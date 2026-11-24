import Image from 'next/image';
import Link from 'next/link';
import {
  formatCompetitionDate,
  getAllInternationalCompetitions,
} from '@/lib/internationalCompetitions';
import { DEFAULT_OG_IMAGE, pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'CAN 2027',
  description:
    'Retrouvez les compétitions internationales couvertes par Aubin Simo et toutes leurs photographies.',
  path: '/competitions-internationales',
});

export const revalidate = 60;

export default async function CompetitionsInternationales() {
  const competitions = await getAllInternationalCompetitions();

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-gradient-to-r from-blue-900 to-red-700 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/"
            className="text-white/80 hover:text-white mb-6 inline-block font-medium transition"
          >
            ← Retour à l&apos;accueil
          </Link>
          <h1 className="text-4xl sm:text-6xl font-extrabold mb-4">CAN 2027</h1>
          <p className="text-xl text-white/90 max-w-3xl">
            Les grands rendez-vous internationaux racontés en images par Aubin Simo.
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {competitions.length === 0 ? (
          <p className="text-gray-500 text-center text-lg">
            Aucune compétition publiée pour le moment.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {competitions.map((competition) => (
              <Link
                key={competition.slug}
                href={`/competitions-internationales/${competition.slug}`}
                className="group overflow-hidden rounded-2xl bg-white shadow-md transition hover:shadow-xl"
              >
                <div className="relative h-56">
                  <Image
                    src={competition.coverImage || DEFAULT_OG_IMAGE}
                    alt={`Photo principale : ${competition.title}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-red-600">
                    {competition.competition || 'Compétition internationale'}
                  </p>
                  <h2 className="text-2xl font-bold text-blue-950 mb-3">
                    {competition.title}
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">
                    {formatCompetitionDate(competition.date)} · {competition.location}
                  </p>
                  <span className="text-red-600 font-semibold text-sm">
                    Voir la galerie →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
