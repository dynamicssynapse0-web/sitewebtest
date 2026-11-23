'use server';

import { getAdminContext } from '@/lib/supabase/admin';
import { getServerSupabase } from '@/lib/supabase/server';
import { decodeMaybeJson, slugify } from '@/lib/supabase/records';
import { SUPABASE_MEDIA_BUCKET } from '@/lib/supabase/config';

const ALLOWED_TABLES = new Set([
  'articles',
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

async function writeRow(table, row) {
  if (!ALLOWED_TABLES.has(table)) throw new Error('Table non autorisée.');

  const supabase = await requireAdmin();
  const payload = cleanRow({
    ...row,
    slug: slugify(row.slug || row.title) || row.slug || null,
  });

  const result = row.id
    ? await supabase
        .from(table)
        .update(payload)
        .eq('id', row.id)
        .select()
        .single()
    : await supabase.from(table).insert(payload).select().single();

  if (result.error) throw new Error(result.error.message);
  return result.data;
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

async function getMediaSources(supabase, table, id) {
  const { data: row } = await supabase
    .from(table)
    .select('*')
    .eq('id', id)
    .maybeSingle();

  return collectSources(row);
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

async function removeRow(table, id) {
  if (!ALLOWED_TABLES.has(table) || !id) {
    throw new Error('Suppression impossible.');
  }

  const supabase = await requireAdmin();

  // Capture des sources avant la suppression de la ligne.
  const sources = await getMediaSources(supabase, table, id);

  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw new Error(error.message);

  // Nettoyage Storage après la suppression : un échec ici ne doit pas annuler
  // une suppression déjà effectuée (seuls des fichiers orphelins resteraient).
  let removedMedia = [];
  try {
    removedMedia = await removeUnusedMedia(supabase, sources);
  } catch {
    removedMedia = [];
  }

  return { id, removedMedia };
}

export async function saveArticle(row) {
  if (!['event', 'international'].includes(row?.type)) {
    throw new Error('Type d’article invalide.');
  }
  return writeRow('articles', row);
}

export async function deleteArticle(id) {
  return removeRow('articles', id);
}

export async function saveSportif(row) {
  return writeRow('sportifs_semaine', row);
}

export async function deleteSportif(id) {
  return removeRow('sportifs_semaine', id);
}

export async function saveVitrine(row) {
  if (!['moment_fort', 'portrait_exclusif'].includes(row?.section)) {
    throw new Error('Section de vitrine invalide.');
  }
  return writeRow('vitrine_items', row);
}

export async function deleteVitrine(id) {
  return removeRow('vitrine_items', id);
}
