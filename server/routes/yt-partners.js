const express = require('express');
const { prepare } = require('../database-simple');

const router = express.Router();

// Get YT partners and enabled status
router.get('/', async (req, res) => {
  try {
    const partners = prepare('SELECT * FROM yt_partners ORDER BY sortOrder').all();
    const setting = prepare('SELECT value FROM site_settings WHERE key = ?').get('yt_partners_enabled');
    const enabled = setting?.value === '1';
    
    res.json({ partners: partners || [], enabled });
  } catch (error) {
    console.error('Error fetching YT partners:', error);
    res.status(500).json({ error: 'Failed to fetch YT partners' });
  }
});

module.exports = router;