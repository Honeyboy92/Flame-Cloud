const express = require('express');
const bcrypt = require('bcryptjs');
const { prepare, saveDB } = require('../database');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

// Apply admin check selectively below

// Paid Plans CRUD (Admin only)
router.get('/paid-plans', adminMiddleware, (req, res) => {
  const plans = prepare('SELECT * FROM paid_plans ORDER BY sort_order').all();
  res.json(plans);
});

router.post('/paid-plans', adminMiddleware, (req, res) => {
  const { name, ram, cpu, storage, location, price, discount, sort_order } = req.body;
  // Get max sort_order and add 1 to put new plan at end
  const maxOrder = prepare('SELECT MAX(sort_order) as maxOrder FROM paid_plans').get();
  const newOrder = sort_order || ((maxOrder && maxOrder.maxOrder) ? maxOrder.maxOrder + 1 : 1);
  const result = prepare('INSERT INTO paid_plans (name, ram, cpu, storage, location, price, discount, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(name, ram, cpu, storage || '10GB', location, price, discount || 0, newOrder);
  saveDB();
  res.json({ id: result.lastInsertRowid });
});

router.put('/paid-plans/:id', adminMiddleware, (req, res) => {
  const { name, ram, cpu, storage, location, price, discount, sort_order } = req.body;
  prepare('UPDATE paid_plans SET name=?, ram=?, cpu=?, storage=?, location=?, price=?, discount=?, sort_order=? WHERE id=?').run(name, ram, cpu, storage || '10GB', location, price, discount || 0, sort_order || 0, req.params.id);
  saveDB();
  res.json({ message: 'Plan updated' });
});

router.delete('/paid-plans/:id', adminMiddleware, (req, res) => {
  prepare('DELETE FROM paid_plans WHERE id=?').run(req.params.id);
  saveDB();
  res.json({ message: 'Plan deleted' });
});

// Restore default paid plans (admin only)
router.post('/paid-plans/restore-defaults', adminMiddleware, (req, res) => {
  const existing = prepare('SELECT name FROM paid_plans').all().map(r => r.name.toLowerCase());
  const defaults = [
    { name: 'Bronze Plan', ram: '2GB', cpu: '100%', storage: '10 GB SSD', location: 'UAE', price: '200 PKR' },
    { name: 'Silver Plan', ram: '4GB', cpu: '150%', storage: '20 GB SSD', location: 'UAE', price: '400 PKR' },
    { name: 'Gold Plan', ram: '8GB', cpu: '250%', storage: '30 GB SSD', location: 'UAE', price: '600 PKR' },
    { name: 'Platinum Plan', ram: '10GB', cpu: '300%', storage: '40 GB SSD', location: 'UAE', price: '800 PKR' },
    { name: 'Emerald Plan', ram: '12GB', cpu: '350%', storage: '50 GB SSD', location: 'UAE', price: '1200 PKR' },
    { name: 'Amethyst Plan', ram: '14GB', cpu: '400%', storage: '60 GB SSD', location: 'UAE', price: '3600 PKR' },
    { name: 'Diamond Plan', ram: '16GB', cpu: '500%', storage: '80 GB SSD', location: 'UAE', price: '1600 PKR' },
    { name: 'Ruby Plan', ram: '32GB', cpu: '1000%', storage: '100 GB SSD', location: 'UAE', price: '3200 PKR' },
    { name: 'Black Ruby Plan', ram: '34GB', cpu: '2000%', storage: '200 GB SSD', location: 'UAE', price: '3400 PKR' }
  ];

  // Insert missing defaults preserving order
  let inserted = 0;
  defaults.forEach((p, idx) => {
    if (!existing.includes(p.name.toLowerCase())) {
      // Determine next sortOrder
      const maxOrder = prepare('SELECT MAX(sort_order) as maxOrder FROM paid_plans').get();
      const newOrder = (maxOrder && maxOrder.maxOrder) ? maxOrder.maxOrder + 1 : idx + 1;
      prepare('INSERT INTO paid_plans (name, ram, cpu, storage, location, price, discount, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
        .run(p.name, p.ram, p.cpu, p.storage, p.location, p.price, 0, newOrder);
      inserted++;
    }
  });

  res.json({ message: `Defaults restored, inserted ${inserted} plans` });
  saveDB();
});

// Free Plans CRUD (Admin only)
router.get('/free-plans', adminMiddleware, (req, res) => {
  const plans = prepare('SELECT * FROM free_plans ORDER BY sort_order').all();
  res.json(plans);
});

router.post('/free-plans', (req, res) => {
  const { name, ram, cpu, location, description, sort_order } = req.body;
  const result = prepare('INSERT INTO free_plans (name, ram, cpu, location, description, sort_order) VALUES (?, ?, ?, ?, ?, ?)').run(name, ram, cpu, location, description, sort_order || 0);
  saveDB();
  res.json({ id: result.lastInsertRowid });
});

router.put('/free-plans/:id', (req, res) => {
  const { name, ram, cpu, location, description, sort_order } = req.body;
  prepare('UPDATE free_plans SET name=?, ram=?, cpu=?, location=?, description=?, sort_order=? WHERE id=?').run(name, ram, cpu, location, description, sort_order || 0, req.params.id);
  saveDB();
  res.json({ message: 'Plan updated' });
});

router.delete('/free-plans/:id', (req, res) => {
  prepare('DELETE FROM free_plans WHERE id=?').run(req.params.id);
  saveDB();
  res.json({ message: 'Plan deleted' });
});

// Tickets (Admin only for full list/update)
router.get('/tickets', adminMiddleware, (req, res) => {
  const tickets = prepare(`
    SELECT t.*, u.username, u.email as userEmail 
    FROM tickets t 
    JOIN users u ON t.user_id = u.id 
    ORDER BY t.created_at DESC
  `).all();
  res.json(tickets);
});

router.put('/tickets/:id', adminMiddleware, (req, res) => {
  const { status, adminResponse } = req.body;
  prepare('UPDATE tickets SET status=?, adminResponse=? WHERE id=?').run(status, adminResponse, req.params.id);
  saveDB();
  res.json({ message: 'Ticket updated' });
});



// Admin credentials update
router.put('/credentials', (req, res) => {
  const { email, password } = req.body;
  if (email) prepare('UPDATE users SET email=? WHERE id=?').run(email, req.user.id);
  if (password) prepare('UPDATE users SET password=? WHERE id=?').run(bcrypt.hashSync(password, 10), req.user.id);
  saveDB();
  res.json({ message: 'Credentials updated' });
});

// About Content Management
router.get('/about', (req, res) => {
  console.log('Admin about route called');
  try {
    const about = prepare('SELECT * FROM about_content LIMIT 1').get();
    console.log('About data from DB:', about);
    if (about) {
      res.json(about);
    } else {
      console.log('No about data found, returning default');
      const defaultData = {
        id: 1,
        content: "Flame Cloud is a next-generation gaming server hosting platform built for speed, power, and reliability.",
        founder_name: "Flame Founder",
        founder_photo: null,
        owner_name: "Flame Owner",
        owner_photo: null,
        management_name: "Flame Management",
        management_photo: null
      };
      res.json(defaultData);
    }
  } catch (error) {
    console.error('Error in admin about route:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

router.put('/about', adminMiddleware, (req, res) => {
  const { content, founder_name, founder_photo, owner_name, owner_photo, management_name, management_photo } = req.body;

  // Check if record exists
  const exists = prepare('SELECT id FROM about_content LIMIT 1').get();

  if (exists) {
    prepare(`UPDATE about_content SET 
      content=?, founder_name=?, founder_photo=?, 
      owner_name=?, owner_photo=?, management_name=?, management_photo=? 
      WHERE id=?`).run(
      content, founder_name, founder_photo || null,
      owner_name, owner_photo || null, management_name, management_photo || null,
      exists.id
    );
  } else {
    prepare(`INSERT INTO about_content 
      (content, founder_name, founder_photo, owner_name, owner_photo, management_name, management_photo) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`).run(
      content, founder_name, founder_photo || null,
      owner_name, owner_photo || null, management_name, management_photo || null
    );
  }

  saveDB();
  res.json({ message: 'About content updated' });
});

// Location Settings (Admin only)
router.get('/locations', adminMiddleware, (req, res) => {
  const locations = prepare('SELECT * FROM location_settings ORDER BY sort_order').all();
  res.json(locations);
});

router.put('/locations/:id', adminMiddleware, (req, res) => {
  const { isAvailable } = req.body;
  prepare('UPDATE location_settings SET is_available=? WHERE id=?').run(isAvailable ? 1 : 0, req.params.id);
  saveDB();
  res.json({ message: 'Location updated' });
});

// YT Partners CRUD (Admin only)
router.get('/yt-partners', adminMiddleware, (req, res) => {
  const partners = prepare('SELECT * FROM yt_partners ORDER BY sort_order ASC, created_at DESC, id DESC').all();
  res.json(partners);
});

router.post('/yt-partners', adminMiddleware, (req, res) => {
  const { name, link, logo, isFeatured } = req.body;
  const createdAt = new Date().toISOString();
  // Get max sort_order and add 1
  const maxOrder = prepare('SELECT MAX(sort_order) as maxOrder FROM yt_partners').get();
  const newOrder = (maxOrder && maxOrder.maxOrder) ? maxOrder.maxOrder + 1 : 1;
  const result = prepare('INSERT INTO yt_partners (name, channel_link, logo, is_featured, created_at, sort_order) VALUES (?, ?, ?, ?, ?, ?)').run(name, link, logo || null, isFeatured ? 1 : 0, createdAt, newOrder);
  saveDB();
  res.json({ id: result.lastInsertRowid });
});

router.put('/yt-partners/:id', adminMiddleware, (req, res) => {
  const { name, link, logo, isFeatured } = req.body;
  prepare('UPDATE yt_partners SET name=?, channel_link=?, logo=?, is_featured=? WHERE id=?').run(name, link, logo || null, isFeatured ? 1 : 0, req.params.id);
  saveDB();
  res.json({ message: 'Partner updated' });
});

router.delete('/yt-partners/:id', adminMiddleware, (req, res) => {
  prepare('DELETE FROM yt_partners WHERE id=?').run(req.params.id);
  saveDB();
  res.json({ message: 'Partner deleted' });
});

// YT Partners Reorder (Admin only)
router.put('/yt-partners-reorder', adminMiddleware, (req, res) => {
  const { orderedIds } = req.body;
  orderedIds.forEach((id, index) => {
    prepare('UPDATE yt_partners SET sort_order=? WHERE id=?').run(index + 1, id);
  });
  saveDB();
  res.json({ message: 'Partners reordered' });
});

// Site Settings
router.get('/settings/:key', (req, res) => {
  const setting = prepare('SELECT * FROM site_settings WHERE key=?').get(req.params.key);
  res.json(setting || { key: req.params.key, value: '0' });
});

router.put('/settings/:key', adminMiddleware, (req, res) => {
  const { value } = req.body;
  const exists = prepare('SELECT * FROM site_settings WHERE key=?').get(req.params.key);
  if (exists) {
    prepare('UPDATE site_settings SET value=? WHERE key=?').run(value, req.params.key);
  } else {
    prepare('INSERT INTO site_settings (key, value) VALUES (?, ?)').run(req.params.key, value);
  }
  saveDB();
  res.json({ message: 'Setting updated' });
});

module.exports = router;