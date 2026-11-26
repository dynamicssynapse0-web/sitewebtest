import { getPublicSupabase } from './supabase/publicClient';
import { normalizeImages, toIsoDate } from './supabase/records';
import { safeText, toPlainRows } from './supabase/serialization';

export const AD_PLACEMENTS = [
  { value: 'accueil', label: 'Bandeau accueil' },
  { value: 'carte', label: 'Carte sponsorisée (accueil)' },
  { value: 'partenaires', label: 'Logos partenaires (tout le site)' },
  { value: 'evenement', label: 'Sponsor d’événement (fiche événement)' },
  { value: 'competition', label: 'Sponsor de compétition (fiche compétition)' },
];

export function isAdPlacement(value) {
  return AD_PLACEMENTS.some((placement) => placement.value === value);
}

export function adPlacementLabel(value) {
  return AD_PLACEMENTS.find((placement) => placement.value === value)?.label || '';
}

function mapAd(row) {
  const title = safeText(row.title).trim();
  if (!title || title.toLocaleLowerCase('fr') === 'sans titre') return null;

  const image = normalizeImages(
    row.image || row.cover_image || row.images,
    title
  )[0];

  return {
    id: safeText(row.id),
    title,
    advertiser: safeText(row.advertiser) || title,
    slug: safeText(row.slug),
    placement: safeText(row.placement),
    linkUrl: safeText(row.link_url),
    image: image?.src || '',
    alt: safeText(row.alt) || image?.alt || `Publicité ${title}`,
    dateDebut: toIsoDate(row.date_debut),
    dateFin: toIsoDate(row.date_fin),
    ordre: Number(row.ordre) || 0,
  };
}

function isCurrentlyPublished(ad, today) {
  if (ad.dateDebut && ad.dateDebut > today) return false;
  if (ad.dateFin && ad.dateFin < today) return false;
  return Boolean(ad.image && ad.linkUrl);
}

// Lecture publique : les lignes inactives ou hors période sont filtrées ici
// aussi, pour rester correctes même si les policies RLS sont assouplies.
export async function getAds(placement) {
  const supabase = getPublicSupabase();
  if (!supabase || !isAdPlacement(placement)) return [];

  try {
    const { data, error } = await supabase
      .from('ads')
      .select('*')
      .eq('placement', placement)
      .eq('active', true)
      .order('ordre', { ascending: true });

    if (error || !Array.isArray(data)) return [];

    const today = new Date().toISOString().slice(0, 10);
    return toPlainRows(data)
      .map(mapAd)
      .filter((ad) => ad && isCurrentlyPublished(ad, today));
  } catch {
    return [];
  }
}

export async function getAdClickCounts() {
  const supabase = getPublicSupabase();
  if (!supabase) return {};

  try {
    const { data, error } = await supabase
      .from('ad_clicks')
      .select('ad_id')
      .limit(5000);

    if (error || !Array.isArray(data)) return {};

    return data.reduce((counts, row) => {
      const id = safeText(row.ad_id);
      if (id) counts[id] = (counts[id] || 0) + 1;
      return counts;
    }, {});
  } catch {
    return {};
  }
}
