const { initDB, prepare } = require('./server/database');
const bcrypt = require('bcryptjs');

async function resetAdminPassword() {
  await initDB();
  
  const newPassword = 'flamecloud999';
  const hashedPassword = bcrypt.hashSync(newPassword, 10);
  
  // Update admin password
  prepare('UPDATE users SET password=? WHERE email=? AND isAdmin=1').run(hashedPassword, 'flamecloud@gmail.com');
  
  console.log('✅ Admin password reset successfully!');
  console.log('Email: flamecloud@gmail.com');
  console.log('Password: flamecloud999');
  
  // Verify the update
  const admin = prepare('SELECT username, email, isAdmin FROM users WHERE email=? AND isAdmin=1').get('flamecloud@gmail.com');
  console.log('Admin user:', admin);
}

resetAdminPassword().catch(console.error);