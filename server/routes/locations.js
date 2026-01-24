const express = require('express');
const { prepare } = require('../database-simple');

const router = express.Router();

// Get location settings
router.get('/', async (req, res) => {
  try {
    const locations = prepare('SELECT * FROM location_settings').all();
    res.json(locations || []);
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
});

module.exports = router;