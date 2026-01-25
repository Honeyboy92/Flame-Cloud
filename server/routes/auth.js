const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { prepare } = require('../database');
const { JWT_SECRET, authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.post('/signup', (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields required' });
  }
  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    prepare('INSERT INTO users (username, email, password) VALUES (?, ?, ?)').run(username, email, hashedPassword);
    res.json({ message: 'Account created successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Username or email already exists' });
  }
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user.id, username: user.username, email: user.email, isAdmin: user.is_admin }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, username: user.username, email: user.email, isAdmin: user.is_admin } });
});

router.get('/me', authMiddleware, (req, res) => {
  const user = prepare('SELECT id, username, email, is_admin as isAdmin, avatar, created_at as createdAt FROM users WHERE id = ?').get(req.user.id);
  res.json(user);
});

// Update email
router.put('/update-email', authMiddleware, (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  try {
    const existing = prepare('SELECT id FROM users WHERE email = ? AND id != ?').get(email, req.user.id);
    if (existing) {
      return res.status(400).json({ error: 'Email already in use' });
    }
    prepare('UPDATE users SET email = ? WHERE id = ?').run(email, req.user.id);
    res.json({ message: 'Email updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update email' });
  }
});

// Update password
router.put('/update-password', authMiddleware, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current and new password are required' });
  }
  try {
    const user = prepare('SELECT password FROM users WHERE id = ?').get(req.user.id);
    if (!bcrypt.compareSync(currentPassword, user.password)) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }
    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    prepare('UPDATE users SET password = ? WHERE id = ?').run(hashedPassword, req.user.id);
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update password' });
  }
});

// Update username
router.put('/update-username', authMiddleware, (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }
  try {
    const existing = prepare('SELECT id FROM users WHERE username = ? AND id != ?').get(username, req.user.id);
    if (existing) {
      return res.status(400).json({ error: 'Username already taken' });
    }
    prepare('UPDATE users SET username = ? WHERE id = ?').run(username, req.user.id);
    res.json({ message: 'Username updated successfully', username });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update username' });
  }
});

// Update profile (Unified: username, email, avatar)
router.put('/update-profile', authMiddleware, (req, res) => {
  const { username, email, avatar } = req.body;
  const userId = req.user.id;

  const updates = [];
  if (username) updates.push({ k: 'username', v: username });
  if (email) updates.push({ k: 'email', v: email });
  if (typeof avatar !== 'undefined') updates.push({ k: 'avatar', v: avatar });

  try {
    if (updates.length === 0) return res.status(400).json({ error: 'No updates provided' });

    // Unique checks
    if (username) {
      const existing = prepare('SELECT id FROM users WHERE username = ? AND id != ?').get(username, userId);
      if (existing) return res.status(400).json({ error: 'Username already taken' });
    }
    if (email) {
      const existing = prepare('SELECT id FROM users WHERE email = ? AND id != ?').get(email, userId);
      if (existing) return res.status(400).json({ error: 'Email already in use' });
    }

    for (const u of updates) {
      prepare(`UPDATE users SET ${u.k}=? WHERE id=?`).run(u.v, userId);
    }

    const updated = prepare('SELECT id, username, email, avatar, is_admin as is_admin FROM users WHERE id = ?').get(userId);
    res.json({ message: 'Profile updated successfully', user: updated });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Update avatar
router.put('/update-avatar', authMiddleware, (req, res) => {
  const { avatar } = req.body;
  try {
    prepare('UPDATE users SET avatar = ? WHERE id = ?').run(avatar || null, req.user.id);
    res.json({ message: 'Avatar updated successfully', avatar });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update avatar' });
  }
});

module.exports = router;