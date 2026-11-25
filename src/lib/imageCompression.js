// Compression côté client avant envoi vers Supabase Storage.
// On reste volontairement hors des composants React pour éviter les règles de pureté du render.

import {
  getUploadExtension,
  validateUploadFile,
  MAX_COMPRESSED_FILE_BYTES,
} from './upload';

export const MAX_UPLOAD_WIDTH = 1600;
export const UPLOAD_QUALITY = 0.82;

// Paliers essayés dans l'ordre jusqu'à obtenir un fichier ≤ 3 Mo.
//Une photo très lourde n'est donc jamais rejetée pour cause de taille :
// on diminue d'abord la qualité, puis les dimensions.
const WIDTH_STEPS = [1600, 1400, 1200, 1000, 800, 640, 480];
const QUALITY_STEPS = [UPLOAD_QUALITY, 0.7, 0.58, 0.45, 0.35, 0.25];

// Compatibilité : l'extension renvoyée est toujours une extension photo autorisée.
export function getFileExtension(fileName) {
  return getUploadExtension(fileName) || 'jpg';
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type, quality);
  });
}

// Garde le ratio d'origine et ne dépasse jamais 1600 px, même sur les photos
// très portrait (hauteur aussi limitée).
function scaledDimensions(naturalWidth, naturalHeight, targetSide) {
  const scale = Math.min(1, targetSide / naturalWidth, targetSide / naturalHeight);
  return {
    width: Math.max(1, Math.round(naturalWidth * scale)),
    height: Math.max(1, Math.round(naturalHeight * scale)),
  };
}

/**
 * Vérifie le format (JPG/PNG/WebP uniquement), puis redimensionne à 1600 px max
 * et encode en WebP qualité 0.82 (repli JPEG). Si le résultat dépasse 3 Mo, on
 * réessaie avec une qualité puis une taille décroissantes jusqu'à ce qu'il
 * passe sous la limite — la photo est compressée, pas refusée.
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

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Compression impossible sur ce navigateur.');

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';

    let smallest = null;

    for (const targetSide of WIDTH_STEPS) {
      const { width, height } = scaledDimensions(
        naturalWidth,
        naturalHeight,
        targetSide
      );
      canvas.width = width;
      canvas.height = height;
      context.drawImage(image, 0, 0, width, height);

      for (const quality of QUALITY_STEPS) {
        let blob = await canvasToBlob(canvas, 'image/webp', quality);
        let extension = 'webp';

        if (blob?.type !== 'image/webp' || blob.size === 0) {
          blob = await canvasToBlob(canvas, 'image/jpeg', quality);
          extension = 'jpg';
        }

        if (!blob || blob.size === 0) continue;

        const result = {
          blob,
          extension,
          compressed: true,
          width,
          height,
          quality,
          originalSize: file.size,
          size: blob.size,
        };
        if (!smallest || blob.size < smallest.size) smallest = result;
        if (blob.size <= MAX_COMPRESSED_FILE_BYTES) return result;
      }
    }

    // Dernier recours : la version la plus légère obtenue est renvoyée plutôt
    // que de rejeter la photo (cas extrême, quasi impossible en WebP).
    if (smallest) return smallest;
    throw new Error('Impossible de compresser cette image.');
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error('Impossible de traiter cette image.');
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
