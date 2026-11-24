'use client';

import { useMemo, useState } from 'react';
import FilterBar from './FilterBar';
import GalerieGrid from './GalerieGrid';
import PhotoLightbox from './PhotoLightbox';
import { toLightboxSlides } from '@/lib/lightbox';

export default function GalerieExplorer({
  images = [],
  sportOptions = [],
  yearOptions = [],
}) {
  const [sport, setSport] = useState('');
  const [year, setYear] = useState('');
  const [index, setIndex] = useState(-1);

  const filtered = useMemo(
    () =>
      images.filter((image) => {
        if (sport && image.sport !== sport) return false;
        if (year && image.year !== year) return false;
        return true;
      }),
    [images, sport, year]
  );

  const slides = useMemo(
    () =>
      toLightboxSlides(
        filtered,
        'Photographie sportive',
        'Bilderfassung · Aubin Simo'
      ),
    [filtered]
  );

  const current = index >= 0 && index < filtered.length ? filtered[index] : null;

  return (
    <>
      <FilterBar
        sportOptions={sportOptions}
        yearOptions={yearOptions}
        sport={sport}
        year={year}
        onSportChange={(value) => {
          setSport(value);
          setIndex(-1);
        }}
        onYearChange={(value) => {
          setYear(value);
          setIndex(-1);
        }}
      />

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-gray-300">
          Aucune photo ne correspond à ces filtres.
        </p>
      ) : (
        <GalerieGrid images={filtered} pageSize={18} onOpen={setIndex} />
      )}

      <PhotoLightbox
        open={Boolean(current)}
        index={current ? index : 0}
        close={() => setIndex(-1)}
        slides={slides}
        title={current?.title || 'Galerie photo'}
        href={current?.href}
        hrefLabel="Voir le contenu"
      />
    </>
  );
}
