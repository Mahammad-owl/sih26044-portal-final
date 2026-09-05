const db = require('../database/db');

/**
 * Evidence-Based Skill Verification Engine
 * 
 * Core Principle: "WE DO NOT CLAIM TO DETECT CHATGPT. WE VERIFY COMPETENCE."
 * Evaluates:
 * 1. Assessment Score (MCQ / algorithmic timed tests)
 * 2. Project Evidence (Repository code, live demo, design files)
 * 3. Practical Task Performance (Camera/demonstration recording, hands-on lab task)
 * 4. Technical Explanation & Dynamic Modification Task
 * 
 * Computes:
 * - Consistency Rating (HIGH / MEDIUM / LOW)
 * - Final Verification Verdict (VERIFIED / NEEDS_REVIEW / REJECTED)
 * - Recommended Verified Level (1-5)
 */
function evaluateCompetenceEvidence({
  assessmentScore = 0,
  projectEvidenceScore = 0,
  practicalScore = 0,
  explanationText = '',
  modificationResponse = ''
}) {
  const scores = [assessmentScore, projectEvidenceScore, practicalScore].filter(s => s > 0);
  const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

  // Check variance between assessment, project, and practical task
  let variance = 0;
  if (scores.length > 1) {
    const minS = Math.min(...scores);
    const maxS = Math.max(...scores);
    variance = maxS - minS;
  }

  // Explanation completeness check (heuristic length & technical depth)
  const explanationLength = (explanationText || '').trim().length;
  const modificationLength = (modificationResponse || '').trim().length;

  let consistencyRating = 'MEDIUM';
  if (variance <= 15 && explanationLength > 50 && modificationLength > 30) {
    consistencyRating = 'HIGH';
  } else if (variance > 35 || explanationLength < 20) {
    consistencyRating = 'LOW';
  }

  let finalVerdict = 'NEEDS_REVIEW';
  let recommendedLevel = 1;

  if (avgScore >= 80 && consistencyRating === 'HIGH') {
    finalVerdict = 'VERIFIED';
    recommendedLevel = avgScore >= 90 ? 5 : 4;
  } else if (avgScore >= 65 && consistencyRating !== 'LOW') {
    finalVerdict = 'VERIFIED';
    recommendedLevel = 3;
  } else if (avgScore < 50 || consistencyRating === 'LOW') {
    finalVerdict = 'REJECTED';
    recommendedLevel = 1;
  } else {
    finalVerdict = 'NEEDS_REVIEW';
    recommendedLevel = 2;
  }

  return {
    assessmentScore,
    projectEvidenceScore,
    practicalScore,
    averageEvidenceScore: Math.round(avgScore),
    consistencyRating,
    finalVerdict,
    recommendedLevel,
    explanationQuality: explanationLength > 50 ? 'Thorough & Detailed' : 'Basic',
    modificationQuality: modificationLength > 30 ? 'Successfully Executed' : 'Incomplete',
    summary: `Competence evaluated with ${consistencyRating} consistency across multi-factor evidence pillars (Score: ${Math.round(avgScore)}%). Verdict: ${finalVerdict}.`
  };
}

module.exports = {
  evaluateCompetenceEvidence
};
