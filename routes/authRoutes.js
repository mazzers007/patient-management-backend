const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const newUser = new User({ username, password, role });

    // Generate unique session ID
    const sessionId = Math.random().toString(36).substr(2, 9);

    // Set session expired
    const expiration = new Date();
    expiration.setHours(expiration.getHours() - 1);

    newUser.session = { sessionId, expiration };

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  // Login logic
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate unique session ID
    const sessionId = Math.random().toString(36).substr(2, 9);

    // Set session expiration (e.g., 1 hour from now)
    const expiration = new Date();
    expiration.setHours(expiration.getHours() + 1);

    // Update user's session information
    user.session = { sessionId, expiration };
    await user.save();

    // Generate token
    const token = jwt.sign({ userId: user._id, sessionId, role: user.role, username: user.username }, 'your_secret_key', { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/logout', async (req, res) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, 'your_secret_key');
    const user = await User.findById(decoded.userId);

    if (!user || user.session.sessionId !== decoded.sessionId || user.session.expiration < Date.now()) {
      return res.status(401).json({ message: 'Invalid token or session expired.' });
    }

    // Generate unique session ID
    const sessionId = Math.random().toString(36).substr(2, 9);

    // Set session expired
    const expiration = new Date();
    expiration.setHours(expiration.getHours() - 1);

    // Clear user's session information
    user.session = { sessionId, expiration };
    await user.save();

    res.status(200).json({ message: 'Logout successful.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
