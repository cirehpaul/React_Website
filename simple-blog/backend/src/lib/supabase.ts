import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import { fileURLToPath } from 'url';

// In ES Modules, we need to manually define __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Point to the .env file relative to THIS file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Debugging check: If this prints "undefined", your .env path is wrong
console.log('Connecting to Supabase URL:', supabaseUrl);
console.log('PORT_ :', process.env.PORT);

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase credentials missing in .env file');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);