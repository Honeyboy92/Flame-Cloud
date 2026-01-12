const express = require('express');
const { prepare } = require('../database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get chat messages between user and admin
router.get('/messages/:otherUserId', authMiddleware, (req, res) => {
  const userId = req.user.id;
  const otherUserId = req.params.otherUserId;
  
  const messages = prepare(`
    SELECT * FROM chat_messages 
    WHERE (senderId = ? AND receiverId = ?) OR (senderId = ? AND receiverId = ?)
    ORDER BY createdAt ASC
  `).all(userId, otherUserId, otherUserId, userId);
  
  // Mark messages as read
  prepare(`UPDATE chat_messages SET isRead = 1 WHERE senderId = ? AND receiverId = ?`).run(otherUserId, userId);
  
  res.json(messages);
});

// Send message
router.post('/send', authMiddleware, (req, res) => {
  const { receiverId, message } = req.body;
  const senderId = req.user.id;
  
  if (!message || !receiverId) {
    return res.status(400).json({ error: 'Message and receiver required' });
  }
  
  const result = prepare(`INSERT INTO chat_messages (senderId, receiverId, message) VALUES (?, ?, ?)`).run(senderId, receiverId, message);
  res.json({ id: result.lastInsertRowid, message: 'Message sent' });
});

// Get admin user (for regular users to chat with)
router.get('/admin', authMiddleware, (req, res) => {
  const admin = prepare('SELECT id, username FROM users WHERE isAdmin = 1 LIMIT 1').get();
  res.json(admin);
});

// Get all users with unread count (for admin)
router.get('/users', authMiddleware, (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: 'Admin only' });
  }
  
  const users = prepare(`
    SELECT u.id, u.username, u.email,
    (SELECT COUNT(*) FROM chat_messages WHERE senderId = u.id AND receiverId = ? AND isRead = 0) as unreadCount
    FROM users u WHERE u.isAdmin = 0 ORDER BY u.username
  `).all(req.user.id);
  
  res.json(users);
});

// Get unread count for user
router.get('/unread', authMiddleware, (req, res) => {
  const count = prepare(`SELECT COUNT(*) as count FROM chat_messages WHERE receiverId = ? AND isRead = 0`).get(req.user.id);
  res.json({ unread: count?.count || 0 });
});

module.exports = router;
