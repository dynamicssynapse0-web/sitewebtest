import { NextResponse } from 'next/server';
import { getPublicSupabase } from '@/lib/supabase/publicClient';

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const id = String(body?.id || '').slice(0, 64);
    const placement = String(body?.placement || '').slice(0, 40);

    if (!id) return NextResponse.json({ ok: false }, { status: 400 });

    const supabase = getPublicSupabase();
    if (!supabase) return NextResponse.json({ ok: true, counted: false });

    const payload = {
      ad_id: id,
      placement,
      created_at: new Date().toISOString(),
    };
    let result = await supabase.from('ad_clicks').insert(payload);

    // Compatibilité avec les tables qui portent une colonne `count` NOT NULL.
    if (result.error && /count/i.test(result.error.message)) {
      result = await supabase.from('ad_clicks').insert({ ...payload, count: 1 });
    }

    if (result.error) return NextResponse.json({ ok: false });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
