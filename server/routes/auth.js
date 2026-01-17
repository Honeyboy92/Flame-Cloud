const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { supabase } = require('../database');
const { JWT_SECRET, authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields required' });
  }
  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const { data, error } = await supabase
      .from('users')
      .insert({ username, email, password: hashedPassword })
      .select();
    
    if (error) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }
    res.json({ message: 'Account created successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Username or email already exists' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  const { data: users, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .limit(1);
  
  const user = users?.[0];
  
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const token = jwt.sign(
    { id: user.id, username: user.username, email: user.email, isAdmin: user.is_admin },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
  
  res.json({
    token,
    user: { id: user.id, username: user.username, email: user.email, isAdmin: user.is_admin }
  });
});

router.get('/me', authMiddleware, async (req, res) => {
  const { data: users } = await supabase
    .from('users')
    .select('id, username, email, is_admin, avatar, created_at')
    .eq('id', req.user.id)
    .limit(1);
  
  const user = users?.[0];
  if (user) {
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      isAdmin: user.is_admin,
      avatar: user.avatar,
      createdAt: user.created_at
    });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Update email
router.put('/update-email', authMiddleware, async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  try {
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .neq('id', req.user.id)
      .limit(1);
    
    if (existing && existing.length > 0) {
      return res.status(400).json({ error: 'Email already in use' });
    }
    
    await supabase.from('users').update({ email }).eq('id', req.user.id);
    res.json({ message: 'Email updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update email' });
  }
});

// Update password
router.put('/update-password', authMiddleware, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current and new password are required' });
  }
  try {
    const { data: users } = await supabase
      .from('users')
      .select('password')
      .eq('id', req.user.id)
      .limit(1);
    
    const user = users?.[0];
    if (!bcrypt.compareSync(currentPassword, user.password)) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }
    
    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    await supabase.from('users').update({ password: hashedPassword }).eq('id', req.user.id);
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update password' });
  }
});

// Update username
router.put('/update-username', authMiddleware, async (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }
  try {
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .neq('id', req.user.id)
      .limit(1);
    
    if (existing && existing.length > 0) {
      return res.status(400).json({ error: 'Username already taken' });
    }
    
    await supabase.from('users').update({ username }).eq('id', req.user.id);
    res.json({ message: 'Username updated successfully', username });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update username' });
  }
});

// Update avatar
router.put('/update-avatar', authMiddleware, async (req, res) => {
  const { avatar } = req.body;
  try {
    await supabase.from('users').update({ avatar: avatar || null }).eq('id', req.user.id);
    res.json({ message: 'Avatar updated successfully', avatar });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update avatar' });
  }
});

module.exports = router;
