const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

let pool = null;

async function initDB() {
  // Create connection pool with timeout
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    connectionTimeoutMillis: 5000, // 5 second timeout to prevent hangs
    max: 10 // Smaller pool for serverless
  });

  try {
    // Test connection
    await pool.query('SELECT NOW()');
    console.log('✅ PostgreSQL connected successfully');

    // Create tables
    await createTables();
    await initializeDefaultData();

    return pool;
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error);
    throw error;
  }
}

async function createTables() {
  const queries = [
    `CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      avatar TEXT,
      isAdmin BOOLEAN DEFAULT FALSE,
      hasClaimedFreePlan BOOLEAN DEFAULT FALSE,
      claimedIP VARCHAR(45),
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    `CREATE TABLE IF NOT EXISTS paid_plans (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      ram VARCHAR(50) NOT NULL,
      cpu VARCHAR(50) NOT NULL,
      storage VARCHAR(100) NOT NULL,
      location VARCHAR(100) NOT NULL,
      price VARCHAR(50) NOT NULL,
      discount INTEGER DEFAULT 0,
      sortOrder INTEGER DEFAULT 0
    )`,

    `CREATE TABLE IF NOT EXISTS free_plans (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      ram VARCHAR(50) NOT NULL,
      cpu VARCHAR(50) NOT NULL,
      location VARCHAR(100) NOT NULL,
      description TEXT,
      sortOrder INTEGER DEFAULT 0
    )`,

    `CREATE TABLE IF NOT EXISTS tickets (
      id SERIAL PRIMARY KEY,
      userId INTEGER NOT NULL,
      subject VARCHAR(500) NOT NULL,
      message TEXT NOT NULL,
      screenshot TEXT,
      status VARCHAR(50) DEFAULT 'pending',
      admin_response TEXT,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    `CREATE TABLE IF NOT EXISTS chat_messages (
      id SERIAL PRIMARY KEY,
      senderId INTEGER NOT NULL,
      receiverId INTEGER NOT NULL,
      message TEXT NOT NULL,
      isRead BOOLEAN DEFAULT FALSE,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    `CREATE TABLE IF NOT EXISTS location_settings (
      id SERIAL PRIMARY KEY,
      location VARCHAR(100) UNIQUE NOT NULL,
      isAvailable BOOLEAN DEFAULT FALSE
    )`,

    `CREATE TABLE IF NOT EXISTS yt_partners (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      link TEXT NOT NULL,
      logo TEXT,
      isFeatured BOOLEAN DEFAULT FALSE,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      sortOrder INTEGER DEFAULT 0
    )`,

    `CREATE TABLE IF NOT EXISTS site_settings (
      id SERIAL PRIMARY KEY,
      key VARCHAR(255) UNIQUE NOT NULL,
      value TEXT NOT NULL
    )`,

    `CREATE TABLE IF NOT EXISTS about_content (
      id SERIAL PRIMARY KEY,
      content TEXT NOT NULL DEFAULT 'Flame Cloud is a next-generation gaming server hosting platform built for speed, power, and reliability.',
      founder_name VARCHAR(255) NOT NULL DEFAULT 'Flame Founder',
      founder_photo TEXT,
      owner_name VARCHAR(255) NOT NULL DEFAULT 'Flame Owner',
      owner_photo TEXT,
      management_name VARCHAR(255) NOT NULL DEFAULT 'Flame Management',
      management_photo TEXT
    )`
  ];

  for (const query of queries) {
    await pool.query(query);
  }

  console.log('✅ Database tables created successfully');
}

async function initializeDefaultData() {
  try {
    // Initialize default admin
    const adminExists = await pool.query("SELECT * FROM users WHERE isAdmin = TRUE");
    if (adminExists.rows.length === 0) {
      const adminEmail = process.env.ADMIN_EMAIL || 'flamecloud@gmail.com';
      const adminPassword = process.env.ADMIN_PASSWORD || 'flamecloud999';
      const hashedPassword = bcrypt.hashSync(adminPassword, 10);
      await pool.query(
        "INSERT INTO users (username, email, password, isAdmin) VALUES ($1, $2, $3, $4)",
        ['Flame Cloud Team', adminEmail, hashedPassword, true]
      );
      console.log('✅ Default admin created');
    }

    // Initialize location settings
    const locationsExist = await pool.query("SELECT * FROM location_settings");
    if (locationsExist.rows.length === 0) {
      await pool.query("INSERT INTO location_settings (location, isAvailable) VALUES ($1, $2)", ['UAE', true]);
      await pool.query("INSERT INTO location_settings (location, isAvailable) VALUES ($1, $2)", ['France', false]);
      await pool.query("INSERT INTO location_settings (location, isAvailable) VALUES ($1, $2)", ['Singapore', false]);
      console.log('✅ Default locations created');
    }

    // Initialize YT Partners visibility setting
    const ytSettingExists = await pool.query("SELECT * FROM site_settings WHERE key = 'yt_partners_enabled'");
    if (ytSettingExists.rows.length === 0) {
      await pool.query("INSERT INTO site_settings (key, value) VALUES ($1, $2)", ['yt_partners_enabled', '0']);
      console.log('✅ YT Partners setting created');
    }

    // Initialize default about content
    const aboutExists = await pool.query("SELECT * FROM about_content");
    if (aboutExists.rows.length === 0) {
      await pool.query(
        "INSERT INTO about_content (content, founder_name, owner_name, management_name) VALUES ($1, $2, $3, $4)",
        [
          'Flame Cloud is a next-generation gaming server hosting platform built for speed, power, and reliability.',
          'Flame Founder',
          'Flame Owner',
          'Flame Management'
        ]
      );
      console.log('✅ Default about content created');
    }

    // Initialize default paid plans
    const plansExist = await pool.query("SELECT * FROM paid_plans");
    if (plansExist.rows.length === 0) {
      const plans = [
        { name: 'Bronze Plan', ram: '2GB', cpu: '100%', storage: '10 GB SSD', location: 'UAE', price: '200 PKR', order: 1 },
        { name: 'Silver Plan', ram: '4GB', cpu: '150%', storage: '20 GB SSD', location: 'UAE', price: '400 PKR', order: 2 },
        { name: 'Gold Plan', ram: '8GB', cpu: '250%', storage: '30 GB SSD', location: 'UAE', price: '600 PKR', order: 3 },
        { name: 'Platinum Plan', ram: '10GB', cpu: '300%', storage: '40 GB SSD', location: 'UAE', price: '800 PKR', order: 4 },
        { name: 'Emerald Plan', ram: '12GB', cpu: '350%', storage: '50 GB SSD', location: 'UAE', price: '1200 PKR', order: 5 },
        { name: 'Amethyst Plan', ram: '14GB', cpu: '400%', storage: '60 GB SSD', location: 'UAE', price: '3600 PKR', order: 6 },
        { name: 'Diamond Plan', ram: '16GB', cpu: '500%', storage: '80 GB SSD', location: 'UAE', price: '1600 PKR', order: 7 },
        { name: 'Ruby Plan', ram: '32GB', cpu: '1000%', storage: '100 GB SSD', location: 'UAE', price: '3200 PKR', order: 8 },
        { name: 'Black Ruby Plan', ram: '34GB', cpu: '2000%', storage: '200 GB SSD', location: 'UAE', price: '3400 PKR', order: 9 }
      ];

      for (const p of plans) {
        await pool.query(
          "INSERT INTO paid_plans (name, ram, cpu, storage, location, price, sortOrder) VALUES ($1, $2, $3, $4, $5, $6, $7)",
          [p.name, p.ram, p.cpu, p.storage, p.location, p.price, p.order]
        );
      }
      console.log('✅ Default paid plans created');
    }

  } catch (error) {
    console.error('❌ Error initializing default data:', error);
  }
}

function getDB() {
  return pool;
}

// Helper functions for compatibility with existing code
function prepare(sql) {
  return {
    run: async (...params) => {
      const result = await pool.query(sql, params);
      return { lastInsertRowid: result.rows[0]?.id || result.insertId };
    },
    get: async (...params) => {
      const result = await pool.query(sql, params);
      return result.rows[0] || null;
    },
    all: async (...params) => {
      const result = await pool.query(sql, params);
      return result.rows;
    }
  };
}

// Direct query function
async function query(text, params) {
  return await pool.query(text, params);
}

module.exports = { initDB, getDB, prepare, query };