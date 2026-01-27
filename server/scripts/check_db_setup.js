const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing credentials");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkTables() {
    console.log(`Checking database at: ${supabaseUrl}`);

    // Check for a few critical tables
    const tables = ['paid_plans', 'location_settings', 'users', 'tickets'];

    for (const table of tables) {
        const { data, error } = await supabase.from(table).select('count', { count: 'exact', head: true });

        if (error) {
            console.error(`[MISSING/ERROR] Table '${table}':`, error.message);
        } else {
            console.log(`[OK] Table '${table}' exists.`);
        }
    }

    console.log('\n--- Checking User Read Access ---');
    const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', 'flamecloud@gmail.com')
        .single();

    if (userError) {
        console.error("User Read Failed:", userError.message);
        if (userError.message.includes("recursion")) {
            console.error("FATAL: Recursion detected in policies!");
        }
    } else {
        console.log("User Read OK:", userData);
    }
}

checkTables();
