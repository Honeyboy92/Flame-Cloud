require('dotenv').config({ path: '../.env' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) { process.exit(1); }

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixOrder() {
    // 1. Get Black Ruby
    const { data: oldPlan } = await supabase
        .from('paid_plans')
        .select('*')
        .ilike('name', '%Black Ruby%')
        .single();

    if (!oldPlan) {
        console.log('Black Ruby not found');
        return;
    }

    console.log('Found Black Ruby ID:', oldPlan.id);

    // 2. Delete it
    const { error: delError } = await supabase
        .from('paid_plans')
        .delete()
        .eq('id', oldPlan.id);

    if (delError) {
        console.error('Delete failed:', delError);
        return;
    }
    console.log('Deleted old Black Ruby');

    // 3. Re-insert it (without ID, so it generates new one)
    const { id, created_at, ...planData } = oldPlan;
    const { data: newPlan, error: insError } = await supabase
        .from('paid_plans')
        .insert([planData])
        .select();

    if (insError) {
        console.error('Insert failed:', insError);
    } else {
        console.log('Re-inserted Black Ruby with new ID:', newPlan[0].id);
    }
}

fixOrder();
