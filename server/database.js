// Auto-detect database type based on environment
if (process.env.DATABASE_URL) {
  // Use PostgreSQL for production
  module.exports = require('./database-postgres');
} else {
  // Use SQLite for local development
  const initSqlJs = require('sql.js');
  const fs = require('fs');
  const path = require('path');
  const bcrypt = require('bcryptjs');

  const DB_PATH = path.join(__dirname, 'daimond.db');
  let db = null;

  async function initDB() {
    const SQL = await initSqlJs();

    // Load existing database or create new
    if (fs.existsSync(DB_PATH)) {
      const buffer = fs.readFileSync(DB_PATH);
      db = new SQL.Database(buffer);
    } else {
      db = new SQL.Database();
    }

    // Create tables with snake_case for Supabase compatibility
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        avatar TEXT,
        is_admin INTEGER DEFAULT 0,
        has_claimed_free_plan INTEGER DEFAULT 0,
        claimed_ip TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        last_seen TEXT
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS paid_plans (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        ram TEXT NOT NULL,
        cpu TEXT NOT NULL,
        storage TEXT NOT NULL,
        location TEXT NOT NULL,
        price TEXT NOT NULL,
        discount INTEGER DEFAULT 0,
        sort_order INTEGER DEFAULT 0,
        is_active INTEGER DEFAULT 1
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS free_plans (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        ram TEXT NOT NULL,
        cpu TEXT NOT NULL,
        location TEXT NOT NULL,
        description TEXT,
        sort_order INTEGER DEFAULT 0
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS tickets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        user_email TEXT,
        username TEXT,
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        screenshot TEXT,
        status TEXT DEFAULT 'pending',
        category TEXT,
        admin_response TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sender_id INTEGER NOT NULL,
        receiver_id INTEGER NOT NULL,
        message TEXT NOT NULL,
        is_read INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS location_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        location TEXT UNIQUE NOT NULL,
        is_available INTEGER DEFAULT 0,
        sort_order INTEGER DEFAULT 0
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS yt_partners (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        channel_link TEXT NOT NULL,
        logo TEXT,
        is_featured INTEGER DEFAULT 0,
        created_at TEXT,
        sort_order INTEGER DEFAULT 0,
        is_active INTEGER DEFAULT 1
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS site_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT UNIQUE NOT NULL,
        value TEXT NOT NULL
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS about_content (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT NOT NULL DEFAULT 'Flame Cloud is a next-generation gaming server hosting platform built for speed, power, and reliability.',
        founder_name TEXT NOT NULL DEFAULT 'Flame Founder',
        founder_photo TEXT,
        owner_name TEXT NOT NULL DEFAULT 'Flame Owner',
        owner_photo TEXT,
        management_name TEXT NOT NULL DEFAULT 'Flame Management',
        management_photo TEXT
      )
    `);

    // Initialize default admin
    const adminExists = db.exec("SELECT * FROM users WHERE is_admin = 1");
    if (adminExists.length === 0 || adminExists[0].values.length === 0) {
      const adminEmail = process.env.ADMIN_EMAIL || 'flamecloud@gmail.com';
      const adminPassword = process.env.ADMIN_PASSWORD || 'GSFY!25V$';
      const hashedPassword = bcrypt.hashSync(adminPassword, 10);
      db.run("INSERT INTO users (username, email, password, is_admin) VALUES (?, ?, ?, ?)",
        ['Flame Cloud Admin', adminEmail, hashedPassword, 1]);
    }

    // Initialize location settings
    const locationsExist = db.exec("SELECT * FROM location_settings");
    if (locationsExist.length === 0 || locationsExist[0].values.length === 0) {
      db.run("INSERT INTO location_settings (location, is_available, sort_order) VALUES (?, ?, ?)", ['UAE', 1, 1]);
      db.run("INSERT INTO location_settings (location, is_available, sort_order) VALUES (?, ?, ?)", ['France', 0, 2]);
      db.run("INSERT INTO location_settings (location, is_available, sort_order) VALUES (?, ?, ?)", ['Singapore', 0, 3]);
    }

    // Initialize Site Settings
    const settingsExist = db.exec("SELECT * FROM site_settings");
    if (settingsExist.length === 0 || settingsExist[0].values.length === 0) {
      db.run("INSERT INTO site_settings (key, value) VALUES (?, ?)", ['yt_partners_enabled', '0']);
      db.run("INSERT INTO site_settings (key, value) VALUES (?, ?)", ['discord_members', '400+']);
    }

    // Initialize default about content
    const aboutExists = db.exec("SELECT * FROM about_content");
    if (aboutExists.length === 0 || aboutExists[0].values.length === 0) {
      db.run("INSERT INTO about_content (content, founder_name, owner_name, management_name) VALUES (?, ?, ?, ?)", [
        'Flame Cloud is a next-generation gaming server hosting platform built for speed, power, and reliability.',
        'Flame Founder',
        'Flame Owner',
        'Flame Management'
      ]);
    }

    // Initialize default paid plans
    const plansExist = db.exec("SELECT * FROM paid_plans");
    if (plansExist.length === 0 || plansExist[0].values.length === 0) {
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
      plans.forEach(p => {
        db.run("INSERT INTO paid_plans (name, ram, cpu, storage, location, price, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          [p.name, p.ram, p.cpu, p.storage, p.location, p.price, p.order, 1]);
      });
    }

    saveDB();
    return db;
  }

  function saveDB() {
    if (db) {
      const data = db.export();
      const buffer = Buffer.from(data);
      fs.writeFileSync(DB_PATH, buffer);
    }
  }

  function getDB() {
    return db;
  }

  // Helper functions
  function prepare(sql) {
    return {
      run: (...params) => {
        db.run(sql, params);
        saveDB();
        const res = db.exec("SELECT last_insert_rowid()");
        return { lastInsertRowid: res[0].values[0][0] };
      },
      get: (...params) => {
        const result = db.exec(sql, params);
        if (result.length === 0 || result[0].values.length === 0) return null;
        const cols = result[0].columns;
        const vals = result[0].values[0];
        return cols.reduce((obj, col, i) => { obj[col] = vals[i]; return obj; }, {});
      },
      all: (...params) => {
        const result = db.exec(sql, params);
        if (result.length === 0) return [];
        const cols = result[0].columns;
        return result[0].values.map(vals => cols.reduce((obj, col, i) => { obj[col] = vals[i]; return obj; }, {}));
      }
    };
  }

  module.exports = { initDB, getDB, prepare, saveDB };
}
