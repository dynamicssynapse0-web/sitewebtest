'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function GalerieGrid({ images = [], pageSize = 18 }) {
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
      <p
        aria-live="polite"
        className="mb-5 text-sm text-gray-400"
      >
        {visibleImages.length} photo{visibleImages.length > 1 ? 's' : ''} affichée
        {visibleImages.length > 1 ? 's' : ''} sur {images.length}
      </p>

      <div className="columns-1 gap-4 sm:columns-2 md:columns-3 [&>*]:mb-4">
        {visibleImages.map((image, index) => (
          <div
            key={`${image.src}-${index}`}
            className="relative group overflow-hidden break-inside-avoid rounded-lg"
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

            <div className="absolute inset-0 flex items-end bg-black/60 opacity-0 transition duration-300 group-hover:opacity-100">
              <div className="p-6">
                <p className="mb-1 text-sm font-bold uppercase tracking-wider text-yellow-500">
                  {image.category || 'Photographie'}
                </p>
                <p className="text-lg font-bold text-white">{image.title}</p>
                <Link
                  href={image.href || '/'}
                  className="mt-2 block text-sm text-gray-300 underline"
                >
                  Voir le contenu →
                </Link>
              </div>
            </div>
          </div>
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
