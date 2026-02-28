import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || 'https://rfhlcnnjaujlrnznkitv.supabase.co';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmaGxjbm5qYXVqbHJuem5raXR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyODA5MjAsImV4cCI6MjA4Nzg1NjkyMH0.6BCUMqVAmjUVrGyDwB34EQevEU5PNMYyEETCAil6wZo';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase configuration is missing! Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.');
}

// Only create the client if we have a URL, otherwise export a placeholder or null
// Using a proxy or a check in App.tsx is better, but let's at least prevent the crash
export const supabase = supabaseUrl 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (null as any);
