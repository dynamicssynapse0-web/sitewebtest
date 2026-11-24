import { getRemoteArticles } from './supabase/content';
import { hasValidTitle, sortByDateDesc } from './supabase/records';

export function formatCompetitionDate(date) {
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
  return date || 'Date à confirmer';
}

// Source unique : table Supabase `articles` (type = international).
export async function getAllInternationalCompetitions() {
  const competitions = await getRemoteArticles('international');
  return sortByDateDesc(competitions.filter(hasValidTitle));
}

export async function getInternationalCompetitionBySlug(slug) {
  if (!/^[a-z0-9-]+$/.test(String(slug || ''))) return null;
  const competitions = await getAllInternationalCompetitions();
  return (
    competitions.find((competition) => competition.slug === slug) ?? null
  );
}
