import { getRemoteImagesSport } from './supabase/content';

// Source unique : table Supabase `images_sport` (une ligne par discipline photo).
export async function getImagesSportDisciplines() {
  return getRemoteImagesSport();
}

export async function getImagesSportBySlug(slug) {
  if (!/^[a-z0-9-]+$/.test(String(slug || ''))) return null;
  const disciplines = await getImagesSportDisciplines();
  return disciplines.find((discipline) => discipline.slug === slug) ?? null;
}
