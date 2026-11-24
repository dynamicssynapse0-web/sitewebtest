'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const PROTECTED_SELECTOR = [
  'img',
  'picture',
  'figure',
  '[data-image-protect]',
  '.yarl__slide',
  '.yarl__image',
].join(',');

function isProtectedTarget(target) {
  if (!(target instanceof Element)) return false;
  if (target.closest(PROTECTED_SELECTOR)) return true;

  // Conteneurs utilisant une photo en background-image.
  const backgroundImage = window.getComputedStyle(target).backgroundImage;
  return Boolean(backgroundImage && backgroundImage !== 'none' && backgroundImage.includes('url('));
}

export default function ImageProtection() {
  const [visible, setVisible] = useState(false);
  const closeButtonRef = useRef(null);

  const showNotice = useCallback(() => setVisible(true), []);

  useEffect(() => {
    function markImages(root = document) {
      root.querySelectorAll('img').forEach((image) => {
        if (image.getAttribute('draggable') !== 'false') {
          image.setAttribute('draggable', 'false');
        }
      });
    }

    function handleContextMenu(event) {
      if (!isProtectedTarget(event.target)) return;
      event.preventDefault();
      event.stopPropagation();
      showNotice();
    }

    function handleDragStart(event) {
      if (!isProtectedTarget(event.target)) return;
      if (event.target instanceof HTMLElement) event.target.draggable = false;
      event.preventDefault();
      event.stopPropagation();
      showNotice();
    }

    markImages();

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          markImages(node);
        });
      });
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });

    document.addEventListener('contextmenu', handleContextMenu, true);
    document.addEventListener('dragstart', handleDragStart, true);

    return () => {
      observer.disconnect();
      document.removeEventListener('contextmenu', handleContextMenu, true);
      document.removeEventListener('dragstart', handleDragStart, true);
    };
  }, [showNotice]);

  useEffect(() => {
    if (!visible) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === 'Escape') setVisible(false);
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-blue-950/75 p-4 backdrop-blur-sm"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) setVisible(false);
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="image-protection-title"
        aria-describedby="image-protection-message"
        className="w-full max-w-lg rounded-3xl border border-white/10 bg-white p-6 shadow-2xl sm:p-8"
      >
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-2xl" aria-hidden="true">
            📸
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-600">
              Bilderfassung
            </p>
            <h2 id="image-protection-title" className="text-xl font-extrabold text-blue-950 sm:text-2xl">
              Image protégée
            </h2>
          </div>
        </div>

        <p id="image-protection-message" className="text-sm leading-7 text-gray-700">
          Image protégée © Le Chroniqueur / Bilderfassung. Pour obtenir ou acheter cette photo, contactez le numéro WhatsApp : 676 97 88 78
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <a
            href="https://wa.me/237676978878"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-1 items-center justify-center rounded-full bg-green-600 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-green-700"
          >
            Contacter sur WhatsApp
          </a>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={() => setVisible(false)}
            className="inline-flex flex-1 items-center justify-center rounded-full border border-gray-300 px-6 py-3 text-sm font-bold text-blue-950 transition hover:border-blue-950 hover:bg-blue-950 hover:text-white"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
