'use client'; // Obligatoire pour l'interactivité

import { useState } from 'react';
import Image from 'next/image';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

export default function Gallery({ images, title }) {
  const [index, setIndex] = useState(-1);

  // On prépare les images pour la Lightbox
  const slides = images.map((img) => ({ src: img }));

  return (
    <div>
      {/* Grille de miniatures */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((img, i) => (
          <div 
            key={i} 
            className="relative h-64 bg-gray-200 rounded-lg overflow-hidden cursor-pointer group"
            onClick={() => setIndex(i)}
          >
            <Image
              src={img}
              alt={`${title} - Photo ${i + 1}`}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
            {/* Effet de survol */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-3xl">🔍</span>
            </div>
          </div>
        ))}
      </div>

      {/* La Lightbox (s'affiche seulement si on clique sur une image) */}
      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={slides}
      />
    </div>
  );
}