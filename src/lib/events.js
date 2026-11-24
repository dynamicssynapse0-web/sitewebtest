import { getRemoteArticles } from './supabase/content';
import { hasValidTitle, sortByDateDesc } from './supabase/records';

export function formatEventDate(date, season) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(String(date || ''))) {
    const parsed = new Date(`${date}T12:00:00`);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    }
  }

  if (season) return `Saison ${season}`;
  if (date) return date;
  return 'Date à confirmer';
}

// Source unique : table Supabase `articles` (type = event).
export async function getAllEvents() {
  const events = await getRemoteArticles('event');
  return sortByDateDesc(events.filter(hasValidTitle));
}

export async function getEventBySlug(slug) {
  if (!/^[a-z0-9-]+$/.test(String(slug || ''))) return null;
  const events = await getAllEvents();
  return events.find((event) => event.slug === slug) ?? null;
}
