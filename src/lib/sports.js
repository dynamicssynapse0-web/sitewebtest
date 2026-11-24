import { getAllCategoriesSport } from './categoriesSport';
import { getImagesSportDisciplines } from './imagesSport';
import { DEFAULT_OG_IMAGE } from './seo';
import { slugify } from './supabase/records';

// Disciplines de base, toujours disponibles même sans Supabase.
export const listeSports = [
  {
    nom: 'Football',
    slug: 'football',
    icone: '⚽',
    description: 'Matchs de championnat, coupes nationales et rencontres internationales.',
    image: '/images/aubin-simo-photographe-football-CAN2027.jpg',
    alt: 'Aubin Simo photographiant un match de football – CAN 2027',
  },
  {
    nom: 'Basketball',
    slug: 'basketball',
    icone: '🏀',
    description: 'Ambiance des salles, dunks et tirs à 3 points.',
    image: '/images/aubin-basketball-fiba.jpg',
    alt: 'Aubin Simo – photographie de basketball',
  },
  {
    nom: 'Athlétisme',
    slug: 'athletisme',
    icone: '🏃',
    description: 'Courses, sauts et moments de pure intensité sur la piste.',
    image: '/images/aubin-simo-photographe-football-CAN2027.jpg',
    alt: "Aubin Simo – photographie d'athlétisme",
  },
  {
    nom: 'Boxe',
    slug: 'boxe',
    icone: '🥊',
    description: 'Combats sur le ring, techniques et moments forts.',
    image: '/images/aubin-simo-photographe-football-CAN2027.jpg',
    alt: 'Aubin Simo – photographie de boxe',
  },
];

// Fusionne les disciplines publiées dans `images_sport` avec les sports de base.
// Une ligne Supabase portant le même slug remplace la fiche statique (photo de
// couverture, description et galerie), sans créer de doublon dans le menu.
export function mergeSports(disciplines = []) {
  const merged = new Map();

  listeSports.forEach((sport) => {
    merged.set(sport.slug, {
      ...sport,
      title: sport.nom,
      coverImage: sport.image,
      images: [],
      secondaryImages: [],
      imageCount: 0,
      order: 0,
      source: 'base',
      categories: [],
    });
  });

  [...disciplines]
    .filter(Boolean)
    .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0))
    .forEach((discipline) => {
      const key = discipline.slug || slugify(discipline.title);
      if (!key) return;

      const base = merged.get(key) || {};
      const coverImage =
        discipline.coverImage ||
        discipline.image ||
        base.coverImage ||
        DEFAULT_OG_IMAGE;
      const images =
        discipline.images?.length
          ? discipline.images
          : base.images || [];

      merged.set(key, {
        ...base,
        ...discipline,
        nom: discipline.title || base.nom,
        title: discipline.title || base.title || base.nom,
        slug: key,
        icone: base.icone || '📸',
        description: discipline.description || base.description || '',
        coverImage,
        image: coverImage,
        alt: discipline.alt || base.alt || `Photographies de ${discipline.title}`,
        images,
        secondaryImages: discipline.secondaryImages?.length
          ? discipline.secondaryImages
          : base.secondaryImages || [],
        imageCount: Number(discipline.imageCount ?? images.length) || 0,
        order: Number(discipline.order ?? base.order ?? 0) || 0,
        source: discipline.source || 'supabase',
        categories: discipline.categories || base.categories || [],
      });
    });

  return [...merged.values()];
}

export async function getAllSports() {
  const [disciplines, categories] = await Promise.all([
    getImagesSportDisciplines(),
    getAllCategoriesSport(),
  ]);

  // Les catégories `categories_sport` alimentent aussi la couverture et le
  // compteur de photos de chaque discipline (ex. Football → MTN Elite One).
  const categoryDisciplines = categories.map((category) => {
    const allImages = category.images || [];
    return {
      slug: category.disciplineSlug,
      title: category.discipline,
      description: `Photographies de ${category.discipline} — ${category.sousDiscipline}.`,
      coverImage: category.coverImage,
      images: allImages,
      secondaryImages: category.secondaryImages,
      imageCount: allImages.length,
      alt: category.alt,
      order: category.order,
      source: 'categories_sport',
      categories: [category],
    };
  });

  const merged = mergeSports([...disciplines, ...categoryDisciplines]);

  return merged.map((sport) => {
    const sportCategories = categories.filter(
      (category) => category.disciplineSlug === sport.slug
    );
    if (sportCategories.length === 0) return sport;

    const categoryImages = sportCategories.flatMap((category) => category.images || []);
    const allImages = [...(sport.images || []), ...categoryImages].filter(
      (image, index, list) =>
        image?.src && list.findIndex((item) => item?.src === image.src) === index
    );
    const coverFromCategories =
      sportCategories.find((category) => category.coverImage)?.coverImage || '';

    return {
      ...sport,
      coverImage:
        sport.source === 'base' && coverFromCategories
          ? coverFromCategories
          : sport.coverImage,
      image:
        sport.source === 'base' && coverFromCategories
          ? coverFromCategories
          : sport.image,
      images: allImages,
      imageCount: allImages.length,
      categories: sportCategories.sort(
        (a, b) => a.order - b.order || a.sousDiscipline.localeCompare(b.sousDiscipline, 'fr')
      ),
    };
  });
}

export async function getSportBySlug(slug) {
  if (!/^[a-z0-9-]+$/.test(String(slug || ''))) return null;
  const sports = await getAllSports();
  return sports.find((sport) => sport.slug === slug) ?? null;
}
