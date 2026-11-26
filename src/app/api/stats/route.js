import { NextResponse } from 'next/server';
import { getPublicSupabase } from '@/lib/supabase/publicClient';
import { resolveTable } from '@/lib/supabase/tables';

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

    const { error } = await supabase
      .from(await resolveTable(supabase, 'site_pageviews'))
      .insert({
        path,
        created_at: new Date().toISOString(),
      });

    if (error) return NextResponse.json({ ok: false });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
