import Link from 'next/link';
import GalerieExplorer from '@/components/GalerieExplorer';
import MomentFortSection from '@/components/MomentFortSection';
import ExclusivePortraits from '@/components/ExclusivePortraits';
import SportifsDeLaSemaine from '@/components/SportifsDeLaSemaine';
import { getGalleryImages } from '@/lib/gallery';
import { getMomentsForts, getPortraitsExclusifs } from '@/lib/vitrine';
import { getAllSportifs } from '@/lib/sportifsSemaine';
import { buildFilterOptions } from '@/lib/filters';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Galerie photos',
  description:
    'Les plus belles photographies sportives d’Aubin Simo, réunies dans une seule galerie.',
  path: '/galerie',
  image: '/images/aubin-simo-getimages.jpg',
});

export const revalidate = 60;

export default async function Galerie() {
  const [toutesLesImages, momentsForts, portraitsExclusifs, sportifs] =
    await Promise.all([
      getGalleryImages(),
      getMomentsForts(),
      getPortraitsExclusifs(),
      getAllSportifs(),
    ]);

  const sportOptions = buildFilterOptions(toutesLesImages, 'sport');
  const yearOptions = buildFilterOptions(toutesLesImages, 'year');

  return (
    <main className="min-h-screen bg-gray-900 pb-20">
      <div className="border-b border-gray-800 bg-black py-16 px-4">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/"
            className="mb-6 inline-block font-medium text-gray-400 transition hover:text-white"
          >
            ← Retour à l&apos;accueil
          </Link>
          <h1 className="mb-4 text-4xl font-extrabold sm:text-6xl">Galerie</h1>
          <p className="max-w-2xl text-lg text-gray-400">
            Toutes mes plus belles photos, capturées sur le terrain, réunies en un seul
            endroit. Touchez une image pour l&apos;ouvrir en plein écran et commander vos
            photos.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-12">
        <GalerieExplorer
          images={toutesLesImages}
          sportOptions={sportOptions}
          yearOptions={yearOptions}
        />

        {momentsForts.length > 0 || portraitsExclusifs.length > 0 ? (
          <div className="rounded-3xl bg-white p-5 sm:p-8">
            <MomentFortSection items={momentsForts} />
            <ExclusivePortraits items={portraitsExclusifs} />
          </div>
        ) : null}

        {sportifs.length > 0 ? <SportifsDeLaSemaine sportifs={sportifs} /> : null}
      </div>
    </main>
  );
}
