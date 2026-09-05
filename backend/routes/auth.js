const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../database/db');
const { JWT_SECRET, authenticateToken } = require('../middleware/auth');

// Normalize demo aliases
function resolveEmail(rawEmail) {
  const email = (rawEmail || '').trim().toLowerCase();
  if (email === 'student.demo@demo.sih') return 'student@demo.com';
  if (email === 'industry.demo@demo.sih') return 'industry@demo.com';
  if (email === 'academia.demo@demo.sih') return 'faculty@demo.com';
  if (email === 'admin.demo@demo.sih') return 'admin@demo.com';
  return email;
}

// POST /api/auth/login
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const resolved = resolveEmail(email);
    let user = db.prepare('SELECT * FROM users WHERE email = ?').get(resolved);

    // Fallback: search by original email if not found via alias
    if (!user && resolved !== email.trim().toLowerCase()) {
      user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.trim().toLowerCase());
    }

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

// POST /api/auth/register (Real Prototype Registration Flow)
router.post('/register', (req, res) => {
  try {
    const {
      email,
      password,
      role,
      name,
      // Student specific
      institution_name,
      branch,
      year,
      career_goal,
      cgpa,
      phone,
      // Industry specific
      company_name,
      industry_sector,
      website,
      location,
      description,
      // Faculty specific
      department,
      designation
    } = req.body;

    if (!email || !password || !name || !role) {
      return res.status(400).json({ error: 'Name, email, password, and role are required.' });
    }

    const normalizedRole = role.toUpperCase().trim();
    if (normalizedRole === 'INSTITUTION_ADMIN' || normalizedRole === 'ADMIN') {
      return res.status(403).json({
        error: 'Admin accounts cannot be self-registered. Please use preloaded demo admin access or contact system administration.'
      });
    }

    if (!['STUDENT', 'INDUSTRY', 'FACULTY'].includes(normalizedRole)) {
      return res.status(400).json({ error: 'Role must be STUDENT, INDUSTRY, or FACULTY.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(cleanEmail);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email address already exists. Please sign in.' });
    }

    const userId = `usr-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const saltRounds = 10;
    const password_hash = bcrypt.hashSync(password, saltRounds);
    const defaultAvatar = `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`;

    // Wrap in database transaction
    const registerTx = db.transaction(() => {
      // 1. Insert into users
      db.prepare(`
        INSERT INTO users (id, email, password_hash, role, name, avatar)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(userId, cleanEmail, password_hash, normalizedRole, name.trim(), defaultAvatar);

      let profileData = null;

      // 2. Insert into role-specific profile table
      if (normalizedRole === 'STUDENT') {
        const profileId = `stu-${Date.now()}`;
        const studentBranch = branch || 'ECE';
        const studentYear = year || '3rd Year';
        const instName = institution_name || 'National Institute of Technology';
        const goal = career_goal || `${studentBranch} Systems Specialist`;
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + `-${Math.random().toString(36).substr(2, 4)}`;

        db.prepare(`
          INSERT INTO student_profiles (
            id, user_id, name, email, phone, branch, year, institution_name,
            career_goal, location, about, cgpa, roll_no, readiness_score,
            verified_skills_count, pending_skills_count, portfolio_slug
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          profileId,
          userId,
          name.trim(),
          cleanEmail,
          phone || '+91 98000 00000',
          studentBranch,
          studentYear,
          instName,
          goal,
          'India',
          `Undergraduate student in ${studentBranch} aiming for ${goal}.`,
          cgpa ? parseFloat(cgpa) : 8.0,
          `ROLL-${Date.now().toString().slice(-6)}`,
          35, // Initial baseline readiness
          0,
          0,
          slug
        );

        profileData = db.prepare('SELECT * FROM student_profiles WHERE id = ?').get(profileId);

        // Add welcome notification
        db.prepare(`
          INSERT INTO notifications (id, user_id, title, message, type)
          VALUES (?, ?, ?, ?, ?)
        `).run(
          `notif-${Date.now()}`,
          userId,
          'Welcome to SKILLSETU!',
          'Your student account is active. Complete your diagnostic skill assessment to unlock verified industry matching.',
          'SYSTEM'
        );
      } else if (normalizedRole === 'INDUSTRY') {
        const profileId = `ind-${Date.now()}`;
        const compName = company_name || `${name}'s Enterprises`;

        db.prepare(`
          INSERT INTO industry_profiles (
            id, user_id, company_name, industry_sector, website, location, description, verified_partner
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          profileId,
          userId,
          compName,
          industry_sector || 'Technology & Engineering Solutions',
          website || 'https://industry.example.com',
          location || 'Bangalore, India',
          description || 'Industry hiring partner offering technical internships and placement opportunities.',
          1
        );

        profileData = db.prepare('SELECT * FROM industry_profiles WHERE id = ?').get(profileId);

        db.prepare(`
          INSERT INTO notifications (id, user_id, title, message, type)
          VALUES (?, ?, ?, ?, ?)
        `).run(
          `notif-${Date.now()}`,
          userId,
          'Welcome to SKILLSETU Partner Portal!',
          'Post job openings, specify required competencies, and browse top verified candidates.',
          'SYSTEM'
        );
      } else if (normalizedRole === 'FACULTY') {
        const profileId = `fac-${Date.now()}`;
        const instName = institution_name || 'National Institute of Technology';

        db.prepare(`
          INSERT INTO faculty_profiles (
            id, user_id, name, department, designation, institution_name, email, phone
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          profileId,
          userId,
          name.trim(),
          department || 'Electronics & Communication Engineering',
          designation || 'Assistant Professor & Skill Coordinator',
          instName,
          cleanEmail,
          phone || '+91 98000 00000'
        );

        profileData = db.prepare('SELECT * FROM faculty_profiles WHERE id = ?').get(profileId);

        db.prepare(`
          INSERT INTO notifications (id, user_id, title, message, type)
          VALUES (?, ?, ?, ?, ?)
        `).run(
          `notif-${Date.now()}`,
          userId,
          'Welcome to SKILLSETU Academia Portal!',
          'Track student cohort skill gaps, verify student evidence, and establish MoUs with industry partners.',
          'SYSTEM'
        );
      }

      return profileData;
    });

    const createdProfile = registerTx();

    const token = jwt.sign(
      {
        id: userId,
        email: cleanEmail,
        role: normalizedRole,
        name: name.trim(),
        profileId: createdProfile ? createdProfile.id : null
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Account successfully registered and profile initialized.',
      token,
      user: {
        id: userId,
        email: cleanEmail,
        role: normalizedRole,
        name: name.trim(),
        avatar: defaultAvatar,
        profile: createdProfile
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Internal server error during registration: ' + err.message });
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
    else if (role === 'INSTITUTION_ADMIN' || role === 'ADMIN') targetEmail = 'admin@demo.com';
    else return res.status(400).json({ error: 'Invalid demo role requested' });

    let user = db.prepare('SELECT * FROM users WHERE email = ?').get(targetEmail);
    if (!user) {
      // Try alias format
      const alias = targetEmail === 'student@demo.com' ? 'student.demo@demo.sih'
        : targetEmail === 'industry@demo.com' ? 'industry.demo@demo.sih'
        : targetEmail === 'faculty@demo.com' ? 'academia.demo@demo.sih'
        : 'admin.demo@demo.sih';
      user = db.prepare('SELECT * FROM users WHERE email = ?').get(alias);
    }

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

// POST /api/auth/forgot-password (Prototype recovery simulation)
router.post('/forgot-password', (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const resolved = resolveEmail(email);
    const user = db.prepare('SELECT id, email, name FROM users WHERE email = ?').get(resolved);

    if (!user) {
      return res.status(404).json({ error: 'No account found with this email address.' });
    }

    res.json({
      message: 'Password reset link simulated for prototype. In production, an OTP will be dispatched to your registered institutional address.',
      email: user.email,
      demoHint: 'For local prototype demonstration, demo password is: demo123'
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: 'Failed to process password recovery.' });
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
