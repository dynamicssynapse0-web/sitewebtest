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

    const { error } = await supabase.from('ad_clicks').insert({
      ad_id: id,
      placement,
      created_at: new Date().toISOString(),
    });

    if (error) return NextResponse.json({ ok: false });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
