(async () => {
  const { initDB, prepare } = require('../database');
  await initDB();
  console.log('DB initialized');
  const users = prepare('SELECT id, username, email, isAdmin FROM users ORDER BY id').all() || [];
  console.log('Users:', users);
  const msgs = prepare('SELECT * FROM chat_messages ORDER BY createdAt').all() || [];
  console.log('Messages:', msgs);
})();
