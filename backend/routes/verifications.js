const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { evaluateCompetenceEvidence } = require('../services/verificationEngine');

// GET /api/verifications - Get verification records for current student or all for faculty
router.get('/', authenticateToken, (req, res) => {
  try {
    let verifications;

    if (req.user.role === 'STUDENT') {
      const student = db.prepare('SELECT id FROM student_profiles WHERE user_id = ?').get(req.user.id);
      if (!student) return res.status(404).json({ error: 'Student profile not found' });

      verifications = db.prepare(`
        SELECT v.*, s.name as skill_name, s.category, s.discipline, s.icon
        FROM verifications v
        JOIN skills s ON s.id = v.skill_id
        WHERE v.student_id = ?
        ORDER BY v.created_at DESC
      `).all(student.id);
    } else {
      // Faculty or Admin sees all pending and completed verifications
      verifications = db.prepare(`
        SELECT v.*, s.name as skill_name, s.category, s.discipline,
               sp.name as student_name, sp.branch as student_branch, sp.year as student_year, sp.roll_no
        FROM verifications v
        JOIN skills s ON s.id = v.skill_id
        JOIN student_profiles sp ON sp.id = v.student_id
        ORDER BY CASE WHEN v.final_verdict = 'PENDING' OR v.final_verdict = 'NEEDS_REVIEW' THEN 0 ELSE 1 END, v.created_at DESC
      `).all();
    }

    res.json({ verifications });
  } catch (err) {
    console.error('List verifications error:', err);
    res.status(500).json({ error: 'Failed to fetch verifications' });
  }
});

// GET /api/verifications/:id - Verification Detail with multi-factor evidence breakdown
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const verification = db.prepare(`
      SELECT v.*, s.name as skill_name, s.category, s.discipline, s.icon,
             sp.name as student_name, sp.email as student_email, sp.branch as student_branch, sp.year as student_year, sp.cgpa, sp.roll_no
      FROM verifications v
      JOIN skills s ON s.id = v.skill_id
      JOIN student_profiles sp ON sp.id = v.student_id
      WHERE v.id = ?
    `).get(req.params.id);

    if (!verification) return res.status(404).json({ error: 'Verification record not found' });

    // Fetch related projects for this student
    const projects = db.prepare('SELECT * FROM projects WHERE student_id = ?').all(verification.student_id);

    // Fetch assessment attempts for this skill
    const attempts = db.prepare('SELECT * FROM assessment_attempts WHERE student_id = ? AND skill_id = ? ORDER BY completed_at DESC').all(verification.student_id, verification.skill_id);

    // Fetch student skill status
    const studentSkill = db.prepare('SELECT * FROM student_skills WHERE student_id = ? AND skill_id = ?').get(verification.student_id, verification.skill_id);

    res.json({
      verification,
      projects,
      attempts,
      studentSkill
    });
  } catch (err) {
    console.error('Fetch verification detail error:', err);
    res.status(500).json({ error: 'Failed to fetch verification detail' });
  }
});

// POST /api/verifications/submit - Student submits practical demonstration evidence
router.post('/submit', authenticateToken, requireRole(['STUDENT']), (req, res) => {
  try {
    const student = db.prepare('SELECT id, name FROM student_profiles WHERE user_id = ?').get(req.user.id);
    if (!student) return res.status(404).json({ error: 'Student profile not found' });

    const {
      skillId, practicalTaskTitle, practicalTaskDesc, submissionNotes,
      explanationText, modificationTaskResponse, demoMediaUrl, snapshotData
    } = req.body;

    if (!skillId || !practicalTaskTitle) {
      return res.status(400).json({ error: 'skillId and practicalTaskTitle are required' });
    }

    // 1. Get assessment score for this skill
    const latestAttempt = db.prepare('SELECT * FROM assessment_attempts WHERE student_id = ? AND skill_id = ? ORDER BY percentage DESC LIMIT 1').get(student.id, skillId);
    const assessmentScore = latestAttempt ? latestAttempt.percentage : 70;

    // 2. Get verified project score
    const projects = db.prepare('SELECT * FROM projects WHERE student_id = ? AND status = "VERIFIED"').all(student.id);
    const projectScore = projects.length >= 2 ? 90 : (projects.length === 1 ? 80 : 65);

    // 3. Evaluate multi-factor evidence
    const practicalScore = snapshotData || demoMediaUrl ? 85 : 70;
    const evaluation = evaluateCompetenceEvidence({
      assessmentScore,
      projectEvidenceScore: projectScore,
      practicalScore,
      explanationText,
      modificationResponse: modificationTaskResponse
    });

    const verificationId = `ver-${Date.now()}`;

    db.prepare(`
      INSERT INTO verifications (
        id, student_id, skill_id, practical_task_title, practical_task_desc,
        practical_task_status, submission_notes, explanation_text, modification_task_response,
        demo_media_url, snapshot_data, assessment_score, project_evidence_score, practical_score,
        consistency_rating, final_verdict, recommended_level
      ) VALUES (?, ?, ?, ?, ?, 'SUBMITTED', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      verificationId, student.id, skillId, practicalTaskTitle,
      practicalTaskDesc || 'Hands-on practical demonstration of core technical concepts and code modification.',
      submissionNotes || 'Practical evidence submitted for faculty review.',
      explanationText || 'Student submitted concept breakdown.',
      modificationTaskResponse || 'Dynamic modification completed as requested.',
      demoMediaUrl || null,
      snapshotData || null,
      assessmentScore,
      projectScore,
      practicalScore,
      evaluation.consistencyRating,
      evaluation.finalVerdict === 'VERIFIED' ? 'NEEDS_REVIEW' : evaluation.finalVerdict, // Flag for faculty sign-off
      evaluation.recommendedLevel
    );

    // Update student_skill status to IN_REVIEW
    db.prepare(`
      UPDATE student_skills
      SET verification_status = 'IN_REVIEW', evidence_level = ?, updated_at = CURRENT_TIMESTAMP
      WHERE student_id = ? AND skill_id = ?
    `).run(evaluation.recommendedLevel, student.id, skillId);

    // Notify Faculty
    const facultyUser = db.prepare("SELECT user_id FROM faculty_profiles LIMIT 1").get();
    if (facultyUser) {
      db.prepare(`
        INSERT INTO notifications (id, user_id, title, message, type, link)
        VALUES (?, ?, ?, ?, 'VERIFICATION', '/faculty/verifications')
      `).run(
        `not-${Date.now()}`,
        facultyUser.user_id,
        'New Skill Verification Request',
        `${student.name} submitted practical demonstration evidence for verification.`,
      );
    }

    res.json({
      message: 'Evidence submitted successfully! Multi-factor analysis completed. Awaiting faculty confirmation.',
      verificationId,
      evaluation
    });
  } catch (err) {
    console.error('Submit verification error:', err);
    res.status(500).json({ error: 'Failed to submit practical verification' });
  }
});

// POST /api/verifications/:id/review - Faculty/Admin review and approve/reject
router.post('/:id/review', authenticateToken, requireRole(['FACULTY', 'INSTITUTION_ADMIN']), (req, res) => {
  try {
    const { status, verifiedLevel, reviewerComments } = req.body; // status: 'APPROVED' | 'REJECTED' | 'REQUEST_CHANGES'

    const verification = db.prepare('SELECT * FROM verifications WHERE id = ?').get(req.params.id);
    if (!verification) return res.status(404).json({ error: 'Verification record not found' });

    const finalVerdict = status === 'APPROVED' ? 'VERIFIED' : (status === 'REJECTED' ? 'REJECTED' : 'NEEDS_REVIEW');
    const assignedLevel = Number(verifiedLevel) || verification.recommended_level || 3;

    db.prepare(`
      UPDATE verifications
      SET practical_task_status = ?,
          final_verdict = ?,
          recommended_level = ?,
          reviewer_id = ?,
          reviewer_name = ?,
          reviewer_comments = ?,
          verified_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      status === 'APPROVED' ? 'APPROVED' : 'REJECTED',
      finalVerdict,
      assignedLevel,
      req.user.id,
      req.user.name,
      reviewerComments || 'Evidence reviewed and verified by faculty panel.',
      verification.id
    );

    // Update student_skills table
    if (status === 'APPROVED') {
      db.prepare(`
        UPDATE student_skills
        SET verified_level = ?,
            verification_status = 'VERIFIED',
            confidence_level = 'HIGH',
            updated_at = CURRENT_TIMESTAMP
        WHERE student_id = ? AND skill_id = ?
      `).run(assignedLevel, verification.student_id, verification.skill_id);
    } else if (status === 'REJECTED') {
      db.prepare(`
        UPDATE student_skills
        SET verification_status = 'REJECTED',
            updated_at = CURRENT_TIMESTAMP
        WHERE student_id = ? AND skill_id = ?
      `).run(verification.student_id, verification.skill_id);
    }

    // Get student user_id for notification
    const student = db.prepare('SELECT user_id, name FROM student_profiles WHERE id = ?').get(verification.student_id);
    const skill = db.prepare('SELECT name FROM skills WHERE id = ?').get(verification.skill_id);

    if (student) {
      db.prepare(`
        INSERT INTO notifications (id, user_id, title, message, type, link)
        VALUES (?, ?, ?, ?, 'VERIFICATION', '/skills')
      `).run(
        `not-${Date.now()}`,
        student.user_id,
        status === 'APPROVED' ? 'Skill Verified! 🏅' : 'Verification Update',
        status === 'APPROVED'
          ? `Congratulations! ${req.user.name} verified your proficiency in ${skill ? skill.name : 'your skill'} at Level ${assignedLevel}.`
          : `Your verification request for ${skill ? skill.name : 'skill'} was updated: ${reviewerComments || 'Please see reviewer feedback.'}`
      );
    }

    res.json({
      message: `Verification ${status === 'APPROVED' ? 'approved and skill marked as VERIFIED' : 'updated'}.`,
      verdict: finalVerdict,
      verifiedLevel: assignedLevel
    });
  } catch (err) {
    console.error('Review verification error:', err);
    res.status(500).json({ error: 'Failed to complete verification review' });
  }
});

module.exports = router;
