import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import EventCard from '@/components/EventCard';
import ExclusivePortraits from '@/components/ExclusivePortraits';
import { getAllEvents } from '@/lib/events';
import { getAllInternationalCompetitions, formatCompetitionDate } from '@/lib/internationalCompetitions';
import { DEFAULT_OG_IMAGE } from '@/lib/seo';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const evenements = getAllEvents();
  const competitionsInternationales = getAllInternationalCompetitions();
  const sportifsDeLaSemaine = [
    {
      photo: '/images/aubin-simo-photographe-football-CAN2027.jpg',
      alt: 'Sportif en action pendant un match de football',
      sport: 'Football',
      commentaire: 'Détermination, concentration et passion jusqu’au coup de sifflet final.',
    },
    {
      photo: '/images/aubin-basketball-fiba.jpg',
      alt: 'Action de basketball en match',
      sport: 'Basketball',
      commentaire: 'Un bel exemple d’énergie et d’engagement sur le terrain.',
    },
    {
      photo: '/images/AUBINSIMO-MTN.jpg',
      alt: 'Joueur pendant une rencontre de football',
      sport: 'Football',
      commentaire: 'Le talent se révèle aussi dans les efforts et le travail d’équipe.',
    },
  ];

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

        {/* COMPÉTITIONS INTERNATIONALES */}
        {competitionsInternationales.length > 0 && (
          <section id="competitions-internationales" className="mb-20 overflow-hidden rounded-3xl bg-blue-950 p-6 text-white shadow-xl sm:p-8 lg:p-10">
            <div className="mb-8 flex flex-col gap-4 border-b border-white/15 pb-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-red-400">
                  Sur la scène internationale
                </p>
                <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                  Compétitions internationales
                </h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-blue-100/75">
                Retrouvez les grands rendez-vous et les images qui racontent chaque rencontre.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {competitionsInternationales.map((competition) => (
                <article
                  key={competition.slug}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-white text-gray-900"
                >
                  <div className="relative h-56 sm:h-64">
                    <Image
                      src={competition.coverImage || DEFAULT_OG_IMAGE}
                      alt={`Photo principale : ${competition.title}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition duration-500 hover:scale-[1.03]"
                    />
                    <span className="absolute left-4 top-4 rounded-full bg-blue-950/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white">
                      {competition.competition || competition.sport || 'Compétition'}
                    </span>
                  </div>
                  <div className="p-5 sm:p-6">
                    <h3 className="mb-2 text-xl font-bold text-blue-950">
                      {competition.title}
                    </h3>
                    <p className="mb-4 text-sm text-gray-500">
                      {competition.location} · {formatCompetitionDate(competition.date)}
                    </p>
                    <p className="mb-6 text-sm leading-6 text-gray-600">
                      {competition.content}
                    </p>
                    <Link
                      href={`/competitions-internationales/${competition.slug}`}
                      className="inline-flex items-center gap-2 font-bold text-blue-900 transition hover:text-red-600"
                    >
                      Voir les images <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

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
      { src: '/images/aubin-basketball-fiba.jpg', alt: 'Action de basketball pendant un match' },
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

        {/* SPORTIFS DE LA SEMAINE */}
        <section className="mb-20 rounded-3xl bg-blue-950 p-6 text-white shadow-xl sm:p-8 lg:p-10">
          <div className="mb-8 flex flex-col gap-5 border-b border-white/15 pb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-red-400">
                Le rendez-vous hebdomadaire
              </p>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Les sportifs de la semaine
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-blue-100/75">
              Des images fortes et des mots simples pour mettre en lumière celles et ceux qui font vivre le sport.
            </p>
          </div>

          {sportifsDeLaSemaine.length > 0 && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              {sportifsDeLaSemaine.slice(0, 1).map((sportif) => (
                <article
                  key={sportif.photo}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-white lg:col-span-7"
                >
                  <div className="relative h-72 sm:h-[420px]">
                    <Image
                      src={sportif.photo}
                      alt={sportif.alt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 58vw"
                      className="object-cover transition duration-500 hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
                    <span className="absolute left-5 top-5 rounded-full bg-red-600 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white">
                      À la une
                    </span>
                  </div>
                  <div className="p-5 text-gray-900 sm:p-7">
                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-red-600">
                      {sportif.sport}
                    </p>
                    <p className="text-lg font-medium leading-relaxed sm:text-xl">
                      {sportif.commentaire}
                    </p>
                  </div>
                </article>
              ))}

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
                {sportifsDeLaSemaine.slice(1, 3).map((sportif) => (
                  <article
                    key={sportif.photo}
                    className="overflow-hidden rounded-2xl border border-white/10 bg-white"
                  >
                    <div className="relative h-52 sm:h-60 lg:h-48">
                      <Image
                        src={sportif.photo}
                        alt={sportif.alt}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 38vw"
                        className="object-cover transition duration-500 hover:scale-[1.02]"
                      />
                    </div>
                    <div className="p-5 text-gray-900">
                      <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-red-600">
                        {sportif.sport}
                      </p>
                      <p className="leading-relaxed text-gray-700">
                        {sportif.commentaire}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* 3. SECTION : POURQUOI ME CHOISIR ? */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-blue-900 mb-4">Pourquoi travailler avec Bilderfassung ?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Je ne fais pas que prendre des photos, je capture l&apos;émotion et l&apos;intensité de l&apos;instant pour que chaque souvenir soit inoubliable.</p>
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
              <p className="text-gray-600 text-sm">Je suis au plus près de l&apos;action pour ne jamais rater le moment décisif, avec une livraison rapide.</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-50 text-blue-900 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl shadow-sm">🤝</div>
              <h3 className="font-bold text-lg mb-2">Sur Mesure</h3>
              <p className="text-gray-600 text-sm">Chaque événement est unique. Je m&apos;adapte à vos besoins pour vous fournir exactement ce que vous cherchez.</p>
            </div>
          </div>
        </div>

        {/* 4. APPEL À L'ACTION FINAL */}
        <div className="bg-gradient-to-r from-blue-900 to-red-700 rounded-3xl p-10 md:p-16 text-center text-white shadow-xl">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6">Vous organisez un événement sportif ?</h2>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Ne laissez pas les meilleurs moments s&apos;échapper. Engagez un photographe passionné pour immortaliser votre événement.
          </p>
          <Link 
            href="/contact" 
            className="bg-white text-blue-900 hover:bg-gray-100 font-bold py-4 px-10 rounded-full transition-colors shadow-lg text-lg inline-block"
          >
            Discutons de votre projet →
          </Link>
        </div>

        <ExclusivePortraits />

      </div>
    </main>
  );
}
