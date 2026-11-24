// Compression côté client avant envoi vers Supabase Storage.
// On reste volontairement hors des composants React pour éviter les règles de pureté du render.

import {
  getUploadExtension,
  validateUploadFile,
  MAX_COMPRESSED_FILE_BYTES,
} from './upload';

export const MAX_UPLOAD_WIDTH = 1600;
export const UPLOAD_QUALITY = 0.82;

// Compatibilité : l'extension renvoyée est toujours une extension photo autorisée.
export function getFileExtension(fileName) {
  return getUploadExtension(fileName) || 'jpg';
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type, quality);
  });
}

/**
 * Vérifie le fichier (JPG/PNG/WebP, 15 Mo max), le redimensionne à 1600 px de
 * large maximum et l'encode en WebP qualité 0.82 (repli JPEG). Le fichier
 * compressé ne doit pas dépasser 3 Mo ; sinon l'upload est refusé.
 */
export async function compressImageForUpload(file) {
  const validationError = validateUploadFile(file, { stage: 'original' });
  if (validationError) throw new Error(validationError);

  if (typeof window === 'undefined' || typeof document === 'undefined') {
    throw new Error('Le traitement des photos nécessite un navigateur.');
  }

  const objectUrl = URL.createObjectURL(file);

  try {
    const image = new Image();
    image.decoding = 'async';
    image.src = objectUrl;

    if (typeof image.decode === 'function') {
      await image.decode();
    } else {
      await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = reject;
      });
    }

    const naturalWidth = image.naturalWidth;
    const naturalHeight = image.naturalHeight;
    if (!naturalWidth || !naturalHeight) {
      throw new Error('Image illisible.');
    }

    const scale = Math.min(1, MAX_UPLOAD_WIDTH / naturalWidth);
    const width = Math.max(1, Math.round(naturalWidth * scale));
    const height = Math.max(1, Math.round(naturalHeight * scale));

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');
    if (!context) throw new Error('Compression impossible sur ce navigateur.');

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    context.drawImage(image, 0, 0, width, height);

    let blob = await canvasToBlob(canvas, 'image/webp', UPLOAD_QUALITY);
    let extension = 'webp';

    if (blob?.type !== 'image/webp' || blob.size === 0) {
      blob = await canvasToBlob(canvas, 'image/jpeg', UPLOAD_QUALITY);
      extension = 'jpg';
    }

    if (!blob || blob.size === 0) {
      throw new Error('Impossible de compresser cette image.');
    }
    if (blob.size > MAX_COMPRESSED_FILE_BYTES) {
      throw new Error('Photo trop volumineuse après compression (3 Mo maximum).');
    }

    return {
      blob,
      extension,
      compressed: true,
      width,
      height,
      originalSize: file.size,
      size: blob.size,
    };
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error('Impossible de traiter cette image.');
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
