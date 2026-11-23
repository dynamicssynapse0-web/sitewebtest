import Link from 'next/link';
import Image from 'next/image';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'À propos',
  description:
    "Découvrez Bilderfassung et Aubin Simo, photographe sportif au Cameroun.",
  path: '/a-propos',
  image: '/images/aubin-simo-bilderfassung.jpg',
});

export default function APropos() {
  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* En-tête avec les couleurs de la charte (Bleu et Rouge) */}
      <header className="bg-gradient-to-r from-blue-900 to-red-700 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="text-white/80 hover:text-white mb-6 inline-block font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
            ← Retour à l&apos;accueil
          </Link>
          <h1 className="text-4xl sm:text-6xl font-extrabold mb-2">Bilderfassung</h1>
          <p className="text-xl text-white/90">L&apos;œil du sport par Aubin Simo</p>
        </div>
      </header>

      {/* Contenu principal */}
      <div className="max-w-4xl mx-auto px-4 -mt-10">
        <section
          aria-labelledby="a-propos-title"
          className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-100 flex flex-col md:flex-row gap-10 items-center md:items-start"
        >
          <div className="w-48 h-48 md:w-64 md:h-64 relative rounded-full overflow-hidden border-4 border-blue-900 shadow-lg shrink-0 bg-blue-50">
            <Image
              src="/images/aubin-simo-bilderfassung.jpg"
              alt="Portrait d'Aubin Simo, photographe sportif"
              fill
              sizes="(max-width: 768px) 12rem, 16rem"
              priority
              className="object-cover"
            />
          </div>

          {/* Ta biographie */}
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Aubin Simo</h2>
            <p className="text-blue-700 font-semibold mb-6 uppercase tracking-wider text-sm">Photographe Sportif</p>
            
            <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
              <p>
                Derrière l&apos;objectif de <strong>Bilderfassung</strong>, il y a <strong>Aubin Simo</strong>, un passionné de sport et de photographie. 
                Mon but est de capturer l&apos;intensité, l&apos;émotion et la beauté brute des événements sportifs.
              </p>
              <p>
                Du football au basketball en passant par l&apos;athlétisme, je parcours les terrains et les stades pour vous faire revivre 
                les meilleurs moments. Chaque match est une histoire, chaque photo est un souvenir figé.
              </p>
              <p>
                À travers ce site, je partage avec vous ma vision du sport : celle où la sueur, la joie et la détermination se rencontrent.
              </p>
            </div>

            {/* Bouton de contact avec la couleur rouge de la charte */}
            <div className="mt-8">
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full transition-colors shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                >
                  Me contacter
                </Link>
                <Link
                  href="/galerie"
                  className="inline-block border-2 border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white font-bold py-3 px-8 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-900"
                >
                  Voir la galerie
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}