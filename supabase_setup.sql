-- FLAME CLOUD: COMPREHENSIVE SUPABASE SETUP SQL
-- This script sets up all necessary tables, constraints, and initial data.

-- 1. USERS TABLE (Supabase Auth handled by distinct schema, but this caches profile data)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT auth.uid(),
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    avatar TEXT,
    is_admin BOOLEAN DEFAULT FALSE,
    has_claimed_free_plan BOOLEAN DEFAULT FALSE,
    claimed_ip TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_seen TIMESTAMPTZ
);

-- Enable RLS for users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policies for users
CREATE POLICY "Users can view their own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.users FOR INSERT WITH CHECK (TRUE); 
CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.users FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = TRUE)
);

-- 2. PAID PLANS TABLE
CREATE TABLE IF NOT EXISTS public.paid_plans (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL,
    ram TEXT NOT NULL,
    cpu TEXT NOT NULL,
    storage TEXT NOT NULL,
    location TEXT NOT NULL,
    price TEXT NOT NULL,
    discount INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TICKETS TABLE
CREATE TABLE IF NOT EXISTS public.tickets (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id UUID NOT NULL REFERENCES public.users(id),
    email TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    screenshot TEXT,
    status TEXT DEFAULT 'pending',
    admin_response TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for tickets
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own tickets" ON public.tickets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create tickets" ON public.tickets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage all tickets" ON public.tickets FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = TRUE)
);

-- 4. CHAT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    sender_id UUID NOT NULL REFERENCES public.users(id),
    receiver_id UUID NOT NULL REFERENCES public.users(id),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for chat
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their messages" ON public.chat_messages FOR SELECT USING (
    auth.uid() = sender_id OR auth.uid() = receiver_id
);
CREATE POLICY "Users can send messages" ON public.chat_messages FOR INSERT WITH CHECK (
    auth.uid() = sender_id
);

-- 5. YT PARTNERS TABLE
CREATE TABLE IF NOT EXISTS public.yt_partners (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL,
    channel_link TEXT NOT NULL,
    logo TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. LOCATION SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.location_settings (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    location TEXT UNIQUE NOT NULL,
    is_available BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0
);

-- 7. INITIAL DATA
INSERT INTO public.location_settings (location, is_available, sort_order) VALUES 
('UAE', TRUE, 1),
('France', FALSE, 2),
('Singapore', FALSE, 3)
ON CONFLICT (location) DO NOTHING;

INSERT INTO public.paid_plans (name, ram, cpu, storage, location, price, sort_order) VALUES 
('Bronze Plan', '2GB', '100%', '10 GB SSD', 'UAE', '200 PKR', 1),
('Silver Plan', '4GB', '150%', '20 GB SSD', 'UAE', '400 PKR', 2),
('Gold Plan', '8GB', '250%', '30 GB SSD', 'UAE', '600 PKR', 3),
('Platinum Plan', '10GB', '300%', '40 GB SSD', 'UAE', '800 PKR', 4),
('Emerald Plan', '12GB', '350%', '50 GB SSD', 'UAE', '1200 PKR', 5),
('Amethyst Plan', '14GB', '400%', '60 GB SSD', 'UAE', '1400 PKR', 6),
('Diamond Plan', '16GB', '500%', '80 GB SSD', 'UAE', '1600 PKR', 7),
('Ruby Plan', '32GB', '1000%', '100 GB SSD', 'UAE', '3200 PKR', 8),
('Black Ruby Plan', '64GB', '2000%', '200 GB SSD', 'UAE', '6400 PKR', 9)
ON CONFLICT DO NOTHING;
