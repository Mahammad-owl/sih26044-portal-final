const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { analyzeSkillGaps, generateRoadmap } = require('../services/skillGapEngine');
const { extractSkillsFromResume } = require('../services/resumeParser');
const { calculateOpportunityMatch } = require('../services/matchingEngine');

// GET /api/students/dashboard - Comprehensive live data for student dashboard
router.get('/dashboard', authenticateToken, requireRole(['STUDENT']), (req, res) => {
  try {
    const student = db.prepare('SELECT * FROM student_profiles WHERE user_id = ?').get(req.user.id);
    if (!student) return res.status(404).json({ error: 'Student profile not found' });

    // 1. Student Skills summary
    const skills = db.prepare(`
      SELECT ss.*, s.name as skill_name, s.category, s.discipline, s.icon
      FROM student_skills ss
      JOIN skills s ON s.id = ss.skill_id
      WHERE ss.student_id = ?
    `).all(student.id);

    const verifiedSkills = skills.filter(s => s.verification_status === 'VERIFIED');
    const pendingSkills = skills.filter(s => s.verification_status === 'IN_REVIEW');

    // 2. Career Goal & Gap Analysis
    let careerRole = db.prepare('SELECT * FROM career_roles WHERE title LIKE ?').get(`%${student.career_goal.split(' ')[0]}%`);
    if (!careerRole) {
      careerRole = db.prepare('SELECT * FROM career_roles WHERE discipline = ?').get(student.branch) || db.prepare('SELECT * FROM career_roles LIMIT 1').get();
    }

    const gapAnalysis = analyzeSkillGaps(student.id, careerRole.id);

    // 3. Recommended Opportunities with transparent match score
    const allOpportunities = db.prepare(`
      SELECT o.*, ip.logo as company_logo
      FROM opportunities o
      LEFT JOIN industry_profiles ip ON ip.id = o.company_id
      WHERE o.status = 'OPEN'
      ORDER BY o.created_at DESC
      LIMIT 8
    `).all();

    const recommendedOpportunities = allOpportunities.map(opp => {
      const match = calculateOpportunityMatch(student.id, opp.id);
      return {
        ...opp,
        matchScore: match ? match.finalScore : 70,
        matchBreakdown: match ? match.breakdown : []
      };
    }).sort((a, b) => b.matchScore - a.matchScore);

    // 4. Applications summary
    const applications = db.prepare(`
      SELECT a.*, o.title as opportunity_title, o.company_name, o.opportunity_type, o.location, o.mode
      FROM applications a
      JOIN opportunities o ON o.id = a.opportunity_id
      WHERE a.student_id = ?
      ORDER BY a.applied_at DESC
    `).all(student.id);

    // 5. Recent Assessment Attempts
    const recentAssessments = db.prepare(`
      SELECT aa.*, a.title as assessment_title, s.name as skill_name
      FROM assessment_attempts aa
      JOIN assessments a ON a.id = aa.assessment_id
      JOIN skills s ON s.id = aa.skill_id
      WHERE aa.student_id = ?
      ORDER BY aa.completed_at DESC
      LIMIT 5
    `).all(student.id);

    // 6. Roadmap progress
    const roadmapData = generateRoadmap(student.id, careerRole.id);

    // Update readiness score in profile
    const currentReadiness = gapAnalysis ? gapAnalysis.readinessScore : student.readiness_score;
    db.prepare('UPDATE student_profiles SET readiness_score = ?, verified_skills_count = ?, pending_skills_count = ? WHERE id = ?')
      .run(currentReadiness, verifiedSkills.length, pendingSkills.length, student.id);

    res.json({
      profile: {
        ...student,
        readiness_score: currentReadiness,
        verified_skills_count: verifiedSkills.length,
        pending_skills_count: pendingSkills.length
      },
      stats: {
        readinessScore: currentReadiness,
        verifiedSkillsCount: verifiedSkills.length,
        pendingSkillsCount: pendingSkills.length,
        totalSkillsCount: skills.length,
        activeApplicationsCount: applications.length,
        completedActivities: roadmapData ? roadmapData.learningPath.completed_modules : 0,
        totalActivities: roadmapData ? roadmapData.learningPath.total_modules : 5
      },
      skills,
      verifiedSkills,
      gapAnalysis,
      careerRole,
      recommendedOpportunities: recommendedOpportunities.slice(0, 4),
      applications,
      recentAssessments,
      roadmap: roadmapData
    });
  } catch (err) {
    console.error('Student dashboard error:', err);
    res.status(500).json({ error: 'Failed to load student dashboard' });
  }
});

// GET /api/students/profile
router.get('/profile', authenticateToken, (req, res) => {
  try {
    const student = db.prepare('SELECT * FROM student_profiles WHERE user_id = ?').get(req.user.id);
    if (!student) return res.status(404).json({ error: 'Student profile not found' });

    const certifications = db.prepare('SELECT * FROM certifications WHERE student_id = ?').all(student.id);
    const projects = db.prepare('SELECT * FROM projects WHERE student_id = ?').all(student.id);

    res.json({ profile: student, certifications, projects });
  } catch (err) {
    console.error('Fetch profile error:', err);
    res.status(500).json({ error: 'Failed to fetch student profile' });
  }
});

// PUT /api/students/profile
router.put('/profile', authenticateToken, requireRole(['STUDENT']), (req, res) => {
  try {
    const student = db.prepare('SELECT * FROM student_profiles WHERE user_id = ?').get(req.user.id);
    if (!student) return res.status(404).json({ error: 'Student profile not found' });

    const {
      name, phone, branch, year, institution_name, career_goal, location, about, cgpa, roll_no
    } = req.body;

    db.prepare(`
      UPDATE student_profiles
      SET name = COALESCE(?, name),
          phone = COALESCE(?, phone),
          branch = COALESCE(?, branch),
          year = COALESCE(?, year),
          institution_name = COALESCE(?, institution_name),
          career_goal = COALESCE(?, career_goal),
          location = COALESCE(?, location),
          about = COALESCE(?, about),
          cgpa = COALESCE(?, cgpa),
          roll_no = COALESCE(?, roll_no),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(name, phone, branch, year, institution_name, career_goal, location, about, cgpa, roll_no, student.id);

    // Update users table name as well
    if (name) {
      db.prepare('UPDATE users SET name = ? WHERE id = ?').run(name, req.user.id);
    }

    const updated = db.prepare('SELECT * FROM student_profiles WHERE id = ?').get(student.id);
    res.json({ message: 'Profile updated successfully', profile: updated });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: 'Failed to update student profile' });
  }
});

// GET /api/students/skills
router.get('/skills', authenticateToken, (req, res) => {
  try {
    const student = db.prepare('SELECT * FROM student_profiles WHERE user_id = ?').get(req.user.id);
    if (!student) return res.status(404).json({ error: 'Student profile not found' });

    const skills = db.prepare(`
      SELECT ss.*, s.name as skill_name, s.category, s.discipline, s.description, s.icon
      FROM student_skills ss
      JOIN skills s ON s.id = ss.skill_id
      WHERE ss.student_id = ?
      ORDER BY ss.verification_status DESC, ss.claimed_level DESC
    `).all(student.id);

    const allSkills = db.prepare('SELECT * FROM skills ORDER BY discipline, name').all();

    res.json({ studentSkills: skills, availableSkills: allSkills });
  } catch (err) {
    console.error('Fetch skills error:', err);
    res.status(500).json({ error: 'Failed to fetch student skills' });
  }
});

// POST /api/students/skills (Add or Claim a skill)
router.post('/skills', authenticateToken, requireRole(['STUDENT']), (req, res) => {
  try {
    const student = db.prepare('SELECT * FROM student_profiles WHERE user_id = ?').get(req.user.id);
    if (!student) return res.status(404).json({ error: 'Student profile not found' });

    const { skillId, claimedLevel } = req.body;

    if (!skillId || !claimedLevel) {
      return res.status(400).json({ error: 'skillId and claimedLevel (1-5) are required' });
    }

    const existing = db.prepare('SELECT * FROM student_skills WHERE student_id = ? AND skill_id = ?').get(student.id, skillId);

    if (existing) {
      db.prepare(`
        UPDATE student_skills
        SET claimed_level = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(claimedLevel, existing.id);
    } else {
      const id = `ss-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      db.prepare(`
        INSERT INTO student_skills (id, student_id, skill_id, claimed_level, assessment_level, evidence_level, verified_level, verification_status, confidence_level)
        VALUES (?, ?, ?, ?, 0, 0, 0, 'NOT_VERIFIED', 'LOW')
      `).run(id, student.id, skillId, claimedLevel);
    }

    res.json({ message: 'Skill added to profile. Take an assessment or submit project evidence to verify proficiency.' });
  } catch (err) {
    console.error('Add skill error:', err);
    res.status(500).json({ error: 'Failed to add skill' });
  }
});

// GET /api/students/gap-analysis
router.get('/gap-analysis', authenticateToken, (req, res) => {
  try {
    const student = db.prepare('SELECT * FROM student_profiles WHERE user_id = ?').get(req.user.id);
    if (!student) return res.status(404).json({ error: 'Student profile not found' });

    const careerRoleId = req.query.careerRoleId || 'cr-01';
    const analysis = analyzeSkillGaps(student.id, careerRoleId);
    const careerRoles = db.prepare('SELECT * FROM career_roles ORDER BY discipline, title').all();

    res.json({ analysis, availableCareerRoles: careerRoles });
  } catch (err) {
    console.error('Gap analysis error:', err);
    res.status(500).json({ error: 'Failed to calculate skill gap analysis' });
  }
});

// GET /api/students/roadmap
router.get('/roadmap', authenticateToken, (req, res) => {
  try {
    const student = db.prepare('SELECT * FROM student_profiles WHERE user_id = ?').get(req.user.id);
    if (!student) return res.status(404).json({ error: 'Student profile not found' });

    const careerRoleId = req.query.careerRoleId || 'cr-01';
    const roadmap = generateRoadmap(student.id, careerRoleId);

    res.json(roadmap);
  } catch (err) {
    console.error('Roadmap error:', err);
    res.status(500).json({ error: 'Failed to generate learning roadmap' });
  }
});

// PUT /api/students/roadmap/activity/:id/toggle (Mark roadmap milestone complete)
router.put('/roadmap/activity/:id/toggle', authenticateToken, requireRole(['STUDENT']), (req, res) => {
  try {
    const activity = db.prepare('SELECT * FROM learning_activities WHERE id = ?').get(req.params.id);
    if (!activity) return res.status(404).json({ error: 'Activity not found' });

    const newStatus = activity.is_completed ? 0 : 1;
    const completedAt = newStatus ? new Date().toISOString() : null;

    db.prepare('UPDATE learning_activities SET is_completed = ?, completed_at = ? WHERE id = ?')
      .run(newStatus, completedAt, activity.id);

    // Update learning path completed count
    const activities = db.prepare('SELECT * FROM learning_activities WHERE learning_path_id = ?').all(activity.learning_path_id);
    const completedCount = activities.filter(a => a.is_completed).length;

    db.prepare('UPDATE learning_paths SET completed_modules = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(completedCount, activity.learning_path_id);

    res.json({ message: `Activity marked as ${newStatus ? 'Completed' : 'Incomplete'}`, isCompleted: !!newStatus, completedCount });
  } catch (err) {
    console.error('Roadmap activity toggle error:', err);
    res.status(500).json({ error: 'Failed to update activity status' });
  }
});

// POST /api/students/resume-parse (AI-assisted skill extraction from resume)
router.post('/resume-parse', authenticateToken, requireRole(['STUDENT']), (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Please provide resume text to analyze' });
    }

    const extractionResult = extractSkillsFromResume(text);
    res.json(extractionResult);
  } catch (err) {
    console.error('Resume parse error:', err);
    res.status(500).json({ error: 'Failed to extract skills from resume' });
  }
});

// POST /api/students/resume-import-skills (Confirm & Add detected skills to profile)
router.post('/resume-import-skills', authenticateToken, requireRole(['STUDENT']), (req, res) => {
  try {
    const student = db.prepare('SELECT * FROM student_profiles WHERE user_id = ?').get(req.user.id);
    if (!student) return res.status(404).json({ error: 'Student profile not found' });

    const { skills } = req.body; // Array of { skillId, claimedLevel }
    if (!Array.isArray(skills) || skills.length === 0) {
      return res.status(400).json({ error: 'No skills provided for import' });
    }

    let added = 0;
    for (const item of skills) {
      const existing = db.prepare('SELECT * FROM student_skills WHERE student_id = ? AND skill_id = ?').get(student.id, item.skillId);
      if (existing) {
        db.prepare('UPDATE student_skills SET claimed_level = MAX(claimed_level, ?) WHERE id = ?').run(item.claimedLevel || 3, existing.id);
      } else {
        const id = `ss-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        db.prepare(`
          INSERT INTO student_skills (id, student_id, skill_id, claimed_level, assessment_level, evidence_level, verified_level, verification_status, confidence_level)
          VALUES (?, ?, ?, ?, 0, 0, 0, 'NOT_VERIFIED', 'LOW')
        `).run(id, student.id, item.skillId, item.claimedLevel || 3);
        added++;
      }
    }

    res.json({ message: `Successfully imported ${skills.length} skills (${added} new skills added) to your profile!` });
  } catch (err) {
    console.error('Import skills error:', err);
    res.status(500).json({ error: 'Failed to import skills' });
  }
});

// GET /api/students/portfolio/:slugOrId (Public / Shareable Digital Verified Portfolio)
router.get('/portfolio/:slugOrId', (req, res) => {
  try {
    const param = req.params.slugOrId;
    let student = db.prepare('SELECT * FROM student_profiles WHERE portfolio_slug = ? OR id = ?').get(param, param);
    if (!student) {
      // Default fallback to first student for demo
      student = db.prepare('SELECT * FROM student_profiles LIMIT 1').get();
    }

    const skills = db.prepare(`
      SELECT ss.*, s.name as skill_name, s.category, s.discipline, s.description, s.icon
      FROM student_skills ss
      JOIN skills s ON s.id = ss.skill_id
      WHERE ss.student_id = ?
      ORDER BY ss.verification_status DESC, ss.verified_level DESC
    `).all(student.id);

    const verifiedSkills = skills.filter(s => s.verification_status === 'VERIFIED');
    const selfDeclaredSkills = skills.filter(s => s.verification_status !== 'VERIFIED');

    const verifiedProjects = db.prepare('SELECT * FROM projects WHERE student_id = ? AND status = "VERIFIED"').all(student.id);
    const certifications = db.prepare('SELECT * FROM certifications WHERE student_id = ?').all(student.id);
    const verifications = db.prepare(`
      SELECT v.*, s.name as skill_name
      FROM verifications v
      JOIN skills s ON s.id = v.skill_id
      WHERE v.student_id = ? AND v.final_verdict = 'VERIFIED'
    `).all(student.id);

    res.json({
      student,
      verifiedSkills,
      selfDeclaredSkills,
      verifiedProjects,
      certifications,
      verifications
    });
  } catch (err) {
    console.error('Portfolio error:', err);
    res.status(500).json({ error: 'Failed to load verified digital portfolio' });
  }
});

module.exports = router;
