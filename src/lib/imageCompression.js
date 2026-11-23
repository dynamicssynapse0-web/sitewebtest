// Compression côté client avant envoi vers Supabase Storage.
// On reste volontairement hors des composants React pour éviter les règles de pureté du render.

export const MAX_UPLOAD_WIDTH = 1600;
export const UPLOAD_QUALITY = 0.82;

export function getFileExtension(fileName) {
  const extension = String(fileName || '').split('.').pop()?.toLocaleLowerCase('fr');
  return /^[a-z0-9]{2,5}$/.test(extension || '') ? extension : 'jpg';
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type, quality);
  });
}

/**
 * Redimensionne à 1600 px de large maximum (ratio conservé) et compresse en WebP,
 * avec repli JPEG si le navigateur ne gère pas WebP. Retourne le fichier d'origine
 * en cas d'échec (GIF animé, SVG, image illisible, etc.).
 */
export async function compressImageForUpload(file) {
  const fallback = {
    blob: file,
    extension: getFileExtension(file?.name),
    compressed: false,
  };

  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return fallback;
  }
  if (!file?.type?.startsWith('image/')) return fallback;
  if (['image/gif', 'image/svg+xml', 'image/avif'].includes(file.type)) {
    return fallback;
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
    if (!naturalWidth || !naturalHeight) return fallback;

    const scale = Math.min(1, MAX_UPLOAD_WIDTH / naturalWidth);
    const width = Math.max(1, Math.round(naturalWidth * scale));
    const height = Math.max(1, Math.round(naturalHeight * scale));

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');
    if (!context) return fallback;

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    context.drawImage(image, 0, 0, width, height);

    let blob = await canvasToBlob(canvas, 'image/webp', UPLOAD_QUALITY);
    let extension = 'webp';

    if (blob?.type !== 'image/webp' || blob.size === 0) {
      blob = await canvasToBlob(canvas, 'image/jpeg', UPLOAD_QUALITY);
      extension = 'jpg';
    }

    if (!blob || blob.size === 0) return fallback;

    return {
      blob,
      extension,
      compressed: true,
      width,
      height,
      originalSize: file.size,
      size: blob.size,
    };
  } catch {
    return fallback;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
