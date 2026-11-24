'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PhotoLightbox from './PhotoLightbox';
import { toLightboxSlides } from '@/lib/lightbox';
import { slugify } from '@/lib/supabase/records';
import { DEFAULT_OG_IMAGE } from '@/lib/seo';

function normalizePhoto(photo, fallbackTitle) {
  const value = typeof photo === 'string' ? { src: photo } : photo || {};
  const src = value.src || value.url || value.path || value.image || '';
  if (!src) return null;

  return {
    src,
    alt: value.alt || `${fallbackTitle} — photo`,
    legend: value.legend || value.caption || value.title || fallbackTitle,
    credit: value.credit || 'Aubin Simo',
  };
}

export default function ImagesSportSection({ sports = [] }) {
  const [active, setActive] = useState(null);

  const disciplines = useMemo(
    () =>
      (Array.isArray(sports) ? sports : []).map((sport, index) => {
        const title = sport?.title || sport?.nom || 'Discipline';
        const secondarySource =
          sport?.secondaryImages?.length
            ? sport.secondaryImages
            : sport?.images || [];
        const secondary = secondarySource
          .map((photo) => normalizePhoto(photo, title))
          .filter(Boolean);
        const cover =
          sport?.coverImage ||
          sport?.image ||
          secondary[0]?.src ||
          DEFAULT_OG_IMAGE;
        const gallery = [cover, ...secondary.map((photo) => photo.src)]
          .filter(Boolean)
          .filter((src, position, all) => all.indexOf(src) === position)
          .map((src, position) => {
            const photo = secondary.find((item) => item.src === src);
            return (
              photo || {
                src,
                alt: `${title} — photo ${position + 1}`,
                legend: title,
                credit: 'Aubin Simo',
              }
            );
          });

        return {
          id: sport?.id || sport?.slug || index,
          slug: sport?.slug || slugify(title),
          title,
          description: sport?.description || sport?.resume || '',
          cover,
          alt: sport?.alt || `Photographies de ${title}`,
          gallery,
          secondaryCount: secondary.length,
        };
      }),
    [sports]
  );

  const slides = useMemo(
    () => (active ? toLightboxSlides(active.gallery, active.title) : []),
    [active]
  );

  return (
    <section id="images-sport" className="mb-20">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-red-600">
            Galeries par discipline
          </p>
          <h2 className="text-3xl font-extrabold text-blue-900 md:text-4xl">
            Images Sport
          </h2>
        </div>
        <p className="max-w-md text-sm leading-6 text-gray-600">
          Retrouvez chaque discipline en images : la couverture et toutes les
          photos disponibles dans une galerie plein écran.
        </p>
      </div>

      {disciplines.length === 0 ? (
        <p className="rounded-2xl border border-gray-200 bg-white py-12 text-center text-gray-500">
          Aucune discipline publiée pour le moment.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {disciplines.map((sport) => (
            <article
              key={sport.id}
              className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-500 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-56 overflow-hidden bg-blue-950">
                <Image
                  src={sport.cover}
                  alt={sport.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-950/75 via-transparent to-transparent" />
                <span className="absolute right-4 top-4 rounded-full bg-blue-950/85 px-3 py-1.5 text-[11px] font-bold text-white">
                  {sport.secondaryCount} photo
                  {sport.secondaryCount > 1 ? 's' : ''} secondaire
                  {sport.secondaryCount > 1 ? 's' : ''}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <h3 className="break-words text-xl font-extrabold text-blue-950">
                  {sport.title}
                </h3>
                {sport.description ? (
                  <p className="mt-2 flex-1 text-sm leading-6 text-gray-600">
                    {sport.description}
                  </p>
                ) : null}
                <div className="mt-5 flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setActive(sport)}
                    className="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700"
                  >
                    Voir les images <span aria-hidden="true">→</span>
                  </button>
                  <Link
                    href={`/sports/${sport.slug}`}
                    className="text-sm font-bold text-blue-900 transition hover:text-red-600"
                  >
                    Voir la discipline
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <PhotoLightbox
        open={Boolean(active)}
        index={0}
        close={() => setActive(null)}
        slides={slides}
        title={active?.title || 'Images Sport'}
        href={active ? `/sports/${active.slug}` : undefined}
        hrefLabel="Voir la discipline"
      />
    </section>
  );
}
