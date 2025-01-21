import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xyzcompany.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // This is a placeholder - user needs to provide real key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);