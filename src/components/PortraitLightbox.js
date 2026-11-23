'use client';

import { useState } from 'react';
import Image from 'next/image';
import Lightbox from 'yet-another-react-lightbox';
import Counter from 'yet-another-react-lightbox/plugins/counter';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/counter.css';

export default function PortraitLightbox({ images, title }) {
  const [index, setIndex] = useState(-1);
  const slides = images.map((src, position) => ({
    src,
    alt: `${title} — photo ${position + 1}`,
  }));

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((src, position) => (
          <button
            key={src}
            type="button"
            onClick={() => setIndex(position)}
            aria-label={`Ouvrir la photo ${position + 1} sur ${images.length}`}
            className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-blue-900 text-left shadow-lg transition-all duration-500 hover:-translate-y-1 hover:border-red-500/50 hover:shadow-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
          >
            <Image
              src={src}
              alt={`${title} — photo ${position + 1}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
            />
            <span className="absolute bottom-3 right-3 rounded-full bg-blue-950/80 px-3 py-1 text-[11px] font-bold text-white">
              {position + 1} / {images.length}
            </span>
          </button>
        ))}
      </div>

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
      />
    </>
  );
}
