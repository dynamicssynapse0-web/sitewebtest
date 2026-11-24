import { DEFAULT_OG_IMAGE } from './seo';
import { fetchRows, parseImagesField } from './supabase/content';
import { mergeImages, normalizeImages, slugify } from './supabase/records';

export { parseImagesField } from './supabase/content';

// Limite métier : une couverture + 4 images secondaires maximum.
export const MAX_CATEGORY_IMAGES = 4;

// Les six disciplines autorisées, dans l'ordre du menu.
export const CATEGORY_DISCIPLINES = [
  'Football',
  'Basketball',
  'Boxe',
  'Volleyball',
  'Athlétisme',
  'Arts martiaux',
];

export function canonicalDiscipline(value) {
  const needle = slugify(value);
  if (!needle) return '';
  return CATEGORY_DISCIPLINES.find((discipline) => slugify(discipline) === needle) || '';
}

export function isCategorySportRow(row) {
  if (!row || typeof row !== 'object') return false;
  if (!canonicalDiscipline(row.discipline ?? row.sport)) return false;
  const sousDiscipline = String(row.sous_discipline ?? row.sousDiscipline ?? '').trim();
  return Boolean(sousDiscipline) && sousDiscipline.toLocaleLowerCase('fr') !== 'sans titre';
}

export function mapCategorySport(row, index = 0) {
  const discipline = canonicalDiscipline(row.discipline ?? row.sport) || 'Sport';
  const sousDiscipline =
    String(row.sous_discipline ?? row.sousDiscipline ?? '').trim() || 'Sous-discipline';
  const disciplineSlug = slugify(discipline);
  const sousDisciplineSlug = slugify(sousDiscipline) || `sous-discipline-${index + 1}`;
  const compositeSlug =
    slugify(row.slug || `${discipline}-${sousDiscipline}`) ||
    `${disciplineSlug}-${sousDisciplineSlug}`;

  const secondaryImages = normalizeImages(
    parseImagesField(row.images ?? row.photos ?? row.image_urls),
    sousDiscipline
  ).slice(0, MAX_CATEGORY_IMAGES);
  const coverImages = normalizeImages(
    parseImagesField(
      row.cover_image ?? row.coverImage ?? row.image ?? row.image_url
    ),
    sousDiscipline
  );
  const coverImage =
    coverImages[0]?.src || secondaryImages[0]?.src || DEFAULT_OG_IMAGE;
  const images = mergeImages(coverImage, secondaryImages);

  return {
    id: row.id ?? null,
    discipline,
    disciplineSlug,
    sousDiscipline,
    sousDisciplineSlug,
    // Slug composite unique : discipline-sous-discipline.
    slug: compositeSlug,
    title: sousDiscipline,
    coverImage,
    cover: coverImages[0] || images[0] || null,
    secondaryImages,
    images,
    alt: coverImages[0]?.alt || `Photo ${discipline} — ${sousDiscipline}`,
    order: Number(row.ordre ?? row.order ?? 0) || 0,
    // URL complète avec le slug composite ; la page accepte aussi la version courte.
    href: `/sports/${disciplineSlug}/${compositeSlug}`,
    shortHref: `/sports/${disciplineSlug}/${sousDisciplineSlug}`,
    source: 'supabase',
  };
}

export async function getAllCategoriesSport() {
  const rows = await fetchRows(
    'categories_sport',
    {},
    { column: 'ordre', ascending: true }
  );

  return rows
    .filter(isCategorySportRow)
    .map(mapCategorySport)
    .sort(
      (a, b) =>
        a.order - b.order ||
        a.discipline.localeCompare(b.discipline, 'fr') ||
        a.sousDiscipline.localeCompare(b.sousDiscipline, 'fr')
    );
}

// Ne renvoie que les disciplines ayant au moins une sous-discipline publiée.
export function groupCategoriesSportByDiscipline(items = []) {
  return CATEGORY_DISCIPLINES.map((discipline) => {
    const categories = items
      .filter((item) => item?.discipline === discipline)
      .sort(
        (a, b) =>
          a.order - b.order ||
          a.sousDiscipline.localeCompare(b.sousDiscipline, 'fr')
      );

    if (categories.length === 0) return null;
    return { discipline, slug: slugify(discipline), categories };
  }).filter(Boolean);
}

export async function getActiveSportDisciplines() {
  return groupCategoriesSportByDiscipline(await getAllCategoriesSport());
}

export async function getCategorySportBySlug(discipline, slug) {
  const disciplineSlug = slugify(discipline);
  const wantedSlug = slugify(slug);
  if (!disciplineSlug || !wantedSlug) return null;

  const categories = await getAllCategoriesSport();
  return (
    categories.find(
      (item) =>
        item.disciplineSlug === disciplineSlug &&
        (item.sousDisciplineSlug === wantedSlug || item.slug === wantedSlug)
    ) ?? null
  );
}
