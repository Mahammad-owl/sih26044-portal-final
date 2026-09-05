const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { authenticateToken, requireRole } = require('../middleware/auth');

// GET /api/projects - List projects (for student or faculty queue)
router.get('/', authenticateToken, (req, res) => {
  try {
    let projects;

    if (req.user.role === 'STUDENT') {
      const student = db.prepare('SELECT id FROM student_profiles WHERE user_id = ?').get(req.user.id);
      if (!student) return res.status(404).json({ error: 'Student profile not found' });

      projects = db.prepare(`
        SELECT * FROM projects WHERE student_id = ? ORDER BY created_at DESC
      `).all(student.id);
    } else {
      // Faculty/Admin sees all projects
      projects = db.prepare(`
        SELECT p.*, sp.name as student_name, sp.branch as student_branch, sp.year as student_year, sp.roll_no
        FROM projects p
        JOIN student_profiles sp ON sp.id = p.student_id
        ORDER BY CASE WHEN p.status = 'SUBMITTED' OR p.status = 'IN_REVIEW' THEN 0 ELSE 1 END, p.created_at DESC
      `).all();
    }

    res.json({ projects });
  } catch (err) {
    console.error('List projects error:', err);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// POST /api/projects - Student submits a new project
router.post('/', authenticateToken, requireRole(['STUDENT']), (req, res) => {
  try {
    const student = db.prepare('SELECT id, name FROM student_profiles WHERE user_id = ?').get(req.user.id);
    if (!student) return res.status(404).json({ error: 'Student profile not found' });

    const { title, description, technologies, skillsUsedIds, repoUrl, demoUrl, evidenceFiles } = req.body;

    if (!title || !description || !technologies) {
      return res.status(400).json({ error: 'Title, description, and technologies are required' });
    }

    const projectId = `prj-${Date.now()}`;
    const skillsJson = Array.isArray(skillsUsedIds) ? JSON.stringify(skillsUsedIds) : JSON.stringify([]);

    db.prepare(`
      INSERT INTO projects (
        id, student_id, title, description, technologies, skills_used_ids,
        repo_url, demo_url, evidence_files, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'SUBMITTED')
    `).run(
      projectId, student.id, title, description, technologies, skillsJson,
      repoUrl || null, demoUrl || null, evidenceFiles || null
    );

    // Notify Faculty
    const facultyUser = db.prepare("SELECT user_id FROM faculty_profiles LIMIT 1").get();
    if (facultyUser) {
      db.prepare(`
        INSERT INTO notifications (id, user_id, title, message, type, link)
        VALUES (?, ?, ?, ?, 'VERIFICATION', '/faculty/projects')
      `).run(
        `not-${Date.now()}`,
        facultyUser.user_id,
        'New Student Project for Review',
        `${student.name} submitted project "${title}" for faculty verification.`
      );
    }

    res.json({ message: 'Project submitted successfully for faculty verification!', projectId });
  } catch (err) {
    console.error('Submit project error:', err);
    res.status(500).json({ error: 'Failed to submit project' });
  }
});

// POST /api/projects/:id/review - Faculty reviews project
router.post('/:id/review', authenticateToken, requireRole(['FACULTY', 'INSTITUTION_ADMIN']), (req, res) => {
  try {
    const { status, reviewerFeedback } = req.body; // status: 'VERIFIED' | 'CHANGES_REQUESTED' | 'REJECTED'

    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    db.prepare(`
      UPDATE projects
      SET status = ?,
          reviewer_feedback = ?,
          reviewed_by = ?,
          reviewed_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      status,
      reviewerFeedback || 'Project reviewed and validated against technical rubric.',
      req.user.name,
      project.id
    );

    // If verified, enhance evidence level for linked skills
    if (status === 'VERIFIED' && project.skills_used_ids) {
      try {
        const skillIds = JSON.parse(project.skills_used_ids);
        for (const sId of skillIds) {
          db.prepare(`
            UPDATE student_skills
            SET evidence_level = MAX(evidence_level, 4), updated_at = CURRENT_TIMESTAMP
            WHERE student_id = ? AND skill_id = ?
          `).run(project.student_id, sId);
        }
      } catch (e) {
        console.error('Error parsing skills_used_ids:', e);
      }
    }

    // Notify student
    const student = db.prepare('SELECT user_id, name FROM student_profiles WHERE id = ?').get(project.student_id);
    if (student) {
      db.prepare(`
        INSERT INTO notifications (id, user_id, title, message, type, link)
        VALUES (?, ?, ?, ?, 'VERIFICATION', '/projects')
      `).run(
        `not-${Date.now()}`,
        student.user_id,
        status === 'VERIFIED' ? 'Project Verified! 🚀' : 'Project Review Update',
        `Your project "${project.title}" was reviewed by ${req.user.name}. Status: ${status}.`
      );
    }

    res.json({ message: `Project status updated to ${status}`, status });
  } catch (err) {
    console.error('Review project error:', err);
    res.status(500).json({ error: 'Failed to review project' });
  }
});

module.exports = router;
