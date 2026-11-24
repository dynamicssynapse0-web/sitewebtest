'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Lightbox from 'yet-another-react-lightbox';
import Counter from 'yet-another-react-lightbox/plugins/counter';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/counter.css';

const PAGE_SIZE = 18;

function normalizeImage(image, fallbackTitle, index) {
  const value = typeof image === 'string' ? { src: image } : image || {};
  const src = value.src || value.url || value.path || '';

  return {
    src,
    alt: value.alt || `${fallbackTitle} — photo ${index + 1}`,
    legend: value.legend || value.caption || value.title || fallbackTitle,
    credit: value.credit || 'Aubin Simo',
  };
}

export default function Gallery({
  images = [],
  title = 'Galerie photos',
  subtitle,
  sport,
  href,
  hrefLabel = 'Voir l’événement',
  variant = 'grid',
}) {
  const [index, setIndex] = useState(-1);

  const photos = useMemo(
    () => images.map((image, position) => normalizeImage(image, title, position)),
    [images, title]
  );

  const [pagination, setPagination] = useState({
    source: photos,
    count: PAGE_SIZE,
  });

  // Ajustement pendant le render (pattern React recommandé) plutôt que dans un effet.
  if (pagination.source !== photos) {
    setPagination({ source: photos, count: PAGE_SIZE });
  }

  const visiblePhotos = photos.slice(0, pagination.count);
  const remainingPhotos = photos.length - visiblePhotos.length;

  const slides = useMemo(
    () =>
      photos.map((photo) => ({
        src: photo.src,
        alt: photo.alt,
        title: photo.legend,
        description: `${photo.credit}${sport ? ` · ${sport}` : ''}`,
      })),
    [photos, sport]
  );

  const isMasonry = variant === 'masonry';

  return (
    <>
      {(subtitle || photos.length > 0) && (
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
          <p className="text-sm text-gray-400">
            {photos.length} photo{photos.length > 1 ? 's' : ''}
          </p>
        </div>
      )}

      {photos.length === 0 ? (
        <p className="rounded-xl border border-white/10 bg-white/5 p-6 text-center text-gray-300">
          Aucune photo disponible pour le moment.
        </p>
      ) : (
        <div
          className={
            isMasonry
              ? 'columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4'
              : 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'
          }
        >
          {visiblePhotos.map((photo, position) => (
            <button
              key={`${photo.src}-${position}`}
              type="button"
              onClick={() => setIndex(position)}
              aria-label={`Ouvrir la photo ${position + 1} sur ${photos.length} : ${photo.legend}`}
              className={`group relative block aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-900 text-left shadow-lg transition-all duration-500 hover:-translate-y-1 hover:border-red-500/50 hover:shadow-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400 ${
                isMasonry ? 'break-inside-avoid' : ''
              }`}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                priority={position < 3}
                sizes={
                  isMasonry
                    ? '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                    : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                }
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-950/90 via-blue-950/10 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
              <span className="absolute bottom-3 left-3 right-3 translate-y-1 text-left opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                <span className="block text-sm font-bold text-white drop-shadow">
                  {photo.legend}
                </span>
                <span className="mt-1 block text-[11px] font-medium text-blue-100/90">
                  {photo.credit}
                  {sport ? ` · ${sport}` : ''}
                </span>
              </span>
              <span className="absolute right-3 top-3 rounded-full bg-blue-950/80 px-2.5 py-1 text-[11px] font-bold text-white">
                {position + 1} / {photos.length}
              </span>
            </button>
          ))}
        </div>
      )}

      {remainingPhotos > 0 ? (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() =>
              setPagination((previous) => ({
                ...previous,
                count: previous.count + PAGE_SIZE,
              }))
            }
            className="rounded-full bg-red-600 px-7 py-4 text-sm font-bold text-white shadow-lg transition hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400 sm:text-base"
          >
            Charger plus de photos ({remainingPhotos})
          </button>
        </div>
      ) : null}

      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={slides}
        plugins={[Counter]}
        labels={{
          Previous: 'Précédent',
          Next: 'Suivant',
          Close: 'Fermer',
          Lightbox: `Galerie photo : ${title}`,
        }}
        counter={{
          container: {
            style: {
              top: 20,
              right: 20,
              borderRadius: 999,
              padding: '8px 14px',
              background: 'rgba(4, 20, 50, 0.85)',
              fontSize: 13,
              fontWeight: 700,
            },
          },
        }}
        render={{
          buttonPrev: photos.length > 1 ? undefined : () => null,
          buttonNext: photos.length > 1 ? undefined : () => null,
        }}
      />

      {href && index >= 0 && photos[index] && (
        <Link
          href={href}
          onClick={() => setIndex(-1)}
          className="fixed bottom-5 left-1/2 z-[10001] -translate-x-1/2 rounded-full border border-white/20 bg-blue-950/90 px-5 py-2.5 text-sm font-semibold text-white shadow-xl transition hover:bg-red-600"
        >
          {hrefLabel} <span aria-hidden="true">→</span>
        </Link>
      )}
    </>
  );
}
