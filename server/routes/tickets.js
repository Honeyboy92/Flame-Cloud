const express = require('express');
const { supabase } = require('../database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  const { data: tickets } = await supabase
    .from('tickets')
    .select('*')
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: false });
  
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
});

router.post('/', authMiddleware, async (req, res) => {
  const { subject, message, screenshot } = req.body;
  if (!subject || !message) {
    return res.status(400).json({ error: 'Subject and message required' });
  }
  
  const { data, error } = await supabase
    .from('tickets')
    .insert({
      user_id: req.user.id,
      subject,
      message,
      screenshot: screenshot || null
    })
    .select();
  
  if (error) {
    return res.status(500).json({ error: 'Failed to create ticket' });
  }
  
  res.json({ id: data[0].id, message: 'Ticket submitted successfully' });
});

module.exports = router;
