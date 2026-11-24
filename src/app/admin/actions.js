'use server';

import { revalidatePath } from 'next/cache';
import { getAdminContext } from '@/lib/supabase/admin';
import { getServerSupabase } from '@/lib/supabase/server';
import {
  canonicalDiscipline,
  MAX_CATEGORY_IMAGES,
} from '@/lib/categoriesSport';
import { decodeMaybeJson, slugify } from '@/lib/supabase/records';
import { errorText, toPlainJson } from '@/lib/supabase/serialization';
import { SUPABASE_MEDIA_BUCKET } from '@/lib/supabase/config';

const ALLOWED_TABLES = new Set([
  'articles',
  'images_sport',
  'categories_sport',
  'sportifs_semaine',
  'vitrine_items',
]);

const IMAGE_COLUMNS = [
  'images',
  'image',
  'image_url',
  'cover_image',
  'photos',
  'image_urls',
];

// Routes publiques invalidées après chaque création / modification / suppression.
const PUBLIC_PATHS = [
  '/',
  '/evenements',
  '/evenements/[slug]',
  '/competitions-internationales',
  '/competitions-internationales/[slug]',
  '/sportifs-semaine/[id]',
  '/galerie',
  '/sports',
  '/sports/[slug]',
  '/sports/[discipline]/[slug]',
  '/sitemap.xml',
];

function revalidatePublicContent(row, table) {
  try {
    const paths = new Set(PUBLIC_PATHS);
    const plainRow = row && typeof row === 'object' ? row : {};
    const slug = slugify(plainRow.slug || plainRow.title);

    // L'accueil, /sports, /galerie et toutes les pages enfants dépendent des
    // disciplines : une seule invalidation globale couvre la navigation entière.
    revalidatePath('/', 'layout');

    if (table === 'articles' && slug) {
      paths.add(
        plainRow.type === 'international'
          ? `/competitions-internationales/${slug}`
          : `/evenements/${slug}`
      );
    }
    if (table === 'sportifs_semaine') {
      if (slug) paths.add(`/sportifs-semaine/${slug}`);
      if (plainRow.id) paths.add(`/sportifs-semaine/${plainRow.id}`);
    }
    if (table === 'images_sport' && slug) {
      paths.add(`/sports/${slug}`);
    }
    if (table === 'categories_sport') {
      const disciplineSlug = slugify(plainRow.discipline);
      const sousDisciplineSlug = slugify(plainRow.sous_discipline);
      if (disciplineSlug && sousDisciplineSlug) {
        paths.add(`/sports/${disciplineSlug}/${sousDisciplineSlug}`);
      }
    }

    paths.forEach((path) => revalidatePath(path));
  } catch {
    // L'invalidation du cache ne doit jamais faire échouer une écriture réussie.
  }
}

function failure(error) {
  return { ok: false, error: errorText(error) };
}

async function requireAdmin() {
  const context = await getAdminContext();

  if (!context.configured) {
    throw new Error('Supabase n’est pas configuré sur ce serveur.');
  }
  if (!context.authorized) {
    throw new Error('Accès refusé : un rôle admin actif est requis.');
  }

  const supabase = await getServerSupabase();
  if (!supabase) throw new Error('Client Supabase indisponible.');

  return supabase;
}

function cleanRow(row) {
  return Object.fromEntries(
    Object.entries(row).filter(
      ([, value]) => value !== undefined && value !== null && value !== ''
    )
  );
}

function collectSources(row) {
  const sources = new Set();

  IMAGE_COLUMNS.forEach((column) => {
    const value = decodeMaybeJson(row?.[column]);
    const list = Array.isArray(value) ? value : value ? [value] : [];

    list.forEach((item) => {
      const src =
        typeof item === 'string'
          ? item
          : item?.src || item?.url || item?.path || '';
      if (src) sources.add(src);
    });
  });

  return sources;
}

function toStoragePath(source) {
  const value = String(source || '');
  const marker = `/storage/v1/object/public/${SUPABASE_MEDIA_BUCKET}/`;
  const markerIndex = value.indexOf(marker);
  let path = markerIndex >= 0 ? value.slice(markerIndex + marker.length) : value;

  if (markerIndex < 0) {
    const prefix = `${SUPABASE_MEDIA_BUCKET}/`;
    if (!path.startsWith(prefix)) return '';
    path = path.slice(prefix.length);
  }

  try {
    path = decodeURIComponent(path);
  } catch {
    return '';
  }

  path = path.split('?')[0].split('#')[0].replace(/^\/+/, '');
  if (!path || path.includes('..') || /^https?:/i.test(path)) return '';
  return path;
}

async function getDeletedRow(supabase, table, id) {
  const { data: row } = await supabase
    .from(table)
    .select('*')
    .eq('id', id)
    .maybeSingle();

  return row ?? {};
}

async function removeUnusedMedia(supabase, sources) {
  if (sources.size === 0) return [];

  // Une image partagée entre plusieurs contenus ne doit jamais être supprimée.
  const results = await Promise.all(
    [...ALLOWED_TABLES].map((name) => supabase.from(name).select('*'))
  );

  const usedPaths = new Set();
  results.forEach((result) => {
    (result?.data || []).forEach((row) => {
      collectSources(row).forEach((source) => {
        const path = toStoragePath(source);
        if (path) usedPaths.add(path);
      });
    });
  });

  const paths = [...sources]
    .map(toStoragePath)
    .filter((path) => path && !usedPaths.has(path));

  if (paths.length === 0) return [];

  const { error } = await supabase.storage
    .from(SUPABASE_MEDIA_BUCKET)
    .remove(paths);

  if (error) throw new Error(error.message);
  return paths;
}

async function saveItem(table, row) {
  try {
    if (!ALLOWED_TABLES.has(table)) throw new Error('Table non autorisée.');
    if (!row || typeof row !== 'object' || Array.isArray(row)) {
      throw new Error('Données invalides.');
    }

    const supabase = await requireAdmin();
    const plainRow = toPlainJson(row);
    const payload = cleanRow({
      ...plainRow,
      slug: slugify(plainRow.slug || plainRow.title) || plainRow.slug || null,
    });

    const result = plainRow.id
      ? await supabase
          .from(table)
          .update(payload)
          .eq('id', plainRow.id)
          .select()
          .single()
      : await supabase.from(table).insert(payload).select().single();

    if (result.error) throw new Error(result.error.message);

    revalidatePublicContent(result.data, table);
    return { ok: true, data: toPlainJson(result.data) };
  } catch (error) {
    return failure(error);
  }
}

async function deleteItem(table, id) {
  try {
    if (!ALLOWED_TABLES.has(table) || !id) {
      throw new Error('Suppression impossible.');
    }

    const supabase = await requireAdmin();

    // Capture de la ligne et de ses sources avant la suppression.
    const deletedRow = await getDeletedRow(supabase, table, id);
    const sources = collectSources(deletedRow);

    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) throw new Error(error.message);

    revalidatePublicContent(deletedRow, table);

    // Nettoyage Storage après la suppression : un échec ici ne doit pas annuler
    // une suppression déjà effectuée (seuls des fichiers orphelins resteraient).
    let removedMedia = [];
    try {
      removedMedia = await removeUnusedMedia(supabase, sources);
    } catch {
      removedMedia = [];
    }

    return { ok: true, id: toPlainJson(id), removedMedia };
  } catch (error) {
    return failure(error);
  }
}

export async function saveArticle(row) {
  if (!['event', 'international'].includes(row?.type)) {
    return failure(new Error('Type d’article invalide.'));
  }
  return saveItem('articles', row);
}

export async function deleteArticle(id) {
  return deleteItem('articles', id);
}

export async function saveImagesSport(row) {
  if (!String(row?.title ?? '').trim()) {
    return failure(new Error('Le titre de la discipline est requis.'));
  }
  return saveItem('images_sport', row);
}

export async function deleteImagesSport(id) {
  return deleteItem('images_sport', id);
}

export async function saveCategorySport(row) {
  try {
    const discipline = canonicalDiscipline(row?.discipline);
    if (!discipline) {
      throw new Error(`Discipline invalide : choisissez l’une des six disciplines autorisées.`);
    }

    const sousDiscipline = String(row?.sous_discipline ?? '').trim();
    if (!sousDiscipline || sousDiscipline.toLocaleLowerCase('fr') === 'sans titre') {
      throw new Error('La sous-discipline est requise.');
    }

    const coverImage = String(row?.cover_image ?? '').trim();
    if (!coverImage) {
      throw new Error('Une image de couverture est obligatoire.');
    }

    const decodedImages = decodeMaybeJson(row?.images);
    const images = Array.isArray(decodedImages)
      ? decodedImages
      : decodedImages
        ? [decodedImages]
        : [];
    if (images.length > MAX_CATEGORY_IMAGES) {
      throw new Error(
        `4 images secondaires maximum (${images.length} reçues).`
      );
    }

    return saveItem('categories_sport', {
      ...row,
      discipline,
      sous_discipline: sousDiscipline,
      slug: slugify(`${discipline}-${sousDiscipline}`),
      cover_image: coverImage,
      images: JSON.stringify(images),
    });
  } catch (error) {
    return failure(error);
  }
}

export async function deleteCategorySport(id) {
  return deleteItem('categories_sport', id);
}

export async function saveSportif(row) {
  return saveItem('sportifs_semaine', row);
}

export async function deleteSportif(id) {
  return deleteItem('sportifs_semaine', id);
}

export async function saveVitrine(row) {
  if (!['moment_fort', 'portrait_exclusif'].includes(row?.section)) {
    return failure(new Error('Section de vitrine invalide.'));
  }
  return saveItem('vitrine_items', row);
}

export async function deleteVitrine(id) {
  return deleteItem('vitrine_items', id);
}
