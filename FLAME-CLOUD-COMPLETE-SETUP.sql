-- =====================================================
-- FLAME CLOUD - COMPLETE SUPABASE SETUP
-- =====================================================
-- Run this in your new Supabase project SQL Editor
-- This includes: Auth, Admin Panel, Plans, Chat, YT Partners, About, Settings

-- =====================================================
-- 1. PAID PLANS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS paid_plans (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    ram VARCHAR(50) NOT NULL,
    cpu VARCHAR(50) NOT NULL,
    storage VARCHAR(100) NOT NULL,
    location VARCHAR(50) NOT NULL DEFAULT 'UAE',
    price VARCHAR(50) NOT NULL,
    discount INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert Default Plans
INSERT INTO paid_plans (name, ram, cpu, storage, location, price, discount, sort_order) VALUES
-- UAE Plans
('S-Rank', '4GB', '200%', '20 GB SSD', 'UAE', '500 PKR', 0, 1),
('A-Rank', '6GB', '300%', '30 GB SSD', 'UAE', '750 PKR', 0, 2),
('B-Rank', '8GB', '400%', '40 GB SSD', 'UAE', '1000 PKR', 0, 3),
('Flame Starter', '2GB', '100%', '15 GB SSD', 'UAE', '350 PKR', 0, 4),
('Flame Pro', '12GB', '600%', '60 GB SSD', 'UAE', '1500 PKR', 0, 5),
('Flame Ultimate', '16GB', '800%', '80 GB SSD', 'UAE', '2000 PKR', 0, 6),

-- Germany Plans (Coming Soon)
('S-Rank DE', '4GB', '200%', '20 GB SSD', 'Germany', '600 PKR', 0, 1),
('A-Rank DE', '6GB', '300%', '30 GB SSD', 'Germany', '900 PKR', 0, 2),
('B-Rank DE', '8GB', '400%', '40 GB SSD', 'Germany', '1200 PKR', 0, 3),

-- Singapore Plans (Coming Soon)
('S-Rank SG', '4GB', '200%', '20 GB SSD', 'Singapore', '650 PKR', 0, 1),
('A-Rank SG', '6GB', '300%', '30 GB SSD', 'Singapore', '950 PKR', 0, 2),
('B-Rank SG', '8GB', '400%', '40 GB SSD', 'Singapore', '1250 PKR', 0, 3);

-- =====================================================
-- 2. TICKETS TABLE (Orders/Support)
-- =====================================================
CREATE TABLE IF NOT EXISTS tickets (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(100) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    screenshot TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    admin_response TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. CHAT MESSAGES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS chat_messages (
    id SERIAL PRIMARY KEY,
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. YT PARTNERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS yt_partners (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    link VARCHAR(500) NOT NULL,
    logo TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert Default YT Partners
INSERT INTO yt_partners (name, link, logo, is_featured, sort_order) VALUES
('TechGamer', 'https://youtube.com/@techgamer', NULL, TRUE, 1),
('MinecraftPro', 'https://youtube.com/@minecraftpro', NULL, FALSE, 2),
('FlameGaming', 'https://youtube.com/@flamegaming', NULL, TRUE, 3);

-- =====================================================
-- 5. ABOUT CONTENT TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS about_content (
    id SERIAL PRIMARY KEY,
    content TEXT,
    founder_name VARCHAR(100) DEFAULT 'Flame Founder',
    founder_photo TEXT,
    owner_name VARCHAR(100) DEFAULT 'Flame Owner', 
    owner_photo TEXT,
    management_name VARCHAR(100) DEFAULT 'Flame Management',
    management_photo TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert Default About Content
INSERT INTO about_content (content, founder_name, owner_name, management_name) VALUES
('Flame Cloud is the premier Minecraft hosting provider, offering high-performance servers with instant setup, DDoS protection, and 24/7 support. We are dedicated to providing the best gaming experience for Minecraft players worldwide.', 'Flame Founder', 'Flame Owner', 'Flame Management');

-- =====================================================
-- 6. SITE SETTINGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS site_settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert Default Settings
INSERT INTO site_settings (key, value) VALUES
('discord_members', '400+'),
('yt_partners_enabled', '1'),
('maintenance_mode', '0');

-- =====================================================
-- 7. LOCATION SETTINGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS location_settings (
    id SERIAL PRIMARY KEY,
    location VARCHAR(50) UNIQUE NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert Default Locations
INSERT INTO location_settings (location, is_available) VALUES
('UAE', TRUE),
('Germany', FALSE),
('Singapore', FALSE);

-- =====================================================
-- 8. USERS TABLE (Additional user data)
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    avatar TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE paid_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE yt_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Paid Plans Policies (Public Read, Admin Write)
CREATE POLICY "Anyone can view paid plans" ON paid_plans FOR SELECT USING (true);
CREATE POLICY "Only admins can modify paid plans" ON paid_plans FOR ALL USING (
    auth.jwt() ->> 'user_metadata' ->> 'isAdmin' = 'true'
);

-- Tickets Policies (Users can create, Admins can manage)
CREATE POLICY "Users can view their own tickets" ON tickets FOR SELECT USING (
    auth.uid() = user_id OR auth.jwt() ->> 'user_metadata' ->> 'isAdmin' = 'true'
);
CREATE POLICY "Users can create tickets" ON tickets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can update tickets" ON tickets FOR UPDATE USING (
    auth.jwt() ->> 'user_metadata' ->> 'isAdmin' = 'true'
);

-- Chat Messages Policies (Users can see their conversations)
CREATE POLICY "Users can view their messages" ON chat_messages FOR SELECT USING (
    auth.uid() = sender_id OR auth.uid() = receiver_id
);
CREATE POLICY "Users can send messages" ON chat_messages FOR INSERT WITH CHECK (
    auth.uid() = sender_id
);

-- YT Partners Policies (Public Read, Admin Write)
CREATE POLICY "Anyone can view YT partners" ON yt_partners FOR SELECT USING (true);
CREATE POLICY "Only admins can modify YT partners" ON yt_partners FOR ALL USING (
    auth.jwt() ->> 'user_metadata' ->> 'isAdmin' = 'true'
);

-- About Content Policies (Public Read, Admin Write)
CREATE POLICY "Anyone can view about content" ON about_content FOR SELECT USING (true);
CREATE POLICY "Only admins can modify about content" ON about_content FOR ALL USING (
    auth.jwt() ->> 'user_metadata' ->> 'isAdmin' = 'true'
);

-- Site Settings Policies (Public Read, Admin Write)
CREATE POLICY "Anyone can view site settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Only admins can modify site settings" ON site_settings FOR ALL USING (
    auth.jwt() ->> 'user_metadata' ->> 'isAdmin' = 'true'
);

-- Location Settings Policies (Public Read, Admin Write)
CREATE POLICY "Anyone can view location settings" ON location_settings FOR SELECT USING (true);
CREATE POLICY "Only admins can modify location settings" ON location_settings FOR ALL USING (
    auth.jwt() ->> 'user_metadata' ->> 'isAdmin' = 'true'
);

-- Users Policies (Users can view/update their profile, Admins can see all)
CREATE POLICY "Users can view their profile" ON users FOR SELECT USING (
    auth.uid() = id OR auth.jwt() ->> 'user_metadata' ->> 'isAdmin' = 'true'
);
CREATE POLICY "Users can update their profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- =====================================================
-- 10. FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO users (id, username, email, is_admin)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data ->> 'username', split_part(NEW.email, '@', 1)),
        NEW.email,
        COALESCE((NEW.raw_user_meta_data ->> 'isAdmin')::boolean, false)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add update triggers to tables
CREATE TRIGGER update_paid_plans_updated_at BEFORE UPDATE ON paid_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_about_content_updated_at BEFORE UPDATE ON about_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_users_updated_at_column();

-- =====================================================
-- 11. CREATE ADMIN USER
-- =====================================================
-- Note: You need to create the admin user manually in Supabase Auth
-- Email: flamecloud@gmail.com
-- Password: GSFY!25V$
-- Then run this to set admin metadata:

-- UPDATE auth.users 
-- SET raw_user_meta_data = jsonb_set(
--     COALESCE(raw_user_meta_data, '{}'), 
--     '{isAdmin}', 
--     'true'
-- ),
-- raw_user_meta_data = jsonb_set(
--     raw_user_meta_data, 
--     '{username}', 
--     '"Flame Admin"'
-- )
-- WHERE email = 'flamecloud@gmail.com';

-- =====================================================
-- 12. SAMPLE DATA FOR TESTING
-- =====================================================

-- Sample Customer User (create manually in Auth)
-- Email: customer@test.com
-- Password: test123456

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================
-- 
-- NEXT STEPS:
-- 1. Run this SQL in your Supabase SQL Editor
-- 2. Go to Authentication > Users
-- 3. Create admin user: flamecloud@gmail.com / GSFY!25V$
-- 4. Create test customer: customer@test.com / test123456
-- 5. Update admin user metadata with isAdmin: true
-- 6. Your Flame Cloud is ready!
--
-- FEATURES INCLUDED:
-- ✅ Admin Panel (Plans, Tickets, Settings, YT Partners, About)
-- ✅ User Authentication (Login/Signup)
-- ✅ Paid Plans (UAE, Germany, Singapore)
-- ✅ Chat System (Admin-Customer messaging)
-- ✅ YT Partners Management
-- ✅ About Section with Team
-- ✅ Location Settings
-- ✅ Discord Members Counter
-- ✅ Row Level Security
-- ✅ Proper Permissions
-- =====================================================