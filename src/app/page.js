import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import EventCard from '@/components/EventCard';
import { getAllEvents } from '@/lib/events';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const evenements = getAllEvents();

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <Hero />
      
      <div id="evenements" className="max-w-7xl mx-auto px-4 py-16">
        
        {/* 1. SECTION : CHIFFRES CLÉS (Pour rassurer) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20 text-center">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-4xl font-extrabold text-blue-900 mb-1">50+</p>
            <p className="text-gray-600 text-sm font-medium">Événements couverts</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-4xl font-extrabold text-red-600 mb-1">10K+</p>
            <p className="text-gray-600 text-sm font-medium">Photos capturées</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-4xl font-extrabold text-blue-900 mb-1">5</p>
            <p className="text-gray-600 text-sm font-medium">Sports différents</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-4xl font-extrabold text-red-600 mb-1">100%</p>
            <p className="text-gray-600 text-sm font-medium">Passion & Qualité</p>
          </div>
        </div>

        {/* 2. SECTION : DERNIERS ÉVÉNEMENTS */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-blue-900 flex items-center gap-2 mb-2">
              📅 Derniers événements
            </h2>
            <p className="text-gray-600">Découvrez mes dernières couvertures photographiques.</p>
          </div>
          
          <Link 
            href="/evenements" 
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-md"
          >
            Voir tous les événements →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {evenements.length === 0 ? (
            <div className="col-span-3 text-center py-12 bg-white rounded-xl border border-gray-200">
              <p className="text-gray-500 text-lg">Aucun événement publié pour le moment.</p>
            </div>
          ) : (
            evenements.slice(0, 3).map((event) => ( // On n'affiche que les 3 premiers sur l'accueil
              <EventCard key={event.slug} event={event} />
            ))
          )}
        </div>
        {/* Galerie : moments forts */}
<section className="mb-20">
  <div className="text-center mb-8">
    <p className="text-red-600 font-semibold uppercase tracking-widest text-sm mb-2">
      Au cœur de l’action
    </p>
    <h2 className="text-3xl md:text-4xl font-extrabold text-blue-900 mb-3">
      Les moments forts
    </h2>
    <p className="text-gray-600 max-w-2xl mx-auto">
      De l’intensité du jeu à la joie de la victoire, chaque image raconte une histoire.
    </p>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
    {[
      { src: '/images/aubin-simo-acceuil.jpg', alt: 'Joueur en pleine action' },
      { src: '/images/aubin-simo-getimages.jpg', alt: 'Moment fort d’un événement sportif' },
      { src: '/images/photo-sport-3.jpg', alt: 'Célébration après un match' },
    ].map((photo) => (
      <div
        key={photo.src}
        className="relative h-72 overflow-hidden rounded-2xl shadow-lg group"
      >
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-950/60 via-transparent to-transparent" />
      </div>
    ))}
  </div>
</section>

        {/* 3. SECTION : POURQUOI ME CHOISIR ? */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-blue-900 mb-4">Pourquoi travailler avec Bilderfassung ?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Je ne fais pas que prendre des photos, je capture l'émotion et l'intensité de l'instant pour que chaque souvenir soit inoubliable.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-50 text-blue-900 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl shadow-sm">📸</div>
              <h3 className="font-bold text-lg mb-2">Qualité Professionnelle</h3>
              <p className="text-gray-600 text-sm">Des images haute définition capturées avec un équipement de pointe pour un rendu exceptionnel.</p>
            </div>
            <div className="text-center">
              <div className="bg-red-50 text-red-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl shadow-sm">⚡</div>
              <h3 className="font-bold text-lg mb-2">Réactivité & Passion</h3>
              <p className="text-gray-600 text-sm">Je suis au plus près de l'action pour ne jamais rater le moment décisif, avec une livraison rapide.</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-50 text-blue-900 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl shadow-sm">🤝</div>
              <h3 className="font-bold text-lg mb-2">Sur Mesure</h3>
              <p className="text-gray-600 text-sm">Chaque événement est unique. Je m'adapte à vos besoins pour vous fournir exactement ce que vous cherchez.</p>
            </div>
          </div>
        </div>

        {/* 4. APPEL À L'ACTION FINAL */}
        <div className="bg-gradient-to-r from-blue-900 to-red-700 rounded-3xl p-10 md:p-16 text-center text-white shadow-xl">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6">Vous organisez un événement sportif ?</h2>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Ne laissez pas les meilleurs moments s'échapper. Engagez un photographe passionné pour immortaliser votre événement.
          </p>
          <Link 
            href="/contact" 
            className="bg-white text-blue-900 hover:bg-gray-100 font-bold py-4 px-10 rounded-full transition-colors shadow-lg text-lg inline-block"
          >
            Discutons de votre projet →
          </Link>
        </div>

      </div>
    </main>
  );
}