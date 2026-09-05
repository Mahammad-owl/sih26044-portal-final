const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { calculateOpportunityMatch } = require('../services/matchingEngine');

// GET /api/opportunities - List all opportunities with filters & match calculations
router.get('/', authenticateToken, (req, res) => {
  try {
    const { branch, type, mode, search } = req.query;

    let query = `
      SELECT o.*, ip.logo as company_logo, ip.website as company_website, ip.industry_sector
      FROM opportunities o
      LEFT JOIN industry_profiles ip ON ip.id = o.company_id
      WHERE o.status = 'OPEN'
    `;
    const params = [];

    if (branch && branch !== 'ALL') {
      query += ` AND (o.branch = ? OR o.branch = 'ALL')`;
      params.push(branch);
    }
    if (type && type !== 'ALL') {
      query += ` AND o.opportunity_type = ?`;
      params.push(type);
    }
    if (mode && mode !== 'ALL') {
      query += ` AND o.mode = ?`;
      params.push(mode);
    }
    if (search) {
      query += ` AND (o.title LIKE ? OR o.company_name LIKE ? OR o.description LIKE ?)`;
      const s = `%${search}%`;
      params.push(s, s, s);
    }

    query += ` ORDER BY o.created_at DESC`;

    const opportunities = db.prepare(query).all(...params);

    // If student, calculate match score and check applied status for each
    let studentId = null;
    let appliedMap = new Set();

    if (req.user.role === 'STUDENT') {
      const student = db.prepare('SELECT id FROM student_profiles WHERE user_id = ?').get(req.user.id);
      if (student) {
        studentId = student.id;
        const apps = db.prepare('SELECT opportunity_id FROM applications WHERE student_id = ?').all(student.id);
        apps.forEach(a => appliedMap.add(a.opportunity_id));
      }
    }

    const enriched = opportunities.map(opp => {
      let match = null;
      if (studentId) {
        match = calculateOpportunityMatch(studentId, opp.id);
      }

      // Fetch required skills for this opportunity
      const reqSkills = db.prepare(`
        SELECT os.*, s.name as skill_name, s.discipline
        FROM opportunity_skills os
        JOIN skills s ON s.id = os.skill_id
        WHERE os.opportunity_id = ?
      `).all(opp.id);

      return {
        ...opp,
        isApplied: appliedMap.has(opp.id),
        matchScore: match ? match.finalScore : null,
        matchDetails: match,
        requiredSkills: reqSkills
      };
    });

    if (studentId) {
      enriched.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    }

    res.json({ opportunities: enriched });
  } catch (err) {
    console.error('List opportunities error:', err);
    res.status(500).json({ error: 'Failed to fetch opportunities' });
  }
});

// GET /api/opportunities/:id - Get full opportunity detail with transparent match explanation
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const opp = db.prepare(`
      SELECT o.*, ip.logo as company_logo, ip.website as company_website, ip.industry_sector, ip.description as company_description
      FROM opportunities o
      LEFT JOIN industry_profiles ip ON ip.id = o.company_id
      WHERE o.id = ?
    `).get(req.params.id);

    if (!opp) return res.status(404).json({ error: 'Opportunity not found' });

    const reqSkills = db.prepare(`
      SELECT os.*, s.name as skill_name, s.discipline, s.category
      FROM opportunity_skills os
      JOIN skills s ON s.id = os.skill_id
      WHERE os.opportunity_id = ?
    `).all(opp.id);

    let match = null;
    let application = null;

    if (req.user.role === 'STUDENT') {
      const student = db.prepare('SELECT id FROM student_profiles WHERE user_id = ?').get(req.user.id);
      if (student) {
        match = calculateOpportunityMatch(student.id, opp.id);
        application = db.prepare('SELECT * FROM applications WHERE student_id = ? AND opportunity_id = ?').get(student.id, opp.id);
      }
    }

    res.json({
      opportunity: opp,
      requiredSkills: reqSkills,
      match,
      application
    });
  } catch (err) {
    console.error('Get opportunity error:', err);
    res.status(500).json({ error: 'Failed to fetch opportunity detail' });
  }
});

// POST /api/opportunities/:id/apply - Student applies for opportunity
router.post('/:id/apply', authenticateToken, requireRole(['STUDENT']), (req, res) => {
  try {
    const student = db.prepare('SELECT id, name, branch, year, readiness_score FROM student_profiles WHERE user_id = ?').get(req.user.id);
    if (!student) return res.status(404).json({ error: 'Student profile not found' });

    const opportunity = db.prepare('SELECT * FROM opportunities WHERE id = ?').get(req.params.id);
    if (!opportunity) return res.status(404).json({ error: 'Opportunity not found' });

    const existing = db.prepare('SELECT * FROM applications WHERE student_id = ? AND opportunity_id = ?').get(student.id, opportunity.id);
    if (existing) {
      return res.status(400).json({ error: 'You have already applied for this opportunity.' });
    }

    const { coverLetter, resumeSummary } = req.body;

    // Calculate dynamic transparent match score
    const match = calculateOpportunityMatch(student.id, opportunity.id);
    const matchScore = match ? match.finalScore : 75;
    const breakdownJson = match ? JSON.stringify(match) : null;

    const appId = `app-${Date.now()}`;
    db.prepare(`
      INSERT INTO applications (
        id, student_id, opportunity_id, resume_summary, cover_letter,
        match_score, match_breakdown_json, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'APPLIED')
    `).run(
      appId, student.id, opportunity.id,
      resumeSummary || `${student.branch} student with verified practical competence.`,
      coverLetter || 'Excited to apply my verified engineering skills to your organization.',
      matchScore, breakdownJson
    );

    // Notify Industry User
    const companyUser = db.prepare('SELECT user_id FROM industry_profiles WHERE id = ?').get(opportunity.company_id);
    if (companyUser) {
      db.prepare(`
        INSERT INTO notifications (id, user_id, title, message, type, link)
        VALUES (?, ?, ?, ?, 'APPLICATION', '/industry/applications')
      `).run(
        `not-${Date.now()}`,
        companyUser.user_id,
        `New Applicant: ${student.name} (${matchScore}% Match)`,
        `${student.name} applied for "${opportunity.title}". Verified match score: ${matchScore}%.`
      );
    }

    // Notify Student
    db.prepare(`
      INSERT INTO notifications (id, user_id, title, message, type, link)
      VALUES (?, ?, ?, ?, 'APPLICATION', '/applications')
    `).run(
      `not-${Date.now()}-stu`,
      req.user.id,
      'Application Submitted Successfully 🚀',
      `Your application for ${opportunity.title} at ${opportunity.company_name} was received.`
    );

    res.json({
      message: 'Application submitted successfully!',
      applicationId: appId,
      matchScore,
      match
    });
  } catch (err) {
    console.error('Apply opportunity error:', err);
    res.status(500).json({ error: 'Failed to submit application' });
  }
});

// POST /api/opportunities - Industry creates opportunity
router.post('/', authenticateToken, requireRole(['INDUSTRY', 'INSTITUTION_ADMIN']), (req, res) => {
  try {
    let companyId = null;
    let companyName = 'Nexa Embedded Solutions';

    if (req.user.role === 'INDUSTRY') {
      const industry = db.prepare('SELECT id, company_name FROM industry_profiles WHERE user_id = ?').get(req.user.id);
      if (!industry) return res.status(404).json({ error: 'Industry profile not found' });
      companyId = industry.id;
      companyName = industry.company_name;
    } else {
      const firstIndustry = db.prepare('SELECT id, company_name FROM industry_profiles LIMIT 1').get();
      companyId = firstIndustry.id;
      companyName = firstIndustry.company_name;
    }

    const {
      title, opportunityType, branch, description, location, mode,
      duration, stipend, deadline, requiredSkills // Array of { skillId, minLevel, weight }
    } = req.body;

    if (!title || !opportunityType || !branch || !description) {
      return res.status(400).json({ error: 'Title, opportunity type, branch, and description are required' });
    }

    const oppId = `opp-${Date.now()}`;

    db.prepare(`
      INSERT INTO opportunities (
        id, company_id, company_name, title, opportunity_type, branch, description,
        location, mode, duration, stipend, deadline, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'OPEN')
    `).run(
      oppId, companyId, companyName, title, opportunityType, branch, description,
      location || 'Bangalore, India', mode || 'HYBRID', duration || '6 Months',
      stipend || '₹30,000 / month', deadline || '2026-11-30'
    );

    // Insert required skills
    if (Array.isArray(requiredSkills)) {
      for (const s of requiredSkills) {
        if (s.skillId) {
          db.prepare(`
            INSERT INTO opportunity_skills (id, opportunity_id, skill_id, min_level, weight)
            VALUES (?, ?, ?, ?, ?)
          `).run(`os-${Date.now()}-${Math.floor(Math.random() * 1000)}`, oppId, s.skillId, s.minLevel || 3, s.weight || 1.0);
        }
      }
    }

    res.json({ message: 'Opportunity created successfully!', opportunityId: oppId });
  } catch (err) {
    console.error('Create opportunity error:', err);
    res.status(500).json({ error: 'Failed to create opportunity' });
  }
});

// GET /api/opportunities/my/applications - Applications submitted by current student
router.get('/my/applications', authenticateToken, requireRole(['STUDENT']), (req, res) => {
  try {
    const student = db.prepare('SELECT id FROM student_profiles WHERE user_id = ?').get(req.user.id);
    if (!student) return res.status(404).json({ error: 'Student profile not found' });

    const applications = db.prepare(`
      SELECT a.*, o.title as opportunity_title, o.company_name, o.opportunity_type, o.location, o.mode, o.stipend, o.branch, o.duration
      FROM applications a
      JOIN opportunities o ON o.id = a.opportunity_id
      WHERE a.student_id = ?
      ORDER BY a.applied_at DESC
    `).all(student.id);

    res.json({ applications });
  } catch (err) {
    console.error('Fetch student applications error:', err);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

module.exports = router;
