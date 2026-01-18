const express = require('express');
const { prepare } = require('../database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/paid', (req, res) => {
  const plans = prepare('SELECT * FROM paid_plans ORDER BY sortOrder').all();
  res.json(plans);
});

router.get('/free', (req, res) => {
  const plans = prepare('SELECT * FROM free_plans ORDER BY sortOrder').all();
  res.json(plans);
});

// Get location availability
router.get('/locations', (req, res) => {
  const locations = prepare('SELECT * FROM location_settings').all();
  res.json(locations);
});

// Check if user can access free plans
router.get('/free-plan-status', authMiddleware, (req, res) => {
  const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip;
  
  // Check if this user already claimed
  const user = prepare('SELECT hasClaimedFreePlan FROM users WHERE id = ?').get(req.user.id);
  
  // Check if this IP already claimed
  const ipClaimed = prepare('SELECT id FROM users WHERE claimedIP = ? AND hasClaimedFreePlan = 1').get(clientIP);
  
  res.json({
    canClaim: !user?.hasClaimedFreePlan && !ipClaimed,
    hasClaimed: user?.hasClaimedFreePlan === 1,
    ipAlreadyUsed: !!ipClaimed
  });
});

// Claim free plan
router.post('/claim-free', authMiddleware, (req, res) => {
  const { planId } = req.body;
  const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip;
  
  // Check if user already claimed
  const user = prepare('SELECT hasClaimedFreePlan FROM users WHERE id = ?').get(req.user.id);
  if (user?.hasClaimedFreePlan) {
    return res.status(400).json({ error: 'You have already claimed a free plan' });
  }
  
  // Check if IP already claimed
  const ipClaimed = prepare('SELECT id FROM users WHERE claimedIP = ? AND hasClaimedFreePlan = 1').get(clientIP);
  if (ipClaimed) {
    return res.status(400).json({ error: 'A free plan has already been claimed from this IP address' });
  }
  
  // Get plan details
  const plan = prepare('SELECT * FROM free_plans WHERE id = ?').get(planId);
  if (!plan) {
    return res.status(404).json({ error: 'Plan not found' });
  }
  
  // Mark user as claimed
  prepare('UPDATE users SET hasClaimedFreePlan = 1, claimedIP = ? WHERE id = ?').run(clientIP, req.user.id);
  
  // Create ticket for the free plan
  prepare('INSERT INTO tickets (userId, subject, message, status) VALUES (?, ?, ?, ?)').run(
    req.user.id,
    `Free Plan: ${plan.name}`,
    `Free Plan Claimed\nPlan: ${plan.name}\nRAM: ${plan.ram}\nCPU: ${plan.cpu}\nLocation: ${plan.location}`,
    'pending'
  );
  
  res.json({ success: true, message: 'Free plan claimed successfully!' });
});

// Public YT Partners
router.get('/yt-partners', (req, res) => {
  const partners = prepare('SELECT * FROM yt_partners ORDER BY sortOrder ASC, createdAt DESC, id DESC').all();
  res.json(partners);
});

// Public site settings
router.get('/settings/:key', (req, res) => {
  const setting = prepare('SELECT * FROM site_settings WHERE key=?').get(req.params.key);
  res.json(setting || { key: req.params.key, value: '0' });
});

module.exports = router;