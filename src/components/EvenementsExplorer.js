'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import FilterBar from './FilterBar';
import { DEFAULT_OG_IMAGE } from '@/lib/seo';

export default function EvenementsExplorer({
  events = [],
  sportOptions = [],
  yearOptions = [],
}) {
  const [sport, setSport] = useState('');
  const [year, setYear] = useState('');

  const filtered = useMemo(
    () =>
      events.filter((event) => {
        if (sport && event.sportKey !== sport) return false;
        if (year && event.year !== year) return false;
        return true;
      }),
    [events, sport, year]
  );

  return (
    <>
      <FilterBar
        sportOptions={sportOptions}
        yearOptions={yearOptions}
        sport={sport}
        year={year}
        onSportChange={setSport}
        onYearChange={setYear}
      />

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-gray-200 bg-white p-10 text-center text-gray-500">
          Aucun événement ne correspond à ces filtres.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((event) => (
            <Link key={event.slug} href={`/evenements/${event.slug}`}>
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:shadow-xl">
                <div className="relative h-56 w-full bg-gray-200">
                  <Image
                    src={event.coverImage || DEFAULT_OG_IMAGE}
                    alt={event.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 rounded-md bg-blue-900 px-3 py-1 text-sm font-bold text-white shadow-md">
                    {event.sport || 'Sport'}
                  </span>
                  <span className="absolute bottom-3 right-3 rounded-full bg-blue-950/85 px-3 py-1 text-[11px] font-bold text-white">
                    {event.photoCount} photo{event.photoCount > 1 ? 's' : ''}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h2 className="mb-2 text-2xl font-bold text-gray-900 transition-colors group-hover:text-blue-900">
                    {event.title}
                  </h2>
                  <p className="mb-4 text-sm text-gray-600">
                    📅 {event.dateLabel} {event.location ? `| 📍 ${event.location}` : ''}
                  </p>
                  <p className="mb-4 flex-1 text-sm text-gray-700 line-clamp-3">
                    {event.content}
                  </p>
                  <span className="mt-auto flex items-center gap-2 text-sm font-semibold text-red-600 transition-all group-hover:gap-3">
                    Voir la galerie complète →
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
