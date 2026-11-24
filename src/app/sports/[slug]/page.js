import Link from 'next/link';
import Image from 'next/image';
import Gallery from '@/components/Gallery';
import { formatEventDate, getAllEvents } from '@/lib/events';
import { pageMetadata, DEFAULT_OG_IMAGE } from '@/lib/seo';
import { getSportBySlug } from '@/lib/sports';

export const revalidate = 60;

function displayName(sport, slug) {
  return sport?.nom || sport?.title || slug.charAt(0).toUpperCase() + slug.slice(1);
}

// SEO dynamique : la fiche `images_sport` fournit titre, description et couverture.
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const sport = await getSportBySlug(slug);
  const nomSport = displayName(sport, slug);

  return pageMetadata({
    title: `Photographies de ${nomSport}`,
    description:
      sport?.description ||
      `Découvrez mes meilleures photos de ${nomSport} par événement.`,
    path: `/sports/${slug}`,
    image: sport?.coverImage || sport?.image || DEFAULT_OG_IMAGE,
  });
}

async function getEventsBySport(sportSlug) {
  const allEvents = await getAllEvents();

  return allEvents.filter((event) => {
    if (!event.sport) return false;
    return (
      event.sport.trim().toLocaleLowerCase('fr') ===
      sportSlug.trim().toLocaleLowerCase('fr')
    );
  });
}

export default async function SportPage({ params }) {
  const { slug } = await params;
  const sport = await getSportBySlug(slug);
  const evenements = await getEventsBySport(slug);
  const photos = sport?.images || [];
  const nomSport = displayName(sport, slug);

  return (
    <main className="relative min-h-screen pb-20 overflow-hidden">
      {/* Fond */}
      <div className="fixed inset-0 -z-20">
        <Image
          src={sport?.coverImage || sport?.image || DEFAULT_OG_IMAGE}
          alt={`Photographies de ${nomSport}`}
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="fixed inset-0 -z-10 bg-black/80 backdrop-blur-md"></div>

      <div className="relative z-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <Link href="/sports" className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition mb-8 font-medium">
          ← Retour aux sports
        </Link>

        {sport?.categories?.length ? (
          <section className="mb-10">
            <h2 className="text-lg font-bold text-white mb-4">Sous-disciplines</h2>
            <div className="flex flex-wrap gap-3">
              {sport.categories.map((category) => (
                <Link
                  key={category.id || category.href}
                  href={category.href}
                  className="inline-flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 text-white hover:bg-white/20 transition"
                >
                  <span className="relative h-12 w-16 overflow-hidden rounded-lg">
                    <Image
                      src={category.coverImage}
                      alt={category.sousDiscipline}
                      fill
                      className="object-cover"
                    />
                  </span>
                  <span>
                    <span className="block font-bold">{category.sousDiscipline}</span>
                    <span className="block text-xs text-gray-300">
                      {category.images?.length || 0} photo
                      {(category.images?.length || 0) > 1 ? 's' : ''}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <header className="max-w-2xl mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            Photographies <span className="text-yellow-500">{nomSport}</span>
          </h1>
          <p className="text-gray-300 text-lg">
            {sport?.description ||
              `Retrouvez toutes mes couvertures photographiques pour la discipline ${nomSport.toLowerCase()}.`}
          </p>
        </header>

        {photos.length > 0 ? (
          <section className="mb-14">
            <h2 className="text-2xl font-bold mb-8 text-white border-b border-gray-600 pb-4">
              Galerie {nomSport} ({photos.length})
            </h2>
            <Gallery
              images={photos}
              title={nomSport}
              subtitle={`Images secondaires et couverture de ${nomSport}`}
              sport={nomSport}
              href="/galerie"
              hrefLabel="Ouvrir la galerie complète"
              variant="masonry"
            />
          </section>
        ) : null}

        <h2 className="text-2xl font-bold mb-8 text-white border-b border-gray-600 pb-4">
          Événements {nomSport}
        </h2>

        {evenements.length === 0 && photos.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-10 rounded-2xl text-center">
            <p className="text-white text-lg">Aucune image {nomSport} n&apos;a été publiée pour le moment.</p>
          </div>
        ) : evenements.length === 0 ? (
          <p className="text-gray-300">
            Aucun événement {nomSport} n&apos;a été publié pour le moment.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {evenements.map((event) => (
              <article key={event.slug} className="bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col hover:-translate-y-1 transition-transform duration-300">
                <div className="relative h-56 w-full">
                  <Image
                    src={event.coverImage || sport?.coverImage || DEFAULT_OG_IMAGE}
                    alt={`Couverture de l'événement ${event.title}`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-yellow-500 text-black font-bold px-3 py-1 rounded-md text-sm shadow-md">
                    {event.sport}
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{event.title}</h3>

                  <div className="flex flex-col gap-2 mb-6 text-gray-600 text-sm">
                    <p className="flex items-center gap-2">📍 {event.location}</p>
                    <p className="flex items-center gap-2">📅 {formatEventDate(event.date, event.season)}</p>
                  </div>

                  <Link
                    href={`/evenements/${event.slug}`}
                    className="mt-auto w-full text-center bg-black hover:bg-gray-800 text-white font-semibold py-3 rounded-lg transition-colors"
                  >
                    Voir la galerie photos →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
