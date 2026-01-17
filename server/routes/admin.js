const express = require('express');
const bcrypt = require('bcryptjs');
const { supabase } = require('../database');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

// Users
router.get('/users', async (req, res) => {
  const { data: users } = await supabase
    .from('users')
    .select('id, username, email, is_admin, created_at')
    .order('created_at', { ascending: false });
  
  const mappedUsers = (users || []).map(u => ({
    id: u.id,
    username: u.username,
    email: u.email,
    isAdmin: u.is_admin,
    createdAt: u.created_at
  }));
  
  res.json(mappedUsers);
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  const userId = req.params.id;
  
  const { data: users } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', userId)
    .limit(1);
  
  if (users?.[0]?.is_admin) {
    return res.status(400).json({ error: 'Cannot delete admin user' });
  }
  
  await supabase.from('chat_messages').delete().or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);
  await supabase.from('tickets').delete().eq('user_id', userId);
  await supabase.from('users').delete().eq('id', userId);
  
  res.json({ message: 'User deleted successfully' });
});

// Paid Plans CRUD
router.get('/paid-plans', async (req, res) => {
  const { data: plans } = await supabase
    .from('paid_plans')
    .select('*')
    .order('sort_order');
  
  const mappedPlans = (plans || []).map(p => ({
    id: p.id, name: p.name, ram: p.ram, cpu: p.cpu, storage: p.storage,
    location: p.location, price: p.price, discount: p.discount, sortOrder: p.sort_order
  }));
  
  res.json(mappedPlans);
});

router.post('/paid-plans', async (req, res) => {
  const { name, ram, cpu, storage, location, price, discount, sortOrder } = req.body;
  
  const { data: maxData } = await supabase
    .from('paid_plans')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1);
  
  const newOrder = sortOrder || ((maxData?.[0]?.sort_order || 0) + 1);
  
  const { data, error } = await supabase
    .from('paid_plans')
    .insert({ name, ram, cpu, storage: storage || '10GB', location, price, discount: discount || 0, sort_order: newOrder })
    .select();
  
  res.json({ id: data?.[0]?.id });
});

router.put('/paid-plans/:id', async (req, res) => {
  const { name, ram, cpu, storage, location, price, discount, sortOrder } = req.body;
  
  await supabase
    .from('paid_plans')
    .update({ name, ram, cpu, storage: storage || '10GB', location, price, discount: discount || 0, sort_order: sortOrder || 0 })
    .eq('id', req.params.id);
  
  res.json({ message: 'Plan updated' });
});

router.delete('/paid-plans/:id', async (req, res) => {
  await supabase.from('paid_plans').delete().eq('id', req.params.id);
  res.json({ message: 'Plan deleted' });
});

// Free Plans CRUD
router.get('/free-plans', async (req, res) => {
  const { data: plans } = await supabase
    .from('free_plans')
    .select('*')
    .order('sort_order');
  
  const mappedPlans = (plans || []).map(p => ({
    id: p.id, name: p.name, ram: p.ram, cpu: p.cpu,
    location: p.location, description: p.description, sortOrder: p.sort_order
  }));
  
  res.json(mappedPlans);
});

router.post('/free-plans', async (req, res) => {
  const { name, ram, cpu, location, description, sortOrder } = req.body;
  
  const { data } = await supabase
    .from('free_plans')
    .insert({ name, ram, cpu, location, description, sort_order: sortOrder || 0 })
    .select();
  
  res.json({ id: data?.[0]?.id });
});

router.put('/free-plans/:id', async (req, res) => {
  const { name, ram, cpu, location, description, sortOrder } = req.body;
  
  await supabase
    .from('free_plans')
    .update({ name, ram, cpu, location, description, sort_order: sortOrder || 0 })
    .eq('id', req.params.id);
  
  res.json({ message: 'Plan updated' });
});

router.delete('/free-plans/:id', async (req, res) => {
  await supabase.from('free_plans').delete().eq('id', req.params.id);
  res.json({ message: 'Plan deleted' });
});

// Tickets
router.get('/tickets', async (req, res) => {
  const { data: tickets } = await supabase
    .from('tickets')
    .select('*, users(username, email)')
    .order('created_at', { ascending: false });
  
  const mappedTickets = (tickets || []).map(t => ({
    id: t.id, userId: t.user_id, subject: t.subject, message: t.message,
    screenshot: t.screenshot, status: t.status, adminResponse: t.admin_response,
    createdAt: t.created_at, username: t.users?.username, userEmail: t.users?.email
  }));
  
  res.json(mappedTickets);
});

router.put('/tickets/:id', async (req, res) => {
  const { status, adminResponse } = req.body;
  
  await supabase
    .from('tickets')
    .update({ status, admin_response: adminResponse })
    .eq('id', req.params.id);
  
  res.json({ message: 'Ticket updated' });
});

// About Content
router.get('/about', async (req, res) => {
  const { data } = await supabase.from('about_content').select('*').limit(1);
  const about = data?.[0];
  
  if (about) {
    res.json({
      id: about.id, content: about.content, owner: about.owner, ownerPhoto: about.owner_photo,
      coOwner: about.co_owner, coOwnerPhoto: about.co_owner_photo,
      managers: about.managers, managersPhoto: about.managers_photo
    });
  } else {
    res.json(null);
  }
});

router.put('/about', async (req, res) => {
  const { content, owner, ownerPhoto, coOwner, coOwnerPhoto, managers, managersPhoto } = req.body;
  
  await supabase
    .from('about_content')
    .update({
      content, owner, owner_photo: ownerPhoto || null,
      co_owner: coOwner, co_owner_photo: coOwnerPhoto || null,
      managers, managers_photo: managersPhoto || null
    })
    .eq('id', 1);
  
  res.json({ message: 'About content updated' });
});

// Admin credentials update
router.put('/credentials', async (req, res) => {
  const { email, password } = req.body;
  
  const updates = {};
  if (email) updates.email = email;
  if (password) updates.password = bcrypt.hashSync(password, 10);
  
  if (Object.keys(updates).length > 0) {
    await supabase.from('users').update(updates).eq('id', req.user.id);
  }
  
  res.json({ message: 'Credentials updated' });
});

// Location Settings
router.get('/locations', async (req, res) => {
  const { data: locations } = await supabase.from('location_settings').select('*');
  
  const mappedLocations = (locations || []).map(l => ({
    id: l.id, location: l.location, isAvailable: l.is_available
  }));
  
  res.json(mappedLocations);
});

router.put('/locations/:location', async (req, res) => {
  const { isAvailable } = req.body;
  
  await supabase
    .from('location_settings')
    .update({ is_available: isAvailable })
    .eq('location', req.params.location);
  
  res.json({ message: 'Location updated' });
});

// YT Partners CRUD
router.get('/yt-partners', async (req, res) => {
  const { data: partners } = await supabase
    .from('yt_partners')
    .select('*')
    .order('sort_order')
    .order('created_at', { ascending: false });
  
  const mappedPartners = (partners || []).map(p => ({
    id: p.id, name: p.name, link: p.link, logo: p.logo,
    isFeatured: p.is_featured, sortOrder: p.sort_order, createdAt: p.created_at
  }));
  
  res.json(mappedPartners);
});

router.post('/yt-partners', async (req, res) => {
  const { name, link, logo, isFeatured } = req.body;
  
  const { data: maxData } = await supabase
    .from('yt_partners')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1);
  
  const newOrder = (maxData?.[0]?.sort_order || 0) + 1;
  
  const { data } = await supabase
    .from('yt_partners')
    .insert({ name, link, logo: logo || null, is_featured: isFeatured || false, sort_order: newOrder })
    .select();
  
  res.json({ id: data?.[0]?.id });
});

router.put('/yt-partners/:id', async (req, res) => {
  const { name, link, logo, isFeatured } = req.body;
  
  await supabase
    .from('yt_partners')
    .update({ name, link, logo: logo || null, is_featured: isFeatured || false })
    .eq('id', req.params.id);
  
  res.json({ message: 'Partner updated' });
});

router.delete('/yt-partners/:id', async (req, res) => {
  await supabase.from('yt_partners').delete().eq('id', req.params.id);
  res.json({ message: 'Partner deleted' });
});

// YT Partners Reorder
router.put('/yt-partners-reorder', async (req, res) => {
  const { orderedIds } = req.body;
  
  for (let i = 0; i < orderedIds.length; i++) {
    await supabase
      .from('yt_partners')
      .update({ sort_order: i + 1 })
      .eq('id', orderedIds[i]);
  }
  
  res.json({ message: 'Partners reordered' });
});

// Site Settings
router.get('/settings/:key', async (req, res) => {
  const { data } = await supabase
    .from('site_settings')
    .select('*')
    .eq('key', req.params.key)
    .limit(1);
  
  res.json(data?.[0] || { key: req.params.key, value: '0' });
});

router.put('/settings/:key', async (req, res) => {
  const { value } = req.body;
  
  const { data: exists } = await supabase
    .from('site_settings')
    .select('*')
    .eq('key', req.params.key)
    .limit(1);
  
  if (exists && exists.length > 0) {
    await supabase.from('site_settings').update({ value }).eq('key', req.params.key);
  } else {
    await supabase.from('site_settings').insert({ key: req.params.key, value });
  }
  
  res.json({ message: 'Setting updated' });
});

module.exports = router;
