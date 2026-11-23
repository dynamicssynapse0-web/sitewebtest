import { createClient } from '@supabase/supabase-js';
import {
  SUPABASE_PUBLISHABLE_KEY,
  SUPABASE_URL,
  isSupabaseConfigured,
} from './config';

let publicClient;

export function getPublicSupabase() {
  if (!isSupabaseConfigured) return null;

  if (!publicClient) {
    publicClient = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  return publicClient;
}
