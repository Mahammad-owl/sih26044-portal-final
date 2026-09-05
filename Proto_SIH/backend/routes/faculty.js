const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { authenticateToken, requireRole } = require('../middleware/auth');

// GET /api/faculty/dashboard - Faculty dashboard overview
router.get('/dashboard', authenticateToken, requireRole(['FACULTY', 'INSTITUTION_ADMIN']), (req, res) => {
  try {
    const students = db.prepare('SELECT * FROM student_profiles').all();
    const pendingVerifications = db.prepare('SELECT COUNT(*) as count FROM verifications WHERE final_verdict = "PENDING" OR final_verdict = "NEEDS_REVIEW"').get().count;
    const pendingProjects = db.prepare('SELECT COUNT(*) as count FROM projects WHERE status = "SUBMITTED" OR status = "IN_REVIEW"').get().count;
    const totalSkills = db.prepare('SELECT COUNT(*) as count FROM skills').get().count;

    // Average readiness by branch
    const branchStats = db.prepare(`
      SELECT branch,
             COUNT(*) as total_students,
             ROUND(AVG(readiness_score), 1) as avg_readiness,
             SUM(verified_skills_count) as total_verified_skills
      FROM student_profiles
      GROUP BY branch
    `).all();

    // Critical department skill gaps
    const eceGaps = [
      { skill: 'RTOS (FreeRTOS)', branch: 'ECE', studentsLacking: 7, avgDeficit: '2.1 levels', priority: 'HIGH' },
      { skill: 'Embedded Linux', branch: 'ECE', studentsLacking: 8, avgDeficit: '2.4 levels', priority: 'HIGH' },
      { skill: 'VLSI Physical Design', branch: 'ECE', studentsLacking: 5, avgDeficit: '1.8 levels', priority: 'MEDIUM' }
    ];

    const cseGaps = [
      { skill: 'Cloud & Docker', branch: 'CSE', studentsLacking: 6, avgDeficit: '2.0 levels', priority: 'HIGH' },
      { skill: 'Cybersecurity SOC', branch: 'CSE', studentsLacking: 5, avgDeficit: '1.9 levels', priority: 'MEDIUM' }
    ];

    const recentPendingVerifications = db.prepare(`
      SELECT v.*, s.name as skill_name, sp.name as student_name, sp.branch as student_branch, sp.year as student_year
      FROM verifications v
      JOIN skills s ON s.id = v.skill_id
      JOIN student_profiles sp ON sp.id = v.student_id
      WHERE v.final_verdict = 'PENDING' OR v.final_verdict = 'NEEDS_REVIEW'
      ORDER BY v.created_at DESC
      LIMIT 5
    `).all();

    res.json({
      stats: {
        totalStudents: students.length,
        pendingVerifications,
        pendingProjects,
        totalSkills
      },
      branchStats,
      skillGaps: {
        ECE: eceGaps,
        CSE: cseGaps
      },
      recentPendingVerifications
    });
  } catch (err) {
    console.error('Faculty dashboard error:', err);
    res.status(500).json({ error: 'Failed to load faculty dashboard' });
  }
});

// GET /api/faculty/students - Student Roster & Individual Profiles
router.get('/students', authenticateToken, requireRole(['FACULTY', 'INSTITUTION_ADMIN']), (req, res) => {
  try {
    const { branch, search } = req.query;

    let query = 'SELECT * FROM student_profiles WHERE 1=1';
    const params = [];

    if (branch && branch !== 'ALL') {
      query += ' AND branch = ?';
      params.push(branch);
    }
    if (search) {
      query += ' AND (name LIKE ? OR email LIKE ? OR roll_no LIKE ? OR career_goal LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s, s, s);
    }

    query += ' ORDER BY readiness_score DESC, name ASC';

    const students = db.prepare(query).all(...params);

    const enriched = students.map(s => {
      const skills = db.prepare(`
        SELECT ss.*, sk.name as skill_name
        FROM student_skills ss
        JOIN skills sk ON sk.id = ss.skill_id
        WHERE ss.student_id = ?
      `).all(s.id);

      return {
        ...s,
        skills
      };
    });

    res.json({ students: enriched });
  } catch (err) {
    console.error('Fetch student roster error:', err);
    res.status(500).json({ error: 'Failed to fetch student roster' });
  }
});

// POST /api/faculty/assessments - Faculty creates a new assessment
router.post('/assessments', authenticateToken, requireRole(['FACULTY', 'INSTITUTION_ADMIN']), (req, res) => {
  try {
    const { skillId, title, description, timeLimitMins, passingScore, questions } = req.body;

    if (!skillId || !title || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: 'skillId, title, and at least 1 question are required' });
    }

    const skill = db.prepare('SELECT name FROM skills WHERE id = ?').get(skillId);
    if (!skill) return res.status(404).json({ error: 'Skill not found' });

    const assessmentId = `asm-${Date.now()}`;

    db.prepare(`
      INSERT INTO assessments (
        id, skill_id, skill_name, title, description, time_limit_mins,
        passing_score, total_questions, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      assessmentId, skillId, skill.name, title, description || '',
      timeLimitMins || 15, passingScore || 60, questions.length, req.user.name
    );

    const insertQ = db.prepare(`
      INSERT INTO questions (
        id, assessment_id, question_text, question_type, option_a, option_b,
        option_c, option_d, correct_option, explanation, points
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      insertQ.run(
        `q-${assessmentId}-${i + 1}`,
        assessmentId,
        q.questionText,
        q.questionType || 'MCQ',
        q.optionA || 'Option A',
        q.optionB || 'Option B',
        q.optionC || 'Option C',
        q.optionD || 'Option D',
        (q.correctOption || 'A').toUpperCase(),
        q.explanation || 'Verified reference answer.',
        q.points || 20
      );
    }

    res.json({ message: 'Assessment created successfully with questions pool!', assessmentId });
  } catch (err) {
    console.error('Create assessment error:', err);
    res.status(500).json({ error: 'Failed to create assessment' });
  }
});

module.exports = router;
