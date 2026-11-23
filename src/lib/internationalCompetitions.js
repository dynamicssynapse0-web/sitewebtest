import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const competitionsDirectory = path.join(
  process.cwd(),
  'content/international-competitions'
);

function readCompetitionFile(fileName) {
  const slug = fileName.replace(/\.md$/, '');
  const fullPath = path.join(competitionsDirectory, fileName);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return { slug, ...data, content };
}

function getDateTimestamp(date) {
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return 0;
  }

  const parsedDate = new Date(`${date}T12:00:00`);
  return Number.isNaN(parsedDate.getTime()) ? 0 : parsedDate.getTime();
}

export function formatCompetitionDate(date) {
  if (!getDateTimestamp(date)) return date || 'Date à confirmer';
  return new Date(`${date}T12:00:00`).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * @typedef {{ slug: string, date?: string, competition?: string, content: string, [key: string]: any }} Competition
 */

/** @returns {Competition[]} */
export function getAllInternationalCompetitions() {
  if (!fs.existsSync(competitionsDirectory)) return [];

  return fs
    .readdirSync(competitionsDirectory)
    .filter((fileName) => fileName.endsWith('.md'))
    .map(readCompetitionFile)
    .sort((a, b) => getDateTimestamp(b.date) - getDateTimestamp(a.date));
}

export function getInternationalCompetitionBySlug(slug) {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;

  const fileName = `${slug}.md`;
  const fullPath = path.join(competitionsDirectory, fileName);
  if (!fs.existsSync(fullPath)) return null;

  return readCompetitionFile(fileName);
}
