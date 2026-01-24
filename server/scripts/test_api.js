(async () => {
  const jwt = require('jsonwebtoken');
  const token = jwt.sign({ id: 1, username: 'Flame Cloud Admin', email: 'flamecloud@gmail.com', isAdmin: true }, process.env.JWT_SECRET || 'flame-cloud-secret-key-2024', { expiresIn: '7d' });
  console.log('Token:', token);
  const res = await fetch('http://localhost:5000/api/chat/users', { headers: { Authorization: `Bearer ${token}` } });
  const txt = await res.text();
  console.log('Status:', res.status);
  console.log('Body:', txt);
})();
