import Image from 'next/image';
import Link from 'next/link';
import { getAllSportifs } from '@/lib/sportifsSemaine';

function PortraitCard({ portrait, index }) {
  return (
    <Link
      href={`/sportifs-semaine/${portrait.id}`}
      className={`group block h-full rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400 ${
        portrait.featured ? 'lg:col-span-7' : ''
      }`}
    >
      <article className="relative h-full overflow-hidden rounded-2xl border border-white/10 bg-blue-900/40 shadow-lg transition-all duration-500 group-hover:-translate-y-1 group-hover:border-red-500/40 group-hover:shadow-2xl">
        <div
          className={`relative overflow-hidden ${
            portrait.featured ? 'aspect-[4/5] sm:aspect-[16/10]' : 'aspect-[5/4]'
          }`}
        >
          <Image
            src={portrait.cover}
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
            <span className="ml-auto rounded-full bg-blue-950/60 px-2.5 py-1 text-[10px] font-bold text-blue-100">
              {portrait.images.length} photo
              {portrait.images.length > 1 ? 's' : ''}
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
            {portrait.eventLabel}
            {portrait.dateLabel ? ` · ${portrait.dateLabel}` : ''}
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

          <span className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-white transition-colors duration-300 group-hover:text-red-300 sm:text-sm">
            {portrait.cta}
            <span
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </span>
        </div>
      </article>
    </Link>
  );
}

export default function SportifsDeLaSemaine() {
  const sportifs = getAllSportifs();
  const featured = sportifs.find((portrait) => portrait.featured);
  const secondary = sportifs.filter((portrait) => !portrait.featured);

  return (
    <section
      id="sportifs-semaine"
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
          {featured && <PortraitCard portrait={featured} index={1} />}
          <div className="grid gap-5 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
            {secondary.map((portrait, position) => (
              <PortraitCard
                key={portrait.id}
                portrait={portrait}
                index={position + 2}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
