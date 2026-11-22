export const SITE_URL = 'https://bilderfassung.com';
export const SITE_NAME = 'Bilderfassung';
export const SITE_DESCRIPTION =
  "L'œil du sport par Aubin Simo : photographies d'événements sportifs au Cameroun (football, basketball, athlétisme, boxe).";
export const DEFAULT_OG_IMAGE = '/images/aubin-simo-photographe-football-CAN2027.jpg';

export function absoluteUrl(path = '/') {
  return new URL(path, SITE_URL).toString();
}

// Complète le metadata racine (metadataBase, titre template, réseaux sociaux).
export function pageMetadata({
  title,
  description,
  path = '/',
  image = DEFAULT_OG_IMAGE,
} = {}) {
  const cleanDescription =
    typeof description === 'string' ? description.trim() : description;

  return {
    ...(title ? { title } : {}),
    ...(cleanDescription ? { description: cleanDescription } : {}),
    alternates: { canonical: path },
    openGraph: {
      url: path,
      ...(title ? { title } : {}),
      ...(cleanDescription ? { description: cleanDescription } : {}),
      images: [{ url: image, alt: title || SITE_NAME }],
    },
    twitter: {
      card: 'summary_large_image',
      ...(title ? { title } : {}),
      ...(cleanDescription ? { description: cleanDescription } : {}),
      images: [image],
    },
  };
}
