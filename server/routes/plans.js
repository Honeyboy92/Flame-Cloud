const express = require('express');
const { prepare } = require('../database');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// Generic root route for shim compatibility
router.get('/', (req, res) => {
  const table = req.baseUrl.split('/').pop();

  if (table === 'location_settings') {
    const locations = prepare('SELECT * FROM location_settings ORDER BY sort_order').all();
    return res.json(locations);
  }

  if (table === 'site_settings') {
    const { key } = req.query;
    if (key) {
      const setting = prepare('SELECT * FROM site_settings WHERE key=?').get(key);
      return res.json(setting || { key, value: '0' });
    }
    const settings = prepare('SELECT * FROM site_settings').all();
    return res.json(settings);
  }

  // Default to paid_plans
  const showAll = req.query.is_active === 'false' || req.query.all === 'true';
  let sql = 'SELECT * FROM paid_plans WHERE is_active = 1 ORDER BY sort_order';

  if (showAll) {
    sql = 'SELECT * FROM paid_plans ORDER BY sort_order';
  }

  const plans = prepare(sql).all();
  res.json(plans);
});

// Admin CRUD for paid plans (mapped to table: paid_plans)
router.post('/', authMiddleware, adminMiddleware, (req, res) => {
  const { name, ram, cpu, storage, location, price, discount, sort_order } = req.body;
  const result = prepare('INSERT INTO paid_plans (name, ram, cpu, storage, location, price, discount, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
    .run(name, ram, cpu, storage, location, price, discount || 0, sort_order || 0);
  res.json({ id: result.lastInsertRowid, message: 'Plan created' });
});

router.put('/:id', authMiddleware, adminMiddleware, (req, res) => {
  const { name, ram, cpu, storage, location, price, discount, sort_order } = req.body;
  prepare('UPDATE paid_plans SET name=?, ram=?, cpu=?, storage=?, location=?, price=?, discount=?, sort_order=? WHERE id=?')
    .run(name, ram, cpu, storage, location, price, discount || 0, sort_order || 0, req.params.id);
  res.json({ message: 'Plan updated' });
});

router.delete('/:id', authMiddleware, adminMiddleware, (req, res) => {
  prepare('DELETE FROM paid_plans WHERE id=?').run(req.params.id);
  res.json({ message: 'Plan deleted' });
});

// Added generic table name route for shim compatibility
router.get('/paid_plans', (req, res) => {
  const plans = prepare('SELECT * FROM paid_plans WHERE is_active = 1 ORDER BY sort_order').all();
  res.json(plans);
});

router.get('/paid', (req, res) => {
  const plans = prepare('SELECT * FROM paid_plans WHERE is_active = 1 ORDER BY sort_order').all();
  res.json(plans);
});

router.get('/free', (req, res) => {
  const plans = prepare('SELECT * FROM free_plans ORDER BY sort_order').all();
  res.json(plans);
});

// Get location availability (mapped from table: location_settings)
router.get('/locations', (req, res) => {
  const locations = prepare('SELECT * FROM location_settings ORDER BY sort_order').all();
  res.json(locations);
});

router.put('/locations/:id', authMiddleware, adminMiddleware, (req, res) => {
  const { is_available } = req.body;
  prepare('UPDATE location_settings SET is_available=? WHERE id=?').run(is_available ? 1 : 0, req.params.id);
  res.json({ message: 'Location updated' });
});

// Added generic table name route for shim compatibility
router.get('/location_settings', (req, res) => {
  const locations = prepare('SELECT * FROM location_settings ORDER BY sort_order').all();
  res.json(locations);
});

// Check if user can access free plans
router.get('/free-plan-status', authMiddleware, (req, res) => {
  const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip;
  const user = prepare('SELECT has_claimed_free_plan FROM users WHERE id = ?').get(req.user.id);
  const ipClaimed = prepare('SELECT id FROM users WHERE claimed_ip = ? AND has_claimed_free_plan = 1').get(clientIP);

  res.json({
    canClaim: !user?.has_claimed_free_plan && !ipClaimed,
    hasClaimed: user?.has_claimed_free_plan === 1,
    ipAlreadyUsed: !!ipClaimed
  });
});

// Claim free plan
router.post('/claim-free', authMiddleware, (req, res) => {
  const { planId } = req.body;
  const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip;
  const user = prepare('SELECT has_claimed_free_plan FROM users WHERE id = ?').get(req.user.id);
  if (user?.has_claimed_free_plan) {
    return res.status(400).json({ error: 'You have already claimed a free plan' });
  }
  const ipClaimed = prepare('SELECT id FROM users WHERE claimed_ip = ? AND has_claimed_free_plan = 1').get(clientIP);
  if (ipClaimed) {
    return res.status(400).json({ error: 'A free plan has already been claimed from this IP address' });
  }
  const plan = prepare('SELECT * FROM free_plans WHERE id = ?').get(planId);
  if (!plan) {
    return res.status(404).json({ error: 'Plan not found' });
  }
  prepare('UPDATE users SET has_claimed_free_plan = 1, claimed_ip = ? WHERE id = ?').run(clientIP, req.user.id);
  prepare('INSERT INTO tickets (user_id, subject, message, status) VALUES (?, ?, ?, ?)').run(
    req.user.id,
    `Free Plan: ${plan.name}`,
    `Free Plan Claimed\nPlan: ${plan.name}\nRAM: ${plan.ram}\nCPU: ${plan.cpu}\nLocation: ${plan.location}`,
    'pending'
  );
  res.json({ success: true, message: 'Free plan claimed successfully!' });
});

// Public YT Partners
router.get('/yt-partners', (req, res) => {
  const partners = prepare('SELECT * FROM yt_partners ORDER BY sort_order ASC, created_at DESC, id DESC').all();
  res.json(partners);
});

// Admin CRUD for YT Partners
router.post('/yt-partners', authMiddleware, adminMiddleware, (req, res) => {
  const { name, channel_link, logo, is_featured } = req.body;
  const result = prepare('INSERT INTO yt_partners (name, channel_link, logo, is_featured) VALUES (?, ?, ?, ?)')
    .run(name, channel_link, logo || null, is_featured ? 1 : 0);
  res.json({ id: result.lastInsertRowid, message: 'Partner added' });
});

router.put('/yt-partners/:id', authMiddleware, adminMiddleware, (req, res) => {
  const { name, channel_link, logo, is_featured } = req.body;
  prepare('UPDATE yt_partners SET name=?, channel_link=?, logo=?, is_featured=? WHERE id=?')
    .run(name, channel_link, logo || null, is_featured ? 1 : 0, req.params.id);
  res.json({ message: 'Partner updated' });
});

router.delete('/yt-partners/:id', authMiddleware, adminMiddleware, (req, res) => {
  prepare('DELETE FROM yt_partners WHERE id=?').run(req.params.id);
  res.json({ message: 'Partner deleted' });
});

// Public site settings
router.get('/settings/:key', (req, res) => {
  const setting = prepare('SELECT * FROM site_settings WHERE key=?').get(req.params.key);
  res.json(setting || { key: req.params.key, value: '0' });
});

// Create an order/ticket for a paid plan
router.post('/order', authMiddleware, (req, res) => {
  const { subject, message, screenshot } = req.body;
  if (!subject || !message) return res.status(400).json({ error: 'Subject and message required' });
  try {
    prepare('INSERT INTO tickets (user_id, subject, message, screenshot, status) VALUES (?, ?, ?, ?, ?)')
      .run(req.user.id, subject, message, screenshot || null, 'pending');
    res.json({ message: 'Order submitted successfully' });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

module.exports = router;