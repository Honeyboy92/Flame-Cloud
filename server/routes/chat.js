const express = require('express');
const { prepare } = require('../database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get chat messages between user and admin
router.get('/messages/:otherUserId', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const otherUserId = parseInt(req.params.otherUserId);

  try {
    const sql = `SELECT cm.*, su.avatar as senderAvatar FROM chat_messages cm JOIN users su ON cm.senderId = su.id WHERE (cm.senderId = ? AND cm.receiverId = ?) OR (cm.senderId = ? AND cm.receiverId = ?) ORDER BY cm.createdAt`;
    const messages = prepare(sql).all(userId, otherUserId, otherUserId, userId) || [];

    // Mark messages as read (messages sent by otherUser to current user)
    prepare('UPDATE chat_messages SET isRead = 1 WHERE senderId = ? AND receiverId = ?').run(otherUserId, userId);

    const mappedMessages = messages.map(m => ({
      id: m.id,
      senderId: m.senderId,
      receiverId: m.receiverId,
      message: m.message,
      isRead: m.isRead,
      createdAt: m.createdAt,
      senderAvatar: m.senderAvatar || null
    }));

    res.json(mappedMessages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ error: 'Failed to load messages' });
  }
});

// Send message
router.post('/send', authMiddleware, async (req, res) => {
  const { receiverId, message } = req.body;
  const senderId = req.user.id;

  if (!message || !receiverId) {
    return res.status(400).json({ error: 'Message and receiver required' });
  }

  try {
    const insert = prepare('INSERT INTO chat_messages (senderId, receiverId, message, isRead, createdAt) VALUES (?, ?, ?, 0, CURRENT_TIMESTAMP)');
    const result = insert.run(senderId, receiverId, message);
    res.json({ id: result.lastInsertRowid, message: 'Message sent' });
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Get admin user (for regular users to chat with)
router.get('/admin', authMiddleware, async (req, res) => {
  try {
    const admin = prepare('SELECT id, username FROM users WHERE isAdmin = 1 LIMIT 1').get();
    res.json(admin || null);
  } catch (err) {
    console.error('Error fetching admin:', err);
    res.status(500).json({ error: 'Failed to load admin' });
  }
});

// Get all users with unread count (for admin)
router.get('/users', authMiddleware, async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: 'Admin only' });
  }

  try {
    const users = prepare('SELECT id, username, email, avatar FROM users WHERE isAdmin = 0 ORDER BY username').all() || [];

    const usersWithUnread = users.map(u => {
      const c = prepare('SELECT COUNT(*) as cnt FROM chat_messages WHERE senderId = ? AND receiverId = ? AND isRead = 0').get(u.id, req.user.id);
      return { ...u, unreadCount: c?.cnt || 0 };
    });

    res.json(usersWithUnread);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to load users' });
  }
});

// Get unread count for user
router.get('/unread', authMiddleware, async (req, res) => {
  const { count } = await supabase
    .from('chat_messages')
    .select('*', { count: 'exact', head: true })
    .eq('receiver_id', req.user.id)
    .eq('is_read', false);
  
  res.json({ unread: count || 0 });
});

module.exports = router;
