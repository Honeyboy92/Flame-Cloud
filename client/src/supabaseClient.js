import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vhsevmcnbsnjzsrkbcnv.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoc2V2bWNuYnNuanpzcmtic252Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3NDk3NDcsImV4cCI6MjA4NDMyNTc0N30.x5HL7TUEgoFz8hREcQtHZdp6mcCKovblIxKdoi9HiNE'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)