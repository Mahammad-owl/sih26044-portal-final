const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { calculateOpportunityMatch } = require('../services/matchingEngine');

// GET /api/industry/dashboard - Key metrics for industry recruiter
router.get('/dashboard', authenticateToken, requireRole(['INDUSTRY', 'INSTITUTION_ADMIN']), (req, res) => {
  try {
    let companyId = null;
    let companyProfile = null;

    if (req.user.role === 'INDUSTRY') {
      companyProfile = db.prepare('SELECT * FROM industry_profiles WHERE user_id = ?').get(req.user.id);
      if (companyProfile) companyId = companyProfile.id;
    } else {
      companyProfile = db.prepare('SELECT * FROM industry_profiles LIMIT 1').get();
      companyId = companyProfile ? companyProfile.id : 'ind-01';
    }

    const opportunities = db.prepare('SELECT * FROM opportunities WHERE company_id = ? ORDER BY created_at DESC').all(companyId);
    const opportunityIds = opportunities.map(o => o.id);

    let applications = [];
    if (opportunityIds.length > 0) {
      const placeholders = opportunityIds.map(() => '?').join(',');
      applications = db.prepare(`
        SELECT a.*, sp.name as student_name, sp.branch as student_branch, sp.year as student_year, sp.cgpa,
               o.title as opportunity_title
        FROM applications a
        JOIN student_profiles sp ON sp.id = a.student_id
        JOIN opportunities o ON o.id = a.opportunity_id
        WHERE a.opportunity_id IN (${placeholders})
        ORDER BY a.applied_at DESC
      `).all(...opportunityIds);
    }

    // Pipeline counts
    const pipelineCounts = {
      applied: applications.filter(a => a.status === 'APPLIED').length,
      underReview: applications.filter(a => a.status === 'UNDER_REVIEW').length,
      shortlisted: applications.filter(a => a.status === 'SHORTLISTED').length,
      interview: applications.filter(a => a.status === 'INTERVIEW').length,
      selected: applications.filter(a => a.status === 'SELECTED').length,
      rejected: applications.filter(a => a.status === 'REJECTED').length
    };

    // Calculate top matching candidates across student database for company's active roles
    const allStudents = db.prepare('SELECT * FROM student_profiles').all();
    const topMatches = [];

    for (const opp of opportunities.slice(0, 3)) {
      for (const student of allStudents) {
        const match = calculateOpportunityMatch(student.id, opp.id);
        if (match && match.finalScore >= 70) {
          topMatches.push({
            student,
            opportunity: opp,
            matchScore: match.finalScore,
            matchDetails: match
          });
        }
      }
    }

    topMatches.sort((a, b) => b.matchScore - a.matchScore);

    res.json({
      companyProfile,
      stats: {
        activeOpportunities: opportunities.filter(o => o.status === 'OPEN').length,
        totalApplications: applications.length,
        shortlistedCount: pipelineCounts.shortlisted,
        interviewsCount: pipelineCounts.interview,
        selectedCount: pipelineCounts.selected
      },
      pipelineCounts,
      opportunities,
      recentApplications: applications.slice(0, 6),
      topMatches: topMatches.slice(0, 6)
    });
  } catch (err) {
    console.error('Industry dashboard error:', err);
    res.status(500).json({ error: 'Failed to load industry dashboard' });
  }
});

// GET /api/industry/candidates - Candidate Matching Engine with transparent "Why X%?" score
router.get('/candidates', authenticateToken, requireRole(['INDUSTRY', 'INSTITUTION_ADMIN']), (req, res) => {
  try {
    const { opportunityId, branch, minScore } = req.query;

    let targetOppId = opportunityId;
    if (!targetOppId) {
      const firstOpp = db.prepare('SELECT id FROM opportunities WHERE status = "OPEN" LIMIT 1').get();
      targetOppId = firstOpp ? firstOpp.id : 'opp-01';
    }

    const opportunity = db.prepare(`
      SELECT o.*, ip.company_name
      FROM opportunities o
      JOIN industry_profiles ip ON ip.id = o.company_id
      WHERE o.id = ?
    `).get(targetOppId);

    if (!opportunity) return res.status(404).json({ error: 'Opportunity not found' });

    let studentsQuery = 'SELECT * FROM student_profiles';
    const params = [];
    if (branch && branch !== 'ALL') {
      studentsQuery += ' WHERE branch = ?';
      params.push(branch);
    }
    const students = db.prepare(studentsQuery).all(...params);

    const candidateMatches = students.map(student => {
      const match = calculateOpportunityMatch(student.id, opportunity.id);

      // Fetch student's verified skills
      const verifiedSkills = db.prepare(`
        SELECT ss.*, s.name as skill_name
        FROM student_skills ss
        JOIN skills s ON s.id = ss.skill_id
        WHERE ss.student_id = ? AND ss.verification_status = 'VERIFIED'
      `).all(student.id);

      // Check if candidate already applied
      const application = db.prepare('SELECT * FROM applications WHERE student_id = ? AND opportunity_id = ?').get(student.id, opportunity.id);

      return {
        student,
        matchScore: match ? match.finalScore : 65,
        matchDetails: match,
        verifiedSkills,
        application
      };
    });

    candidateMatches.sort((a, b) => b.matchScore - a.matchScore);

    const filtered = minScore
      ? candidateMatches.filter(c => c.matchScore >= Number(minScore))
      : candidateMatches;

    // Get all opportunities for dropdown
    const allOpportunities = db.prepare('SELECT id, title, branch, opportunity_type FROM opportunities WHERE status = "OPEN"').all();

    res.json({
      selectedOpportunity: opportunity,
      allOpportunities,
      candidates: filtered
    });
  } catch (err) {
    console.error('Candidate matching error:', err);
    res.status(500).json({ error: 'Failed to fetch candidate matches' });
  }
});

// GET /api/industry/applications - Recruiter pipeline management
router.get('/applications', authenticateToken, requireRole(['INDUSTRY', 'INSTITUTION_ADMIN']), (req, res) => {
  try {
    let companyId = null;
    if (req.user.role === 'INDUSTRY') {
      const ind = db.prepare('SELECT id FROM industry_profiles WHERE user_id = ?').get(req.user.id);
      if (ind) companyId = ind.id;
    }

    let query = `
      SELECT a.*, sp.name as student_name, sp.email as student_email, sp.phone as student_phone,
             sp.branch as student_branch, sp.year as student_year, sp.cgpa, sp.roll_no,
             o.title as opportunity_title, o.opportunity_type, o.branch as target_branch
      FROM applications a
      JOIN student_profiles sp ON sp.id = a.student_id
      JOIN opportunities o ON o.id = a.opportunity_id
    `;
    const params = [];

    if (companyId) {
      query += ` WHERE o.company_id = ?`;
      params.push(companyId);
    }

    query += ` ORDER BY a.applied_at DESC`;

    const applications = db.prepare(query).all(...params);

    res.json({ applications });
  } catch (err) {
    console.error('Industry applications error:', err);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// PUT /api/industry/applications/:id/status - Update candidate stage in pipeline
router.put('/applications/:id/status', authenticateToken, requireRole(['INDUSTRY', 'INSTITUTION_ADMIN']), (req, res) => {
  try {
    const { status, notes } = req.body; // APPLIED, UNDER_REVIEW, SHORTLISTED, INTERVIEW, SELECTED, REJECTED

    const application = db.prepare(`
      SELECT a.*, o.title as opportunity_title, o.company_name, sp.user_id as student_user_id, sp.name as student_name
      FROM applications a
      JOIN opportunities o ON o.id = a.opportunity_id
      JOIN student_profiles sp ON sp.id = a.student_id
      WHERE a.id = ?
    `).get(req.params.id);

    if (!application) return res.status(404).json({ error: 'Application not found' });

    db.prepare(`
      UPDATE applications
      SET status = ?, notes = COALESCE(?, notes), updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(status, notes, application.id);

    // Notify Student
    const statusMessages = {
      UNDER_REVIEW: 'Your application is now under technical review.',
      SHORTLISTED: '🎉 Congratulations! You have been SHORTLISTED for an interview round.',
      INTERVIEW: '📅 Interview scheduled! Check your registered email for schedule & meeting links.',
      SELECTED: '🏆 Offer Extended! You have been SELECTED for the role!',
      REJECTED: 'Application status update: Not selected for this opening.'
    };

    db.prepare(`
      INSERT INTO notifications (id, user_id, title, message, type, link)
      VALUES (?, ?, ?, ?, 'APPLICATION', '/applications')
    `).run(
      `not-${Date.now()}`,
      application.student_user_id,
      `Application Status: ${status}`,
      `${application.company_name} updated your application for "${application.opportunity_title}": ${statusMessages[status] || status}`
    );

    res.json({ message: `Application status updated to ${status}`, status });
  } catch (err) {
    console.error('Update application status error:', err);
    res.status(500).json({ error: 'Failed to update application status' });
  }
});

module.exports = router;
