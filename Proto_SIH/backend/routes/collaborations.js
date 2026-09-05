const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { authenticateToken, requireRole } = require('../middleware/auth');

// GET /api/collaborations - List collaborations with optional discipline/status filter
router.get('/', authenticateToken, (req, res) => {
  try {
    const { discipline, status } = req.query;

    let query = `
      SELECT c.*, ip.logo as company_logo, ip.website as company_website, ip.industry_sector
      FROM collaborations c
      JOIN industry_profiles ip ON ip.id = c.industry_id
      WHERE 1=1
    `;
    const params = [];

    if (discipline && discipline !== 'ALL') {
      query += ` AND c.discipline = ?`;
      params.push(discipline);
    }
    if (status && status !== 'ALL') {
      query += ` AND c.status = ?`;
      params.push(status);
    }

    query += ` ORDER BY CASE WHEN c.status = 'PROPOSED' OR c.status = 'REQUESTED' THEN 0 ELSE 1 END, c.created_at DESC`;

    const collaborations = db.prepare(query).all(...params);

    res.json({ collaborations });
  } catch (err) {
    console.error('List collaborations error:', err);
    res.status(500).json({ error: 'Failed to fetch collaborations' });
  }
});

// POST /api/collaborations - Industry creates collaboration offering
router.post('/', authenticateToken, requireRole(['INDUSTRY', 'INSTITUTION_ADMIN']), (req, res) => {
  try {
    let industryId = 'ind-01';
    let companyName = 'Nexa Embedded Solutions';

    if (req.user.role === 'INDUSTRY') {
      const ind = db.prepare('SELECT id, company_name FROM industry_profiles WHERE user_id = ?').get(req.user.id);
      if (ind) {
        industryId = ind.id;
        companyName = ind.company_name;
      }
    }

    const { title, type, discipline, description, duration, expectedOutcomes } = req.body;

    if (!title || !type || !discipline || !description) {
      return res.status(400).json({ error: 'Title, type, discipline, and description are required' });
    }

    const colId = `col-${Date.now()}`;

    db.prepare(`
      INSERT INTO collaborations (
        id, industry_id, company_name, title, type, discipline,
        description, duration, expected_outcomes, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'PROPOSED')
    `).run(
      colId, industryId, companyName, title, type, discipline,
      description, duration || 'Flexible', expectedOutcomes || 'Knowledge transfer and talent recruitment pipeline.'
    );

    // Notify Faculty & Admin
    const facultyUsers = db.prepare('SELECT user_id FROM faculty_profiles').all();
    for (const f of facultyUsers) {
      db.prepare(`
        INSERT INTO notifications (id, user_id, title, message, type, link)
        VALUES (?, ?, ?, ?, 'COLLABORATION', '/faculty/collaborations')
      `).run(
        `not-${Date.now()}-${Math.random()}`,
        f.user_id,
        `New Industry Collaboration Proposed: ${title}`,
        `${companyName} proposed a ${type} for ${discipline} students.`
      );
    }

    res.json({ message: 'Collaboration initiative published successfully!', collaborationId: colId });
  } catch (err) {
    console.error('Create collaboration error:', err);
    res.status(500).json({ error: 'Failed to create collaboration' });
  }
});

// PUT /api/collaborations/:id/status - Faculty or Industry updates collaboration status (Request/Accept/Activate)
router.put('/:id/status', authenticateToken, (req, res) => {
  try {
    const { status } = req.body; // 'REQUESTED', 'ACCEPTED', 'ACTIVE', 'COMPLETED'

    const col = db.prepare('SELECT * FROM collaborations WHERE id = ?').get(req.params.id);
    if (!col) return res.status(404).json({ error: 'Collaboration not found' });

    let facultyId = col.faculty_id;
    let facultyName = col.faculty_name;
    let instId = col.institution_id || 'inst-01';
    let instName = col.institution_name || 'Apex Institute of Technology';

    if (req.user.role === 'FACULTY') {
      const fac = db.prepare('SELECT id, name, institution_id, institution_name FROM faculty_profiles WHERE user_id = ?').get(req.user.id);
      if (fac) {
        facultyId = fac.id;
        facultyName = fac.name;
        instId = fac.institution_id;
        instName = fac.institution_name;
      }
    }

    db.prepare(`
      UPDATE collaborations
      SET status = ?,
          faculty_id = COALESCE(?, faculty_id),
          faculty_name = COALESCE(?, faculty_name),
          institution_id = COALESCE(?, institution_id),
          institution_name = COALESCE(?, institution_name),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(status, facultyId, facultyName, instId, instName, col.id);

    res.json({ message: `Collaboration status updated to ${status}`, status });
  } catch (err) {
    console.error('Update collaboration status error:', err);
    res.status(500).json({ error: 'Failed to update collaboration' });
  }
});

module.exports = router;
