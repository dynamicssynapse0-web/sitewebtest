import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import {
  SUPABASE_PUBLISHABLE_KEY,
  SUPABASE_URL,
  isSupabaseConfigured,
} from './config';
import { toPlainJson } from './serialization';

export async function getServerSupabase() {
  if (!isSupabaseConfigured) return null;

  try {
    const cookieStore = await cookies();

    return createServerClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      cookies: {
        getAll() {
          try {
            return cookieStore.getAll();
          } catch {
            return [];
          }
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
  } catch {
    // Cookies indisponibles ou configuration invalide : l'admin reste en mode repli.
    return null;
  }
}

export async function getServerUser() {
  try {
    const supabase = await getServerSupabase();
    if (!supabase) return null;

    const { data } = await supabase.auth.getUser();

    // Converti immédiatement en objet JSON simple : le User Supabase contient
    // des instances Date qui ne peuvent pas traverser la frontière RSC.
    return data?.user ? toPlainJson(data.user) : null;
  } catch {
    return null;
  }
}
