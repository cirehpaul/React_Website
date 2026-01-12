import { createClient } from '@supabase/supabase-js';

const supabaseUrl = Deno.env.get('CP_SUPABASE_URL');
const supabaseAnonKey = Deno.env.get('CP_SUPABASE_ANON_KEY');

// Debugging check: If this prints "undefined", your .env path is wrong
console.log('Connecting to Supabase URL:', supabaseUrl);

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase credentials missing in .env file');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);