import Link from 'next/link';
import Image from 'next/image';
import { getAllSports } from '@/lib/sports';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Sports',
  description:
    'Football, basketball, athlétisme, boxe et toutes les disciplines photographiées par Aubin Simo.',
  path: '/sports',
});

export const revalidate = 60;

export default async function Sports() {
  // Les disciplines publiées dans `images_sport` fusionnent avec les sports de
  // base (déduplication par slug) : le menu reflète toujours Supabase.
  const sports = await getAllSports();

  return (
    <main className="relative min-h-screen pb-20 overflow-hidden">
      {/* Image de fond (SANS LE BOUTON) */}
      <div className="fixed inset-0 -z-20">
        <Image
          src="/images/aubin-simo-photographe-football-CAN2027.jpg"
          alt="Fond d'écran sportif par Aubin Simo"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Filtre sombre */}
      <div className="fixed inset-0 -z-10 bg-black/70 backdrop-blur-sm"></div>

      {/* Contenu de la page */}
      <div className="relative z-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* LE BOUTON EST MAINTENANT ICI */}
        <Link href="/" className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition mb-8 font-medium">
          ← Retour à l&apos;accueil
        </Link>

        <header className="max-w-2xl mb-10 sm:mb-14">
          <span className="inline-block text-xs sm:text-sm font-semibold tracking-widest text-yellow-400 uppercase mb-3">
            Portfolio — Aubin Simo
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
            Nos Sports
          </h1>
          <p className="text-base sm:text-lg text-gray-200">
            Découvrez les disciplines que je couvre à travers mes objectifs.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {sports.length === 0 ? (
            <p className="col-span-full rounded-2xl border border-white/20 bg-white/10 p-8 text-center text-gray-200">
              Aucune discipline publiée pour le moment.
            </p>
          ) : (
            sports.map((sport) => (
              <Link
                href={`/sports/${sport.slug}`}
                key={sport.slug}
                className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2 rounded-2xl"
                aria-label={`Découvrir la discipline ${sport.nom || sport.title}`}
              >
                <article className="relative bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                  <div className="relative h-48 sm:h-52 bg-gray-200 overflow-hidden">
                    <Image
                      src={sport.coverImage || sport.image}
                      alt={sport.alt || sport.nom || sport.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-center justify-center">
                      <span
                        className="text-5xl sm:text-6xl drop-shadow-lg select-none"
                        aria-hidden="true"
                      >
                        {sport.icone || '📸'}
                      </span>
                    </div>
                    {sport.imageCount ? (
                      <span className="absolute bottom-3 right-3 rounded-full bg-blue-950/85 px-3 py-1 text-[11px] font-bold text-white">
                        {sport.imageCount} photo{sport.imageCount > 1 ? 's' : ''}
                      </span>
                    ) : null}
                  </div>

                  <div className="p-5 sm:p-6 flex flex-col flex-1">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 group-hover:text-yellow-600 transition-colors">
                      {sport.nom || sport.title}
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed flex-1">
                      {sport.description}
                    </p>

                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-yellow-600 group-hover:gap-3 transition-all">
                      Voir la galerie
                      <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </article>
              </Link>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
