import { getAllEvents, formatEventDate } from './events';
import { DEFAULT_OG_IMAGE } from './seo';
import { getRemoteSportifs } from './supabase/content';
import { hasValidTitle, mergeImages } from './supabase/records';

function decoratePortrait(portrait, index, events) {
  const images = mergeImages(portrait.images);
  const event = portrait.eventSlug
    ? events.find((item) => item.slug === portrait.eventSlug)
    : null;
  const badge =
    portrait.badge ||
    (portrait.featured
      ? `À LA UNE - ${portrait.discipline}`
      : `${String(index + 1).padStart(2, '0')} - ${portrait.discipline}`)
      .toLocaleUpperCase('fr');

  return {
    ...portrait,
    id: portrait.id || portrait.slug,
    images,
    cover: images[0]?.src || DEFAULT_OG_IMAGE,
    badge,
    featured: Boolean(portrait.featured),
    eventHref: event ? `/evenements/${event.slug}` : null,
    eventLabel: event?.title ?? portrait.eventLabel ?? portrait.fallbackLabel,
    dateLabel: event
      ? formatEventDate(event.date, event.season)
      : portrait.dateLabel,
  };
}

// Source unique : table Supabase `sportifs_semaine`.
export async function getAllSportifs() {
  const [events, remote] = await Promise.all([
    getAllEvents(),
    getRemoteSportifs(),
  ]);

  const ordered = [...remote]
    .filter(hasValidTitle)
    .sort((a, b) => {
      if (Boolean(a.featured) !== Boolean(b.featured)) {
        return a.featured ? -1 : 1;
      }
      return (Number(a.order) || 0) - (Number(b.order) || 0);
    });

  return ordered.map((portrait, index) =>
    decoratePortrait(portrait, index, events)
  );
}

export async function getSportifById(id) {
  if (!/^[a-z0-9-]+$/.test(String(id || ''))) return null;
  const portraitsList = await getAllSportifs();
  return portraitsList.find((portrait) => portrait.id === id) ?? null;
}
