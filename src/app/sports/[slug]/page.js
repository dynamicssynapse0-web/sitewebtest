import Link from 'next/link';
import Image from 'next/image';
import { formatEventDate, getAllEvents } from '@/lib/events';
import { pageMetadata } from '@/lib/seo';

export const revalidate = 3600;

// SEO dynamique
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const nomSport = slug.charAt(0).toUpperCase() + slug.slice(1);
  return pageMetadata({
    title: `Photographies de ${nomSport}`,
    description: `Découvrez mes meilleures photos de ${nomSport} par événement.`,
    path: `/sports/${slug}`,
  });
}

// Événements locaux (Markdown) + événements ajoutés depuis l'admin Supabase.
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
  const nomSport = slug.charAt(0).toUpperCase() + slug.slice(1);
  const evenements = await getEventsBySport(slug);

  return (
    <main className="relative min-h-screen pb-20 overflow-hidden">
      {/* Fond */}
      <div className="fixed inset-0 -z-20">
        <Image
          src="/images/aubin-simo-photographe-football-CAN2027.jpg"
          alt="Fond d'écran sportif"
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

        <header className="max-w-2xl mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            Événements <span className="text-yellow-500">{nomSport}</span>
          </h1>
          <p className="text-gray-300 text-lg">
            Retrouvez toutes mes couvertures photographiques pour la discipline {nomSport.toLowerCase()}.
          </p>
        </header>

        {evenements.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-10 rounded-2xl text-center">
            <p className="text-white text-lg">Aucun événement {nomSport} n&apos;a été publié pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {evenements.map((event) => (
              <article key={event.slug} className="bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col hover:-translate-y-1 transition-transform duration-300">
                <div className="relative h-56 w-full">
                  <Image
                    src={event.coverImage || "/images/aubin-simo-photographe-football-CAN2027.jpg"}
                    alt={`Couverture de l'événement ${event.title}`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-yellow-500 text-black font-bold px-3 py-1 rounded-md text-sm shadow-md">
                    {event.sport}
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">{event.title}</h2>
                  
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