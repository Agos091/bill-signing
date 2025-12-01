import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dxzxqpvwremhtcynmqul.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4enhxcHZ3cmVtaHRjeW5tcXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2MjI5NDIsImV4cCI6MjA4MDE5ODk0Mn0.COMkess5KWpojX32dOH0Tq4Qf1GTqXnyHUAFgpH4JaA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export { supabaseUrl, supabaseAnonKey };

