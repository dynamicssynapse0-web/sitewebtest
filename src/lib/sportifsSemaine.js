import fs from 'fs';
import path from 'path';
import { getAllEvents, formatEventDate } from './events';
import { DEFAULT_OG_IMAGE } from './seo';
import { getRemoteSportifs } from './supabase/content';
import { mergeCollections, mergeImages } from './supabase/records';

// Ajouter un portrait local = ajouter une entrée ici + un dossier d'images portant le même id.
export const portraits = [
  {
    id: 'lions',
    slug: 'lions',
    title: 'Les Lions en action',
    discipline: 'Football',
    badge: 'À LA UNE - FOOTBALL',
    nom: 'LIONS',
    poste: 'Équipe nationale',
    competition: 'Qualifications CAN 2027',
    quote:
      'Détermination, concentration et passion jusqu’au coup de sifflet final.',
    alt: 'Footballeur camerounais en action lors d’une rencontre internationale',
    eventSlug: 'cameroun-benin',
    fallbackLabel: 'Qualifications CAN 2027',
    cta: 'Voir le reportage',
    featured: true,
  },
  {
    id: 'parquet',
    slug: 'parquet',
    title: 'L’énergie du parquet',
    discipline: 'Basketball',
    badge: '02 - BASKETBALL',
    nom: 'MANGUE',
    poste: 'Meneur',
    competition: 'Basketball FIBA',
    quote: 'Un bel exemple d’énergie et d’engagement sur le terrain.',
    alt: 'Joueur de basketball en action pendant un match FIBA',
    eventLabel: 'Basketball FIBA',
    dateLabel: 'Galerie photos',
    cta: 'Voir les photos',
  },
  {
    id: 'mtn',
    slug: 'mtn',
    title: 'Le talent en mouvement',
    discipline: 'Football',
    badge: '03 - FOOTBALL',
    nom: 'TIMBA',
    poste: 'Attaquant',
    competition: 'MTN Elite 1',
    quote: 'Le talent se révèle aussi dans les efforts et le travail d’équipe.',
    alt: 'Joueur de football en action pendant une rencontre MTN Elite One',
    eventSlug: 'mtn-elite-one',
    fallbackLabel: 'MTN Elite One',
    cta: 'Voir le portrait',
  },
];

const IMAGE_EXTENSION = /\.(jpe?g|png|webp)$/i;
const portraitsDirectory = path.join(
  process.cwd(),
  'public/images/sportifs-semaine'
);

export function getSportifImages(id) {
  if (!/^[a-z0-9-]+$/.test(String(id || ''))) return [];

  const directory = path.join(portraitsDirectory, id);
  if (!fs.existsSync(directory)) return [];

  return fs.readdirSync(directory)
    .filter((fileName) => IMAGE_EXTENSION.test(fileName))
    .sort((a, b) => a.localeCompare(b, 'fr', { numeric: true }))
    .map((fileName) => `/images/sportifs-semaine/${id}/${fileName}`);
}

function decoratePortrait(portrait, index, events) {
  const images = mergeImages(portrait.images, getSportifImages(portrait.id));
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

export async function getAllSportifs() {
  const [events, remote] = await Promise.all([
    getAllEvents(),
    getRemoteSportifs(),
  ]);
  const local = portraits.map((portrait) => ({
    ...portrait,
    images: getSportifImages(portrait.id),
    source: 'markdown',
  }));

  const merged = mergeCollections(local, remote);
  const ordered = [...merged].sort((a, b) => {
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
