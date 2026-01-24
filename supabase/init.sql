-- Supabase / PostgreSQL schema for Flame Cloud
-- Run this in Supabase SQL editor or psql against your Supabase DB.

-- Users table (app-managed users)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  avatar TEXT,
  isAdmin BOOLEAN DEFAULT FALSE,
  hasClaimedFreePlan BOOLEAN DEFAULT FALSE,
  claimedIP VARCHAR(45),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Paid plans
CREATE TABLE IF NOT EXISTS paid_plans (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  ram VARCHAR(50) NOT NULL,
  cpu VARCHAR(50) NOT NULL,
  storage VARCHAR(100) NOT NULL,
  location VARCHAR(100) NOT NULL,
  price VARCHAR(50) NOT NULL,
  discount INTEGER DEFAULT 0,
  sortOrder INTEGER DEFAULT 0
);

-- Free plans
CREATE TABLE IF NOT EXISTS free_plans (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  ram VARCHAR(50) NOT NULL,
  cpu VARCHAR(50) NOT NULL,
  location VARCHAR(100) NOT NULL,
  description TEXT,
  sortOrder INTEGER DEFAULT 0
);

-- Tickets
CREATE TABLE IF NOT EXISTS tickets (
  id SERIAL PRIMARY KEY,
  userId INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject VARCHAR(500) NOT NULL,
  message TEXT NOT NULL,
  screenshot TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  adminResponse TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chat messages
CREATE TABLE IF NOT EXISTS chat_messages (
  id SERIAL PRIMARY KEY,
  senderId INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiverId INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  isRead BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Location settings
CREATE TABLE IF NOT EXISTS location_settings (
  id SERIAL PRIMARY KEY,
  location VARCHAR(100) UNIQUE NOT NULL,
  isAvailable BOOLEAN DEFAULT FALSE
);

-- YouTube partners
CREATE TABLE IF NOT EXISTS yt_partners (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  link TEXT NOT NULL,
  logo TEXT,
  isFeatured BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  sortOrder INTEGER DEFAULT 0
);

-- Site settings
CREATE TABLE IF NOT EXISTS site_settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(255) UNIQUE NOT NULL,
  value TEXT NOT NULL
);

-- About content
CREATE TABLE IF NOT EXISTS about_content (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL DEFAULT 'Flame Cloud is a next-generation gaming server hosting platform built for speed, power, and reliability.',
  founder_name VARCHAR(255) NOT NULL DEFAULT 'Flame Founder',
  founder_photo TEXT,
  owner_name VARCHAR(255) NOT NULL DEFAULT 'Flame Owner',
  owner_photo TEXT,
  management_name VARCHAR(255) NOT NULL DEFAULT 'Flame Management',
  management_photo TEXT
);

-- Seed data (non-destructive inserts)
-- Locations
INSERT INTO location_settings (location, isAvailable)
SELECT * FROM (VALUES
  ('UAE', TRUE),
  ('France', FALSE),
  ('Singapore', FALSE)
) AS v(location, isAvailable)
WHERE NOT EXISTS (SELECT 1 FROM location_settings WHERE location = v.location);

-- Site settings
INSERT INTO site_settings (key, value)
SELECT * FROM (VALUES
  ('yt_partners_enabled', '0')
) AS v(k,v)
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE key = v.k);

-- About content (single-row)
INSERT INTO about_content (content, founder_name, owner_name, management_name)
SELECT * FROM (VALUES
  ('Flame Cloud is a next-generation gaming server hosting platform built for speed, power, and reliability.', 'Flame Founder', 'Flame Owner', 'Flame Management')
) AS v(content, founder_name, owner_name, management_name)
WHERE (SELECT COUNT(*) FROM about_content) = 0;

-- Default paid plans
INSERT INTO paid_plans (name, ram, cpu, storage, location, price, sortOrder)
SELECT * FROM (VALUES
  ('Bronze Plan','2GB','100%','10 GB SSD','UAE','200 PKR',1),
  ('Silver Plan','4GB','150%','20 GB SSD','UAE','400 PKR',2),
  ('Gold Plan','8GB','250%','30 GB SSD','UAE','600 PKR',3),
  ('Platinum Plan','10GB','300%','40 GB SSD','UAE','800 PKR',4),
  ('Emerald Plan','12GB','350%','50 GB SSD','UAE','1200 PKR',5),
  ('Amethyst Plan','14GB','400%','60 GB SSD','UAE','3600 PKR',6),
  ('Diamond Plan','16GB','500%','80 GB SSD','UAE','1600 PKR',7),
  ('Ruby Plan','32GB','1000%','100 GB SSD','UAE','3200 PKR',8),
  ('Black Ruby Plan','34GB','2000%','200 GB SSD','UAE','3400 PKR',9)
) AS v(name,ram,cpu,storage,location,price,sortOrder)
WHERE NOT EXISTS (SELECT 1 FROM paid_plans WHERE name = v.name);

-- Free plans placeholder (no-op if exists)
INSERT INTO free_plans (name, ram, cpu, location, description, sortOrder)
SELECT * FROM (VALUES
  ('Free Trial','1GB','50%','UAE','Basic free trial plan',1)
) AS v(name,ram,cpu,location,description,sortOrder)
WHERE NOT EXISTS (SELECT 1 FROM free_plans WHERE name = v.name);

-- Note: Admin user is created by the backend initialization script when the server runs (it will hash the password and insert admin if none exists).
-- If you prefer to create the admin via SQL, generate a bcrypt hash for your chosen password and insert into users(password) accordingly.

-- End of migration
