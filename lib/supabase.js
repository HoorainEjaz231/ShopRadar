import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Public project URL + publishable (anon) key — safe to embed client-side,
// same as the old network.js's hardcoded serverurl. Real access control
// lives in Postgres RLS policies, not in keeping this key secret.
const SUPABASE_URL = 'https://rqwkffxibguylyvtfhnn.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_55B1jxG8kkReHXGfbH3hRA_yy5DYQk8';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
