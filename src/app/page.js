import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import EventCard from '@/components/EventCard';
import ChampionnatsSection from '@/components/ChampionnatsSection';
import { getAllEvents } from '@/lib/events';
import { getAllSports } from '@/lib/sports';
import { getAllChampionnats, groupChampionnatsBySport } from '@/lib/championnats';
import { getAllInternationalCompetitions, formatCompetitionDate } from '@/lib/internationalCompetitions';
import { getAllSportifs } from '@/lib/sportifsSemaine';
import { DEFAULT_OG_IMAGE } from '@/lib/seo';
import { whatsappUrl } from '@/lib/whatsapp';
import Link from 'next/link';
import Image from 'next/image';

export const revalidate = 60;

export default async function Home() {
  const [evenements, competitionsInternationales, sportifs, sports, championnats] =
    await Promise.all([
      getAllEvents(),
      getAllInternationalCompetitions(),
      getAllSportifs(),
      getAllSports(),
      getAllChampionnats(),
    ]);

  const groupedChampionnats = groupChampionnatsBySport(championnats);
  const portrait = sportifs[0];

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <Hero />

      {/* 1. HERO — voir composant Hero */}

      {/* 2. DOMAINES SPORTIFS & CHAMPIONNATS */}
      <section id="domaines" className="mx-auto max-w-7xl px-4 py-16">
        <ChampionnatsSection groups={groupedChampionnats} sports={sports} />

        {competitionsInternationales.length > 0 ? (
          <div className="rounded-3xl bg-blue-950 p-6 text-white shadow-xl sm:p-8">
            <div className="mb-6 flex flex-col gap-3 border-b border-white/15 pb-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-red-400">
                  Sur la scène internationale
                </p>
                <h2 className="text-2xl font-extrabold sm:text-3xl">
                  Compétitions internationales
                </h2>
              </div>
              <Link
                href="/competitions-internationales"
                className="text-sm font-bold text-white/80 transition hover:text-red-300"
              >
                Toutes les compétitions →
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {competitionsInternationales.slice(0, 3).map((competition) => (
                <Link
                  key={competition.slug}
                  href={`/competitions-internationales/${competition.slug}`}
                  className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-3 transition hover:border-red-400/60 hover:bg-white/10"
                >
                  <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-blue-900">
                    <Image
                      src={competition.coverImage || DEFAULT_OG_IMAGE}
                      alt={`Photo principale : ${competition.title}`}
                      fill
                      sizes="96px"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="line-clamp-2 text-sm font-bold text-white">
                      {competition.title}
                    </h3>
                    <p className="mt-1 text-[11px] text-blue-100/70">
                      {competition.location} · {formatCompetitionDate(competition.date)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      {/* 3. APERÇU — 3 derniers événements */}
      <section className="mx-auto max-w-7xl px-4 pb-16">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-red-600">
              Dernières couvertures
            </p>
            <h2 className="text-3xl font-extrabold text-blue-900">
              📅 Derniers événements
            </h2>
            <p className="mt-2 text-gray-600">
              Découvrez mes trois dernières couvertures photographiques.
            </p>
          </div>
          <Link
            href="/evenements"
            className="w-fit rounded-lg bg-red-600 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-red-700"
          >
            Voir tous les événements →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {evenements.length === 0 ? (
            <p className="col-span-full rounded-xl border border-gray-200 bg-white py-12 text-center text-gray-500">
              Aucun événement publié pour le moment.
            </p>
          ) : (
            evenements.slice(0, 3).map((event) => (
              <EventCard key={event.slug} event={event} />
            ))
          )}
        </div>
      </section>

      {/* 4. CHIFFRES CLÉS & POURQUOI BILDERFASSUNG */}
      <section className="mx-auto max-w-7xl px-4 pb-16">
        <div className="mb-8 grid grid-cols-2 gap-4 text-center md:grid-cols-4 md:gap-6">
          {[
            ['50+', 'Événements couverts', 'text-blue-900'],
            ['10K+', 'Photos capturées', 'text-red-600'],
            ['5', 'Sports différents', 'text-blue-900'],
            ['100%', 'Passion & Qualité', 'text-red-600'],
          ].map(([value, label, color]) => (
            <div
              key={label}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6"
            >
              <p className={`mb-1 text-3xl font-extrabold sm:text-4xl ${color}`}>
                {value}
              </p>
              <p className="text-xs font-medium text-gray-600 sm:text-sm">{label}</p>
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm sm:p-10 md:p-12">
          <div className="mb-10 text-center">
            <h2 className="mb-4 text-3xl font-extrabold text-blue-900">
              Pourquoi travailler avec Bilderfassung ?
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              Je capture l&apos;émotion et l&apos;intensité de l&apos;instant pour que chaque
              souvenir soit inoubliable.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              ['📸', 'Qualité Professionnelle', 'Des images haute définition capturées avec un équipement de pointe pour un rendu exceptionnel.'],
              ['⚡', 'Réactivité & Passion', 'Je suis au plus près de l’action pour ne jamais rater le moment décisif, avec une livraison rapide.'],
              ['🤝', 'Sur Mesure', 'Chaque événement est unique. Je m’adapte à vos besoins pour vous fournir exactement ce que vous cherchez.'],
            ].map(([icon, title, text]) => (
              <div key={title} className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-2xl shadow-sm">
                  <span aria-hidden="true">{icon}</span>
                </div>
                <h3 className="mb-2 text-lg font-bold">{title}</h3>
                <p className="text-sm text-gray-600">{text}</p>
              </div>
            ))}
          </div>

          {portrait ? (
            <div className="mt-10 grid items-center gap-5 rounded-2xl bg-blue-950 p-5 text-white sm:grid-cols-[180px_1fr] sm:p-6">
              <div className="relative h-40 overflow-hidden rounded-xl bg-blue-900 sm:h-44">
                <Image
                  src={portrait.cover || DEFAULT_OG_IMAGE}
                  alt={portrait.alt || `Portrait de ${portrait.title}`}
                  fill
                  sizes="(max-width: 640px) 100vw, 180px"
                  className="object-cover"
                />
              </div>
              <div>
                <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-red-400">
                  Sportif de la semaine
                </p>
                <h3 className="text-xl font-extrabold sm:text-2xl">{portrait.title}</h3>
                <p className="mt-1 text-sm text-blue-100/80">
                  {[portrait.nom, portrait.poste, portrait.competition]
                    .filter(Boolean)
                    .join(' — ')}
                </p>
                <Link
                  href={`/sportifs-semaine/${portrait.id}`}
                  className="mt-4 inline-flex rounded-full bg-red-600 px-5 py-2.5 text-sm font-bold transition hover:bg-red-700"
                >
                  Voir le portrait →
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* 5. CONTACT / RÉSERVATION */}
      <section className="mx-auto max-w-7xl px-4 pb-20">
        <div className="rounded-3xl bg-gradient-to-r from-blue-900 to-red-700 p-8 text-center text-white shadow-xl sm:p-10 md:p-16">
          <h2 className="mb-6 text-3xl font-extrabold md:text-5xl">
            Vous organisez un événement sportif ?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg md:text-xl">
            Ne laissez pas vos meilleurs moments s&apos;échapper. Engagez un photographe
            passionné pour immortaliser votre événement. Réservez dès maintenant pour la
            CAN 2027.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap">
            <Link
              href="/contact"
              className="w-full max-w-xs rounded-full bg-white px-6 py-4 text-center text-base font-bold text-blue-900 shadow-lg transition hover:bg-gray-100 sm:w-auto sm:px-10 sm:text-lg"
            >
              Discutons de votre projet →
            </Link>
            <a
              href={whatsappUrl(
                'Bonjour Aubin, je souhaite réserver une prestation photo pour la CAN 2027.'
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full max-w-xs rounded-full bg-green-600 px-6 py-4 text-center text-base font-bold text-white shadow-lg transition hover:bg-green-700 sm:w-auto sm:px-10 sm:text-lg"
            >
              Réserver pour CAN 2027
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
