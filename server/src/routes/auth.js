const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { users } = require('../data/users');

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // --- Basic validation ---
    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Email, password and role are required.' });
    }

    // --- Find user ---
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // --- Verify role matches the login page the user came from ---
    if (user.role.toLowerCase() !== role.toLowerCase()) {
      return res.status(403).json({ message: 'Access denied for this role.' });
    }

    // --- Compare password with bcrypt hash ---
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // --- Sign JWT ---
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

    // --- Respond ---
    return res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error('[/api/auth/login]', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

// POST /api/auth/verify  — validate an existing JWT
router.post('/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({ valid: true, user: decoded });
  } catch {
    return res.status(401).json({ valid: false, message: 'Token invalid or expired.' });
  }
});

module.exports = router;
