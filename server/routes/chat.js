const express = require('express');
const { prepare } = require('../database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Compatibility for Supabase-style or filter
// e.g. or=and(sender_id.eq.1,receiver_id.eq.2),and(sender_id.eq.2,receiver_id.eq.1)
router.get('/', authMiddleware, async (req, res) => {
  const { or, order, dir } = req.query;
  const userId = req.user.id;

  try {
    let messages = [];
    if (or) {
      // Decode or if needed
      const decodedOr = decodeURIComponent(or);
      const idsmatch = decodedOr.match(/\.eq\.(\d+)/g);

      console.log(`[ChatDebug] IDs found: ${JSON.stringify(idsmatch)}`);

      if (idsmatch && idsmatch.length >= 2 && idsmatch[0] !== idsmatch[1]) {
        const otherId = idsmatch.find(m => m !== `.eq.${userId}`)?.replace('.eq.', '');
        console.log(`[ChatDebug] Complex OR: identified otherId as ${otherId}`);
        if (otherId) {
          const sql = `SELECT cm.*, su.avatar as sender_avatar, su.username as sender_username 
                       FROM chat_messages cm 
                       JOIN users su ON cm.sender_id = su.id 
                       WHERE (cm.sender_id = ? AND cm.receiver_id = ?) 
                          OR (cm.sender_id = ? AND cm.receiver_id = ?) 
                       ORDER BY cm.created_at ${dir === 'desc' ? 'DESC' : 'ASC'}`;
          messages = prepare(sql).all(userId, otherId, otherId, userId);
        }
      } else {
        const sql = `SELECT cm.*, su.avatar as sender_avatar, su.username as sender_username 
                     FROM chat_messages cm 
                     JOIN users su ON cm.sender_id = su.id 
                     WHERE cm.sender_id = ? OR cm.receiver_id = ? 
                     ORDER BY cm.created_at ${dir === 'desc' ? 'DESC' : 'ASC'}`;
        messages = prepare(sql).all(userId, userId);
      }
    } else {
      messages = prepare('SELECT * FROM chat_messages ORDER BY created_at ASC').all();
    }

    // Map to frontend expectation
    const mapped = messages.map(m => ({
      ...m,
      sender: { username: m.sender_username, avatar: m.sender_avatar }
    }));

    res.json(mapped);
  } catch (err) {
    console.error('Chat fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Send message (mapped from chat_messages table)
router.post('/', authMiddleware, (req, res) => {
  const { sender_id, receiver_id, message } = req.body;
  if (!message || !receiver_id) return res.status(400).json({ error: 'Missing data' });

  try {
    const result = prepare('INSERT INTO chat_messages (sender_id, receiver_id, message) VALUES (?, ?, ?)')
      .run(sender_id || req.user.id, receiver_id, message);
    res.json({ id: result.lastInsertRowid, message: 'Sent' });
  } catch (err) {
    res.status(500).json({ error: 'Send failed' });
  }
});

// Admin-specific users list
router.get('/users-list', authMiddleware, (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ error: 'Admin only' });
  const users = prepare('SELECT id, username, avatar, last_seen FROM users WHERE is_admin = 0 ORDER BY last_seen DESC').all();
  res.json(users);
});

// Support admin getter
router.get('/admin', authMiddleware, (req, res) => {
  const admin = prepare('SELECT id, username FROM users WHERE is_admin = 1 LIMIT 1').get();
  res.json(admin);
});

module.exports = router;
