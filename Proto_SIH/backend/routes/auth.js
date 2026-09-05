const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../database/db');
const { JWT_SECRET, authenticateToken } = require('../middleware/auth');

// POST /api/auth/login
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.trim().toLowerCase());

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials. User not found.' });
    }

    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials. Incorrect password.' });
    }

    // Fetch role profile
    let profile = null;
    if (user.role === 'STUDENT') {
      profile = db.prepare('SELECT * FROM student_profiles WHERE user_id = ?').get(user.id);
    } else if (user.role === 'INDUSTRY') {
      profile = db.prepare('SELECT * FROM industry_profiles WHERE user_id = ?').get(user.id);
    } else if (user.role === 'FACULTY') {
      profile = db.prepare('SELECT * FROM faculty_profiles WHERE user_id = ?').get(user.id);
    } else if (user.role === 'INSTITUTION_ADMIN') {
      profile = { name: user.name, role: user.role, institution: 'Apex Institute of Technology' };
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        profileId: profile ? profile.id : null
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        avatar: user.avatar,
        profile
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error during login' });
  }
});

// POST /api/auth/demo-switch (Quick Demo Account Switcher for Hackathon)
router.post('/demo-switch', (req, res) => {
  try {
    const { role } = req.body;
    let targetEmail = 'student@demo.com';

    if (role === 'STUDENT') targetEmail = 'student@demo.com';
    else if (role === 'INDUSTRY') targetEmail = 'industry@demo.com';
    else if (role === 'FACULTY') targetEmail = 'faculty@demo.com';
    else if (role === 'INSTITUTION_ADMIN') targetEmail = 'admin@demo.com';
    else return res.status(400).json({ error: 'Invalid demo role requested' });

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(targetEmail);
    if (!user) return res.status(404).json({ error: 'Demo account not found' });

    let profile = null;
    if (user.role === 'STUDENT') {
      profile = db.prepare('SELECT * FROM student_profiles WHERE user_id = ?').get(user.id);
    } else if (user.role === 'INDUSTRY') {
      profile = db.prepare('SELECT * FROM industry_profiles WHERE user_id = ?').get(user.id);
    } else if (user.role === 'FACULTY') {
      profile = db.prepare('SELECT * FROM faculty_profiles WHERE user_id = ?').get(user.id);
    } else if (user.role === 'INSTITUTION_ADMIN') {
      profile = { name: user.name, role: user.role, institution: 'Apex Institute of Technology' };
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        profileId: profile ? profile.id : null
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: `Switched to demo role: ${user.role}`,
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        avatar: user.avatar,
        profile
      }
    });
  } catch (err) {
    console.error('Demo switch error:', err);
    res.status(500).json({ error: 'Demo switch failed' });
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, (req, res) => {
  try {
    const user = db.prepare('SELECT id, email, role, name, avatar, created_at FROM users WHERE id = ?').get(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    let profile = null;
    if (user.role === 'STUDENT') {
      profile = db.prepare('SELECT * FROM student_profiles WHERE user_id = ?').get(user.id);
    } else if (user.role === 'INDUSTRY') {
      profile = db.prepare('SELECT * FROM industry_profiles WHERE user_id = ?').get(user.id);
    } else if (user.role === 'FACULTY') {
      profile = db.prepare('SELECT * FROM faculty_profiles WHERE user_id = ?').get(user.id);
    } else if (user.role === 'INSTITUTION_ADMIN') {
      profile = { name: user.name, role: user.role, institution: 'Apex Institute of Technology' };
    }

    res.json({ user: { ...user, profile } });
  } catch (err) {
    console.error('Me endpoint error:', err);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

module.exports = router;
