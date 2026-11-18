'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  const [menuOuvert, setMenuOuvert] = useState(false);

  const liens = [
    { href: '/', label: 'Accueil' },
    { href: '/evenements', label: 'Événements' },
    { href: '/sports', label: 'Sports' },
    { href: '/galerie', label: 'Galerie' },
    { href: '/a-propos', label: 'À propos' },
    { href: '/contact', label: 'Contact' },
  ];

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
              Par Aubin Simo
            </p>
          </div>
        </Link>

        {/* Menu ordinateur */}
        <div className="hidden md:flex gap-6 text-sm font-medium items-center">
          {liens.map((lien) => (
            <Link
              key={lien.href}
              href={lien.href}
              className="hover:text-red-300 transition-colors"
            >
              {lien.label}
            </Link>
          ))}
        </div>

        {/* Bouton menu téléphone */}
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

      {/* Liens téléphone */}
      {menuOuvert && (
        <div className="md:hidden border-t border-blue-900 px-4 py-3">
          <div className="flex flex-col">
            {liens.map((lien) => (
              <Link
                key={lien.href}
                href={lien.href}
                onClick={() => setMenuOuvert(false)}
                className="py-3 border-b border-blue-900 last:border-0 hover:text-red-300"
              >
                {lien.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}