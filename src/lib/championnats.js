import { listeSports } from './sports';
import { getRemoteChampionnats } from './supabase/content';
import { slugify } from './supabase/records';

// Liste plate et normalisée, triée par ordre croissant.
export async function getAllChampionnats() {
  return getRemoteChampionnats();
}

// Regroupement par sport pour les onglets de l'accueil. L'ordre des sports
// suit `listeSports`, les sports inconnus étant ajoutés à la fin.
export function groupChampionnatsBySport(championnats = []) {
  const groups = new Map();

  championnats.forEach((item) => {
    const slug = item.sportSlug || slugify(item.sport);
    if (!slug) return;

    const base = listeSports.find((sport) => sport.slug === slug);
    const label = base?.nom || item.sport || slug;

    if (!groups.has(slug)) {
      groups.set(slug, {
        slug,
        sport: label,
        icone: base?.icone || '🏆',
        order: base ? listeSports.indexOf(base) : listeSports.length,
        championnats: [],
      });
    }

    groups.get(slug).championnats.push(item);
  });

  return Array.from(groups.values())
    .map((group) => ({
      ...group,
      championnats: [...group.championnats].sort(
        (a, b) => (Number(a.order) || 0) - (Number(b.order) || 0)
      ),
    }))
    .sort(
      (a, b) =>
        a.order - b.order || a.sport.localeCompare(b.sport, 'fr')
    );
}
