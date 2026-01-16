const express = require('express');
const bcrypt = require('bcryptjs');
const { prepare, saveDB } = require('../database');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

// Users
router.get('/users', (req, res) => {
  const users = prepare('SELECT id, username, email, isAdmin, createdAt FROM users ORDER BY createdAt DESC').all();
  res.json(users);
});

// Delete user
router.delete('/users/:id', (req, res) => {
  const userId = req.params.id;
  // Don't allow deleting admin
  const user = prepare('SELECT isAdmin FROM users WHERE id = ?').get(userId);
  if (user?.isAdmin) {
    return res.status(400).json({ error: 'Cannot delete admin user' });
  }
  // Delete user's chat messages
  prepare('DELETE FROM chat_messages WHERE senderId = ? OR receiverId = ?').run(userId, userId);
  // Delete user's tickets
  prepare('DELETE FROM tickets WHERE userId = ?').run(userId);
  // Delete user
  prepare('DELETE FROM users WHERE id = ?').run(userId);
  res.json({ message: 'User deleted successfully' });
});

// Paid Plans CRUD
router.get('/paid-plans', (req, res) => {
  const plans = prepare('SELECT * FROM paid_plans ORDER BY sortOrder').all();
  res.json(plans);
});

router.post('/paid-plans', (req, res) => {
  const { name, ram, cpu, storage, location, price, discount, sortOrder } = req.body;
  // Get max sortOrder and add 1 to put new plan at end
  const maxOrder = prepare('SELECT MAX(sortOrder) as maxOrder FROM paid_plans').get();
  const newOrder = sortOrder || ((maxOrder && maxOrder.maxOrder) ? maxOrder.maxOrder + 1 : 1);
  const result = prepare('INSERT INTO paid_plans (name, ram, cpu, storage, location, price, discount, sortOrder) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(name, ram, cpu, storage || '10GB', location, price, discount || 0, newOrder);
  res.json({ id: result.lastInsertRowid });
});

router.put('/paid-plans/:id', (req, res) => {
  const { name, ram, cpu, storage, location, price, discount, sortOrder } = req.body;
  prepare('UPDATE paid_plans SET name=?, ram=?, cpu=?, storage=?, location=?, price=?, discount=?, sortOrder=? WHERE id=?').run(name, ram, cpu, storage || '10GB', location, price, discount || 0, sortOrder || 0, req.params.id);
  res.json({ message: 'Plan updated' });
});

router.delete('/paid-plans/:id', (req, res) => {
  prepare('DELETE FROM paid_plans WHERE id=?').run(req.params.id);
  res.json({ message: 'Plan deleted' });
});

// Free Plans CRUD
router.get('/free-plans', (req, res) => {
  const plans = prepare('SELECT * FROM free_plans ORDER BY sortOrder').all();
  res.json(plans);
});

router.post('/free-plans', (req, res) => {
  const { name, ram, cpu, location, description, sortOrder } = req.body;
  const result = prepare('INSERT INTO free_plans (name, ram, cpu, location, description, sortOrder) VALUES (?, ?, ?, ?, ?, ?)').run(name, ram, cpu, location, description, sortOrder || 0);
  res.json({ id: result.lastInsertRowid });
});

router.put('/free-plans/:id', (req, res) => {
  const { name, ram, cpu, location, description, sortOrder } = req.body;
  prepare('UPDATE free_plans SET name=?, ram=?, cpu=?, location=?, description=?, sortOrder=? WHERE id=?').run(name, ram, cpu, location, description, sortOrder || 0, req.params.id);
  res.json({ message: 'Plan updated' });
});

router.delete('/free-plans/:id', (req, res) => {
  prepare('DELETE FROM free_plans WHERE id=?').run(req.params.id);
  res.json({ message: 'Plan deleted' });
});


// Tickets
router.get('/tickets', (req, res) => {
  const tickets = prepare(`
    SELECT t.*, u.username, u.email as userEmail 
    FROM tickets t 
    JOIN users u ON t.userId = u.id 
    ORDER BY t.createdAt DESC
  `).all();
  res.json(tickets);
});

router.put('/tickets/:id', (req, res) => {
  const { status, adminResponse } = req.body;
  prepare('UPDATE tickets SET status=?, adminResponse=? WHERE id=?').run(status, adminResponse, req.params.id);
  res.json({ message: 'Ticket updated' });
});

// About Content
router.get('/about', (req, res) => {
  const about = prepare('SELECT * FROM about_content').get();
  res.json(about);
});

router.put('/about', (req, res) => {
  const { content, owner, ownerPhoto, coOwner, coOwnerPhoto, managers, managersPhoto } = req.body;
  prepare('UPDATE about_content SET content=?, owner=?, ownerPhoto=?, coOwner=?, coOwnerPhoto=?, managers=?, managersPhoto=? WHERE id=1').run(content, owner, ownerPhoto || null, coOwner, coOwnerPhoto || null, managers, managersPhoto || null);
  res.json({ message: 'About content updated' });
});

// Admin credentials update
router.put('/credentials', (req, res) => {
  const { email, password } = req.body;
  if (email) prepare('UPDATE users SET email=? WHERE id=?').run(email, req.user.id);
  if (password) prepare('UPDATE users SET password=? WHERE id=?').run(bcrypt.hashSync(password, 10), req.user.id);
  res.json({ message: 'Credentials updated' });
});

// Location Settings
router.get('/locations', (req, res) => {
  const locations = prepare('SELECT * FROM location_settings').all();
  res.json(locations);
});

router.put('/locations/:location', (req, res) => {
  const { isAvailable } = req.body;
  prepare('UPDATE location_settings SET isAvailable=? WHERE location=?').run(isAvailable ? 1 : 0, req.params.location);
  res.json({ message: 'Location updated' });
});

// YT Partners CRUD
router.get('/yt-partners', (req, res) => {
  const partners = prepare('SELECT * FROM yt_partners ORDER BY sortOrder ASC, createdAt DESC, id DESC').all();
  res.json(partners);
});

router.post('/yt-partners', (req, res) => {
  const { name, link, logo, isFeatured } = req.body;
  const createdAt = new Date().toISOString();
  // Get max sortOrder and add 1
  const maxOrder = prepare('SELECT MAX(sortOrder) as maxOrder FROM yt_partners').get();
  const newOrder = (maxOrder && maxOrder.maxOrder) ? maxOrder.maxOrder + 1 : 1;
  const result = prepare('INSERT INTO yt_partners (name, link, logo, isFeatured, createdAt, sortOrder) VALUES (?, ?, ?, ?, ?, ?)').run(name, link, logo || null, isFeatured ? 1 : 0, createdAt, newOrder);
  res.json({ id: result.lastInsertRowid });
});

router.put('/yt-partners/:id', (req, res) => {
  const { name, link, logo, isFeatured } = req.body;
  prepare('UPDATE yt_partners SET name=?, link=?, logo=?, isFeatured=? WHERE id=?').run(name, link, logo || null, isFeatured ? 1 : 0, req.params.id);
  res.json({ message: 'Partner updated' });
});

router.delete('/yt-partners/:id', (req, res) => {
  prepare('DELETE FROM yt_partners WHERE id=?').run(req.params.id);
  res.json({ message: 'Partner deleted' });
});

// YT Partners Reorder
router.put('/yt-partners-reorder', (req, res) => {
  const { orderedIds } = req.body;
  orderedIds.forEach((id, index) => {
    prepare('UPDATE yt_partners SET sortOrder=? WHERE id=?').run(index + 1, id);
  });
  res.json({ message: 'Partners reordered' });
});

// Site Settings
router.get('/settings/:key', (req, res) => {
  const setting = prepare('SELECT * FROM site_settings WHERE key=?').get(req.params.key);
  res.json(setting || { key: req.params.key, value: '0' });
});

router.put('/settings/:key', (req, res) => {
  const { value } = req.body;
  const exists = prepare('SELECT * FROM site_settings WHERE key=?').get(req.params.key);
  if (exists) {
    prepare('UPDATE site_settings SET value=? WHERE key=?').run(value, req.params.key);
  } else {
    prepare('INSERT INTO site_settings (key, value) VALUES (?, ?)').run(req.params.key, value);
  }
  res.json({ message: 'Setting updated' });
});

module.exports = router;
