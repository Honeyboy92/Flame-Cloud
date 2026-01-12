const express = require('express');
const { prepare } = require('../database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, (req, res) => {
  const tickets = prepare('SELECT * FROM tickets WHERE userId = ? ORDER BY createdAt DESC').all(req.user.id);
  res.json(tickets);
});

router.post('/', authMiddleware, (req, res) => {
  const { subject, message, screenshot } = req.body;
  if (!subject || !message) {
    return res.status(400).json({ error: 'Subject and message required' });
  }
  const result = prepare('INSERT INTO tickets (userId, subject, message, screenshot) VALUES (?, ?, ?, ?)').run(req.user.id, subject, message, screenshot || null);
  res.json({ id: result.lastInsertRowid, message: 'Ticket submitted successfully' });
});

module.exports = router;
