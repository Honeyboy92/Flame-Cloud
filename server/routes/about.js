const express = require('express');
const { getDB } = require('../database');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const db = getDB();
    const about = db.prepare("SELECT * FROM about_content LIMIT 1").get();
    
    if (about) {
      res.json({
        id: about.id,
        content: about.content,
        founder_name: about.founder_name,
        founder_photo: about.founder_photo,
        owner_name: about.owner_name,
        owner_photo: about.owner_photo,
        management_name: about.management_name,
        management_photo: about.management_photo
      });
    } else {
      // Return default content if no data exists
      res.json({
        id: 1,
        content: "Flame Cloud is a next-generation gaming server hosting platform built for speed, power, and reliability.",
        founder_name: "Flame Founder",
        founder_photo: null,
        owner_name: "Flame Owner",
        owner_photo: null,
        management_name: "Flame Management",
        management_photo: null
      });
    }
  } catch (error) {
    console.error('About route error:', error);
    res.json({
      id: 1,
      content: "Flame Cloud is a next-generation gaming server hosting platform built for speed, power, and reliability.",
      founder_name: "Flame Founder",
      founder_photo: null,
      owner_name: "Flame Owner",
      owner_photo: null,
      management_name: "Flame Management",
      management_photo: null
    });
  }
});

module.exports = router;