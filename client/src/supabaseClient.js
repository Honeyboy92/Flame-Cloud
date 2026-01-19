import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://vhsevmcnbsnjzsrkbcnv.supabase.co'
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoc2V2bWNuYnNuanpzcmtic252Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3NDk3NDcsImV4cCI6MjA4NDMyNTc0N30.x5HL7TUEgoFz8hREcQtHZdp6mcCKovblIxKdoi9HiNE'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)