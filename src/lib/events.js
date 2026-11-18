import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const eventsDirectory = path.join(process.cwd(), 'content/events');

function getCalendarTimestamp(date) {
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return 0;
  }

  const parsedDate = new Date(`${date}T12:00:00`);
  return Number.isNaN(parsedDate.getTime()) ? 0 : parsedDate.getTime();
}

export function formatEventDate(date, season) {
  if (getCalendarTimestamp(date)) {
    return new Date(`${date}T12:00:00`).toLocaleDateString('fr-FR');
  }

  if (season) return `Saison ${season}`;
  if (date) return date;
  return 'Date à confirmer';
}

export function getAllEvents() {
  // On vérifie si le dossier existe
  if (!fs.existsSync(eventsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(eventsDirectory);
  
  const allEventsData = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, '');
    const fullPath = path.join(eventsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug,
      ...data,
      content,
    };
  });

  // Trier les dates calendrier valides de la plus récente à la plus ancienne.
  return allEventsData.sort(
    (a, b) => getCalendarTimestamp(b.date) - getCalendarTimestamp(a.date)
  );
}
