import Link from 'next/link';
import Image from 'next/image';
import { getAllEvents } from '@/lib/events';
import { pageMetadata, DEFAULT_OG_IMAGE } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Événements',
  description:
    'Toutes les couvertures photographiques d’événements sportifs réalisées par Aubin Simo.',
  path: '/evenements',
  image: '/images/aubin-simo-annexe.jpg',
});

export default function Evenements() {
  const evenements = getAllEvents();

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      
      {/* En-tête avec la charte graphique */}
      <div className="bg-gradient-to-r from-blue-900 to-red-700 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="text-white/80 hover:text-white mb-6 inline-block font-medium transition">
            ← Retour à l&apos;accueil
          </Link>
          <h1 className="text-4xl sm:text-6xl font-extrabold mb-4">Tous les événements</h1>
          <p className="text-xl text-white/90">
            Retrouvez tous les matchs et événements que j&apos;ai couverts.
          </p>
        </div>
      </div>

      {/* Liste des événements */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {evenements.length === 0 ? (
          <p className="text-gray-500 text-center text-lg">Aucun événement pour le moment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {evenements.map((event) => (
              <Link key={event.slug} href={`/evenements/${event.slug}`}>
                <article className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col group">
                  
                  {/* Photo de couverture */}
                  <div className="relative h-56 w-full bg-gray-200">
                    <Image
                      src={event.coverImage || DEFAULT_OG_IMAGE}
                      alt={event.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-blue-900 text-white font-bold px-3 py-1 rounded-md text-sm shadow-md">
                      {event.sport}
                    </div>
                  </div>

                  {/* Texte et commentaire */}
                  <div className="p-6 flex flex-col flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-900 transition-colors">
                      {event.title}
                    </h2>
                    
                    <p className="text-gray-600 text-sm mb-4">
                      📅 {isNaN(new Date(event.date).getTime()) ? event.date : new Date(event.date).toLocaleDateString('fr-FR')} | 📍 {event.location}
                    </p>
                    
                    {/* Le commentaire de l'événement (le résumé) */}
                    <p className="text-gray-700 line-clamp-3 mb-4 flex-1">
                      {event.content}
                    </p>
                    
                    <span className="text-red-600 font-semibold text-sm flex items-center gap-2 group-hover:gap-3 transition-all mt-auto">
                      Voir la galerie complète →
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