'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

function PortraitCard({ portrait }) {
  const photoCount = portrait.images.length;
  const photoLabel = `${photoCount} photo${photoCount > 1 ? 's' : ''}`;
  const badgeLabel = `${portrait.badge} - ${photoLabel}`;
  const identite = `${portrait.nom} - ${portrait.poste} - ${portrait.competition}`;

  return (
    <Link
      data-portrait-card
      href={`/sportifs-semaine/${portrait.id}`}
      className={`group block h-full w-[86%] shrink-0 snap-center rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400 sm:w-[62%] lg:w-auto ${
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
                ? '(max-width: 640px) 86vw, (max-width: 1024px) 62vw, 58vw'
                : '(max-width: 640px) 86vw, (max-width: 1024px) 62vw, 34vw'
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
          <div className="mb-3">
            <span className="inline-flex max-w-full rounded-full bg-red-600 px-3 py-1 text-[10px] font-bold tracking-[0.14em] text-white">
              {badgeLabel}
            </span>
          </div>

          <h3
            className={`font-extrabold leading-tight text-white ${
              portrait.featured ? 'text-2xl sm:text-3xl' : 'text-lg sm:text-xl'
            }`}
          >
            {portrait.title}
          </h3>
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-red-300 sm:text-xs">
            {identite}
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

export default function SportifsDeLaSemaine({ sportifs = [] }) {
  const carouselRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const featured = sportifs.find((portrait) => portrait.featured);
  const secondary = sportifs.filter((portrait) => !portrait.featured);
  const orderedPortraits = featured ? [featured, ...secondary] : sportifs;

  function handleScroll() {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const cards = Array.from(carousel.querySelectorAll('[data-portrait-card]'));
    if (cards.length === 0) return;

    const carouselRect = carousel.getBoundingClientRect();
    const carouselCenter = carouselRect.left + carouselRect.width / 2;

    let closestIndex = 0;
    let smallestDistance = Number.POSITIVE_INFINITY;

    cards.forEach((card, index) => {
      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.left + cardRect.width / 2;
      const distance = Math.abs(cardCenter - carouselCenter);

      if (distance < smallestDistance) {
        smallestDistance = distance;
        closestIndex = index;
      }
    });

    setActiveIndex(closestIndex);
  }

  function goToPortrait(index) {
    const card = carouselRef.current?.querySelectorAll('[data-portrait-card]')[index];
    card?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    setActiveIndex(index);
  }

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
            <p className="mb-2 whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.18em] text-red-400 sm:text-xs sm:tracking-[0.22em]">
              LE RENDEZ-VOUS HEBDOMADAIRE
            </p>
            <h2
              id="sportifs-semaine-title"
              className="text-2xl font-extrabold leading-tight tracking-tight sm:text-4xl"
            >
              Les sportifs de la semaine
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-blue-100/80">
            Des images fortes et des mots simples pour mettre en lumière celles
            et ceux qui font vivre le sport.
          </p>
        </div>

        <div
          ref={carouselRef}
          onScroll={handleScroll}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-12 lg:overflow-visible lg:pb-0"
          aria-label="Carrousel des sportifs de la semaine"
        >
          {orderedPortraits.map((portrait) => (
            <PortraitCard key={portrait.id} portrait={portrait} />
          ))}
        </div>

        <p className="mt-3 text-center text-xs font-medium text-blue-100/70 lg:hidden">
          ← Fais glisser pour découvrir les suivants
        </p>

        <div
          className="mt-4 flex justify-center gap-3 lg:hidden"
          role="group"
          aria-label="Pagination des sportifs de la semaine"
        >
          {orderedPortraits.map((portrait, index) => (
            <button
              key={portrait.id}
              type="button"
              onClick={() => goToPortrait(index)}
              aria-label={`Voir le portrait ${index + 1} sur ${orderedPortraits.length}`}
              aria-current={index === activeIndex ? 'true' : undefined}
              className="flex h-7 w-7 items-center justify-center rounded-full text-lg leading-none text-white transition hover:text-red-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
            >
              <span aria-hidden="true">{index === activeIndex ? '●' : '○'}</span>
            </button>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/galerie"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-bold text-white transition hover:border-red-400 hover:bg-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
          >
            Voir tous les portraits
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
