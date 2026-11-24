'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

const SLIDE_DURATION = 10000;

function MomentFortCard({ item }) {
  const slides = (Array.isArray(item.images) ? item.images : [])
    .map((image) => (typeof image === 'string' ? { src: image } : image))
    .filter((image) => image?.src);
  const displaySlides =
    slides.length > 0
      ? slides
      : item.image
        ? [{ src: item.image, alt: item.alt, legend: item.legend }]
        : [];
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (displaySlides.length < 2) return undefined;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % displaySlides.length);
    }, SLIDE_DURATION);

    return () => window.clearInterval(timer);
  }, [displaySlides.length]);

  if (displaySlides.length === 0) return null;

  const active = activeIndex < displaySlides.length ? activeIndex : 0;
  const caption = item.title || item.legend || displaySlides[active]?.legend || '';
  const hasCounter = displaySlides.length > 1;

  return (
    <article className="group relative h-72 overflow-hidden rounded-2xl shadow-lg">
      {displaySlides.map((image, index) => (
        <Image
          key={`${image.src}-${index}`}
          src={image.src}
          alt={index === active ? image.alt || item.alt || caption : ''}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={`object-cover transition duration-700 ease-in-out group-hover:scale-105 ${
            index === active ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden={index !== active}
        />
      ))}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-blue-950/60 via-transparent to-transparent" />
      {caption ? (
        <p
          className={`pointer-events-none absolute bottom-4 z-10 break-words text-sm font-bold text-white ${
            hasCounter ? 'left-4 right-16' : 'left-4 right-4'
          }`}
        >
          {caption}
        </p>
      ) : null}
      {hasCounter ? (
        <span
          className="pointer-events-none absolute bottom-4 right-4 z-10 rounded-full bg-blue-950/75 px-2.5 py-1 text-[10px] font-bold tracking-wide text-white"
          aria-live="polite"
        >
          {active + 1}/{displaySlides.length}
        </span>
      ) : null}
    </article>
  );
}

export default function MomentFortSection({ items = [] }) {
  return (
    <section id="moments-forts" className="mb-20">
      <div className="mb-8 text-center">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-red-600">
          AU COEUR DE L&apos;ACTION
        </p>
        <h2 className="mb-3 text-3xl font-extrabold text-blue-900 md:text-4xl">
          Les moments forts
        </h2>
        <p className="mx-auto max-w-2xl text-gray-600">
          De l’intensité du jeu à la joie de la victoire, chaque image raconte une histoire.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.length === 0 ? (
          <p className="col-span-full rounded-xl border border-gray-200 bg-white py-12 text-center text-gray-500">
            Aucun moment fort publié pour le moment.
          </p>
        ) : (
          items.map((item) => (
            <MomentFortCard key={item.id || item.title || item.image} item={item} />
          ))
        )}
      </div>
    </section>
  );
}
