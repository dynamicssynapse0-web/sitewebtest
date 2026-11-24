import { getRemoteVitrine } from './supabase/content';
import { normalizeImages, slugify } from './supabase/records';

const VITRINE_SECTIONS = new Set(['moment_fort', 'portrait_exclusif']);

// Source unique : table Supabase `vitrine_items`.
export async function getVitrineItems(section) {
  if (!VITRINE_SECTIONS.has(section)) return [];

  const items = await getRemoteVitrine(section);
  return items
    .filter((item) => item.image)
    .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
}

function groupKey(item, index) {
  const titleKey = slugify(item?.title);
  return titleKey && titleKey !== 'sans-titre'
    ? titleKey
    : `item-${item?.id ?? index}`;
}

// Une carte peut venir d'une seule ligne (images JSON) ou de plusieurs lignes
// partageant le même titre : on fusionne alors leurs photos dans l'ordre.
export function groupVitrineItems(items = []) {
  const groups = new Map();

  items.forEach((item, index) => {
    const key = groupKey(item, index);
    const images = normalizeImages(
      item.images?.length ? item.images : item.image,
      item.title || 'Photo'
    );
    const existing = groups.get(key);

    if (!existing) {
      groups.set(key, { ...item, images: [...images] });
      return;
    }

    groups.set(key, {
      ...existing,
      images: [...existing.images, ...images],
      order: Math.min(Number(existing.order) || 0, Number(item.order) || 0),
    });
  });

  return Array.from(groups.values())
    .map((item) => {
      const seen = new Set();
      const images = (item.images || []).filter((image) => {
        const src = typeof image === 'string' ? image : image?.src;
        if (!src || seen.has(src)) return false;
        seen.add(src);
        return true;
      });

      return {
        ...item,
        images,
        image: images[0]?.src || item.image || '',
        alt: item.alt || images[0]?.alt || '',
        legend: item.legend || images[0]?.legend || '',
      };
    })
    .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
}

export async function getMomentsForts() {
  return groupVitrineItems(await getVitrineItems('moment_fort'));
}

export async function getPortraitsExclusifs() {
  return getVitrineItems('portrait_exclusif');
}
