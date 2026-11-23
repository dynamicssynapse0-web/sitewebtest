import type { MetadataRoute } from 'next';
import { getAllEvents } from '@/lib/events';
import { getAllInternationalCompetitions } from '@/lib/internationalCompetitions';
import { listeSports } from '@/lib/sports';
import { portraits } from '@/lib/sportifsSemaine';
import { absoluteUrl } from '@/lib/seo';

export const revalidate = 86400;

function lastModifiedFromDate(date: unknown): Date {
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    const parsed = new Date(`${date}T12:00:00`);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return new Date();
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl('/'), lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: absoluteUrl('/evenements'), lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: absoluteUrl('/galerie'), lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: absoluteUrl('/sports'), lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: absoluteUrl('/a-propos'), lastModified: now, changeFrequency: 'yearly', priority: 0.5 },
    { url: absoluteUrl('/contact'), lastModified: now, changeFrequency: 'yearly', priority: 0.5 },
  ];

  const sportPages: MetadataRoute.Sitemap = listeSports.map(({ slug }) => ({
    url: absoluteUrl(`/sports/${slug}`),
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const portraitPages: MetadataRoute.Sitemap = portraits.map(({ id }) => ({
    url: absoluteUrl(`/sportifs-semaine/${id}`),
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const eventPages: MetadataRoute.Sitemap = getAllEvents().map((event) => ({
    url: absoluteUrl(`/evenements/${event.slug}`),
    lastModified: lastModifiedFromDate(event.date),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const competitionPages: MetadataRoute.Sitemap = getAllInternationalCompetitions().map(
    (competition) => ({
      url: absoluteUrl(`/competitions-internationales/${competition.slug}`),
      lastModified: lastModifiedFromDate(competition.date),
      changeFrequency: 'monthly',
      priority: 0.8,
    })
  );

  return [
    ...staticPages,
    ...sportPages,
    ...portraitPages,
    ...eventPages,
    ...competitionPages,
  ];
}
