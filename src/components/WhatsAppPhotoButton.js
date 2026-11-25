'use client';

// Bouton WhatsApp qui associe la photo concernée au message.
// - Sur mobile/PC compatible : partage natif avec le fichier image joint
//   (WhatsApp s'ouvre avec la photo + le texte en légende).
// - En repli : ouverture de wa.me avec le message et l'URL publique de la photo,
//   ce qui donne un aperçu de l'image dans la conversation.

import { useCallback, useEffect, useRef } from 'react';

const WHATSAPP_NUMBER = '237676978878';

export function whatsappPhotoUrl(message, imageUrl) {
  const text = [
    message,
    imageUrl ? `Photo : ${imageUrl}` : '',
  ]
    .filter(Boolean)
    .join('\n');
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

function fileExtension(type) {
  if (String(type).includes('png')) return 'png';
  if (String(type).includes('webp')) return 'webp';
  return 'jpg';
}

export default function WhatsAppPhotoButton({
  message,
  imageUrl = '',
  label = 'Commander sur WhatsApp · 676 97 88 78',
  className = '',
}) {
  const fileRef = useRef(null);
  const canShareRef = useRef(false);

  // Le fichier est préparé à l'avance : au clic, le partage natif reste dans
  // le geste utilisateur (obligatoire pour navigator.share).
  useEffect(() => {
    fileRef.current = null;
    canShareRef.current = false;
    if (!imageUrl || typeof window === 'undefined') return undefined;

    let cancelled = false;
    fetch(imageUrl)
      .then((response) => (response.ok ? response.blob() : null))
      .then((blob) => {
        if (cancelled || !blob || typeof File === 'undefined') return;
        const file = new File(
          [blob],
          `photo-bilderfassung.${fileExtension(blob.type)}`,
          { type: blob.type || 'image/jpeg' }
        );
        fileRef.current = file;
        if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
          canShareRef.current = Boolean(navigator.canShare?.({ files: [file] }));
        }
      })
      .catch(() => {
        // Pas de partage de fichier possible : le lien restera utilisable.
      });

    return () => {
      cancelled = true;
    };
  }, [imageUrl]);

  const handleClick = useCallback(
    async (event) => {
      event.preventDefault();
      const file = fileRef.current;

      if (canShareRef.current && file) {
        try {
          await navigator.share({
            files: [file],
            title: 'Bilderfassung — Aubin Simo',
            text: message,
          });
          return;
        } catch (error) {
          // Un partage refusé par l'utilisateur ne doit rien ouvrir d'autre.
          if (error?.name === 'AbortError') return;
        }
      }

      window.open(whatsappPhotoUrl(message, imageUrl), '_blank', 'noopener,noreferrer');
    },
    [imageUrl, message]
  );

  return (
    <button type="button" onClick={handleClick} className={className}>
      {label}
    </button>
  );
}
