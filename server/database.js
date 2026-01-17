const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

// Supabase Configuration
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://ppaxzpovffwxbyzjsfsp.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwYXh6cG92ZmZ3eGJ5empzZnNwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODU5NTM0NywiZXhwIjoyMDg0MTcxMzQ3fQ.uDoijExE8EoZ6aQPLkpjvSEmKBEiOn8WaqgYn92HM1o';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function initDB() {
  console.log('🔥 Connecting to Supabase...');
  
  // Check connection by fetching users
  const { data, error } = await supabase.from('users').select('count').limit(1);
  
  if (error) {
    console.error('Supabase connection error:', error.message);
  } else {
    console.log('✅ Supabase connected successfully!');
  }

  // Create default admin if not exists
  const { data: adminExists } = await supabase
    .from('users')
    .select('*')
    .eq('is_admin', true)
    .limit(1);

  if (!adminExists || adminExists.length === 0) {
    const adminEmail = process.env.ADMIN_EMAIL || 'flamecloud@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'flamecloud999';
    const hashedPassword = bcrypt.hashSync(adminPassword, 10);
    
    await supabase.from('users').insert({
      username: 'admin',
      email: adminEmail,
      password: hashedPassword,
      is_admin: true
    });
    console.log('✅ Default admin created');
  }

  return supabase;
}

function getDB() {
  return supabase;
}

// Helper function to mimic old prepare interface
function prepare(sql) {
  // This is a compatibility layer - not used with Supabase
  // All routes will use supabase directly
  return {
    run: () => {},
    get: () => null,
    all: () => []
  };
}

function saveDB() {
  // Not needed for Supabase - auto saves
}

module.exports = { initDB, getDB, prepare, saveDB, supabase };
