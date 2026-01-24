-- ================================================================
-- 🔥 FLAME CLOUD - COMPLETE SUPABASE DATABASE SCHEMA
-- ================================================================
-- Author: Flame Cloud Team
-- Date: 2026-01-25
-- Description: Complete SQL schema for Supabase
-- NOTE: This version handles existing tables/policies gracefully
-- ================================================================

-- ================================================================
-- STEP 1: DROP EXISTING POLICIES (Clean Start)
-- ================================================================

-- Users Table Policies
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "System can insert users" ON users;
DROP POLICY IF EXISTS "Admins can delete users" ON users;
DROP POLICY IF EXISTS "Users can view their profile" ON users;
DROP POLICY IF EXISTS "Users can update their profile" ON users;
DROP POLICY IF EXISTS "Users can insert their profile" ON users;

-- Paid Plans Table Policies
DROP POLICY IF EXISTS "Anyone can view paid plans" ON paid_plans;
DROP POLICY IF EXISTS "Admins view all plans" ON paid_plans;
DROP POLICY IF EXISTS "Admins can insert plans" ON paid_plans;
DROP POLICY IF EXISTS "Admins can update plans" ON paid_plans;
DROP POLICY IF EXISTS "Admins can delete plans" ON paid_plans;
DROP POLICY IF EXISTS "Only admins can modify paid plans" ON paid_plans;

-- Free Plans Table Policies
DROP POLICY IF EXISTS "Anyone can view free plans" ON free_plans;
DROP POLICY IF EXISTS "Admins can manage free plans" ON free_plans;

-- Free Plan Claims Policies
DROP POLICY IF EXISTS "Users can view own claims" ON free_plan_claims;
DROP POLICY IF EXISTS "Users can claim plans" ON free_plan_claims;
DROP POLICY IF EXISTS "Admins can view all claims" ON free_plan_claims;

-- Tickets Table Policies
DROP POLICY IF EXISTS "Users can view own tickets" ON tickets;
DROP POLICY IF EXISTS "Users can view their own tickets" ON tickets;
DROP POLICY IF EXISTS "Admins can view all tickets" ON tickets;
DROP POLICY IF EXISTS "Users can create tickets" ON tickets;
DROP POLICY IF EXISTS "Admins can update tickets" ON tickets;
DROP POLICY IF EXISTS "Admins can delete tickets" ON tickets;

-- Chat Messages Table Policies
DROP POLICY IF EXISTS "Users can view own messages" ON chat_messages;
DROP POLICY IF EXISTS "Users can view their messages" ON chat_messages;
DROP POLICY IF EXISTS "Users can send messages" ON chat_messages;
DROP POLICY IF EXISTS "Users can update received messages" ON chat_messages;
DROP POLICY IF EXISTS "Admins can view all messages" ON chat_messages;

-- YT Partners Table Policies
DROP POLICY IF EXISTS "Anyone can view active partners" ON yt_partners;
DROP POLICY IF EXISTS "Anyone can view YT partners" ON yt_partners;
DROP POLICY IF EXISTS "Admins can manage partners" ON yt_partners;
DROP POLICY IF EXISTS "Only admins can modify YT partners" ON yt_partners;

-- About Content Table Policies
DROP POLICY IF EXISTS "Anyone can view about content" ON about_content;
DROP POLICY IF EXISTS "Admins can manage about content" ON about_content;
DROP POLICY IF EXISTS "Only admins can modify about content" ON about_content;

-- Site Settings Table Policies
DROP POLICY IF EXISTS "Anyone can view site settings" ON site_settings;
DROP POLICY IF EXISTS "Admins can manage site settings" ON site_settings;
DROP POLICY IF EXISTS "Only admins can modify site settings" ON site_settings;

-- Location Settings Table Policies
DROP POLICY IF EXISTS "Anyone can view locations" ON location_settings;
DROP POLICY IF EXISTS "Anyone can view location settings" ON location_settings;
DROP POLICY IF EXISTS "Admins can manage locations" ON location_settings;
DROP POLICY IF EXISTS "Only admins can modify location settings" ON location_settings;

-- Activity Log Table Policies
DROP POLICY IF EXISTS "Admins can view activity log" ON activity_log;
DROP POLICY IF EXISTS "System can insert activity log" ON activity_log;

-- ================================================================
-- STEP 2: CREATE TABLES (IF NOT EXISTS)
-- ================================================================

-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    avatar TEXT DEFAULT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    is_banned BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PAID PLANS TABLE
CREATE TABLE IF NOT EXISTS paid_plans (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    ram VARCHAR(50) NOT NULL,
    cpu VARCHAR(50) NOT NULL,
    storage VARCHAR(100) NOT NULL,
    location VARCHAR(50) NOT NULL DEFAULT 'UAE',
    price VARCHAR(50) NOT NULL,
    price_amount INTEGER DEFAULT 0,
    discount INTEGER DEFAULT 0,
    features TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    is_popular BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- FREE PLANS TABLE
CREATE TABLE IF NOT EXISTS free_plans (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    ram VARCHAR(50) NOT NULL,
    cpu VARCHAR(50) NOT NULL,
    storage VARCHAR(100) NOT NULL,
    location VARCHAR(50) NOT NULL DEFAULT 'UAE',
    features TEXT[],
    max_claims INTEGER DEFAULT -1,
    current_claims INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- FREE PLAN CLAIMS TABLE
CREATE TABLE IF NOT EXISTS free_plan_claims (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id INTEGER REFERENCES free_plans(id) ON DELETE CASCADE,
    claimed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE(user_id, plan_id)
);

-- TICKETS TABLE
CREATE TABLE IF NOT EXISTS tickets (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(100) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    screenshot TEXT,
    category VARCHAR(50) DEFAULT 'general',
    priority VARCHAR(20) DEFAULT 'medium',
    status VARCHAR(50) DEFAULT 'pending',
    admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    admin_response TEXT,
    responded_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CHAT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS chat_messages (
    id SERIAL PRIMARY KEY,
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text',
    attachment_url TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- YT PARTNERS TABLE
CREATE TABLE IF NOT EXISTS yt_partners (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    channel_link VARCHAR(500) NOT NULL,
    logo TEXT,
    subscribers VARCHAR(50),
    description TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ABOUT CONTENT TABLE
CREATE TABLE IF NOT EXISTS about_content (
    id SERIAL PRIMARY KEY,
    content TEXT,
    founder_name VARCHAR(100) DEFAULT 'Flame Founder',
    founder_photo TEXT,
    founder_role VARCHAR(100) DEFAULT 'Founder & CEO',
    founder_discord VARCHAR(100),
    owner_name VARCHAR(100) DEFAULT 'Flame Owner',
    owner_photo TEXT,
    owner_role VARCHAR(100) DEFAULT 'Owner & Developer',
    owner_discord VARCHAR(100),
    management_name VARCHAR(100) DEFAULT 'Flame Management',
    management_photo TEXT,
    management_role VARCHAR(100) DEFAULT 'Management Team',
    management_discord VARCHAR(100),
    company_email VARCHAR(255),
    company_discord VARCHAR(255),
    company_founded_year INTEGER DEFAULT 2024,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS site_settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    category VARCHAR(50) DEFAULT 'general',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- LOCATION SETTINGS TABLE
CREATE TABLE IF NOT EXISTS location_settings (
    id SERIAL PRIMARY KEY,
    location VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    country_code VARCHAR(5),
    flag_emoji VARCHAR(10),
    is_available BOOLEAN DEFAULT TRUE,
    coming_soon BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ACTIVITY LOG TABLE
CREATE TABLE IF NOT EXISTS activity_log (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(50),
    target_id TEXT,
    details JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================================
-- STEP 3: CREATE INDEXES
-- ================================================================

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_is_admin ON users(is_admin);
CREATE INDEX IF NOT EXISTS idx_paid_plans_location ON paid_plans(location);
CREATE INDEX IF NOT EXISTS idx_paid_plans_is_active ON paid_plans(is_active);
CREATE INDEX IF NOT EXISTS idx_free_plan_claims_user ON free_plan_claims(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_user ON tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_created ON tickets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_sender ON chat_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_chat_receiver ON chat_messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_chat_created ON chat_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_yt_partners_active ON yt_partners(is_active);
CREATE INDEX IF NOT EXISTS idx_activity_log_user ON activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_action ON activity_log(action);
CREATE INDEX IF NOT EXISTS idx_activity_log_created ON activity_log(created_at DESC);

-- ================================================================
-- STEP 4: ENABLE ROW LEVEL SECURITY
-- ================================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE paid_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE free_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE free_plan_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE yt_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- ================================================================
-- STEP 5: CREATE RLS POLICIES - USERS TABLE
-- ================================================================

CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON users
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = TRUE)
    );

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "System can insert users" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can delete users" ON users
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = TRUE)
    );

-- ================================================================
-- STEP 6: CREATE RLS POLICIES - PAID PLANS TABLE
-- ================================================================

CREATE POLICY "Anyone can view paid plans" ON paid_plans
    FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Admins view all plans" ON paid_plans
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = TRUE)
    );

CREATE POLICY "Admins can insert plans" ON paid_plans
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = TRUE)
    );

CREATE POLICY "Admins can update plans" ON paid_plans
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = TRUE)
    );

CREATE POLICY "Admins can delete plans" ON paid_plans
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = TRUE)
    );

-- ================================================================
-- STEP 7: CREATE RLS POLICIES - FREE PLANS TABLE
-- ================================================================

CREATE POLICY "Anyone can view free plans" ON free_plans
    FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Admins can manage free plans" ON free_plans
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = TRUE)
    );

-- ================================================================
-- STEP 8: CREATE RLS POLICIES - FREE PLAN CLAIMS
-- ================================================================

CREATE POLICY "Users can view own claims" ON free_plan_claims
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can claim plans" ON free_plan_claims
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all claims" ON free_plan_claims
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = TRUE)
    );

-- ================================================================
-- STEP 9: CREATE RLS POLICIES - TICKETS TABLE
-- ================================================================

CREATE POLICY "Users can view own tickets" ON tickets
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all tickets" ON tickets
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = TRUE)
    );

CREATE POLICY "Users can create tickets" ON tickets
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can update tickets" ON tickets
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = TRUE)
    );

CREATE POLICY "Admins can delete tickets" ON tickets
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = TRUE)
    );

-- ================================================================
-- STEP 10: CREATE RLS POLICIES - CHAT MESSAGES TABLE
-- ================================================================

CREATE POLICY "Users can view own messages" ON chat_messages
    FOR SELECT USING (
        sender_id = auth.uid() OR receiver_id = auth.uid()
    );

CREATE POLICY "Users can send messages" ON chat_messages
    FOR INSERT WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can update received messages" ON chat_messages
    FOR UPDATE USING (receiver_id = auth.uid());

CREATE POLICY "Admins can view all messages" ON chat_messages
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = TRUE)
    );

-- ================================================================
-- STEP 11: CREATE RLS POLICIES - YT PARTNERS TABLE
-- ================================================================

CREATE POLICY "Anyone can view active partners" ON yt_partners
    FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Admins can manage partners" ON yt_partners
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = TRUE)
    );

-- ================================================================
-- STEP 12: CREATE RLS POLICIES - ABOUT CONTENT TABLE
-- ================================================================

CREATE POLICY "Anyone can view about content" ON about_content
    FOR SELECT USING (TRUE);

CREATE POLICY "Admins can manage about content" ON about_content
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = TRUE)
    );

-- ================================================================
-- STEP 13: CREATE RLS POLICIES - SITE SETTINGS TABLE
-- ================================================================

CREATE POLICY "Anyone can view site settings" ON site_settings
    FOR SELECT USING (TRUE);

CREATE POLICY "Admins can manage site settings" ON site_settings
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = TRUE)
    );

-- ================================================================
-- STEP 14: CREATE RLS POLICIES - LOCATION SETTINGS TABLE
-- ================================================================

CREATE POLICY "Anyone can view locations" ON location_settings
    FOR SELECT USING (TRUE);

CREATE POLICY "Admins can manage locations" ON location_settings
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = TRUE)
    );

-- ================================================================
-- STEP 15: CREATE RLS POLICIES - ACTIVITY LOG TABLE
-- ================================================================

CREATE POLICY "Admins can view activity log" ON activity_log
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = TRUE)
    );

CREATE POLICY "System can insert activity log" ON activity_log
    FOR INSERT WITH CHECK (TRUE);

-- ================================================================
-- STEP 16: CREATE FUNCTIONS
-- ================================================================

-- Handle New User Registration
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

-- Update Timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Get Unread Message Count
CREATE OR REPLACE FUNCTION get_unread_count(user_uuid UUID)
RETURNS INTEGER AS $$
    SELECT COUNT(*)::INTEGER 
    FROM chat_messages 
    WHERE receiver_id = user_uuid AND is_read = FALSE;
$$ LANGUAGE sql SECURITY DEFINER;

-- Check if User is Admin
CREATE OR REPLACE FUNCTION is_admin(user_uuid UUID)
RETURNS BOOLEAN AS $$
    SELECT COALESCE(
        (SELECT is_admin FROM users WHERE id = user_uuid),
        FALSE
    );
$$ LANGUAGE sql SECURITY DEFINER;

-- ================================================================
-- STEP 17: CREATE TRIGGERS
-- ================================================================

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Update timestamp triggers
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_paid_plans_updated_at ON paid_plans;
CREATE TRIGGER update_paid_plans_updated_at
    BEFORE UPDATE ON paid_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_free_plans_updated_at ON free_plans;
CREATE TRIGGER update_free_plans_updated_at
    BEFORE UPDATE ON free_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_tickets_updated_at ON tickets;
CREATE TRIGGER update_tickets_updated_at
    BEFORE UPDATE ON tickets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_yt_partners_updated_at ON yt_partners;
CREATE TRIGGER update_yt_partners_updated_at
    BEFORE UPDATE ON yt_partners
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_about_content_updated_at ON about_content;
CREATE TRIGGER update_about_content_updated_at
    BEFORE UPDATE ON about_content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_site_settings_updated_at ON site_settings;
CREATE TRIGGER update_site_settings_updated_at
    BEFORE UPDATE ON site_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================================================
-- STEP 18: INSERT DEFAULT DATA
-- ================================================================

-- Location Settings
INSERT INTO location_settings (location, display_name, country_code, flag_emoji, is_available, coming_soon, sort_order) VALUES
('UAE', 'United Arab Emirates', 'AE', '🇦🇪', TRUE, FALSE, 1),
('Germany', 'Germany', 'DE', '🇩🇪', FALSE, TRUE, 2),
('Singapore', 'Singapore', 'SG', '🇸🇬', FALSE, TRUE, 3),
('USA', 'United States', 'US', '🇺🇸', FALSE, TRUE, 4),
('India', 'India', 'IN', '🇮🇳', FALSE, TRUE, 5)
ON CONFLICT (location) DO NOTHING;

-- Paid Plans (UAE)
INSERT INTO paid_plans (name, ram, cpu, storage, location, price, price_amount, discount, is_popular, sort_order) VALUES
('Bronze', '2GB', '100%', '10 GB SSD', 'UAE', '200 PKR', 200, 0, FALSE, 1),
('Silver', '4GB', '150%', '20 GB SSD', 'UAE', '400 PKR', 400, 0, FALSE, 2),
('Gold', '8GB', '250%', '30 GB SSD', 'UAE', '600 PKR', 600, 0, TRUE, 3),
('Platinum', '10GB', '300%', '40 GB SSD', 'UAE', '800 PKR', 800, 0, FALSE, 4),
('Emerald', '12GB', '350%', '50 GB SSD', 'UAE', '1200 PKR', 1200, 0, FALSE, 5),
('Amethyst', '14GB', '400%', '60 GB SSD', 'UAE', '3600 PKR', 3600, 0, FALSE, 6),
('Diamond', '16GB', '500%', '80 GB SSD', 'UAE', '1600 PKR', 1600, 0, TRUE, 7),
('Ruby', '32GB', '1000%', '100 GB SSD', 'UAE', '3200 PKR', 3200, 0, FALSE, 8),
('Black Ruby', '34GB', '2000%', '200 GB SSD', 'UAE', '3400 PKR', 3400, 0, FALSE, 9)
ON CONFLICT DO NOTHING;

-- Site Settings
INSERT INTO site_settings (key, value, description, category) VALUES
('discord_members', '400+', 'Discord member count display', 'display'),
('discord_invite', 'https://discord.gg/flamecloud', 'Discord invite link', 'social'),
('yt_partners_enabled', 'true', 'Show YouTube partners section', 'features'),
('maintenance_mode', 'false', 'Enable maintenance mode', 'general'),
('site_title', 'Flame Cloud - Premium Minecraft Hosting', 'Website title', 'general'),
('whatsapp_number', '', 'WhatsApp contact number', 'social'),
('support_email', 'support@flamecloud.com', 'Support email address', 'general'),
('announcement', '', 'Site-wide announcement banner', 'display'),
('registration_enabled', 'true', 'Allow new user registrations', 'features'),
('chat_enabled', 'true', 'Enable live chat feature', 'features')
ON CONFLICT (key) DO NOTHING;

-- About Content
INSERT INTO about_content (
    content,
    founder_name, founder_role,
    owner_name, owner_role,
    management_name, management_role,
    company_founded_year
) VALUES (
    'Flame Cloud is the premier Minecraft hosting provider, offering high-performance servers with instant setup, DDoS protection, and 24/7 support. We are dedicated to providing the best gaming experience for Minecraft players worldwide.',
    'Flame Founder', 'Founder & CEO',
    'Flame Owner', 'Owner & Lead Developer',
    'Flame Management', 'Management Team',
    2024
)
ON CONFLICT DO NOTHING;

-- YT Partners
INSERT INTO yt_partners (name, channel_link, subscribers, is_featured, is_active, sort_order) VALUES
('TechGamer PK', 'https://youtube.com/@techgamerpk', '50K+', TRUE, TRUE, 1),
('Minecraft Pro', 'https://youtube.com/@minecraftpro', '100K+', TRUE, TRUE, 2),
('Flame Gaming', 'https://youtube.com/@flamegaming', '25K+', FALSE, TRUE, 3)
ON CONFLICT DO NOTHING;

-- ================================================================
-- 🔥 SETUP COMPLETE! 🔥
-- ================================================================
-- 
-- TABLES: users, paid_plans, free_plans, free_plan_claims, tickets,
--         chat_messages, yt_partners, about_content, site_settings,
--         location_settings, activity_log
--
-- NEXT STEPS:
-- 1. Create admin user in Authentication > Users
-- 2. Run: UPDATE users SET is_admin = TRUE WHERE email = 'your_admin@email.com';
-- ================================================================
