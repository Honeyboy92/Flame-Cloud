const express = require('express');
const { supabase } = require('../database');

const router = express.Router();

router.get('/', async (req, res) => {
  const { data } = await supabase.from('about_content').select('*').limit(1);
  const about = data?.[0];
  
  if (about) {
    res.json({
      id: about.id,
      content: about.content,
      owner: about.owner,
      ownerPhoto: about.owner_photo,
      coOwner: about.co_owner,
      coOwnerPhoto: about.co_owner_photo,
      managers: about.managers,
      managersPhoto: about.managers_photo
    });
  } else {
    res.json(null);
  }
});

module.exports = router;
