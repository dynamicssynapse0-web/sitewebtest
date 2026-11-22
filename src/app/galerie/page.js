import Link from 'next/link';
import Image from 'next/image';
import { getAllEvents } from '@/lib/events';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Galerie photos',
  description:
    'Les plus belles photographies sportives d’Aubin Simo, réunies dans une seule galerie.',
  path: '/galerie',
  image: '/images/aubin-simo-getimages.jpg',
});

export default function Galerie() {
  const evenements = getAllEvents();

  // On rassemble TOUTES les images de TOUS les événements dans un seul grand tableau
  const toutesLesImages = evenements.flatMap(event => 
    (event.images || []).map(img => ({
      src: img,
      titre: event.title,
      evenementSlug: event.slug
    }))
  );

  return (
    <main className="min-h-screen bg-gray-900 pb-20">
      
      {/* En-tête de la galerie */}
      <div className="bg-black text-white py-16 px-4 border-b border-gray-800">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="text-gray-400 hover:text-white mb-6 inline-block font-medium transition">
            ← Retour à l&apos;accueil
          </Link>
          <h1 className="text-4xl sm:text-6xl font-extrabold mb-4">Galerie</h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Toutes mes plus belles photos, capturées sur le terrain, réunies en un seul endroit.
          </p>
        </div>
      </div>

      {/* Le mur d'images */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {toutesLesImages.length === 0 ? (
          <p className="text-gray-500 text-center text-lg">Aucune photo pour le moment.</p>
        ) : (
          <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
            {toutesLesImages.map((img, index) => (
              <div key={index} className="relative group rounded-lg overflow-hidden break-inside-avoid">
                <Image
                  src={img.src}
                  alt={`Photographie de ${img.titre}`}
                  width={800} // Largeur arbitraire pour le ratio
                  height={600} // Hauteur arbitraire
                  className="w-full h-auto object-cover group-hover:scale-105 transition duration-500"
                />
                
                {/* Effet au survol : un voile sombre avec le nom de l'événement */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-6">
                  <div>
                    <p className="text-yellow-500 text-sm font-bold mb-1 uppercase tracking-wider">Événement</p>
                    <p className="text-white font-bold text-lg">{img.titre}</p>
                    <Link href={`/evenements/${img.evenementSlug}`} className="text-gray-300 text-sm underline mt-2 block">
                      Voir l&apos;événement →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}