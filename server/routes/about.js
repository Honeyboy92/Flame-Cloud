const express = require('express');
const { prepare } = require('../database');

const router = express.Router();

router.get('/', (req, res) => {
  const about = prepare('SELECT * FROM about_content').get();
  res.json(about);
});

module.exports = router;
