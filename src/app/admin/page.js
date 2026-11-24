import Link from 'next/link';
import { redirect } from 'next/navigation';
import AdminDashboard from '@/components/admin/AdminDashboard';
import LogoutButton from '@/components/admin/LogoutButton';
import { getAdminContext } from '@/lib/supabase/admin';
import { getServerSupabase } from '@/lib/supabase/server';
import { safeText, toPlainJson, toPlainRows } from '@/lib/supabase/serialization';
import { hasValidTitle } from '@/lib/supabase/records';
import { isCategorySportRow } from '@/lib/categoriesSport';

function isArticleOfType(type) {
  return (row) =>
    hasValidTitle(row) &&
    String(row.type ?? '')
      .trim()
      .toLocaleLowerCase('fr') === type;
}

const EMPTY_ITEMS = {
  event: [],
  international: [],
  images_sport: [],
  categories_sport: [],
  sportif: [],
  moment_fort: [],
  portrait_exclusif: [],
};

async function fetchRows(supabase, table, filters = {}, order, validate) {
  if (!supabase) return [];

  try {
    let query = supabase.from(table).select('*');
    Object.entries(filters).forEach(([column, value]) => {
      query = query.eq(column, value);
    });
    if (order) query = query.order(order, { ascending: order === 'ordre' });

    const { data, error } = await query;
    if (error || !Array.isArray(data)) return [];

    const rows = toPlainRows(data);
    return typeof validate === 'function' ? rows.filter(validate) : rows;
  } catch {
    // Table ou colonne manquante : la rubrique s'affiche simplement vide.
    return [];
  }
}

async function fetchAllItems() {
  try {
    const supabase = await getServerSupabase();
    if (!supabase) return EMPTY_ITEMS;

    const [
      events,
      internationals,
      imagesSport,
      categoriesSport,
      sportifs,
      moments,
      portraits,
    ] = await Promise.all([
        fetchRows(
          supabase,
          'articles',
          { type: 'event' },
          'date',
          isArticleOfType('event')
        ),
        fetchRows(
          supabase,
          'articles',
          { type: 'international' },
          'date',
          isArticleOfType('international')
        ),
        fetchRows(supabase, 'images_sport', {}, 'ordre', hasValidTitle),
        fetchRows(supabase, 'categories_sport', {}, 'ordre', isCategorySportRow),
        fetchRows(supabase, 'sportifs_semaine', {}, 'created_at'),
        fetchRows(supabase, 'vitrine_items', { section: 'moment_fort' }, 'ordre'),
        fetchRows(
          supabase,
          'vitrine_items',
          { section: 'portrait_exclusif' },
          'ordre'
        ),
      ]);

    return {
      event: events,
      international: internationals,
      images_sport: imagesSport,
      categories_sport: categoriesSport,
      sportif: sportifs,
      moment_fort: moments,
      portrait_exclusif: portraits,
    };
  } catch {
    return EMPTY_ITEMS;
  }
}

export default async function AdminPage() {
  const context = await getAdminContext();

  if (!context.configured) {
    return (
      <main className="mx-auto max-w-xl px-4 py-14">
        <div className="rounded-3xl border border-red-200 bg-red-50 p-7 text-sm leading-7 text-red-800">
          <h1 className="mb-3 text-2xl font-extrabold">Configuration requise</h1>
          <p>
            Renseignez <code>NEXT_PUBLIC_SUPABASE_URL</code> et{' '}
            <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> dans{' '}
            <code>.env.local</code>, puis redémarrez le serveur.
          </p>
          <Link
            href="/"
            className="mt-5 inline-block font-bold text-blue-900 underline"
          >
            ← Retour au site
          </Link>
        </div>
      </main>
    );
  }

  if (!context.authenticated) {
    redirect('/admin/login?next=/admin');
  }

  if (!context.authorized) {
    return (
      <main className="mx-auto max-w-xl px-4 py-14">
        <div className="rounded-3xl border border-red-200 bg-white p-7 shadow-lg">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-600">
            Accès refusé
          </p>
          <h1 className="mt-2 text-2xl font-extrabold text-blue-950">
            Compte non autorisé
          </h1>
          <p className="mt-4 text-sm leading-7 text-gray-600">
            Votre profil doit avoir <strong>role = admin</strong> et{' '}
            <strong>statut = actif</strong> dans Supabase. Rôle détecté :{' '}
            <strong>{context.role || 'non défini'}</strong> · Statut détecté :{' '}
            <strong>{context.statut || 'non défini'}</strong>.
          </p>
          <div className="mt-7">
            <LogoutButton className="border-blue-950 bg-blue-950 hover:bg-red-600" />
          </div>
        </div>
      </main>
    );
  }

  // Les rubriques de /admin affichent exactement ce qui est publié dans Supabase.
  const initial = toPlainJson(await fetchAllItems());

  return (
    <AdminDashboard
      email={safeText(context.user?.email)}
      initial={initial}
    />
  );
}
