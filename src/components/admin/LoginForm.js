'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getBrowserSupabase } from '@/lib/supabase/client';
import { isSupabaseConfigured, safeAdminNext } from '@/lib/supabase/config';

export default function LoginForm({ next = '/admin', error: initialError }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(initialError || '');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const supabase = getBrowserSupabase();
      if (!supabase) {
        throw new Error(
          'Supabase n’est pas configuré. Renseignez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY dans .env.local.'
        );
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) throw new Error(signInError.message);

      router.push(safeAdminNext(next));
      router.refresh();
    } catch (submitError) {
      setError(submitError.message || 'Connexion impossible.');
      setLoading(false);
    }
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm leading-6 text-red-800">
        <p className="font-bold">Configuration Supabase manquante.</p>
        <p className="mt-2">
          Ajoutez <code>NEXT_PUBLIC_SUPABASE_URL</code> et{' '}
          <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> dans{' '}
          <code>.env.local</code>, puis redémarrez le serveur.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="admin-email"
          className="mb-2 block text-sm font-bold text-blue-950"
        >
          Adresse e-mail
        </label>
        <input
          id="admin-email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="vous@exemple.com"
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-200"
        />
      </div>

      <div>
        <label
          htmlFor="admin-password"
          className="mb-2 block text-sm font-bold text-blue-950"
        >
          Mot de passe
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="••••••••"
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-200"
        />
      </div>

      {error ? (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-red-600 px-6 py-4 text-base font-bold text-white shadow-lg transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Connexion…' : 'Se connecter'}
      </button>

      <Link
        href="/"
        className="block text-center text-sm font-medium text-blue-900 hover:text-red-600"
      >
        ← Retour au site
      </Link>
    </form>
  );
}
