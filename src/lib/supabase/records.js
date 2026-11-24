export function slugify(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('fr')
    .replace(/['’]/g, '-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);
}

export function toIsoDate(value) {
  if (!value) return '';
  if (typeof value === 'string') return value.slice(0, 10);
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  return '';
}

export function decodeMaybeJson(value) {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  if (!trimmed.startsWith('[') && !trimmed.startsWith('{')) return value;
  try {
    return JSON.parse(trimmed);
  } catch {
    return value;
  }
}

export function normalizeImages(value, fallbackTitle = 'Photo') {
  const decoded = decodeMaybeJson(value);
  const list = Array.isArray(decoded)
    ? decoded
    : decoded
      ? [decoded]
      : [];

  return list
    .map((item) => {
      const source = typeof item === 'string' ? { src: item } : item || {};
      const src =
        source.src ||
        source.url ||
        source.path ||
        source.image_url ||
        source.image ||
        '';
      if (!src) return null;

      return {
        src,
        alt: source.alt || `${fallbackTitle} — photo`,
        legend: source.legend || source.caption || source.title || fallbackTitle,
        credit: source.credit || 'Aubin Simo',
      };
    })
    .filter(Boolean);
}

export function mergeImages(...groups) {
  const merged = new Map();

  groups.flat().forEach((image) => {
    const normalized = normalizeImages(image)[0];
    if (!normalized || merged.has(normalized.src)) return;
    merged.set(normalized.src, normalized);
  });

  return Array.from(merged.values());
}

export function getCalendarTimestamp(date) {
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return 0;
  const parsed = new Date(`${date}T12:00:00`);
  return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime();
}

export function sortByDateDesc(items = []) {
  return [...items].sort(
    (a, b) => getCalendarTimestamp(b.date) - getCalendarTimestamp(a.date)
  );
}

// Exclut les anciennes lignes vides ou « Sans titre » qui pollueraient
// l'administration et les pages publiques.
export function hasValidTitle(item) {
  const title = String(item?.title ?? item?.titre ?? '').trim();
  return Boolean(title) && title.toLocaleLowerCase('fr') !== 'sans titre';
}

export function toBoolean(value) {
  if (value === true) return true;
  return ['true', '1', 'oui', 'vrai', 'yes'].includes(
    String(value ?? '').trim().toLocaleLowerCase('fr')
  );
}
