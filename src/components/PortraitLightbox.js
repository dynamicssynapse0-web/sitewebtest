'use client';

import { useState } from 'react';
import Image from 'next/image';
import PhotoLightbox from './PhotoLightbox';
import { toLightboxSlides } from '@/lib/lightbox';

function normalizeImage(image, title, index) {
  const value = typeof image === 'string' ? { src: image } : image || {};
  const src = value.src || value.url || value.path || '';

  return {
    src,
    alt: value.alt || `${title} — photo ${index + 1}`,
    legend: value.legend || value.caption || title,
    credit: value.credit || 'Aubin Simo',
  };
}

export default function PortraitLightbox({ images = [], title }) {
  const [index, setIndex] = useState(-1);
  const photos = images.map((image, position) =>
    normalizeImage(image, title, position)
  );
  const slides = toLightboxSlides(photos, title);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((photo, position) => (
          <button
            key={`${photo.src}-${position}`}
            type="button"
            onClick={() => setIndex(position)}
            aria-label={`Ouvrir la photo ${position + 1} sur ${photos.length}`}
            className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-blue-900 text-left shadow-lg transition-all duration-500 hover:-translate-y-1 hover:border-red-500/50 hover:shadow-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
            />
            <span className="absolute bottom-3 right-3 rounded-full bg-blue-950/80 px-3 py-1 text-[11px] font-bold text-white">
              {position + 1} / {photos.length}
            </span>
          </button>
        ))}
      </div>

      <PhotoLightbox
        open={index >= 0}
        index={index >= 0 ? index : 0}
        close={() => setIndex(-1)}
        slides={slides}
        title={title || 'Portrait'}
      />
    </>
  );
}
