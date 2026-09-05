const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { authenticateToken, requireRole } = require('../middleware/auth');

// GET /api/assessments - List all available skill assessments
router.get('/', authenticateToken, (req, res) => {
  try {
    const assessments = db.prepare(`
      SELECT a.*, s.discipline, s.category, s.icon,
        (SELECT COUNT(*) FROM questions q WHERE q.assessment_id = a.id) as question_count
      FROM assessments a
      JOIN skills s ON s.id = a.skill_id
      ORDER BY s.discipline, a.title
    `).all();

    // Check if student has previous attempts
    let studentAttempts = [];
    if (req.user.role === 'STUDENT') {
      const student = db.prepare('SELECT id FROM student_profiles WHERE user_id = ?').get(req.user.id);
      if (student) {
        studentAttempts = db.prepare(`
          SELECT assessment_id, MAX(percentage) as best_score, MAX(completed_at) as last_attempted
          FROM assessment_attempts
          WHERE student_id = ?
          GROUP BY assessment_id
        `).all(student.id);
      }
    }

    const attemptMap = new Map();
    studentAttempts.forEach(att => attemptMap.set(att.assessment_id, att));

    const enriched = assessments.map(a => ({
      ...a,
      bestScore: attemptMap.has(a.id) ? attemptMap.get(a.id).best_score : null,
      lastAttempted: attemptMap.has(a.id) ? attemptMap.get(a.id).last_attempted : null
    }));

    res.json({ assessments: enriched });
  } catch (err) {
    console.error('List assessments error:', err);
    res.status(500).json({ error: 'Failed to fetch assessments' });
  }
});

// GET /api/assessments/:id - Start Assessment (Returns questions in randomized order without answers)
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const assessment = db.prepare(`
      SELECT a.*, s.name as skill_name, s.discipline, s.category
      FROM assessments a
      JOIN skills s ON s.id = a.skill_id
      WHERE a.id = ?
    `).get(req.params.id);

    if (!assessment) return res.status(404).json({ error: 'Assessment not found' });

    // Fetch questions and omit the correct_option to prevent frontend tampering
    const questions = db.prepare(`
      SELECT id, assessment_id, question_text, question_type, option_a, option_b, option_c, option_d, code_snippet, points
      FROM questions
      WHERE assessment_id = ?
    `).all(assessment.id);

    // Shuffle questions deterministically/randomly
    const shuffled = questions.sort(() => Math.random() - 0.5);

    res.json({
      assessment,
      questions: shuffled
    });
  } catch (err) {
    console.error('Fetch assessment questions error:', err);
    res.status(500).json({ error: 'Failed to load assessment questions' });
  }
});

// POST /api/assessments/:id/submit - Submit answers, auto-grade, record attempt, update skill level
router.post('/:id/submit', authenticateToken, requireRole(['STUDENT']), (req, res) => {
  try {
    const student = db.prepare('SELECT id FROM student_profiles WHERE user_id = ?').get(req.user.id);
    if (!student) return res.status(404).json({ error: 'Student profile not found' });

    const assessment = db.prepare('SELECT * FROM assessments WHERE id = ?').get(req.params.id);
    if (!assessment) return res.status(404).json({ error: 'Assessment not found' });

    const { answers } = req.body; // Map of { questionId: 'A' | 'B' | 'C' | 'D' }
    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({ error: 'Answers map is required' });
    }

    const allQuestions = db.prepare('SELECT * FROM questions WHERE assessment_id = ?').all(assessment.id);

    let earnedScore = 0;
    let maxScore = 0;
    const review = [];

    for (const q of allQuestions) {
      const qPoints = q.points || 20;
      maxScore += qPoints;
      const studentAns = (answers[q.id] || '').toUpperCase();
      const isCorrect = studentAns === q.correct_option.toUpperCase();

      if (isCorrect) {
        earnedScore += qPoints;
      }

      review.push({
        questionId: q.id,
        questionText: q.question_text,
        questionType: q.question_type,
        studentAnswer: studentAns || 'Unanswered',
        correctAnswer: q.correct_option,
        isCorrect,
        explanation: q.explanation,
        pointsEarned: isCorrect ? qPoints : 0
      });
    }

    const percentage = maxScore > 0 ? (earnedScore / maxScore) * 100 : 0;
    const passed = percentage >= assessment.passing_score ? 1 : 0;

    // Calculate assessment skill level (1-5)
    let calculatedLevel = 1;
    if (percentage >= 90) calculatedLevel = 5;
    else if (percentage >= 75) calculatedLevel = 4;
    else if (percentage >= 60) calculatedLevel = 3;
    else if (percentage >= 40) calculatedLevel = 2;
    else calculatedLevel = 1;

    // Save Attempt
    const attemptId = `att-${Date.now()}`;
    db.prepare(`
      INSERT INTO assessment_attempts (id, student_id, assessment_id, skill_id, score, max_score, percentage, passed, calculated_level, answers_json)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      attemptId, student.id, assessment.id, assessment.skill_id,
      earnedScore, maxScore, Math.round(percentage * 10) / 10, passed,
      calculatedLevel, JSON.stringify(answers)
    );

    // Update or Insert into student_skills
    const existingSkill = db.prepare('SELECT * FROM student_skills WHERE student_id = ? AND skill_id = ?').get(student.id, assessment.skill_id);

    if (existingSkill) {
      db.prepare(`
        UPDATE student_skills
        SET assessment_level = MAX(assessment_level, ?),
            last_assessed_at = CURRENT_TIMESTAMP,
            confidence_level = CASE WHEN ? >= 75 THEN 'HIGH' WHEN ? >= 60 THEN 'MEDIUM' ELSE 'LOW' END,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(calculatedLevel, percentage, percentage, existingSkill.id);
    } else {
      const ssId = `ss-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      db.prepare(`
        INSERT INTO student_skills (id, student_id, skill_id, claimed_level, assessment_level, evidence_level, verified_level, verification_status, confidence_level, last_assessed_at)
        VALUES (?, ?, ?, ?, ?, 0, 0, 'NOT_VERIFIED', ?, CURRENT_TIMESTAMP)
      `).run(
        ssId, student.id, assessment.skill_id, calculatedLevel, calculatedLevel,
        percentage >= 75 ? 'HIGH' : (percentage >= 60 ? 'MEDIUM' : 'LOW')
      );
    }

    // Create Notification
    const notifId = `not-${Date.now()}`;
    db.prepare(`
      INSERT INTO notifications (id, user_id, title, message, type, link)
      VALUES (?, ?, ?, ?, 'ASSESSMENT', '/assessments')
    `).run(
      notifId, req.user.id,
      `${assessment.skill_name} Assessment Complete`,
      `You scored ${Math.round(percentage)}% on ${assessment.title}. Your demonstrated assessment level is now Level ${calculatedLevel}.`
    );

    res.json({
      message: passed ? '🎉 Assessment Passed!' : 'Assessment completed. Keep practicing to improve your score!',
      attemptId,
      score: earnedScore,
      maxScore,
      percentage: Math.round(percentage * 10) / 10,
      passed: !!passed,
      calculatedLevel,
      passingScore: assessment.passing_score,
      review
    });
  } catch (err) {
    console.error('Submit assessment error:', err);
    res.status(500).json({ error: 'Failed to submit assessment' });
  }
});

module.exports = router;
