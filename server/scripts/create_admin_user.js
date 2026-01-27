const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'flamecloud@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'GSFY!25V$';

async function createAdmin() {
    console.log(`Setting up Admin User: ${ADMIN_EMAIL}`);

    // 1. Sign Up
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
    });

    if (authError) {
        console.error('Error signing up auth user:', authError.message);
        // If user already exists, we might need to login to get the ID, but assuming clean slate.
        if (authError.message.includes('already registered')) {
            console.log('User already registered, attempting login to get UID...');
            const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
                email: ADMIN_EMAIL,
                password: ADMIN_PASSWORD,
            });
            if (loginError) {
                console.error("Login failed:", loginError.message);
                return;
            }
            await upsertProfile(loginData.user);
            return;
        }
        return;
    }

    if (authData.user) {
        console.log('Auth user created successfully:', authData.user.id);
        await upsertProfile(authData.user);
    }
}

async function upsertProfile(user) {
    // 2. Insert into public.users with is_admin = true
    // The policy allows INSERT WITH CHECK (TRUE), so we can set is_admin here if not blocked elsewhere.
    const { error: dbError } = await supabase
        .from('users')
        .upsert({
            id: user.id,
            email: user.email,
            username: 'FlameAdmin',
            is_admin: true,       // CRITICAL
            has_claimed_free_plan: true
        }, { onConflict: 'id' });

    if (dbError) {
        console.error('Error creating public profile:', dbError.message);
    } else {
        console.log('Admin profile created/updated in public.users table.');
        console.log('SUCCESS: You can now login.');
    }
}

createAdmin();
