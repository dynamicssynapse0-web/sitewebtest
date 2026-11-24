import { getAllEvents } from './events';
import { getImagesSportDisciplines } from './imagesSport';
import { getAllInternationalCompetitions } from './internationalCompetitions';
import { getAllSportifs } from './sportifsSemaine';
import { getVitrineItems } from './vitrine';
import { getAllChampionnats } from './championnats';
import { normalizeImages, slugify } from './supabase/records';

function yearOf(item = {}) {
  const value = String(item.date ?? '').slice(0, 4);
  return /^\d{4}$/.test(value) ? value : '';
}

function withContext(items, getContext) {
  return items.flatMap((item) => {
    const images = normalizeImages(
      item.images?.length ? item.images : item.coverImage || item.image,
      item.title
    );
    const context = getContext(item);

    return images.map((image) => ({
      ...image,
      ...context,
      sport: context.sport || '',
      year: context.year || '',
    }));
  });
}

export async function getGalleryImages() {
  const [
    events,
    competitions,
    sportifs,
    momentsForts,
    portraitsExclusifs,
    imagesSport,
    championnats,
  ] = await Promise.all([
    getAllEvents(),
    getAllInternationalCompetitions(),
    getAllSportifs(),
    getVitrineItems('moment_fort'),
    getVitrineItems('portrait_exclusif'),
    getImagesSportDisciplines(),
    getAllChampionnats(),
  ]);

  const allImages = [
    ...withContext(events, (event) => ({
      title: event.title,
      category: 'Événement',
      href: `/evenements/${event.slug}`,
      sport: slugify(event.sport),
      year: yearOf(event),
    })),
    ...withContext(competitions, (competition) => ({
      title: competition.title,
      category: 'Compétition',
      href: `/competitions-internationales/${competition.slug}`,
      sport: slugify(competition.sport || competition.competition),
      year: yearOf(competition),
    })),
    ...withContext(sportifs, (portrait) => ({
      title: portrait.title,
      category: 'Sportif de la semaine',
      href: `/sportifs-semaine/${portrait.id}`,
      sport: portrait.discipline || portrait.sport || '',
      year: '',
    })),
    ...withContext(momentsForts, (item) => ({
      title: item.title,
      category: 'Moment fort',
      href: '/galerie#moments-forts',
      sport: '',
      year: '',
    })),
    ...withContext(portraitsExclusifs, (item) => ({
      title: item.title,
      category: 'Portrait exclusif',
      href: '/galerie#portraits-exclusifs',
      sport: '',
      year: '',
    })),
    ...withContext(imagesSport, (discipline) => ({
      title: discipline.title,
      category: 'Images Sport',
      href: `/sports/${discipline.slug}`,
      sport: discipline.slug || discipline.title || '',
      year: '',
    })),
    ...withContext(championnats, (championnat) => ({
      title: championnat.title,
      category: 'Championnat',
      href: '/#championnats',
      sport: championnat.sportSlug || championnat.sport || '',
      year: '',
    })),
  ];

  const seen = new Set();
  return allImages.filter((image) => {
    if (!image.src || seen.has(image.src)) return false;
    seen.add(image.src);
    return true;
  });
}
