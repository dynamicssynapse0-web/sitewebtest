import fs from 'fs';
import path from 'path';
import { getAllEvents, formatEventDate } from './events';
import { DEFAULT_OG_IMAGE } from './seo';

// Ajouter un portrait = ajouter une entrée ici + un dossier d'images portant le même id.
export const portraits = [
  {
    id: 'lions',
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

// Lecture serveur du dossier d'un portrait : toutes les images supportées, triées.
export function getSportifImages(id) {
  if (!/^[a-z0-9-]+$/.test(id)) return [];

  const directory = path.join(portraitsDirectory, id);
  if (!fs.existsSync(directory)) return [];

  return fs
    .readdirSync(directory)
    .filter((fileName) => IMAGE_EXTENSION.test(fileName))
    .sort((a, b) => a.localeCompare(b, 'fr', { numeric: true }))
    .map((fileName) => `/images/sportifs-semaine/${id}/${fileName}`);
}

function withDetails(portrait, events) {
  const images = getSportifImages(portrait.id);
  const event = portrait.eventSlug
    ? events.find((item) => item.slug === portrait.eventSlug)
    : null;

  return {
    ...portrait,
    images,
    cover: images[0] ?? DEFAULT_OG_IMAGE,
    eventHref: event ? `/evenements/${event.slug}` : null,
    eventLabel: event?.title ?? portrait.eventLabel ?? portrait.fallbackLabel,
    dateLabel: event
      ? formatEventDate(event.date, event.season)
      : portrait.dateLabel,
  };
}

export function getAllSportifs() {
  const events = getAllEvents();
  return portraits.map((portrait) => withDetails(portrait, events));
}

export function getSportifById(id) {
  const portrait = portraits.find((item) => item.id === id);
  if (!portrait) return null;

  return withDetails(portrait, getAllEvents());
}
