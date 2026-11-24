export const WHATSAPP_NUMBER = '237676978878';
export const WHATSAPP_BASE_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export function whatsappUrl(message = '') {
  const text = String(message || '').trim();
  return text ? `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(text)}` : WHATSAPP_BASE_URL;
}

export const DEFAULT_PHOTO_MESSAGE =
  'Bonjour Aubin, je souhaite commander des photos sportives. Pouvez-vous me dire quelles photos sont disponibles et leurs tarifs ?';
