import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://gespgnetqvlxaarwkvtr.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdlc3BnbmV0cXZseGFhcndrdnRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzNTk3NTgsImV4cCI6MjA4NDkzNTc1OH0.4kjI2iX6SiXvIEuuBX2TRmz-6UsttAB3g8M-whXPQfY';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL and Anon Key are missing! Check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('--- Flame Cloud: Using Real Supabase Client ---');
