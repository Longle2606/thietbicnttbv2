import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jjkrknthmhlhvfjcszoc.supabase.co';
const supabaseAnonKey = 'sb_publishable_OXGAXY2eVFL-Y3MEaPANPA_3Wm1sCU1';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);