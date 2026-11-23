import { DEFAULT_OG_IMAGE } from '@/lib/seo';
import { getPublicSupabase } from './publicClient';
import {
  normalizeImages,
  slugify,
  sortByDateDesc,
  toBoolean,
  toIsoDate,
} from './records';

async function fetchRows(table, filters = {}, order) {
  const supabase = getPublicSupabase();
  if (!supabase) return [];

  function build(withOrder) {
    let query = supabase.from(table).select('*');
    Object.entries(filters).forEach(([column, value]) => {
      query = query.eq(column, value);
    });
    if (withOrder && order) {
      query = query.order(order.column, {
        ascending: order.ascending ?? false,
      });
    }
    return query;
  }

  const ordered = await build(true);
  if (!ordered.error) return ordered.data ?? [];

  const unordered = await build(false);
  if (unordered.error) return [];

  return unordered.data ?? [];
}

export function mapArticle(row, type) {
  const images = normalizeImages(
    row.images ?? row.photos ?? row.image_urls,
    row.title || 'Photo'
  );
  const slug = slugify(row.slug || row.title || row.titre) || `${type}-${row.id}`;

  return {
    id: row.id ?? null,
    slug,
    title: row.title || row.titre || 'Sans titre',
    type,
    competition: row.competition || '',
    sport: row.sport || '',
    date: toIsoDate(row.date),
    time: row.time || row.heure || '',
    location: row.location || row.lieu || '',
    season: row.season || row.saison || '',
    excerpt: row.excerpt || row.resume || row.description || '',
    content: row.content || row.contenu || row.excerpt || '',
    coverImage: row.cover_image || row.coverImage || images[0]?.src || DEFAULT_OG_IMAGE,
    images,
    source: 'supabase',
  };
}

export function mapSportif(row, index = 0) {
  const images = normalizeImages(row.images ?? row.photos, row.title || 'Portrait');
  const slug =
    slugify(row.slug || row.title || row.player_name || row.nom) ||
    `sportif-${index + 1}`;

  return {
    id: slug,
    slug,
    title: row.title || row.titre || row.player_name || 'Sportif de la semaine',
    discipline: row.discipline || 'Sport',
    nom: row.player_name || row.nom || '',
    poste: row.position || row.poste || '',
    competition: row.competition || '',
    quote: row.quote || row.citation || '',
    alt: row.alt || `Portrait de ${row.player_name || row.title || 'un sportif'}`,
    eventSlug: row.event_slug || row.eventSlug || '',
    fallbackLabel: row.competition || row.event_label || '',
    cta: row.cta || 'Voir le portrait',
    featured: toBoolean(row.featured),
    order: Number(row.ordre ?? row.order ?? 0) || 0,
    images,
    source: 'supabase',
  };
}

export function mapVitrine(row, section, index = 0) {
  const images = normalizeImages(
    row.images ?? row.image ?? row.image_url,
    row.title || 'Photo'
  );
  const image = images[0] || null;

  return {
    id: row.id ?? (slugify(row.title) || `${section}-${index + 1}`),
    title: row.title || row.titre || 'Sans titre',
    subtitle: row.subtitle || row.sous_titre || '',
    section,
    order: Number(row.ordre ?? row.order ?? 0) || 0,
    image: image?.src || row.image || row.image_url || '',
    alt: row.alt || image?.alt || row.title || 'Photographie sportive',
    legend: row.legend || image?.legend || row.title || '',
    credit: row.credit || image?.credit || 'Aubin Simo',
    source: 'supabase',
  };
}

export async function getRemoteArticles(type) {
  const rows = await fetchRows(
    'articles',
    { type },
    { column: 'date', ascending: false }
  );
  return sortByDateDesc(rows.map((row) => mapArticle(row, type)));
}

export async function getRemoteSportifs() {
  const rows = await fetchRows(
    'sportifs_semaine',
    {},
    { column: 'created_at', ascending: false }
  );
  return rows.map(mapSportif);
}

export async function getRemoteVitrine(section) {
  const rows = await fetchRows(
    'vitrine_items',
    { section },
    { column: 'ordre', ascending: true }
  );
  return rows
    .map((row, index) => mapVitrine(row, section, index))
    .sort((a, b) => a.order - b.order);
}
