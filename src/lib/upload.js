// Génération des noms de fichiers médias.
// Les appels impurs (Date.now, random) restent dans ce module et ne sont jamais
// exécutés pendant le render d'un composant React.

const ACCENTED_CHARACTERS = /[\u0300-\u036f]/g;

export function getUploadTimestamp() {
  return Date.now();
}

export function uploadFileBase(title) {
  return (
    String(title || '')
      .normalize('NFD')
      .replace(ACCENTED_CHARACTERS, '')
      .toLocaleLowerCase('fr')
      .replace(/['’]/g, '-')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 90) || 'photo'
  );
}

function randomSuffix() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID().replace(/-/g, '').slice(0, 8);
  }
  return Math.random().toString(36).slice(2, 10);
}

/**
 * Nom SEO unique, même pour plusieurs fichiers envoyés dans la même milliseconde :
 * aubin-simo-bilderfassung-<slug>-<timestamp ms>-<index>-<random>.<ext>
 */
export function buildUniqueUploadName({ title, index = 0, extension = 'jpg' } = {}) {
  const base = uploadFileBase(title);
  const safeExtension = /^[a-z0-9]{2,5}$/.test(String(extension || ''))
    ? String(extension).toLowerCase()
    : 'jpg';

  return `aubin-simo-bilderfassung-${base}-${getUploadTimestamp()}-${index}-${randomSuffix()}.${safeExtension}`;
}
