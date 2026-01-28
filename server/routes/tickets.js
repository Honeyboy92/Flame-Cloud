const express = require('express');
const { prepare } = require('../database');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    let sql = 'SELECT * FROM tickets WHERE user_id = ? ORDER BY created_at DESC';
    let params = [req.user.id];

    if (req.user.isAdmin) {
      sql = 'SELECT * FROM tickets ORDER BY created_at DESC';
      params = [];
    }

    const tickets = await prepare(sql).all(...params);

    const mappedTickets = (tickets || []).map(t => ({
      id: t.id,
      userId: t.user_id,
      subject: t.subject,
      message: t.message,
      screenshot: t.screenshot,
      status: t.status,
      adminResponse: t.admin_response,
      createdAt: t.created_at
    }));

    res.json(mappedTickets);
  } catch (err) {
    console.error('Error fetching tickets:', err);
    res.status(500).json({ error: 'Failed to load tickets' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  const { subject, message, screenshot } = req.body;
  if (!subject || !message) {
    return res.status(400).json({ error: 'Subject and message required' });
  }

  try {
    const result = await prepare('INSERT INTO tickets (user_id, subject, message, screenshot, status, created_at) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)')
      .run(req.user.id, subject, message, screenshot || null, 'pending');

    res.json({ id: result.lastInsertRowid, message: 'Ticket submitted successfully' });
  } catch (err) {
    console.error('Error creating ticket:', err);
    res.status(500).json({ error: 'Failed to create ticket' });
  }
});

router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  const { status, admin_response } = req.body;
  try {
    await prepare('UPDATE tickets SET status=?, admin_response=? WHERE id=?').run(status, admin_response, req.params.id);
    res.json({ message: 'Ticket updated successfully' });
  } catch (err) {
    console.error('Error updating ticket:', err);
    res.status(500).json({ error: 'Failed to update ticket' });
  }
});

module.exports = router;
