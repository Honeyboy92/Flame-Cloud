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

  // Create tables
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      avatar TEXT,
      isAdmin INTEGER DEFAULT 0,
      hasClaimedFreePlan INTEGER DEFAULT 0,
      claimedIP TEXT,
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
      discount INTEGER DEFAULT 0,
      sortOrder INTEGER DEFAULT 0
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
      sortOrder INTEGER DEFAULT 0
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
    CREATE TABLE IF NOT EXISTS about_content (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT NOT NULL,
      owner TEXT NOT NULL,
      ownerPhoto TEXT,
      coOwner TEXT NOT NULL,
      coOwnerPhoto TEXT,
      managers TEXT NOT NULL,
      managersPhoto TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS location_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      location TEXT UNIQUE NOT NULL,
      isAvailable INTEGER DEFAULT 0
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS yt_partners (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      link TEXT NOT NULL,
      logo TEXT,
      isFeatured INTEGER DEFAULT 0,
      createdAt TEXT
    )
  `);

  // Add createdAt column to existing yt_partners table if it doesn't exist
  const ytPartnersColumns = db.exec("PRAGMA table_info(yt_partners)");
  const hasCreatedAt = ytPartnersColumns.length > 0 && 
    ytPartnersColumns[0].values.some(col => col[1] === 'createdAt');
  
  if (!hasCreatedAt) {
    try {
      db.run(`ALTER TABLE yt_partners ADD COLUMN createdAt TEXT`);
      saveDB();
    } catch (e) {
      console.log('createdAt column migration error:', e.message);
    }
  }

  // Add sortOrder column to yt_partners if it doesn't exist
  const hasSortOrder = ytPartnersColumns.length > 0 && 
    ytPartnersColumns[0].values.some(col => col[1] === 'sortOrder');
  
  if (!hasSortOrder) {
    try {
      db.run(`ALTER TABLE yt_partners ADD COLUMN sortOrder INTEGER DEFAULT 0`);
      saveDB();
    } catch (e) {
      console.log('sortOrder column migration error:', e.message);
    }
  }
  
  // Update existing records without createdAt
  try {
    const currentTime = new Date().toISOString();
    db.run(`UPDATE yt_partners SET createdAt = ? WHERE createdAt IS NULL`, [currentTime]);
    saveDB();
  } catch (e) {
    console.log('createdAt update error:', e.message);
  }

  // Update existing records without sortOrder
  try {
    db.run(`UPDATE yt_partners SET sortOrder = id WHERE sortOrder IS NULL OR sortOrder = 0`);
    saveDB();
  } catch (e) {
    console.log('sortOrder update error:', e.message);
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS site_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT UNIQUE NOT NULL,
      value TEXT NOT NULL
    )
  `);

  // Initialize YT Partners visibility setting
  const ytSettingExists = db.exec("SELECT * FROM site_settings WHERE key = 'yt_partners_enabled'");
  if (ytSettingExists.length === 0 || ytSettingExists[0].values.length === 0) {
    db.run("INSERT INTO site_settings (key, value) VALUES (?, ?)", ['yt_partners_enabled', '0']);
  }

  // Initialize location settings
  const locationsExist = db.exec("SELECT * FROM location_settings");
  if (locationsExist.length === 0 || locationsExist[0].values.length === 0) {
    db.run("INSERT INTO location_settings (location, isAvailable) VALUES (?, ?)", ['UAE', 1]);
    db.run("INSERT INTO location_settings (location, isAvailable) VALUES (?, ?)", ['Germany', 0]);
    db.run("INSERT INTO location_settings (location, isAvailable) VALUES (?, ?)", ['Singapore', 0]);
  }

  // Initialize default admin
  const adminExists = db.exec("SELECT * FROM users WHERE isAdmin = 1");
  if (adminExists.length === 0 || adminExists[0].values.length === 0) {
    const adminEmail = process.env.ADMIN_EMAIL || 'flamecloud@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'flamecloud999';
    const hashedPassword = bcrypt.hashSync(adminPassword, 10);
    db.run("INSERT INTO users (username, email, password, isAdmin) VALUES (?, ?, ?, ?)", 
      ['admin', adminEmail, hashedPassword, 1]);
  }


  // Initialize default about content
  const aboutExists = db.exec("SELECT * FROM about_content");
  if (aboutExists.length === 0 || aboutExists[0].values.length === 0) {
    db.run("INSERT INTO about_content (content, owner, coOwner, managers) VALUES (?, ?, ?, ?)", [
      'Flame Cloud is a professional Minecraft hosting platform providing premium server plans with a modern panel-style dashboard. The platform is designed to offer reliable Minecraft hosting, custom plans, and a ticket-based support system with admin approval and full transparency. The platform focuses on performance, stability, and easy management for Minecraft servers.',
      'TGK',
      'Rameez_xD',
      'Newest_YT'
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
      db.run("INSERT INTO paid_plans (name, ram, cpu, storage, location, price, sortOrder) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [p.name, p.ram, p.cpu, p.storage, p.location, p.price, p.order]);
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
    run: (...params) => { db.run(sql, params); saveDB(); return { lastInsertRowid: db.exec("SELECT last_insert_rowid()")[0].values[0][0] }; },
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
