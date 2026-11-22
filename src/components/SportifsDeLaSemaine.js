import Image from 'next/image';
import Link from 'next/link';
import { getAllEvents, formatEventDate } from '@/lib/events';

const portraits = [
  {
    id: 'lions',
    title: 'Les Lions en action',
    discipline: 'Football',
    quote:
      'Détermination, concentration et passion jusqu’au coup de sifflet final.',
    image: '/images/aubin-simo-photographe-football-CAN2027.jpg',
    alt: 'Footballeur camerounais en action lors d’une rencontre internationale',
    eventSlug: 'cameroun-benin',
    fallbackLabel: 'Qualifications CAN 2027',
    href: '/evenements/cameroun-benin',
    cta: 'Voir le reportage',
    featured: true,
  },
  {
    id: 'parquet',
    title: 'L’énergie du parquet',
    discipline: 'Basketball',
    quote: 'Un bel exemple d’énergie et d’engagement sur le terrain.',
    image: '/images/aubin-basketball-fiba.jpg',
    alt: 'Joueur de basketball en action pendant un match FIBA',
    eventLabel: 'Basketball FIBA',
    dateLabel: 'Galerie photos',
    href: '/galerie',
    cta: 'Voir la galerie',
  },
  {
    id: 'mtn',
    title: 'Le talent en mouvement',
    discipline: 'Football',
    quote: 'Le talent se révèle aussi dans les efforts et le travail d’équipe.',
    image: '/images/AUBINSIMO-MTN.jpg',
    alt: 'Joueur de football en action pendant une rencontre MTN Elite One',
    eventSlug: 'mtn-elite-one',
    fallbackLabel: 'MTN Elite One',
    href: '/evenements/mtn-elite-one',
    cta: 'Voir l’événement',
  },
];

function PortraitCard({ portrait, index, event }) {
  const eventLabel = event?.title ?? portrait.eventLabel ?? portrait.fallbackLabel;
  const dateLabel = event
    ? formatEventDate(event.date, event.season)
    : portrait.dateLabel;

  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-blue-900/40 shadow-lg transition-all duration-500 hover:-translate-y-1 hover:border-red-500/40 hover:shadow-2xl ${portrait.featured ? 'lg:col-span-7' : ''}`}
    >
      <div
        className={`relative overflow-hidden ${
          portrait.featured ? 'aspect-[4/5] sm:aspect-[16/10]' : 'aspect-[5/4]'
        }`}
      >
        <Image
          src={portrait.image}
          alt={portrait.alt}
          fill
          sizes={
            portrait.featured
              ? '(max-width: 1024px) 100vw, 58vw'
              : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 34vw'
          }
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-blue-950/55 to-blue-950/5 transition-opacity duration-500 group-hover:opacity-80" />
      </div>

      <div
        className={`absolute inset-x-0 bottom-0 ${
          portrait.featured ? 'p-5 sm:p-8' : 'p-4 sm:p-5'
        }`}
      >
        <div className="mb-2 flex flex-wrap items-center gap-2">
          {portrait.featured ? (
            <span className="rounded-full bg-red-600 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white">
              À la une
            </span>
          ) : (
            <span className="rounded-full border border-white/25 bg-blue-950/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-100">
              0{index}
            </span>
          )}
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-red-300">
            {portrait.discipline}
          </span>
        </div>

        <h3
          className={`font-extrabold leading-tight text-white ${
            portrait.featured ? 'text-2xl sm:text-3xl' : 'text-lg sm:text-xl'
          }`}
        >
          {portrait.title}
        </h3>
        <p className="mt-1 text-[11px] font-medium text-blue-100/80 sm:text-xs">
          {eventLabel}
          {dateLabel ? ` · ${dateLabel}` : ''}
        </p>
        <blockquote
          className={`mt-3 border-l-2 border-red-500 pl-3 text-white/90 ${
            portrait.featured
              ? 'text-sm leading-relaxed sm:text-base'
              : 'line-clamp-3 text-xs leading-relaxed'
          }`}
        >
          “{portrait.quote}”
        </blockquote>

        <Link
          href={portrait.href}
          className="mt-4 inline-flex items-center gap-2 rounded-sm text-xs font-bold text-white transition-colors hover:text-red-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-400 sm:text-sm"
        >
          {portrait.cta}
          <span
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
      </div>
    </article>
  );
}

export default function SportifsDeLaSemaine() {
  const events = getAllEvents();
  const findEvent = (portrait) =>
    portrait.eventSlug
      ? events.find((item) => item.slug === portrait.eventSlug)
      : null;
  const featured = portraits.find((portrait) => portrait.featured);
  const secondary = portraits.filter((portrait) => !portrait.featured);

  return (
    <section
      aria-labelledby="sportifs-semaine-title"
      className="relative mb-20 overflow-hidden rounded-3xl bg-blue-950 p-5 text-white shadow-2xl sm:p-8 lg:p-10"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-red-600/10 blur-3xl"
      />
      <div className="relative">
        <div className="mb-8 flex flex-col gap-5 border-b border-white/10 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-red-400">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-red-500"
              />
              Le rendez-vous hebdomadaire
            </p>
            <h2
              id="sportifs-semaine-title"
              className="text-3xl font-extrabold tracking-tight sm:text-4xl"
            >
              Les sportifs de la semaine
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-blue-100/80">
            Des images fortes et des mots simples pour mettre en lumière celles
            et ceux qui font vivre le sport.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-12">
          <PortraitCard
            portrait={featured}
            index={1}
            event={findEvent(featured)}
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
            {secondary.map((portrait, position) => (
              <PortraitCard
                key={portrait.id}
                portrait={portrait}
                index={position + 2}
                event={findEvent(portrait)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
