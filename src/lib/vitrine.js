import { getRemoteVitrine } from './supabase/content';

const VITRINE_SECTIONS = new Set(['moment_fort', 'portrait_exclusif']);

// Source unique : table Supabase `vitrine_items`.
export async function getVitrineItems(section) {
  if (!VITRINE_SECTIONS.has(section)) return [];

  const items = await getRemoteVitrine(section);
  return items
    .filter((item) => item.image)
    .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
}

export async function getMomentsForts() {
  return getVitrineItems('moment_fort');
}

export async function getPortraitsExclusifs() {
  return getVitrineItems('portrait_exclusif');
}
