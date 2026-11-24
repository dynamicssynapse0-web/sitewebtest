import { DEFAULT_OG_IMAGE } from '@/lib/seo';
import { getPublicSupabase } from './publicClient';
import {
  hasValidTitle,
  mergeImages,
  normalizeImages,
  slugify,
  sortByDateDesc,
  toBoolean,
  toIsoDate,
} from './records';

export async function fetchRows(table, filters = {}, order) {
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

// Décode un champ d'images même lorsqu'il a été sérialisé plusieurs fois
// (ex. "\"[{\\\"src\\\":...}]\""). Les lignes historiques peuvent contenir
// une chaîne JSON dans une chaîne JSON ; on normalize toujours vers un tableau.
const MAX_JSON_DECODE_PASSES = 6;

export function parseImagesField(raw) {
  let value = raw;

  for (
    let pass = 0;
    pass < MAX_JSON_DECODE_PASSES && typeof value === 'string';
    pass += 1
  ) {
    const trimmed = value.trim();
    if (!trimmed) return [];

    const startsLikeJson =
      trimmed.startsWith('[') ||
      trimmed.startsWith('{') ||
      trimmed.startsWith('"');
    if (!startsLikeJson) break;

    try {
      const parsed = JSON.parse(trimmed);
      if (parsed === value) break;
      value = parsed;
    } catch {
      break;
    }
  }

  return value;
}

// Renvoie la première valeur réellement renseignée (chaîne non vide ou tableau non vide).
function firstValue(...values) {
  for (const value of values) {
    if (value === null || value === undefined) continue;
    if (typeof value === 'string' && !value.trim()) continue;
    if (Array.isArray(value) && value.length === 0) continue;
    return value;
  }
  return '';
}

// Les anciennes lignes sans titre ou avec un autre type ne doivent jamais
// apparaître dans les listings publics ni dans l'administration.
export function isValidArticleRow(row, type) {
  if (!row || typeof row !== 'object') return false;
  const rowType = String(row.type ?? '')
    .trim()
    .toLocaleLowerCase('fr');
  if (rowType !== String(type).trim().toLocaleLowerCase('fr')) return false;
  return hasValidTitle(row);
}

export function mapArticle(row, type) {
  const title = String(row.title ?? row.titre ?? '').trim() || 'Sans titre';
  const images = normalizeImages(
    parseImagesField(
      firstValue(
        row.images,
        row.photos,
        row.image_urls,
        row.image,
        row.image_url,
        row.cover_image
      )
    ),
    title
  );
  const slug = slugify(row.slug || title) || `${type}-${row.id}`;
  const coverImage =
    firstValue(
      row.cover_image,
      row.coverImage,
      row.image,
      row.image_url,
      images[0]?.src
    ) || DEFAULT_OG_IMAGE;

  return {
    id: row.id ?? null,
    slug,
    title,
    type,
    competition: firstValue(row.competition),
    sport: firstValue(row.sport, row.discipline),
    date: toIsoDate(row.date),
    time: firstValue(row.time, row.heure),
    location: firstValue(row.location, row.lieu),
    season: firstValue(row.season, row.saison),
    excerpt: firstValue(row.excerpt, row.resume, row.description),
    content: firstValue(row.content, row.contenu, row.excerpt),
    coverImage,
    images,
    source: 'supabase',
  };
}

export function mapSportif(row, index = 0) {
  const images = normalizeImages(
    parseImagesField(row.images ?? row.photos),
    row.title || 'Portrait'
  );
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
    parseImagesField(row.images ?? row.image ?? row.image_url),
    row.title || 'Photo'
  );
  const image = images[0] || null;

  return {
    id: row.id ?? (slugify(row.title) || `${section}-${index + 1}`),
    title: row.title || row.titre || 'Sans titre',
    subtitle: row.subtitle || row.sous_titre || '',
    section,
    order: Number(row.ordre ?? row.order ?? 0) || 0,
    images,
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
  return sortByDateDesc(
    rows.filter((row) => isValidArticleRow(row, type)).map((row) => mapArticle(row, type))
  );
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

// Discipline photo : la couverture est distincte des images secondaires, mais
// `images` contient la galerie complète pour les pages /sports et /galerie.
export function mapImagesSport(row, index = 0) {
  const title = String(row.title ?? row.titre ?? '').trim() || 'Sans titre';
  const secondaryImages = normalizeImages(
    parseImagesField(firstValue(row.images, row.photos, row.image_urls)),
    title
  );
  const coverImages = normalizeImages(
    parseImagesField(
      firstValue(row.cover_image, row.coverImage, row.image, row.image_url)
    ),
    title
  );
  const coverImage =
    coverImages[0]?.src || secondaryImages[0]?.src || DEFAULT_OG_IMAGE;
  const slug = slugify(row.slug || title) || `images-sport-${index + 1}`;

  return {
    id: row.id ?? null,
    slug,
    title,
    description: firstValue(row.description, row.resume, row.excerpt),
    coverImage,
    image: coverImage,
    // Pas de colonne `alt` dans images_sport : texte généré côté front-end.
    alt: `Photo ${title}`,
    images: mergeImages(coverImage, secondaryImages),
    secondaryImages,
    imageCount: secondaryImages.length,
    order: Number(row.ordre ?? row.order ?? 0) || 0,
    source: 'supabase',
  };
}

export async function getRemoteImagesSport() {
  const rows = await fetchRows(
    'images_sport',
    {},
    { column: 'ordre', ascending: true }
  );
  return rows
    .filter(hasValidTitle)
    .map(mapImagesSport)
    .sort((a, b) => a.order - b.order);
}
