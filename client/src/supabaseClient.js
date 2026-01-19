import { createClient } from '@supabase/supabase-js'

// Use the correct Supabase URL - check your Supabase dashboard Settings -> API
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://vhaumcmtaajbmrkdxnw.supabase.co'
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoYXVtY210YWFqYm1ya2R4bncuc3VwYWJhc2UuY28iLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczNzI2NjA3MiwiZXhwIjoyMDUyODQyMDcyfQ.example'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)