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

// Paid Plans CRUD
router.get('/paid-plans', (req, res) => {
  const plans = prepare('SELECT * FROM paid_plans ORDER BY sortOrder').all();
  res.json(plans);
});

router.post('/paid-plans', (req, res) => {
  const { name, ram, cpu, storage, location, price, sortOrder } = req.body;
  const result = prepare('INSERT INTO paid_plans (name, ram, cpu, storage, location, price, sortOrder) VALUES (?, ?, ?, ?, ?, ?, ?)').run(name, ram, cpu, storage || '10GB', location, price, sortOrder || 0);
  res.json({ id: result.lastInsertRowid });
});

router.put('/paid-plans/:id', (req, res) => {
  const { name, ram, cpu, storage, location, price, sortOrder } = req.body;
  prepare('UPDATE paid_plans SET name=?, ram=?, cpu=?, storage=?, location=?, price=?, sortOrder=? WHERE id=?').run(name, ram, cpu, storage || '10GB', location, price, sortOrder || 0, req.params.id);
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
  const { content, owner, coOwner, managers } = req.body;
  prepare('UPDATE about_content SET content=?, owner=?, coOwner=?, managers=? WHERE id=1').run(content, owner, coOwner, managers);
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

module.exports = router;
