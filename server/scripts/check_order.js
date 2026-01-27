require('dotenv').config({ path: '../.env' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkOrder() {
    const { data: plans, error } = await supabase
        .from('paid_plans')
        .select('id, name, sort_order, price')
        .order('sort_order', { ascending: true });

    if (error) {
        console.error(error);
    } else {
        console.table(plans);
    }
}

checkOrder();
