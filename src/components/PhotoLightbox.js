'use client';

import Link from 'next/link';
import Lightbox from 'yet-another-react-lightbox';
import Counter from 'yet-another-react-lightbox/plugins/counter';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/counter.css';
import { DEFAULT_PHOTO_MESSAGE, whatsappUrl } from '@/lib/whatsapp';

export default function PhotoLightbox({
  open = false,
  index = 0,
  close,
  slides = [],
  title = 'Galerie photo',
  href,
  hrefLabel = 'Voir le contenu',
  whatsappMessage,
}) {
  const message =
    whatsappMessage ||
    `Bonjour Aubin, je souhaite commander des photos sportives (${title}). Pouvez-vous me transmettre les disponibilités et les tarifs ?`;

  return (
    <>
      <Lightbox
        open={open}
        index={index}
        close={close}
        slides={slides}
        plugins={[Counter]}
        labels={{
          Previous: 'Précédent',
          Next: 'Suivant',
          Close: 'Fermer',
          Lightbox: `Galerie photo : ${title}`,
        }}
        counter={{
          container: {
            style: {
              top: 20,
              right: 20,
              borderRadius: 999,
              padding: '8px 14px',
              background: 'rgba(4, 20, 50, 0.85)',
              fontSize: 13,
              fontWeight: 700,
            },
          },
        }}
        render={{
          buttonPrev: slides.length > 1 ? undefined : () => null,
          buttonNext: slides.length > 1 ? undefined : () => null,
        }}
      />

      {open ? (
        <div className="fixed bottom-5 left-1/2 z-[10001] flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 flex-col gap-2 sm:flex-row">
          <a
            href={whatsappUrl(message || DEFAULT_PHOTO_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-green-600 px-5 py-3 text-sm font-bold text-white shadow-xl transition hover:bg-green-700"
          >
            <span aria-hidden="true">💬</span>
            Commander des photos
          </a>
          {href ? (
            <Link
              href={href}
              onClick={close}
              className="inline-flex flex-1 items-center justify-center rounded-full border border-white/25 bg-blue-950/90 px-5 py-3 text-sm font-bold text-white shadow-xl transition hover:bg-red-600"
            >
              {hrefLabel} <span aria-hidden="true">→</span>
            </Link>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
