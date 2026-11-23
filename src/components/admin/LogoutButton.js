'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getBrowserSupabase } from '@/lib/supabase/client';

export default function LogoutButton({ className = '' }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    const supabase = getBrowserSupabase();
    if (supabase) await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className={`rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-bold text-white transition hover:border-red-400 hover:bg-red-600 disabled:opacity-60 ${className}`}
    >
      {loading ? 'Déconnexion…' : 'Déconnexion'}
    </button>
  );
}
