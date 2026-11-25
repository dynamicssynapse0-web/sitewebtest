// Génération des noms de fichiers médias + validation stricte des uploads.
// Les appels impurs (Date.now, random) restent dans ce module et ne sont jamais
// exécutés pendant le render d'un composant React.

const ACCENTED_CHARACTERS = /[\u0300-\u036f]/g;

// Taille de référence avant compression. Ce n'est plus un motif de rejet :
// toute photo JPG/PNG/WebP est compressée automatiquement avant l'upload.
export const MAX_ORIGINAL_FILE_BYTES = 15 * 1024 * 1024;
export const MAX_COMPRESSED_FILE_BYTES = 3 * 1024 * 1024; // 3 Mo après compression

export const ALLOWED_UPLOAD_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
]);
export const ALLOWED_UPLOAD_EXTENSIONS = new Set([
  'jpg',
  'jpeg',
  'png',
  'webp',
]);

const MIME_TO_EXTENSION = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

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

// Extension autorisée uniquement : jamais de .html/.svg/.js/.exe.
export function getUploadExtension(fileName) {
  const extension = String(fileName || '')
    .split('.')
    .pop()
    ?.toLocaleLowerCase('fr');
  return ALLOWED_UPLOAD_EXTENSIONS.has(extension || '') ? extension : '';
}

/**
 * Refuse tout fichier dont le type MIME, l'extension ou la taille ne correspond
 * pas aux photos autorisées. Renvoie null quand le fichier est valide.
 */
export function validateUploadFile(file, { stage = 'original' } = {}) {
  if (!file) return 'Aucun fichier sélectionné.';

  const mimeType = String(file.type || '').toLowerCase();
  if (!ALLOWED_UPLOAD_TYPES.has(mimeType)) {
    return 'Formats acceptés : JPG, PNG ou WebP uniquement.';
  }

  const extension = getUploadExtension(file.name);
  if (!extension) {
    return 'Extension de fichier non autorisée (JPG, PNG ou WebP uniquement).';
  }

  const expectedExtensions =
    mimeType === 'image/jpeg' ? ['jpg', 'jpeg'] : [MIME_TO_EXTENSION[mimeType]];
  if (!expectedExtensions.includes(extension)) {
    return 'L’extension et le type du fichier ne correspondent pas.';
  }

  // La taille d'origine n'est PAS un motif de rejet : une photo de 20 Mo est
  // tout à fait acceptable puisqu'elle sera compressée avant l'envoi.
  // Seul le résultat compressé doit rester sous 3 Mo.
  if (
    stage === 'compressed' &&
    Number(file.size || 0) > MAX_COMPRESSED_FILE_BYTES
  ) {
    return 'Photo trop volumineuse après compression (3 Mo maximum).';
  }

  return null;
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
export function buildUniqueUploadName({
  title,
  index = 0,
  extension = 'jpg',
  mimeType,
  tag = '',
} = {}) {
  const base = uploadFileBase(title);
  const candidate = String(extension || '').toLowerCase();
  const safeExtension = ALLOWED_UPLOAD_EXTENSIONS.has(candidate)
    ? candidate
    : MIME_TO_EXTENSION[String(mimeType || '').toLowerCase()] || 'jpg';
  const safeTag = String(tag || '')
    .toLocaleLowerCase('fr')
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return `aubin-simo-bilderfassung-${base}${safeTag ? `-${safeTag}` : ''}-${getUploadTimestamp()}-${index}-${randomSuffix()}.${safeExtension}`;
}
