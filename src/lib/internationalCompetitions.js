import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { getRemoteArticles } from './supabase/content';
import {
  hasValidTitle,
  mergeCollections,
  normalizeImages,
  sortByDateDesc,
} from './supabase/records';

function isValidCompetition(item) {
  if (!hasValidTitle(item)) return false;
  return item.source !== 'supabase' || item.type === 'international';
}

const competitionsDirectory = path.join(
  process.cwd(),
  'content/international-competitions'
);

export function formatCompetitionDate(date) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(String(date || ''))) {
    const parsed = new Date(`${date}T12:00:00`);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    }
  }
  return date || 'Date à confirmer';
}

export function getLocalCompetitions() {
  if (!fs.existsSync(competitionsDirectory)) return [];

  return fs.readdirSync(competitionsDirectory)
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fileContents = fs.readFileSync(
        path.join(competitionsDirectory, fileName),
        'utf8'
      );
      const { data, content } = matter(fileContents);

      return {
        slug,
        ...data,
        images: normalizeImages(data.images, data.title || 'Compétition'),
        content: content?.trim() || '',
        source: 'markdown',
      };
    });
}

export async function getAllInternationalCompetitions() {
  const [local, remote] = await Promise.all([
    Promise.resolve(getLocalCompetitions()),
    getRemoteArticles('international'),
  ]);

  return sortByDateDesc(
    mergeCollections(
      local.filter(isValidCompetition),
      remote.filter(isValidCompetition)
    )
  );
}

export async function getInternationalCompetitionBySlug(slug) {
  if (!/^[a-z0-9-]+$/.test(String(slug || ''))) return null;
  const competitions = await getAllInternationalCompetitions();
  return (
    competitions.find((competition) => competition.slug === slug) ?? null
  );
}
