const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // --- Basic validation ---
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Name, email, password and role are required.' });
    }

    // --- Check if user exists ---
    const existingUser = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    // --- Hash password ---
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // --- Create user ---
    const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${name.split(' ').join('')}`;
    const newUser = new User({
      name,
      email,
      passwordHash,
      role,
      avatar,
      createdAt: new Date()
    });

    await newUser.save();

    // --- Sign JWT ---
    const payload = {
      id: newUser._id.toString(),
      email: newUser.email,
      role: newUser.role,
      name: newUser.name,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

    // --- Respond ---
    return res.status(201).json({
      token,
      user: {
        id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        avatar: newUser.avatar,
        createdAt: newUser.createdAt,
      },
    });
  } catch (err) {
    console.error('[/api/auth/signup]', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // --- Basic validation ---
    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Email, password and role are required.' });
    }

    // --- Find user ---
    const user = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });

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
      id: user._id.toString(),
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
        id: user._id.toString(),
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
