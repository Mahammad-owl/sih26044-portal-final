const db = require('../database/db');

/**
 * Transparent Matching Algorithm:
 * - Skill Match Score (60% weight)
 * - Assessment Performance Score (20% weight)
 * - Verified Project Evidence Score (10% weight)
 * - Academic / Experience Score (10% weight)
 */
function calculateOpportunityMatch(studentId, opportunityId) {
  // 1. Get Opportunity and its required skills
  const opportunity = db.prepare('SELECT * FROM opportunities WHERE id = ?').get(opportunityId);
  if (!opportunity) return null;

  const reqSkills = db.prepare(`
    SELECT os.skill_id, os.min_level, os.weight, s.name as skill_name, s.category, s.discipline
    FROM opportunity_skills os
    JOIN skills s ON s.id = os.skill_id
    WHERE os.opportunity_id = ?
  `).all(opportunityId);

  // 2. Get Student's current skills
  const studentSkills = db.prepare(`
    SELECT ss.*, s.name as skill_name
    FROM student_skills ss
    JOIN skills s ON s.id = ss.skill_id
    WHERE ss.student_id = ?
  `).all(studentId);

  const studentSkillMap = new Map();
  studentSkills.forEach(s => studentSkillMap.set(s.skill_id, s));

  // 3. Get Student's verified projects
  const verifiedProjects = db.prepare(`
    SELECT * FROM projects WHERE student_id = ? AND status = 'VERIFIED'
  `).all(studentId);

  // 4. Get Student's assessment attempts
  const assessmentAttempts = db.prepare(`
    SELECT aa.* FROM assessment_attempts aa WHERE aa.student_id = ?
  `).all(studentId);

  const studentProfile = db.prepare('SELECT * FROM student_profiles WHERE id = ?').get(studentId);

  let totalWeight = 0;
  let earnedSkillScore = 0;
  const breakdown = [];

  for (const req of reqSkills) {
    const sSkill = studentSkillMap.get(req.skill_id);
    const weight = req.weight || 1.0;
    totalWeight += weight;

    if (!sSkill) {
      breakdown.push({
        skillId: req.skill_id,
        skillName: req.skill_name,
        requiredLevel: req.min_level,
        actualLevel: 0,
        verified: false,
        status: 'MISSING',
        statusText: '✕ Missing from profile',
        icon: 'x'
      });
      continue;
    }

    const effectiveLevel = sSkill.verification_status === 'VERIFIED'
      ? sSkill.verified_level
      : (sSkill.assessment_level > 0 ? sSkill.assessment_level : sSkill.claimed_level * 0.7);

    const isVerified = sSkill.verification_status === 'VERIFIED';
    const ratio = Math.min(1.0, effectiveLevel / req.min_level);
    earnedSkillScore += ratio * weight;

    let status = 'MATCH_EXACT';
    let statusText = '✓ Verified Match';
    let icon = 'check';

    if (effectiveLevel >= req.min_level && isVerified) {
      if (effectiveLevel > req.min_level) {
        status = 'MATCH_EXCEEDS';
        statusText = '🌟 Exceeds Requirement (Verified)';
        icon = 'star';
      } else {
        status = 'MATCH_EXACT';
        statusText = '✓ Matches Requirement (Verified)';
        icon = 'check';
      }
    } else if (effectiveLevel >= req.min_level && !isVerified) {
      status = 'UNVERIFIED_MATCH';
      statusText = '⚠ Meets level (Self-declared / In Review)';
      icon = 'alert';
    } else if (effectiveLevel > 0) {
      status = 'GAP_PARTIAL';
      statusText = `⚠ Partial skill (Level ${Math.round(effectiveLevel)} vs Req ${req.min_level})`;
      icon = 'alert';
    } else {
      status = 'MISSING';
      statusText = '✕ Missing required skill';
      icon = 'x';
    }

    breakdown.push({
      skillId: req.skill_id,
      skillName: req.skill_name,
      requiredLevel: req.min_level,
      actualLevel: sSkill.verified_level || sSkill.claimed_level,
      verified: isVerified,
      status,
      statusText,
      icon
    });
  }

  // Calculate Pillar 1: Skill Match (0 - 100)
  const rawSkillMatchPct = totalWeight > 0 ? (earnedSkillScore / totalWeight) * 100 : 70;
  const skillMatchScore = Math.round(Math.min(100, Math.max(10, rawSkillMatchPct)));

  // Calculate Pillar 2: Assessment Score (0 - 100)
  let assessmentScore = 70;
  if (assessmentAttempts.length > 0) {
    const avgPct = assessmentAttempts.reduce((acc, a) => acc + a.percentage, 0) / assessmentAttempts.length;
    assessmentScore = Math.round(avgPct);
  }

  // Calculate Pillar 3: Project Evidence Score (0 - 100)
  let projectEvidenceScore = 60;
  if (verifiedProjects.length >= 2) {
    projectEvidenceScore = 95;
  } else if (verifiedProjects.length === 1) {
    projectEvidenceScore = 80;
  }

  // Calculate Pillar 4: Experience / Academic Score (0 - 100)
  let experienceScore = 75;
  if (studentProfile) {
    const cgpa = studentProfile.cgpa || 8.0;
    const yearBonus = studentProfile.year.includes('4th') ? 95 : (studentProfile.year.includes('3rd') ? 85 : 75);
    experienceScore = Math.round((cgpa / 10) * 50 + (yearBonus * 0.5));
  }

  // Transparent Weighted Formula:
  // Final Match = (Skill Match * 0.60) + (Assessment * 0.20) + (Project Evidence * 0.10) + (Experience * 0.10)
  const finalScore = Math.round(
    (skillMatchScore * 0.60) +
    (assessmentScore * 0.20) +
    (projectEvidenceScore * 0.10) +
    (experienceScore * 0.10)
  );

  return {
    opportunityId,
    studentId,
    finalScore: Math.min(99, Math.max(25, finalScore)),
    weights: {
      skillMatchWeight: '60%',
      assessmentWeight: '20%',
      projectEvidenceWeight: '10%',
      experienceWeight: '10%'
    },
    pillars: {
      skillMatchScore,
      assessmentScore,
      projectEvidenceScore,
      experienceScore
    },
    breakdown,
    summaryText: `Match calculated with transparent 4-pillar analysis: ${skillMatchScore}% Skill alignment + ${assessmentScore}% Verified Assessment performance + ${projectEvidenceScore}% Project Evidence.`
  };
}

module.exports = {
  calculateOpportunityMatch
};
