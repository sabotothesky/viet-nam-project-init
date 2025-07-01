
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fctvjagzpkzqmddmowjg.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjdHZqYWd6cGt6cW1kZG1vd2pnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU3MzA0MjQsImV4cCI6MjA1MTMwNjQyNH0.Tgmh4KjhYlEbC2PKHh5A7vVJe0KoiVsjqUfL_VPTzos'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})
