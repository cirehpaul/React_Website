import { createClient } from '@supabase/supabase-js';

//  Supabase URL and anon key from the dashboard
const SUPABASE_URL = 'https://amsoeykbxwyidiognngn.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_Kqy-gbmgfSZGFNsfu1Pl1g_8jkMtNHb';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
