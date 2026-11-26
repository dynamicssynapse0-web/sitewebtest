'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const STORAGE_KEY = 'bilderfassung-pageviews';

// Une seule vue par page et par jour pour un même navigateur : évite de
// gonfler les chiffres lors des navigations client ou des rafraîchissements.
export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith('/admin')) return;

    const today = new Date().toISOString().slice(0, 10);
    let seen;

    try {
      const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}');
      seen = stored?.day === today ? { day: today, paths: stored.paths || [] } : { day: today, paths: [] };
    } catch {
      seen = { day: today, paths: [] };
    }

    if (seen.paths.includes(pathname)) return;

    try {
      seen.paths.push(pathname);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seen));
    } catch {
      // Navigation privée : on compte quand même la vue courante.
    }

    try {
      window.fetch('/api/stats', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ path: pathname }),
        keepalive: true,
      }).catch(() => {});
    } catch {
      // La mesure ne doit jamais perturber la navigation.
    }
  }, [pathname]);

  return null;
}
