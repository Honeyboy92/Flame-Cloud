require('dotenv').config({ path: '../.env' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY; // Fallback to anon key if service key missing

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY/SUPABASE_ANON_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const missingPlans = [
    { name: 'Emerald Plan', ram: '12GB', cpu: '350%', storage: '50 GB SSD', location: 'UAE', price: '1200 PKR', sort_order: 5, is_active: true },
    { name: 'Amethyst Plan', ram: '14GB', cpu: '400%', storage: '60 GB SSD', location: 'UAE', price: '1400 PKR', sort_order: 6, is_active: true },
    { name: 'Diamond Plan', ram: '16GB', cpu: '500%', storage: '80 GB SSD', location: 'UAE', price: '1600 PKR', sort_order: 7, is_active: true },
    { name: 'Ruby Plan', ram: '32GB', cpu: '1000%', storage: '100 GB SSD', location: 'UAE', price: '3200 PKR', sort_order: 8, is_active: true }
];

async function restorePlans() {
    console.log('Restoring missing plans...');

    for (const plan of missingPlans) {
        // Check if exists
        const { data: existing } = await supabase
            .from('paid_plans')
            .select('*')
            .eq('name', plan.name)
            .single();

        if (!existing) {
            console.log(`Inserting ${plan.name}...`);
            const { error } = await supabase
                .from('paid_plans')
                .insert([plan]);

            if (error) {
                console.error(`Error inserting ${plan.name}:`, error.message);
            } else {
                console.log(`Successfully added ${plan.name}`);
            }
        } else {
            console.log(`${plan.name} already exists.`);
        }
    }
    console.log('Done!');
}

restorePlans();
