import { getAllEvents } from './events';
import { getAllInternationalCompetitions } from './internationalCompetitions';
import { getAllSportifs } from './sportifsSemaine';
import { getVitrineItems } from './vitrine';
import { normalizeImages } from './supabase/records';

function withContext(items, getContext) {
  return items.flatMap((item) => {
    const images = normalizeImages(
      item.images?.length ? item.images : item.coverImage || item.image,
      item.title
    );
    const context = getContext(item);

    return images.map((image) => ({ ...image, ...context }));
  });
}

export async function getGalleryImages() {
  const [events, competitions, sportifs, momentsForts, portraitsExclusifs] =
    await Promise.all([
      getAllEvents(),
      getAllInternationalCompetitions(),
      getAllSportifs(),
      getVitrineItems('moment_fort'),
      getVitrineItems('portrait_exclusif'),
    ]);

  const allImages = [
    ...withContext(events, (event) => ({
      title: event.title,
      category: 'Événement',
      href: `/evenements/${event.slug}`,
    })),
    ...withContext(competitions, (competition) => ({
      title: competition.title,
      category: 'Compétition',
      href: `/competitions-internationales/${competition.slug}`,
    })),
    ...withContext(sportifs, (portrait) => ({
      title: portrait.title,
      category: 'Sportif de la semaine',
      href: `/sportifs-semaine/${portrait.id}`,
    })),
    ...withContext(momentsForts, (item) => ({
      title: item.title,
      category: 'Moment fort',
      href: '/#moments-forts',
    })),
    ...withContext(portraitsExclusifs, (item) => ({
      title: item.title,
      category: 'Portrait exclusif',
      href: '/#portraits-exclusifs',
    })),
  ];

  const seen = new Set();
  return allImages.filter((image) => {
    if (!image.src || seen.has(image.src)) return false;
    seen.add(image.src);
    return true;
  });
}
