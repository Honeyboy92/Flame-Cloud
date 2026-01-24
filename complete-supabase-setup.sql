-- COMPLETE FLAME CLOUD SUPABASE SETUP
-- Run this entire script in Supabase SQL Editor
-- This will setup everything: Admin Panel, Users, Plans, Chat, Tickets, etc.

-- =====================================================
-- 1. USERS TABLE (for Admin Panel)
-- =====================================================

-- Drop existing table if exists
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  avatar TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_auth_id ON users(auth_user_id);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can view all users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND (auth.users.raw_user_meta_data->>'isAdmin')::boolean = true
    )
  );

CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth_user_id = auth.uid());

CREATE POLICY "Admins can delete users" ON users
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND (auth.users.raw_user_meta_data->>'isAdmin')::boolean = true
    )
  );

-- =====================================================
-- 2. PAID PLANS TABLE
-- =====================================================

-- Drop existing table if exists
DROP TABLE IF EXISTS paid_plans CASCADE;

-- Create paid_plans table
CREATE TABLE paid_plans (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  ram VARCHAR(50) NOT NULL,
  cpu VARCHAR(50) NOT NULL,
  storage VARCHAR(100) NOT NULL,
  location VARCHAR(100) NOT NULL,
  price VARCHAR(100) NOT NULL,
  discount INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index
CREATE INDEX idx_paid_plans_location ON paid_plans(location);
CREATE INDEX idx_paid_plans_sort ON paid_plans(sort_order);

-- Enable RLS
ALTER TABLE paid_plans ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view plans" ON paid_plans FOR SELECT USING (true);
CREATE POLICY "Admins can manage plans" ON paid_plans FOR ALL USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND (auth.users.raw_user_meta_data->>'isAdmin')::boolean = true
  )
);

-- =====================================================
-- 3. LOCATION SETTINGS TABLE
-- =====================================================

-- Drop existing table if exists
DROP TABLE IF EXISTS location_settings CASCADE;

-- Create location_settings table
CREATE TABLE location_settings (
  id SERIAL PRIMARY KEY,
  location VARCHAR(100) UNIQUE NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  flag_emoji VARCHAR(10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE location_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view locations" ON location_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage locations" ON location_settings FOR ALL USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND (auth.users.raw_user_meta_data->>'isAdmin')::boolean = true
  )
);

-- =====================================================
-- 4. TICKETS TABLE
-- =====================================================

-- Drop existing table if exists
DROP TABLE IF EXISTS tickets CASCADE;

-- Create tickets table
CREATE TABLE tickets (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(255),
  user_email VARCHAR(255),
  subject VARCHAR(500) NOT NULL,
  message TEXT NOT NULL,
  screenshot TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  admin_response TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_tickets_user_id ON tickets(user_id);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_created ON tickets(created_at);

-- Enable RLS
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own tickets" ON tickets
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create tickets" ON tickets
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all tickets" ON tickets
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND (auth.users.raw_user_meta_data->>'isAdmin')::boolean = true
    )
  );

CREATE POLICY "Admins can update tickets" ON tickets
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND (auth.users.raw_user_meta_data->>'isAdmin')::boolean = true
    )
  );

-- =====================================================
-- 5. CHAT MESSAGES TABLE
-- =====================================================

-- Drop existing table if exists
DROP TABLE IF EXISTS chat_messages CASCADE;

-- Create chat_messages table
CREATE TABLE chat_messages (
  id SERIAL PRIMARY KEY,
  sender_id UUID NOT NULL,
  receiver_id UUID NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_chat_messages_sender ON chat_messages(sender_id);
CREATE INDEX idx_chat_messages_receiver ON chat_messages(receiver_id);
CREATE INDEX idx_chat_messages_created ON chat_messages(created_at);

-- Enable RLS
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own messages" ON chat_messages
  FOR SELECT USING (sender_id = auth.uid() OR receiver_id = auth.uid());
