import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { getRemoteArticles } from './supabase/content';
import {
  mergeCollections,
  normalizeImages,
  sortByDateDesc,
} from './supabase/records';

const eventsDirectory = path.join(process.cwd(), 'content/events');

export function formatEventDate(date, season) {
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

  if (season) return `Saison ${season}`;
  if (date) return date;
  return 'Date à confirmer';
}

export function getLocalEvents() {
  if (!fs.existsSync(eventsDirectory)) return [];

  return fs.readdirSync(eventsDirectory)
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fileContents = fs.readFileSync(
        path.join(eventsDirectory, fileName),
        'utf8'
      );
      const { data, content } = matter(fileContents);

      return {
        slug,
        ...data,
        images: normalizeImages(data.images, data.title || 'Événement'),
        content: content?.trim() || '',
        source: 'markdown',
      };
    });
}

export async function getAllEvents() {
  const [local, remote] = await Promise.all([
    Promise.resolve(getLocalEvents()),
    getRemoteArticles('event'),
  ]);

  return sortByDateDesc(mergeCollections(local, remote));
}

export async function getEventBySlug(slug) {
  if (!/^[a-z0-9-]+$/.test(String(slug || ''))) return null;
  const events = await getAllEvents();
  return events.find((event) => event.slug === slug) ?? null;
}
