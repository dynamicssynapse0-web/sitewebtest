// Transforme une liste d'images normalisées en slides pour la lightbox partagée.
export function toLightboxSlides(images = [], fallbackTitle = 'Photo', suffix = '') {
  return images
    .map((image, index) => {
      const value =
        typeof image === 'string'
          ? { src: image }
          : image && typeof image === 'object'
            ? image
            : {};
      const src = value.src || value.url || value.image || value.path || '';
      if (!src) return null;

      const title = value.legend || value.caption || value.title || fallbackTitle;
      const details = [value.credit || 'Aubin Simo', suffix]
        .map((part) => String(part || '').trim())
        .filter(Boolean)
        .join(' · ');

      return {
        src,
        alt: value.alt || `${fallbackTitle} — photo ${index + 1}`,
        title,
        description: details,
      };
    })
    .filter(Boolean);
}
