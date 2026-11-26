'use client';

import Image from 'next/image';
import { normalizeAdLink } from '@/lib/adLink';

// Emplacement publicitaire unique, alimenté par la table Supabase `ads`.
// Toutes les variantes sont identifiées comme telles (« Publicité ») et les
// liens sortants sont marqués `sponsored` pour les moteurs de recherche.
export default function AdSlot({ ad, variant = 'banniere', className = '' }) {
  const link = normalizeAdLink(ad?.linkUrl);
  if (!ad?.image || !link.ok) return null;

  function trackClick() {
    if (!ad.id) return;
    try {
      window.fetch('/api/ads/click', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id: ad.id, placement: ad.placement }),
        keepalive: true,
      }).catch(() => {});
    } catch {
      // Le suivi ne doit jamais bloquer l'ouverture du lien.
    }
  }

  const linkProps = {
    href: link.url,
    target: '_blank',
    rel: 'sponsored nofollow noopener noreferrer',
    onClick: trackClick,
    'data-ad-creative': 'true',
  };

  if (variant === 'logo') {
    return (
      <a {...linkProps} className={`group flex flex-col items-center gap-1 ${className}`}>
        <span className="relative block h-12 w-28 transition-opacity group-hover:opacity-80 sm:w-36">
          <Image
            src={ad.image}
            alt={ad.alt}
            fill
            sizes="144px"
            className="object-contain"
            data-ad-creative="true"
          />
        </span>
        <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-gray-400">
          Publicité
        </span>
      </a>
    );
  }

  if (variant === 'presentation') {
    return (
      <a
        {...linkProps}
        className={`inline-flex max-w-full flex-wrap items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white transition hover:border-red-400 hover:bg-white/15 ${className}`}
      >
        <span className="relative block h-9 w-24 shrink-0">
          <Image
            src={ad.image}
            alt={ad.alt}
            fill
            sizes="96px"
            className="object-contain"
            data-ad-creative="true"
          />
        </span>
        <span>
          <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-red-300">
            Cet événement est présenté par
          </span>
          <span className="font-bold">{ad.advertiser}</span>
        </span>
        <span aria-hidden="true">↗</span>
      </a>
    );
  }

  if (variant === 'carte') {
    return (
      <a
        {...linkProps}
        className={`group block overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-red-400 hover:shadow-lg ${className}`}
      >
        <span className="relative block aspect-[16/7] w-full bg-gray-100">
          <Image
            src={ad.image}
            alt={ad.alt}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
            data-ad-creative="true"
          />
          <span className="absolute left-4 top-4 rounded-full bg-blue-950/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white">
            Publicité
          </span>
        </span>
        <span className="block p-5 sm:p-6">
          <span className="block text-xl font-bold text-blue-950">{ad.title}</span>
          {ad.advertiser && ad.advertiser !== ad.title ? (
            <span className="mt-1 block text-sm font-semibold text-red-600">
              {ad.advertiser}
            </span>
          ) : null}
          <span className="mt-4 inline-flex items-center gap-2 font-bold text-blue-900 transition group-hover:text-red-600">
            Découvrir l’offre <span aria-hidden="true">→</span>
          </span>
        </span>
      </a>
    );
  }

  return (
    <a
      {...linkProps}
      className={`group relative block h-[110px] w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:border-red-400 sm:h-[140px] ${className}`}
    >
      <Image
        src={ad.image}
        alt={ad.alt}
        fill
        sizes="(max-width: 640px) 100vw, 1200px"
        className="object-contain p-2 transition duration-500 group-hover:scale-[1.02]"
        data-ad-creative="true"
      />
      <span className="absolute bottom-2 right-3 rounded bg-blue-950/80 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.16em] text-white">
        Publicité
      </span>
    </a>
  );
}
