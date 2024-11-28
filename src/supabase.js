import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://taajjoetwjorgbseosbx.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhYWpqb2V0d2pvcmdic2Vvc2J4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE5OTMyODQsImV4cCI6MjA0NzU2OTI4NH0.WwY1TsvN9qtce2Umy_DAprW6ndBS-iWgRFuDW3pQNIA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)