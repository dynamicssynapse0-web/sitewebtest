import { NextResponse } from 'next/server';
import { getPublicSupabase } from '@/lib/supabase/publicClient';

const VALID_PATH = /^\/(?!admin(?:\/|$))[a-z0-9\-/_]*$/i;

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const path = typeof body?.path === 'string' ? body.path.slice(0, 200) : '/';

    if (!VALID_PATH.test(path)) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const supabase = getPublicSupabase();
    if (!supabase) return NextResponse.json({ ok: true, counted: false });

    const payload = { path, created_at: new Date().toISOString() };
    let result = await supabase.from('site_pageviews').insert(payload);

    // Certaines installations Supabase ajoutent une colonne `count` NOT NULL :
    // on réessaie alors avec une valeur explicite, sans casser l'installation
    // de référence qui ne contient pas cette colonne.
    if (result.error && /count/i.test(result.error.message)) {
      result = await supabase
        .from('site_pageviews')
        .insert({ ...payload, count: 1 });
    }

    if (result.error) return NextResponse.json({ ok: false });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
