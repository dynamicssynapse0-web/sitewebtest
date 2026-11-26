import Image from 'next/image';
import Link from 'next/link';
import { getAllSportifs } from '@/lib/sportifsSemaine';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Sportifs de la semaine',
  description:
    'Découvrez tous les portraits des sportifs mis en lumière par Aubin Simo.',
  path: '/sportifs-semaine',
  image: '/images/aubin-simo-annexe.jpg',
});

export const revalidate = 60;

export default async function SportifsSemaine() {
  const sportifs = await getAllSportifs();

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-r from-blue-900 to-red-700 px-4 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/"
            className="mb-6 inline-block font-medium text-white/80 transition hover:text-white"
          >
            ← Retour à l&apos;accueil
          </Link>
          <h1 className="mb-4 text-4xl font-extrabold sm:text-6xl">
            Sportifs de la semaine
          </h1>
          <p className="text-xl text-white/90">
            Les visages, les parcours et les instants forts du sport.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12">
        {sportifs.length === 0 ? (
          <p className="text-center text-lg text-gray-500">
            Aucun sportif publié pour le moment.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {sportifs.map((portrait) => (
              <Link
                key={portrait.id}
                href={`/sportifs-semaine/${portrait.id}`}
                className="group"
              >
                <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:shadow-xl">
                  <div className="relative h-64 w-full bg-gray-200">
                    <Image
                      src={portrait.cover}
                      alt={portrait.alt || `Portrait de ${portrait.title}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute left-4 top-4 rounded-md bg-blue-900 px-3 py-1 text-sm font-bold text-white shadow-md">
                      {portrait.badge}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <h2 className="mb-2 text-2xl font-bold text-gray-900 transition-colors group-hover:text-blue-900">
                      {portrait.title}
                    </h2>
                    <p className="mb-4 text-sm text-gray-600">
                      {[portrait.nom, portrait.poste, portrait.competition]
                        .filter(Boolean)
                        .join(' — ')}
                    </p>
                    {portrait.quote ? (
                      <p className="mb-4 flex-1 text-gray-700 line-clamp-3">
                        “{portrait.quote}”
                      </p>
                    ) : null}
                    <span className="mt-auto flex items-center gap-2 text-sm font-semibold text-red-600 transition-all group-hover:gap-3">
                      Voir le portrait →
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
