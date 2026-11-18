'use client';

import { useRef } from 'react';
import Image from 'next/image';

// Remplace les noms et les fichiers d'image par tes portraits.
const portraitsExclusifs = [
  {
    nom: 'TIMBA',
    image: '/images/aubin-simo-player.jpg',
    alt: 'Portrait exclusif du joueur 1',
  },
  {
    nom: 'MANGUELE',
    image: '/images/aubin-simo-manguele.jpg',
    alt: 'Portrait exclusif du joueur 2',
  },
  {
    nom: 'Nom du joueur 3',
    image: '/images/aubin-simo-photographe-football-RCA-BENIN.jpg.jpg',
    alt: 'Portrait exclusif du joueur 3',
  },
];

export default function ExclusivePortraits() {
  const carouselRef = useRef(null);

  function faireDefiler(direction) {
    const carousel = carouselRef.current;
    const premiereCarte = carousel?.querySelector('[data-portrait-card]');
    if (!carousel || !premiereCarte) return;

    const espace = Number.parseFloat(getComputedStyle(carousel).columnGap) || 0;
    const largeurCarte = premiereCarte.getBoundingClientRect().width;

    carousel.scrollBy({
      left: direction * (largeurCarte + espace),
      behavior: 'smooth',
    });
  }

  return (
    <section className="mb-16 border-t border-gray-200 pt-14">
      <div className="mb-7 flex items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-red-600">
            Regards singuliers
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight text-blue-950 sm:text-4xl">
            Portrait exclusif
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-gray-600">
            Les visages qui donnent toute sa force au sport.
          </p>
        </div>

        <div className="hidden shrink-0 gap-2 sm:flex">
          <button
            type="button"
            onClick={() => faireDefiler(-1)}
            aria-label="Afficher les portraits précédents"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-300 text-xl text-blue-950 transition hover:border-blue-950 hover:bg-blue-950 hover:text-white"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => faireDefiler(1)}
            aria-label="Afficher les portraits suivants"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-300 text-xl text-blue-950 transition hover:border-blue-950 hover:bg-blue-950 hover:text-white"
          >
            ›
          </button>
        </div>
      </div>

      <div
        ref={carouselRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-3"
        aria-label="Carrousel des portraits exclusifs"
      >
        {portraitsExclusifs.map((portrait) => (
          <article
            key={portrait.nom}
            data-portrait-card
            className="w-[82%] shrink-0 snap-start sm:w-[46%] lg:w-[31%] xl:w-[23%]"
          >
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-200">
              <Image
                src={portrait.image}
                alt={portrait.alt}
                fill
                sizes="(max-width: 640px) 82vw, (max-width: 1024px) 46vw, 25vw"
                className="object-cover transition duration-500 hover:scale-105"
              />
            </div>
            <h3 className="mt-4 text-center text-lg font-bold tracking-wide text-blue-950">
              {portrait.nom}
            </h3>
          </article>
        ))}
      </div>
      <p className="mt-2 text-xs text-gray-500 sm:hidden">
        Fais glisser les portraits pour découvrir les suivants.
      </p>
    </section>
  );
}
