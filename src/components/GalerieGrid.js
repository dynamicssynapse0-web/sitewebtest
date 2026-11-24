'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function GalerieGrid({ images = [], pageSize = 18, onOpen }) {
  const [pagination, setPagination] = useState({
    source: images,
    pageSize,
    count: pageSize,
  });

  // Ajustement pendant le render (pattern React recommandé) plutôt que dans un effet.
  if (pagination.source !== images || pagination.pageSize !== pageSize) {
    setPagination({ source: images, pageSize, count: pageSize });
  }

  const visibleCount = Math.min(pagination.count, images.length);
  const visibleImages = images.slice(0, visibleCount);
  const remaining = images.length - visibleImages.length;

  return (
    <>
      <p aria-live="polite" className="mb-5 text-sm text-gray-400">
        {visibleImages.length} photo{visibleImages.length > 1 ? 's' : ''} affichée
        {visibleImages.length > 1 ? 's' : ''} sur {images.length}
      </p>

      <div className="columns-1 gap-4 sm:columns-2 md:columns-3 [&>*]:mb-4">
        {visibleImages.map((image, index) => (
          <button
            key={`${image.src}-${index}`}
            type="button"
            onClick={() => onOpen?.(index)}
            aria-label={`Ouvrir la photo ${index + 1} sur ${images.length} : ${image.title || image.legend || 'Photographie'}`}
            className="group relative block w-full overflow-hidden break-inside-avoid rounded-lg text-left shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
          >
            <Image
              src={image.src}
              alt={image.alt || `Photographie de ${image.title}`}
              width={800}
              height={600}
              priority={index < 3}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="w-full h-auto object-cover transition duration-500 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent opacity-95 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
              <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-yellow-400">
                {image.category || 'Photographie'}
                {image.sport ? ` · ${image.sport}` : ''}
              </p>
              <p className="line-clamp-2 text-base font-bold text-white sm:text-lg">
                {image.title || image.legend || 'Photographie sportive'}
              </p>
              <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-gray-200">
                Ouvrir la photo <span aria-hidden="true">↗</span>
              </span>
            </div>

            <span className="absolute right-3 top-3 rounded-full bg-blue-950/85 px-2.5 py-1 text-[11px] font-bold text-white">
              {index + 1} / {images.length}
            </span>
          </button>
        ))}
      </div>

      {remaining > 0 ? (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() =>
              setPagination((previous) => ({
                ...previous,
                count: previous.count + pageSize,
              }))
            }
            className="rounded-full bg-red-600 px-7 py-4 text-sm font-bold text-white shadow-lg transition hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400 sm:text-base"
          >
            Charger plus de photos ({remaining})
          </button>
        </div>
      ) : null}
    </>
  );
}
