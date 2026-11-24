'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { navigationLinks } from '@/lib/navigation';
import { DEFAULT_PHOTO_MESSAGE, whatsappUrl } from '@/lib/whatsapp';

export default function Navbar() {
  const [menuOuvert, setMenuOuvert] = useState(false);

  return (
    <nav className="bg-blue-950 text-white sticky top-0 z-50 border-b border-blue-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full overflow-hidden shrink-0">
            <Image
              src="/images/mon-logo.png"
              alt="Logo Bilderfassung"
              width={48}
              height={48}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h1 className="font-bold text-xl leading-tight tracking-wide">
              Bilderfassung
            </h1>
            <p className="text-[10px] text-gray-300 uppercase tracking-widest">
              Aubin Simo
            </p>
          </div>
        </Link>

        <div className="hidden md:flex gap-5 text-sm font-medium items-center">
          {navigationLinks.map((lien) => (
            <Link
              key={lien.href}
              href={lien.href}
              className="hover:text-red-300 transition-colors"
            >
              {lien.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <a
            href={whatsappUrl(DEFAULT_PHOTO_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-full bg-green-600 px-3 py-2 text-[11px] font-bold text-white transition hover:bg-green-700 sm:px-4 sm:text-xs md:hidden"
          >
            💬 Commander
          </a>
          <button
            type="button"
            className="md:hidden p-2 text-3xl leading-none"
            onClick={() => setMenuOuvert(!menuOuvert)}
            aria-label={menuOuvert ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={menuOuvert}
          >
            {menuOuvert ? '×' : '☰'}
          </button>
        </div>
      </div>

      {menuOuvert && (
        <div className="md:hidden border-t border-blue-900 px-4 py-3">
          <div className="flex flex-col">
            {navigationLinks.map((lien) => (
              <Link
                key={lien.href}
                href={lien.href}
                onClick={() => setMenuOuvert(false)}
                className="py-3 border-b border-blue-900 last:border-0 hover:text-red-300"
              >
                {lien.label}
              </Link>
            ))}
            <a
              href={whatsappUrl(DEFAULT_PHOTO_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOuvert(false)}
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-green-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-700"
            >
              💬 Commander des photos
            </a>
          </div>
        </div>
      )}

      <a
        href={whatsappUrl(DEFAULT_PHOTO_MESSAGE)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Commander des photos sur WhatsApp"
        className="fixed bottom-4 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-2xl text-white shadow-2xl transition hover:bg-green-700 md:hidden"
      >
        <span aria-hidden="true">💬</span>
      </a>
    </nav>
  );
}
