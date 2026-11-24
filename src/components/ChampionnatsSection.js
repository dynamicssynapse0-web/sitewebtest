'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import PhotoLightbox from './PhotoLightbox';
import { toLightboxSlides } from '@/lib/lightbox';
import { slugify } from '@/lib/supabase/records';
import { DEFAULT_OG_IMAGE } from '@/lib/seo';

export default function ChampionnatsSection({ groups = [], sports = [] }) {
  const [activeSlug, setActiveSlug] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);

  const tabs = useMemo(() => {
    const map = new Map();

    sports.forEach((sport, order) => {
      const slug = sport?.slug || slugify(sport?.nom || sport?.title);
      if (!slug) return;
      map.set(slug, {
        slug,
        label: sport?.nom || sport?.title || slug,
        icone: sport?.icone || '📸',
        order,
      });
    });

    groups.forEach((group) => {
      const existing = map.get(group.slug);
      map.set(group.slug, {
        slug: group.slug,
        label: existing?.label || group.sport,
        icone: existing?.icone || group.icone || '🏆',
        order: existing?.order ?? sports.length,
      });
    });

    return Array.from(map.values()).sort(
      (a, b) => a.order - b.order || a.label.localeCompare(b.label, 'fr')
    );
  }, [sports, groups]);

  const activeTab = tabs.find((tab) => tab.slug === activeSlug) || tabs[0];

  const cards = useMemo(() => {
    const group = groups.find((item) => item.slug === activeTab?.slug);

    if (group?.championnats?.length) {
      return group.championnats.map((championnat) => ({
        id: championnat.id || championnat.slug,
        title: championnat.title,
        description: championnat.description,
        cover: championnat.coverImage || DEFAULT_OG_IMAGE,
        images: championnat.images?.length
          ? championnat.images
          : [championnat.coverImage || DEFAULT_OG_IMAGE],
      }));
    }

    const sport = sports.find((item) => item.slug === activeTab?.slug);
    if (!sport) return [];

    const cover = sport.coverImage || sport.image || DEFAULT_OG_IMAGE;
    return [
      {
        id: sport.slug,
        title: sport.nom || sport.title,
        description: sport.description,
        cover,
        images: sport.images?.length ? sport.images : [cover],
      },
    ];
  }, [groups, sports, activeTab]);

  const activeCard =
    activeIndex >= 0 && activeIndex < cards.length ? cards[activeIndex] : null;
  const slides = useMemo(
    () =>
      toLightboxSlides(
        activeCard?.images || [],
        activeCard?.title || 'Championnat',
        `Bilderfassung · ${activeTab?.label || 'Sport'}`
      ),
    [activeCard, activeTab]
  );

  return (
    <section id="championnats" className="mb-20">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-red-600">
            Domaines sportifs & championnats
          </p>
          <h2 className="text-3xl font-extrabold text-blue-900 md:text-4xl">
            Explorez chaque sport en images
          </h2>
        </div>
        <p className="max-w-md text-sm leading-6 text-gray-600">
          Choisissez un sport, puis ouvrez la galerie d’un championnat pour voir
          toutes ses photos plein écran.
        </p>
      </div>

      {tabs.length === 0 ? (
        <p className="rounded-2xl border border-gray-200 bg-white py-12 text-center text-gray-500">
          Aucun sport disponible pour le moment.
        </p>
      ) : (
        <>
          <div className="mb-7 flex flex-wrap gap-2" role="tablist" aria-label="Filtrer par sport">
            {tabs.map((tab) => (
              <button
                key={tab.slug}
                type="button"
                role="tab"
                aria-selected={activeTab?.slug === tab.slug}
                onClick={() => {
                  setActiveSlug(tab.slug);
                  setActiveIndex(-1);
                }}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-bold transition ${
                  activeTab?.slug === tab.slug
                    ? 'border-red-600 bg-red-600 text-white shadow-md'
                    : 'border-gray-300 bg-white text-blue-950 hover:border-red-500 hover:text-red-600'
                }`}
              >
                <span aria-hidden="true">{tab.icone}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {cards.length === 0 ? (
            <p className="rounded-2xl border border-gray-200 bg-white py-12 text-center text-gray-500">
              Aucun championnat publié pour ce sport pour le moment.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {cards.map((card, index) => (
                <article
                  key={card.id || `${card.title}-${index}`}
                  className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-500 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative h-56 overflow-hidden bg-blue-950">
                    <Image
                      src={card.cover}
                      alt={`Couverture de ${card.title}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-950/75 via-transparent to-transparent" />
                    <span className="absolute right-4 top-4 rounded-full bg-blue-950/85 px-3 py-1.5 text-[11px] font-bold text-white">
                      {card.images.length} photo{card.images.length > 1 ? 's' : ''}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <h3 className="break-words text-xl font-extrabold text-blue-950">
                      {card.title}
                    </h3>
                    {card.description ? (
                      <p className="mt-2 flex-1 text-sm leading-6 text-gray-600">
                        {card.description}
                      </p>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700"
                    >
                      Voir les images <span aria-hidden="true">→</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}

      <PhotoLightbox
        open={Boolean(activeCard)}
        index={activeCard ? activeIndex : 0}
        close={() => setActiveIndex(-1)}
        slides={slides}
        title={activeCard?.title || 'Championnat'}
      />
    </section>
  );
}
