'use server';

import { revalidatePath } from 'next/cache';
import { isAdPlacement } from '@/lib/ads';
import { normalizeAdLink } from '@/lib/adLink';
import { getAdminContext } from '@/lib/supabase/admin';
import { getServerSupabase } from '@/lib/supabase/server';
import {
  canonicalDiscipline,
  MAX_CATEGORY_IMAGES,
  parseImagesField,
} from '@/lib/categoriesSport';
import { internationalCompetitionSlug } from '@/lib/internationalCompetitions';
import { ARTICLES_TABLE, resolveArticlesTable } from '@/lib/supabase/content';
import { slugify } from '@/lib/supabase/records';
import { errorText, toPlainJson } from '@/lib/supabase/serialization';
import { SUPABASE_MEDIA_BUCKET } from '@/lib/supabase/config';

const ALLOWED_TABLES = new Set([
  'articles',
  ARTICLES_TABLE,
  'images_sport',
  'categories_sport',
  'sportifs_semaine',
  'vitrine_items',
  'ads',
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
  '/annonceurs',
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

    if ((table === ARTICLES_TABLE || table === 'articles') && slug) {
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
    const value = parseImagesField(row?.[column]);
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

// Construit un slug lisible à partir du titre et d'un champ distinctif
// (événement, date, joueur…). Les valeurs vides sont ignorées.
function composedSlug(...parts) {
  return slugify(
    parts
      .map((part) => String(part ?? '').trim())
      .filter(Boolean)
      .join('-')
  );
}

// Dernier filet de sécurité : si deux fiches ont exactement les mêmes valeurs,
// on ajoute -2, -3… au lieu de réutiliser (et donc d'écraser) une URL publiée.
async function uniqueSlug(supabase, table, desired, currentId = null) {
  const base = slugify(desired);
  if (!base) return null;

  const used = new Set();
  try {
    const { data, error } = await supabase.from(table).select('id, slug');
    if (error) throw error;
    (data || []).forEach((row) => {
      if (currentId && String(row.id) === String(currentId)) return;
      const existing = slugify(row.slug);
      if (existing) used.add(existing);
    });
  } catch {
    // Une lecture impossible ne doit pas bloquer l'enregistrement.
  }

  if (!used.has(base)) return base;
  for (let index = 2; ; index += 1) {
    const candidate = `${base}-${index}`;
    if (!used.has(candidate)) return candidate;
  }
}

async function saveItem(table, row) {
  try {
    if (!ALLOWED_TABLES.has(table)) throw new Error('Table non autorisée.');
    if (!row || typeof row !== 'object' || Array.isArray(row)) {
      throw new Error('Données invalides.');
    }

    const supabase = await requireAdmin();
    const targetTable =
      table === ARTICLES_TABLE || table === 'articles'
        ? await resolveArticlesTable(supabase)
        : table;
    if (!ALLOWED_TABLES.has(targetTable)) {
      throw new Error('Table non autorisée.');
    }

    const plainRow = toPlainJson(row);
    const slug = await uniqueSlug(
      supabase,
      targetTable,
      plainRow.slug || plainRow.title,
      plainRow.id
    );
    const payload = cleanRow({ ...plainRow, slug });

    const result = plainRow.id
      ? await supabase
          .from(targetTable)
          .update(payload)
          .eq('id', plainRow.id)
          .select()
          .single()
      : await supabase.from(targetTable).insert(payload).select().single();

    if (result.error) throw new Error(result.error.message);

    revalidatePublicContent(result.data, targetTable);
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
    const targetTable =
      table === ARTICLES_TABLE || table === 'articles'
        ? await resolveArticlesTable(supabase)
        : table;
    if (!ALLOWED_TABLES.has(targetTable)) {
      throw new Error('Suppression impossible.');
    }

    // Capture de la ligne et de ses sources avant la suppression.
    const deletedRow = await getDeletedRow(supabase, targetTable, id);
    const sources = collectSources(deletedRow);

    const { error } = await supabase.from(targetTable).delete().eq('id', id);
    if (error) throw new Error(error.message);

    revalidatePublicContent(deletedRow, targetTable);

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

// Événements : même logique que les grandes compétitions. Deux événements
// peuvent partager un titre ; la date et le lieu distinguent leurs URLs.
export async function saveEvent(row) {
  try {
    const title = String(row?.title ?? '').trim();
    if (!title) throw new Error('Le titre de l’événement est requis.');

    const previousSlug = String(row?.slug ?? '').trim();
    const slug =
      row?.id && previousSlug
        ? slugify(previousSlug)
        : composedSlug(title, row?.date, row?.location, row?.season);
    if (!slug) throw new Error('Impossible de générer une URL valide.');

    return saveItem(ARTICLES_TABLE, {
      ...row,
      type: 'event',
      title,
      slug,
    });
  } catch (error) {
    return failure(error);
  }
}

export async function deleteEvent(id) {
  return deleteItem(ARTICLES_TABLE, id);
}

// Grandes compétitions : même table `event_bilderfassung` (type international) que
// getAllInternationalCompetitions(), avec les contraintes du nouveau formulaire.
export async function saveInternationalCompetition(row) {
  try {
    const title = String(row?.title ?? '').trim();
    if (!title) throw new Error('Le titre de la compétition est requis.');

    const eventTitle = String(row?.competition ?? '').trim();
    // À la création, le slug combine le titre et l'événement afin que
    // « CAN 2017 — Cameroun vs Brésil » et « CAN 2017 — Cameroun vs Nigeria »
    // aient deux URLs distinctes. En modification, on conserve le slug existant
    // pour ne pas casser les liens déjà publiés.
    const previousSlug = String(row?.slug ?? '').trim();
    const slug =
      row?.id && previousSlug
        ? slugify(previousSlug)
        : internationalCompetitionSlug(title, eventTitle);
    if (!slug) throw new Error('Impossible de générer une URL valide.');

    const coverImage = String(row?.cover_image ?? '').trim();
    if (!coverImage) {
      throw new Error('Une photo de couverture est obligatoire.');
    }

    const decodedImages = parseImagesField(row?.images);
    const images = Array.isArray(decodedImages)
      ? decodedImages
      : decodedImages
        ? [decodedImages]
        : [];
    if (images.length > 4) {
      throw new Error(`4 photos maximum pour la galerie (${images.length} reçues).`);
    }

    return saveItem(ARTICLES_TABLE, {
      ...row,
      type: 'international',
      title,
      competition: eventTitle,
      slug,
      cover_image: coverImage,
      images,
    });
  } catch (error) {
    return failure(error);
  }
}

export async function deleteInternationalCompetition(id) {
  return deleteItem(ARTICLES_TABLE, id);
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

    const decodedImages = parseImagesField(row?.images);
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

    const previousSlug = String(row?.slug ?? '').trim();
    const slug =
      row?.id && previousSlug
        ? slugify(previousSlug)
        : slugify(`${discipline}-${sousDiscipline}`);

    return saveItem('categories_sport', {
      ...row,
      discipline,
      sous_discipline: sousDiscipline,
      slug,
      // `images` est une colonne jsonb : on envoie un tableau, pas une chaîne
      // déjà sérialisée (sinon Supabase stocke un JSON string double-encodé).
      cover_image: coverImage,
      images,
    });
  } catch (error) {
    return failure(error);
  }
}

export async function deleteCategorySport(id) {
  return deleteItem('categories_sport', id);
}

// Sportifs de la semaine : la page publique est /sportifs-semaine/[id] et
// l'id public est le slug. Le nom du joueur distingue deux portraits qui
// partagent le même titre.
export async function saveSportif(row) {
  try {
    const title = String(row?.title ?? '').trim();
    const playerName = String(row?.player_name ?? '').trim();
    if (!title && !playerName) {
      throw new Error('Le titre ou le nom du joueur est requis.');
    }

    const previousSlug = String(row?.slug ?? '').trim();
    let slug = '';
    if (row?.id && previousSlug) {
      slug = slugify(previousSlug);
    } else {
      const parts = [title || playerName];
      if (playerName && slugify(playerName) !== slugify(parts[0])) {
        parts.push(playerName);
      }
      slug = composedSlug(...parts);
    }
    if (!slug) throw new Error('Impossible de générer une URL valide.');

    return saveItem('sportifs_semaine', { ...row, slug });
  } catch (error) {
    return failure(error);
  }
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

// Publicité : validation stricte de l'emplacement et du lien sortant avant
// toute écriture. Le visuel est uploadé dans `media` comme les autres contenus.
export async function saveAd(row) {
  try {
    const title = String(row?.title ?? '').trim();
    if (!title || title.toLocaleLowerCase('fr') === 'sans titre') {
      throw new Error('Le titre de la campagne est requis.');
    }
    if (!isAdPlacement(row?.placement)) {
      throw new Error('Choisissez un emplacement publicitaire valide.');
    }

    const link = normalizeAdLink(row?.link_url);
    if (!link.ok) {
      throw new Error(link.error);
    }

    if (!String(row?.cover_image ?? row?.image ?? '').trim()) {
      throw new Error('Le visuel de la publicité est obligatoire.');
    }

    const dateDebut = String(row?.date_debut ?? '');
    const dateFin = String(row?.date_fin ?? '');
    if (
      dateDebut &&
      !/^\d{4}-\d{2}-\d{2}$/.test(dateDebut)
    ) {
      throw new Error('La date de début est invalide.');
    }
    if (dateFin && !/^\d{4}-\d{2}-\d{2}$/.test(dateFin)) {
      throw new Error('La date de fin est invalide.');
    }
    if (dateDebut && dateFin && dateFin < dateDebut) {
      throw new Error('La date de fin doit être postérieure à la date de début.');
    }

    return saveItem('ads', {
      ...row,
      title,
      advertiser: String(row?.advertiser ?? '').trim() || title,
      link_url: link.url,
      image: String(row?.image ?? row?.cover_image ?? '').trim(),
      active: row?.active !== false,
      ordre: Number(row?.ordre) || 0,
    });
  } catch (error) {
    return failure(error);
  }
}

export async function deleteAd(id) {
  return deleteItem('ads', id);
}
