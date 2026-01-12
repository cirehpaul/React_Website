import { createClient } from '@supabase/supabase-js';

// Vite uses import.meta.env, NOT process.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug log to see if variables are loading in the browser
console.log('Vite Supabase URL:', supabaseUrl);

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase credentials missing! Make sure they start with VITE_ in your .env file');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);