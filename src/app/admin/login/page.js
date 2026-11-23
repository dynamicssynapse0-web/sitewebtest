import Link from 'next/link';
import LoginForm from '@/components/admin/LoginForm';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export const metadata = {
  title: 'Connexion admin',
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({ searchParams }) {
  const params = await searchParams;
  const next = typeof params?.next === 'string' ? params.next : '/admin';
  const denied = params?.error === 'acces';

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-950 via-blue-900 to-red-800 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-9">
        <Link
          href="/"
          className="text-sm font-semibold text-blue-900 transition hover:text-red-600"
        >
          ← Bilderfassung
        </Link>

        <p className="mt-7 text-xs font-bold uppercase tracking-[0.22em] text-red-600">
          Espace privé
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-blue-950">
          Administration
        </h1>
        <p className="mt-2 text-sm leading-6 text-gray-600">
          Connectez-vous avec votre compte Supabase pour gérer les contenus du site.
        </p>

        {denied ? (
          <p
            role="alert"
            className="mt-6 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            Votre compte n&apos;a pas le rôle admin actif. Contactez l&apos;administrateur.
          </p>
        ) : null}

        <div className="mt-7">
          <LoginForm next={next} />
        </div>

        {!isSupabaseConfigured ? (
          <p className="mt-6 text-center text-xs text-gray-400">
            Variables d&apos;environnement publiques : NEXT_PUBLIC_SUPABASE_URL et
            NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.
          </p>
        ) : null}
      </div>
    </main>
  );
}
