import Link from 'next/link';
import EvenementsExplorer from '@/components/EvenementsExplorer';
import { formatEventDate, getAllEvents } from '@/lib/events';
import { buildFilterOptions } from '@/lib/filters';
import { slugify } from '@/lib/supabase/records';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Événements',
  description:
    'Toutes les couvertures photographiques d’événements sportifs réalisées par Aubin Simo.',
  path: '/evenements',
  image: '/images/aubin-simo-annexe.jpg',
});

export const revalidate = 60;

export default async function Evenements() {
  const remote = await getAllEvents();
  const evenements = remote.map((event) => ({
    ...event,
    sportKey: slugify(event.sport),
    year: String(event.date || '').slice(0, 4),
    dateLabel: formatEventDate(event.date, event.season),
    photoCount: event.images?.length || 0,
  }));

  const sportOptions = buildFilterOptions(
    evenements.map((event) => ({ sport: event.sportKey })),
    'sport'
  );
  const yearOptions = buildFilterOptions(evenements, 'year');

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-r from-blue-900 to-red-700 py-16 px-4 text-white">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/"
            className="mb-6 inline-block font-medium text-white/80 transition hover:text-white"
          >
            ← Retour à l&apos;accueil
          </Link>
          <h1 className="mb-4 text-4xl font-extrabold sm:text-6xl">
            Tous les événements
          </h1>
          <p className="text-xl text-white/90">
            Retrouvez tous les matchs et événements que j&apos;ai couverts.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12">
        <EvenementsExplorer
          events={evenements}
          sportOptions={sportOptions}
          yearOptions={yearOptions}
        />
      </div>
    </main>
  );
}
