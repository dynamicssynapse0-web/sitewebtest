import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import {
  SUPABASE_PUBLISHABLE_KEY,
  SUPABASE_URL,
  isSupabaseConfigured,
} from './config';

export async function getServerSupabase() {
  if (!isSupabaseConfigured) return null;

  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Appel depuis un Server Component : la session sera rafraîchie par le middleware/route.
        }
      },
    },
  });
}

export async function getServerUser() {
  const supabase = await getServerSupabase();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ?? null;
}
