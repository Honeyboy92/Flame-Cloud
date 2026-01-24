const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, 'flame.db');
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

  // Create tables
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      avatar TEXT,
      isAdmin INTEGER DEFAULT 0,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
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
      sortOrder INTEGER DEFAULT 0
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS chat_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      senderId INTEGER NOT NULL,
      receiverId INTEGER NOT NULL,
      message TEXT NOT NULL,
      isRead INTEGER DEFAULT 0,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS tickets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      screenshot TEXT,
      status TEXT DEFAULT 'pending',
      adminResponse TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // YT Partners table
  db.run(`
    CREATE TABLE IF NOT EXISTS yt_partners (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      channel_url TEXT,
      logo TEXT,
      description TEXT,
      sortOrder INTEGER DEFAULT 0,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Location settings table
  db.run(`
    CREATE TABLE IF NOT EXISTS location_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      location TEXT UNIQUE NOT NULL,
      isAvailable INTEGER DEFAULT 1
    )
  `);

  // Site settings table
  db.run(`
    CREATE TABLE IF NOT EXISTS site_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT UNIQUE NOT NULL,
      value TEXT
    )
  `);

  // Initialize admin user
  const adminExists = db.exec("SELECT * FROM users WHERE isAdmin = 1");
  if (adminExists.length === 0 || adminExists[0].values.length === 0) {
    const adminEmail = process.env.ADMIN_EMAIL || 'flamecloud@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'GSFY!25V$';
    const hashedPassword = bcrypt.hashSync(adminPassword, 10);
    db.run("INSERT INTO users (username, email, password, isAdmin) VALUES (?, ?, ?, ?)", 
      ['Flame Cloud Admin', adminEmail, hashedPassword, 1]);
  }

  // Initialize plans
  const plansExist = db.exec("SELECT * FROM paid_plans");
  if (plansExist.length === 0 || plansExist[0].values.length === 0) {
    const plans = [
      // UAE Plans Only - As Requested
      { name: 'Bronze Plan', ram: '2GB', cpu: '100%', storage: '10 GB SSD', location: 'UAE', price: '200 PKR', order: 1 },
      { name: 'Silver Plan', ram: '4GB', cpu: '150%', storage: '20 GB SSD', location: 'UAE', price: '400 PKR', order: 2 },
      { name: 'Gold Plan', ram: '8GB', cpu: '250%', storage: '30 GB SSD', location: 'UAE', price: '600 PKR', order: 3 },
      { name: 'Platinum Plan', ram: '10GB', cpu: '300%', storage: '40 GB SSD', location: 'UAE', price: '800 PKR', order: 4 },
      { name: 'Diamond Plan', ram: '16GB', cpu: '500%', storage: '80 GB SSD', location: 'UAE', price: '1600 PKR', order: 5 },
      { name: 'Emerald Plan', ram: '12GB', cpu: '350%', storage: '50 GB SSD', location: 'UAE', price: '1200 PKR', order: 6 },
      { name: 'Ruby Plan', ram: '32GB', cpu: '1000%', storage: '100 GB SSD', location: 'UAE', price: '3200 PKR', order: 7 },
      { name: 'Black Ruby Plan', ram: '34GB', cpu: '2000%', storage: '200 GB SSD', location: 'UAE', price: '3400 PKR', order: 8 },
      { name: 'Amethyst Plan', ram: '36GB', cpu: '2500%', storage: '250 GB SSD', location: 'UAE', price: '3600 PKR', order: 9 }
    ];
    
    plans.forEach(p => {
      db.run("INSERT INTO paid_plans (name, ram, cpu, storage, location, price, sortOrder) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [p.name, p.ram, p.cpu, p.storage, p.location, p.price, p.order]);
    });
  }

  // Initialize location settings
  const locationsExist = db.exec("SELECT * FROM location_settings");
  if (locationsExist.length === 0 || locationsExist[0].values.length === 0) {
    const locations = [
      { location: 'UAE', isAvailable: 1 },
      { location: 'France', isAvailable: 0 },
      { location: 'Singapore', isAvailable: 0 }
    ];
    
    locations.forEach(l => {
      db.run("INSERT INTO location_settings (location, isAvailable) VALUES (?, ?)",
        [l.location, l.isAvailable]);
    });
  }

  // Initialize site settings
  const settingsExist = db.exec("SELECT * FROM site_settings");
  if (settingsExist.length === 0 || settingsExist[0].values.length === 0) {
    const settings = [
      { key: 'yt_partners_enabled', value: '1' },
      { key: 'discord_members', value: '400+' }
    ];
    
    settings.forEach(s => {
      db.run("INSERT INTO site_settings (key, value) VALUES (?, ?)",
        [s.key, s.value]);
    });
  }

  saveDB();
  console.log('✅ Database initialized successfully');
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

function prepare(sql) {
  return {
    run: (...params) => { 
      db.run(sql, params); 
      saveDB(); 
      return { lastInsertRowid: 1 }; 
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
      return result[0].values.map(vals => 
        cols.reduce((obj, col, i) => { obj[col] = vals[i]; return obj; }, {})
      );
    }
  };
}

module.exports = { initDB, getDB, prepare, saveDB };