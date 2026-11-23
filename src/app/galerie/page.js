import Link from 'next/link';
import GalerieGrid from '@/components/GalerieGrid';
import { getGalleryImages } from '@/lib/gallery';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Galerie photos',
  description:
    'Les plus belles photographies sportives d’Aubin Simo, réunies dans une seule galerie.',
  path: '/galerie',
  image: '/images/aubin-simo-getimages.jpg',
});

export const revalidate = 3600;

export default async function Galerie() {
  const toutesLesImages = await getGalleryImages();

  return (
    <main className="min-h-screen bg-gray-900 pb-20">
      <div className="bg-black text-white py-16 px-4 border-b border-gray-800">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/"
            className="text-gray-400 hover:text-white mb-6 inline-block font-medium transition"
          >
            ← Retour à l&apos;accueil
          </Link>
          <h1 className="text-4xl sm:text-6xl font-extrabold mb-4">Galerie</h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Toutes mes plus belles photos, capturées sur le terrain, réunies en un seul endroit.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {toutesLesImages.length === 0 ? (
          <p className="text-gray-500 text-center text-lg">Aucune photo pour le moment.</p>
        ) : (
          <GalerieGrid images={toutesLesImages} pageSize={18} />
        )}
      </div>
    </main>
  );
}
