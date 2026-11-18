import Link from 'next/link';
import Image from 'next/image';

export default function APropos() {
  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      
      {/* En-tête avec les couleurs de la charte (Bleu et Rouge) */}
      <div className="bg-gradient-to-r from-blue-900 to-red-700 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="text-white/80 hover:text-white mb-6 inline-block font-medium transition">
            ← Retour à l'accueil
          </Link>
          <h1 className="text-4xl sm:text-6xl font-extrabold mb-2">Bilderfassung</h1>
          <p className="text-xl text-white/90">L'œil du sport par Aubin Simo</p>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-4xl mx-auto px-4 -mt-10">
        
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-100 flex flex-col md:flex-row gap-10 items-center md:items-start">
          
          {/* Ton portrait */}
          <div className="w-48 h-48 md:w-64 md:h-64 relative rounded-full overflow-hidden border-4 border-blue-900 shadow-lg shrink-0">
            <Image
              src="/images/aubin-simo-bilderfassung.jpg"
              alt="Portrait d'Aubin Simo, photographe sportif"
              fill
              className="object-cover"
            />
          </div>

          {/* Ta biographie */}
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Aubin Simo</h2>
            <p className="text-blue-700 font-semibold mb-6 uppercase tracking-wider text-sm">Photographe Sportif</p>
            
            <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
              <p>
                Derrière l'objectif de <strong>Bilderfassung</strong>, il y a <strong>Aubin Simo</strong>, un passionné de sport et de photographie. 
                Mon but est de capturer l'intensité, l'émotion et la beauté brute des événements sportifs.
              </p>
              <p>
                Du football au basketball en passant par l'athlétisme, je parcours les terrains et les stades pour vous faire revivre 
                les meilleurs moments. Chaque match est une histoire, chaque photo est un souvenir figé.
              </p>
              <p>
                À travers ce site, je partage avec vous ma vision du sport : celle où la sueur, la joie et la détermination se rencontrent.
              </p>
            </div>

            {/* Bouton de contact avec la couleur rouge de la charte */}
            <div className="mt-8">
              <Link 
                href="/contact" 
                className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full transition-colors shadow-md"
              >
                Me contacter
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}