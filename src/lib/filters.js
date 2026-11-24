import { listeSports } from './sports';
import { slugify } from './supabase/records';

function sportIndex(value) {
  const slug = slugify(value);
  const index = listeSports.findIndex((sport) => sport.slug === slug);
  return index < 0 ? listeSports.length : index;
}

function sportLabel(value) {
  const slug = slugify(value);
  return listeSports.find((sport) => sport.slug === slug)?.nom || value;
}

export function buildFilterOptions(items = [], key) {
  const counts = new Map();

  items.forEach((item) => {
    const value = String(item?.[key] ?? '').trim();
    if (!value) return;
    counts.set(value, (counts.get(value) || 0) + 1);
  });

  return Array.from(counts, ([value, count]) => ({
    value,
    label: key === 'sport' ? sportLabel(value) : value,
    count,
  })).sort((a, b) => {
    if (key === 'sport') {
      return sportIndex(a.value) - sportIndex(b.value) || a.label.localeCompare(b.label, 'fr');
    }
    return b.value.localeCompare(a.value, 'fr');
  });
}
