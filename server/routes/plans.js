const express = require('express');
const { supabase } = require('../database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/paid', async (req, res) => {
  const { data: plans } = await supabase
    .from('paid_plans')
    .select('*')
    .order('sort_order');
  
  // Map to old format for frontend compatibility
  const mappedPlans = (plans || []).map(p => ({
    id: p.id,
    name: p.name,
    ram: p.ram,
    cpu: p.cpu,
    storage: p.storage,
    location: p.location,
    price: p.price,
    discount: p.discount,
    sortOrder: p.sort_order
  }));
  
  res.json(mappedPlans);
});

router.get('/free', async (req, res) => {
  const { data: plans } = await supabase
    .from('free_plans')
    .select('*')
    .order('sort_order');
  
  const mappedPlans = (plans || []).map(p => ({
    id: p.id,
    name: p.name,
    ram: p.ram,
    cpu: p.cpu,
    location: p.location,
    description: p.description,
    sortOrder: p.sort_order
  }));
  
  res.json(mappedPlans);
});

// Get location availability
router.get('/locations', async (req, res) => {
  const { data: locations } = await supabase.from('location_settings').select('*');
  
  const mappedLocations = (locations || []).map(l => ({
    id: l.id,
    location: l.location,
    isAvailable: l.is_available
  }));
  
  res.json(mappedLocations);
});

// Check if user can access free plans
router.get('/free-plan-status', authMiddleware, async (req, res) => {
  const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip;
  
  const { data: users } = await supabase
    .from('users')
    .select('has_claimed_free_plan')
    .eq('id', req.user.id)
    .limit(1);
  
  const user = users?.[0];
  
  const { data: ipClaimed } = await supabase
    .from('users')
    .select('id')
    .eq('claimed_ip', clientIP)
    .eq('has_claimed_free_plan', true)
    .limit(1);
  
  res.json({
    canClaim: !user?.has_claimed_free_plan && (!ipClaimed || ipClaimed.length === 0),
    hasClaimed: user?.has_claimed_free_plan === true,
    ipAlreadyUsed: ipClaimed && ipClaimed.length > 0
  });
});

// Claim free plan
router.post('/claim-free', authMiddleware, async (req, res) => {
  const { planId } = req.body;
  const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip;
  
  const { data: users } = await supabase
    .from('users')
    .select('has_claimed_free_plan')
    .eq('id', req.user.id)
    .limit(1);
  
  if (users?.[0]?.has_claimed_free_plan) {
    return res.status(400).json({ error: 'You have already claimed a free plan' });
  }
  
  const { data: ipClaimed } = await supabase
    .from('users')
    .select('id')
    .eq('claimed_ip', clientIP)
    .eq('has_claimed_free_plan', true)
    .limit(1);
  
  if (ipClaimed && ipClaimed.length > 0) {
    return res.status(400).json({ error: 'A free plan has already been claimed from this IP address' });
  }
  
  const { data: plans } = await supabase
    .from('free_plans')
    .select('*')
    .eq('id', planId)
    .limit(1);
  
  const plan = plans?.[0];
  if (!plan) {
    return res.status(404).json({ error: 'Plan not found' });
  }
  
  await supabase
    .from('users')
    .update({ has_claimed_free_plan: true, claimed_ip: clientIP })
    .eq('id', req.user.id);
  
  await supabase.from('tickets').insert({
    user_id: req.user.id,
    subject: `Free Plan: ${plan.name}`,
    message: `Free Plan Claimed\nPlan: ${plan.name}\nRAM: ${plan.ram}\nCPU: ${plan.cpu}\nLocation: ${plan.location}`,
    status: 'pending'
  });
  
  res.json({ success: true, message: 'Free plan claimed successfully!' });
});

// Public YT Partners
router.get('/yt-partners', async (req, res) => {
  const { data: partners } = await supabase
    .from('yt_partners')
    .select('*')
    .order('sort_order')
    .order('created_at', { ascending: false });
  
  const mappedPartners = (partners || []).map(p => ({
    id: p.id,
    name: p.name,
    link: p.link,
    logo: p.logo,
    isFeatured: p.is_featured,
    sortOrder: p.sort_order,
    createdAt: p.created_at
  }));
  
  res.json(mappedPartners);
});

// Public site settings
router.get('/settings/:key', async (req, res) => {
  const { data: settings } = await supabase
    .from('site_settings')
    .select('*')
    .eq('key', req.params.key)
    .limit(1);
  
  res.json(settings?.[0] || { key: req.params.key, value: '0' });
});

module.exports = router;
