'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { navigationLinks } from '@/lib/navigation';

const SPORT_HREF = '/sports';
const COMPETITIONS_HREF = '/competitions-internationales';

export default function Navbar({ sportsMenu = [], competitionsMenu = [] }) {
  const [menuOuvert, setMenuOuvert] = useState(false);
  const [sportOuvert, setSportOuvert] = useState(false);
  const [disciplineOuverte, setDisciplineOuverte] = useState(null);
  const [mobileSportOuvert, setMobileSportOuvert] = useState(false);
  const [mobileDisciplineOuverte, setMobileDisciplineOuverte] = useState(null);
  const [competitionOuvert, setCompetitionOuvert] = useState(false);
  const [mobileCompetitionOuvert, setMobileCompetitionOuvert] = useState(false);

  const sportLink = navigationLinks.find((lien) => lien.href === SPORT_HREF);
  const competitionsLink = navigationLinks.find(
    (lien) => lien.href === COMPETITIONS_HREF
  );

  function fermerMenus() {
    setMenuOuvert(false);
    setSportOuvert(false);
    setDisciplineOuverte(null);
    setMobileSportOuvert(false);
    setMobileDisciplineOuverte(null);
    setCompetitionOuvert(false);
    setMobileCompetitionOuvert(false);
  }

  function renderDesktopLink(lien) {
    if (lien.href === SPORT_HREF && sportLink) {
      return (
        <div
          key={lien.href}
          className="relative group"
          onMouseLeave={() => setSportOuvert(false)}
        >
          <div className="flex items-center gap-1">
            <Link
              href={sportLink.href}
              className="hover:text-red-300 transition-colors"
            >
              {sportLink.label}
            </Link>
            {sportsMenu.length > 0 ? (
              <button
                type="button"
                onClick={() => setSportOuvert((open) => !open)}
                aria-label="Afficher les catégories sportives"
                aria-expanded={sportOuvert}
                className="rounded px-1 text-xs text-blue-200 transition hover:text-red-300"
              >
                ▾
              </button>
            ) : null}
          </div>

          {sportsMenu.length > 0 ? (
            <div
              className={`${
                sportOuvert ? 'block' : 'hidden'
              } group-hover:block group-focus-within:block absolute left-0 top-full z-50 w-72 rounded-xl border border-blue-800 bg-blue-950 p-2 shadow-2xl`}
            >
              {sportsMenu.map((groupe) => (
                <div
                  key={groupe.slug}
                  className="border-b border-blue-900/70 last:border-0"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setDisciplineOuverte((current) =>
                        current === groupe.slug ? null : groupe.slug
                      )
                    }
                    aria-expanded={disciplineOuverte === groupe.slug}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-bold transition hover:bg-blue-900/70 hover:text-red-300"
                  >
                    {groupe.discipline}
                    <span aria-hidden="true" className="text-xs text-blue-300">
                      {disciplineOuverte === groupe.slug ? '−' : '+'}
                    </span>
                  </button>
                  {disciplineOuverte === groupe.slug ? (
                    <div className="mb-2 ml-3 border-l border-blue-800 pl-2">
                      {groupe.categories.map((category) => (
                        <Link
                          key={category.slug || category.href}
                          href={category.href}
                          onClick={fermerMenus}
                          className="block rounded-lg px-3 py-2 text-xs font-medium text-blue-100 transition hover:bg-red-600 hover:text-white"
                        >
                          {category.sousDiscipline}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
              <Link
                href={SPORT_HREF}
                onClick={fermerMenus}
                className="mt-2 block rounded-lg px-3 py-2 text-xs font-bold text-red-300 transition hover:bg-blue-900/70"
              >
                Toutes les disciplines →
              </Link>
            </div>
          ) : null}
        </div>
      );
    }

    if (lien.href === COMPETITIONS_HREF && competitionsLink) {
      return (
        <div
          key={lien.href}
          className="relative group"
          onMouseLeave={() => setCompetitionOuvert(false)}
        >
          <div className="flex items-center gap-1">
            <Link
              href={competitionsLink.href}
              className="hover:text-red-300 transition-colors"
            >
              {competitionsLink.label}
            </Link>
            {competitionsMenu.length > 0 ? (
              <button
                type="button"
                onClick={() => setCompetitionOuvert((open) => !open)}
                aria-label="Afficher les compétitions internationales"
                aria-expanded={competitionOuvert}
                className="rounded px-1 text-xs text-blue-200 transition hover:text-red-300"
              >
                ▾
              </button>
            ) : null}
          </div>

          {competitionsMenu.length > 0 ? (
            <div
              className={`${
                competitionOuvert ? 'block' : 'hidden'
              } group-hover:block group-focus-within:block absolute left-0 top-full z-50 w-72 rounded-xl border border-blue-800 bg-blue-950 p-2 shadow-2xl`}
            >
              {competitionsMenu.map((competition) => (
                <Link
                  key={competition.slug || competition.id}
                  href={`/competitions-internationales/${competition.slug}`}
                  onClick={fermerMenus}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-blue-100 transition hover:bg-red-600 hover:text-white"
                >
                  {competition.title}
                  {competition.eventTitle ? (
                    <span className="mt-0.5 block text-[11px] text-blue-300">
                      {competition.eventTitle}
                    </span>
                  ) : null}
                </Link>
              ))}
              <Link
                href={COMPETITIONS_HREF}
                onClick={fermerMenus}
                className="mt-2 block rounded-lg px-3 py-2 text-xs font-bold text-red-300 transition hover:bg-blue-900/70"
              >
                Toutes les compétitions →
              </Link>
            </div>
          ) : null}
        </div>
      );
    }

    return (
      <Link
        key={lien.href}
        href={lien.href}
        className="hover:text-red-300 transition-colors"
      >
        {lien.label}
      </Link>
    );
  }

  function renderMobileLink(lien) {
    if (lien.href === SPORT_HREF && sportLink) {
      return (
        <div key={lien.href} className="border-b border-blue-900">
          <div className="flex items-center justify-between">
            <Link
              href={sportLink.href}
              onClick={fermerMenus}
              className="flex-1 py-3 hover:text-red-300"
            >
              {sportLink.label}
            </Link>
            {sportsMenu.length > 0 ? (
              <button
                type="button"
                onClick={() => setMobileSportOuvert((open) => !open)}
                aria-label="Afficher les catégories sportives"
                aria-expanded={mobileSportOuvert}
                className="p-3 text-lg text-blue-200"
              >
                {mobileSportOuvert ? '−' : '+'}
              </button>
            ) : null}
          </div>

          {mobileSportOuvert ? (
            <div className="mb-3 ml-2 border-l border-blue-800 pl-3">
              {sportsMenu.map((groupe) => (
                <div key={groupe.slug}>
                  <button
                    type="button"
                    onClick={() =>
                      setMobileDisciplineOuverte((current) =>
                        current === groupe.slug ? null : groupe.slug
                      )
                    }
                    aria-expanded={mobileDisciplineOuverte === groupe.slug}
                    className="flex w-full items-center justify-between py-2.5 text-left text-sm font-bold hover:text-red-300"
                  >
                    {groupe.discipline}
                    <span aria-hidden="true" className="text-xs text-blue-300">
                      {mobileDisciplineOuverte === groupe.slug ? '−' : '+'}
                    </span>
                  </button>
                  {mobileDisciplineOuverte === groupe.slug ? (
                    <div className="mb-2 ml-2 border-l border-blue-800 pl-3">
                      {groupe.categories.map((category) => (
                        <Link
                          key={category.slug || category.href}
                          href={category.href}
                          onClick={fermerMenus}
                          className="block py-2 text-xs text-blue-100 hover:text-red-300"
                        >
                          {category.sousDiscipline}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      );
    }

    if (lien.href === COMPETITIONS_HREF && competitionsLink) {
      return (
        <div key={lien.href} className="border-b border-blue-900">
          <div className="flex items-center justify-between">
            <Link
              href={competitionsLink.href}
              onClick={fermerMenus}
              className="flex-1 py-3 hover:text-red-300"
            >
              {competitionsLink.label}
            </Link>
            {competitionsMenu.length > 0 ? (
              <button
                type="button"
                onClick={() =>
                  setMobileCompetitionOuvert((open) => !open)
                }
                aria-label="Afficher les compétitions internationales"
                aria-expanded={mobileCompetitionOuvert}
                className="p-3 text-lg text-blue-200"
              >
                {mobileCompetitionOuvert ? '−' : '+'}
              </button>
            ) : null}
          </div>

          {mobileCompetitionOuvert ? (
            <div className="mb-3 ml-2 border-l border-blue-800 pl-3">
              {competitionsMenu.map((competition) => (
                <Link
                  key={competition.slug || competition.id}
                  href={`/competitions-internationales/${competition.slug}`}
                  onClick={fermerMenus}
                  className="block py-2 text-sm text-blue-100 hover:text-red-300"
                >
                  {competition.title}
                  {competition.eventTitle ? (
                    <span className="mt-0.5 block text-[11px] text-blue-300">
                      {competition.eventTitle}
                    </span>
                  ) : null}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      );
    }

    return (
      <Link
        key={lien.href}
        href={lien.href}
        onClick={fermerMenus}
        className="py-3 border-b border-blue-900 last:border-0 hover:text-red-300"
      >
        {lien.label}
      </Link>
    );
  }

  return (
    <nav className="bg-blue-950 text-white sticky top-0 z-50 border-b border-blue-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3" onClick={fermerMenus}>
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
          {navigationLinks.map(renderDesktopLink)}
        </div>

        <button
          type="button"
          className="md:hidden p-2 text-3xl leading-none"
          onClick={() => setMenuOuvert((open) => !open)}
          aria-label={menuOuvert ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={menuOuvert}
        >
          {menuOuvert ? '×' : '☰'}
        </button>
      </div>

      {menuOuvert ? (
        <div className="md:hidden border-t border-blue-900 px-4 py-3">
          <div className="flex flex-col">{navigationLinks.map(renderMobileLink)}</div>
        </div>
      ) : null}
    </nav>
  );
}
