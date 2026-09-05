const db = require('../database/db');

function analyzeSkillGaps(studentId, careerRoleId) {
  // 1. Fetch career role details and required skills
  const careerRole = db.prepare('SELECT * FROM career_roles WHERE id = ?').get(careerRoleId);
  if (!careerRole) return null;

  const requirements = db.prepare(`
    SELECT csr.*, s.name as skill_name, s.category, s.discipline, s.description
    FROM career_skill_requirements csr
    JOIN skills s ON s.id = csr.skill_id
    WHERE csr.career_role_id = ?
  `).all(careerRoleId);

  // 2. Fetch student's current skills
  const studentSkills = db.prepare(`
    SELECT ss.*, s.name as skill_name
    FROM student_skills ss
    JOIN skills s ON s.id = ss.skill_id
    WHERE ss.student_id = ?
  `).all(studentId);

  const skillMap = new Map();
  studentSkills.forEach(s => skillMap.set(s.skill_id, s));

  const readySkills = [];
  const gapSkills = [];
  let totalReqWeighted = 0;
  let totalEarnedWeighted = 0;

  for (const req of requirements) {
    const sSkill = skillMap.get(req.skill_id);
    const weight = req.importance_weight || 3;
    const reqLevel = req.required_level;
    totalReqWeighted += (reqLevel * weight);

    const actualLevel = sSkill
      ? (sSkill.verification_status === 'VERIFIED' ? sSkill.verified_level : sSkill.claimed_level)
      : 0;

    const isVerified = sSkill ? sSkill.verification_status === 'VERIFIED' : false;
    const verificationStatus = sSkill ? sSkill.verification_status : 'NOT_VERIFIED';

    const effectiveScore = Math.min(reqLevel, actualLevel);
    totalEarnedWeighted += (effectiveScore * weight);

    const gap = Math.max(0, reqLevel - actualLevel);

    let priority = 'LOW';
    if (gap >= 2 || (gap >= 1 && req.is_mandatory)) {
      priority = 'HIGH';
    } else if (gap === 1) {
      priority = 'MEDIUM';
    }

    const item = {
      skillId: req.skill_id,
      skillName: req.skill_name,
      category: req.category,
      discipline: req.discipline,
      requiredLevel: reqLevel,
      currentLevel: actualLevel,
      gap,
      priority,
      isMandatory: !!req.is_mandatory,
      isVerified,
      verificationStatus
    };

    if (gap === 0) {
      readySkills.push(item);
    } else {
      gapSkills.push(item);
    }
  }

  const readinessScore = totalReqWeighted > 0
    ? Math.round((totalEarnedWeighted / totalReqWeighted) * 100)
    : 70;

  // Sort gaps by priority: HIGH first, then MEDIUM, then LOW
  const priorityOrder = { 'HIGH': 1, 'MEDIUM': 2, 'LOW': 3 };
  gapSkills.sort((a, b) => (priorityOrder[a.priority] || 4) - (priorityOrder[b.priority] || 4));

  return {
    studentId,
    careerRole,
    readinessScore,
    totalRequirements: requirements.length,
    readyCount: readySkills.length,
    gapCount: gapSkills.length,
    readySkills,
    gapSkills
  };
}

function generateRoadmap(studentId, careerRoleId) {
  const gapAnalysis = analyzeSkillGaps(studentId, careerRoleId);
  if (!gapAnalysis) return null;

  // Check if roadmap already exists
  let learningPath = db.prepare('SELECT * FROM learning_paths WHERE student_id = ? AND career_role_id = ?').get(studentId, careerRoleId);

  if (!learningPath) {
    const pathId = `lp-${Date.now()}`;
    const totalModules = Math.max(4, gapAnalysis.gapSkills.length + 2);
    db.prepare(`
      INSERT INTO learning_paths (id, student_id, career_role_id, title, target_readiness, current_readiness, total_modules, completed_modules)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      pathId, studentId, careerRoleId,
      `${gapAnalysis.careerRole.title} Targeted Mastery Roadmap`,
      95, gapAnalysis.readinessScore, totalModules, 0
    );
    learningPath = db.prepare('SELECT * FROM learning_paths WHERE id = ?').get(pathId);

    // Create activities for the identified gaps
    let week = 1;
    for (const gap of gapAnalysis.gapSkills) {
      db.prepare(`
        INSERT INTO learning_activities (id, learning_path_id, week_number, title, description, skill_id, skill_name, activity_type, resource_url, estimated_hours, is_completed)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
      `).run(
        `act-${Date.now()}-${week}`,
        pathId,
        week,
        `Mastering ${gap.skillName}: Core Concepts & Lab Exercises`,
        `Focus on closing the level ${gap.currentLevel} → level ${gap.requiredLevel} gap for ${gap.skillName}. Complete interactive lab exercises and hands-on simulation.`,
        gap.skillId,
        gap.skillName,
        week % 2 === 0 ? 'PRACTICAL' : 'THEORY',
        `https://learn.ait.internal/courses/${gap.skillId}`,
        8
      );
      week++;
    }

    // Add capstone & reassessment
    db.prepare(`
      INSERT INTO learning_activities (id, learning_path_id, week_number, title, description, skill_id, skill_name, activity_type, resource_url, estimated_hours, is_completed)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
    `).run(
      `act-${Date.now()}-${week}`,
      pathId,
      week,
      'Integrated Mini-Project / Hardware Demonstration',
      'Build a practical capstone project combining all verified and newly acquired skills to submit for faculty review.',
      null,
      'Multi-Skill Capstone',
      'PROJECT',
      'https://learn.ait.internal/projects/capstone',
      12
    );
    week++;

    db.prepare(`
      INSERT INTO learning_activities (id, learning_path_id, week_number, title, description, skill_id, skill_name, activity_type, resource_url, estimated_hours, is_completed)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
    `).run(
      `act-${Date.now()}-${week}`,
      pathId,
      week,
      'Faculty Verification & Competence Reassessment',
      'Undergo live demonstration review with faculty mentor to convert acquired skills into verified credentials.',
      null,
      'Formal Reassessment',
      'ASSESSMENT',
      'https://learn.ait.internal/reassess',
      4
    );
  }

  const activities = db.prepare('SELECT * FROM learning_activities WHERE learning_path_id = ? ORDER BY week_number ASC').all(learningPath.id);
  const completedCount = activities.filter(a => a.is_completed).length;

  return {
    learningPath: {
      ...learningPath,
      completed_modules: completedCount,
      total_modules: activities.length
    },
    activities,
    gapAnalysis
  };
}

module.exports = {
  analyzeSkillGaps,
  generateRoadmap
};
