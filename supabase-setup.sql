-- Supabase Database Setup for Flame Cloud
-- Run this in Supabase SQL Editor

-- Create tables if they don't exist
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

CREATE TABLE IF NOT EXISTS paid_plans (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  ram VARCHAR(50) NOT NULL,
  cpu VARCHAR(50) NOT NULL,
  storage VARCHAR(100) NOT NULL,
  location VARCHAR(100) NOT NULL,
  price VARCHAR(50) NOT NULL,
  discount INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS free_plans (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  ram VARCHAR(50) NOT NULL,
  cpu VARCHAR(50) NOT NULL,
  location VARCHAR(100) NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS tickets (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  subject VARCHAR(500) NOT NULL,
  message TEXT NOT NULL,
  screenshot TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  admin_response TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id SERIAL PRIMARY KEY,
  sender_id INTEGER NOT NULL,
  receiver_id INTEGER NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS location_settings (
  id SERIAL PRIMARY KEY,
  location VARCHAR(100) UNIQUE NOT NULL,
  is_available BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS yt_partners (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  link TEXT NOT NULL,
  logo TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS site_settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(255) UNIQUE NOT NULL,
  value TEXT NOT NULL
);

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

-- Insert default data
INSERT INTO site_settings (key, value) VALUES ('discord_members', '400+') ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
INSERT INTO site_settings (key, value) VALUES ('yt_partners_enabled', '0') ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Insert location settings
INSERT INTO location_settings (location, is_available) VALUES ('UAE', true) ON CONFLICT (location) DO UPDATE SET is_available = EXCLUDED.is_available;
INSERT INTO location_settings (location, is_available) VALUES ('France', false) ON CONFLICT (location) DO UPDATE SET is_available = EXCLUDED.is_available;
INSERT INTO location_settings (location, is_available) VALUES ('Singapore', false) ON CONFLICT (location) DO UPDATE SET is_available = EXCLUDED.is_available;

-- Insert default about content
INSERT INTO about_content (content, founder_name, owner_name, management_name) 
VALUES (
  'Flame Cloud is a next-generation gaming server hosting platform built for speed, power, and reliability.',
  'Flame Founder',
  'Flame Owner',
  'Flame Management'
) ON CONFLICT (id) DO NOTHING;

-- Insert default paid plans for UAE
INSERT INTO paid_plans (name, ram, cpu, storage, location, price, discount, sort_order) VALUES
('Bronze Plan', '2GB', '100%', '10 GB SSD', 'UAE', '200 PKR', 0, 1),
('Silver Plan', '4GB', '150%', '20 GB SSD', 'UAE', '400 PKR', 0, 2),
('Gold Plan', '8GB', '250%', '30 GB SSD', 'UAE', '600 PKR', 0, 3),
('Platinum Plan', '10GB', '300%', '40 GB SSD', 'UAE', '800 PKR', 0, 4),
('Emerald Plan', '12GB', '350%', '50 GB SSD', 'UAE', '1200 PKR', 0, 5),
('Amethyst Plan', '14GB', '400%', '60 GB SSD', 'UAE', '3600 PKR', 0, 6),
('Diamond Plan', '16GB', '500%', '80 GB SSD', 'UAE', '1600 PKR', 0, 7),
('Ruby Plan', '32GB', '1000%', '100 GB SSD', 'UAE', '3200 PKR', 0, 8),
('Black Ruby Plan', '34GB', '2000%', '200 GB SSD', 'UAE', '3400 PKR', 0, 9)
ON CONFLICT (name) DO NOTHING;

-- Create default admin user (password: flamecloud999)
INSERT INTO users (username, email, password, isAdmin) 
VALUES (
  'Flame Cloud Team', 
  'flamecloud@gmail.com', 
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
  true
) ON CONFLICT (email) DO NOTHING;