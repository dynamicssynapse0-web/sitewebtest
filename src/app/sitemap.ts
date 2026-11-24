import type { MetadataRoute } from 'next';
import { getAllCategoriesSport } from '@/lib/categoriesSport';
import { getAllEvents } from '@/lib/events';
import { getAllInternationalCompetitions } from '@/lib/internationalCompetitions';
import { getAllSports } from '@/lib/sports';
import { getAllSportifs } from '@/lib/sportifsSemaine';
import { absoluteUrl } from '@/lib/seo';

export const revalidate = 86400;

function lastModifiedFromDate(date: unknown): Date {
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    const parsed = new Date(`${date}T12:00:00`);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return new Date();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const [events, competitions, sportifs, sports, categoriesSport] = await Promise.all([
    getAllEvents(),
    getAllInternationalCompetitions(),
    getAllSportifs(),
    getAllSports(),
    getAllCategoriesSport(),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl('/'), lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: absoluteUrl('/evenements'), lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: absoluteUrl('/galerie'), lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: absoluteUrl('/sports'), lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: absoluteUrl('/competitions-internationales'), lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: absoluteUrl('/a-propos'), lastModified: now, changeFrequency: 'yearly', priority: 0.5 },
    { url: absoluteUrl('/contact'), lastModified: now, changeFrequency: 'yearly', priority: 0.5 },
  ];

  const sportPages: MetadataRoute.Sitemap = sports.map(({ slug }) => ({
    url: absoluteUrl(`/sports/${slug}`),
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const categoryPages: MetadataRoute.Sitemap = categoriesSport.map((category: { href: string }) => ({
    url: absoluteUrl(category.href),
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const portraitPages: MetadataRoute.Sitemap = sportifs.map((portrait) => ({
    url: absoluteUrl(`/sportifs-semaine/${String(portrait.id)}`),
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const eventPages: MetadataRoute.Sitemap = events.map((event) => ({
    url: absoluteUrl(`/evenements/${String(event.slug)}`),
    lastModified: lastModifiedFromDate(event.date),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const competitionPages: MetadataRoute.Sitemap = competitions.map((competition) => ({
    url: absoluteUrl(`/competitions-internationales/${String(competition.slug)}`),
    lastModified: lastModifiedFromDate(competition.date),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [
    ...staticPages,
    ...sportPages,
    ...categoryPages,
    ...portraitPages,
    ...eventPages,
    ...competitionPages,
  ];
}
