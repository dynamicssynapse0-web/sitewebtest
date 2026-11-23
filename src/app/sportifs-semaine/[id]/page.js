import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PortraitLightbox from '@/components/PortraitLightbox';
import { getSportifById, portraits } from '@/lib/sportifsSemaine';
import { pageMetadata } from '@/lib/seo';

export function generateStaticParams() {
  return portraits.map(({ id }) => ({ id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const portrait = getSportifById(id);

  if (!portrait) {
    return { title: 'Portrait introuvable', robots: { index: false } };
  }

  return pageMetadata({
    title: portrait.title,
    description: portrait.quote,
    path: `/sportifs-semaine/${id}`,
    image: portrait.cover,
  });
}

export default async function SportifSemainePage({ params }) {
  const { id } = await params;
  const portrait = getSportifById(id);

  if (!portrait) notFound();

  const galleryHref = portrait.eventHref ?? '/galerie';

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <section className="relative overflow-hidden bg-blue-950 text-white">
        <div className="absolute inset-0" aria-hidden="true">
          <Image
            src={portrait.cover}
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-30"
          />
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-blue-950 via-blue-950/85 to-blue-950/60"
        />

        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <Link
            href="/#sportifs-semaine"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-100/80 transition hover:text-white"
          >
            ← Retour aux sportifs de la semaine
          </Link>

          <p className="mt-10 flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-red-400">
            <span>Le rendez-vous hebdomadaire</span>
            <span aria-hidden="true">·</span>
            <span className="text-blue-100/80">{portrait.discipline}</span>
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-6xl">
            {portrait.title}
          </h1>
          <blockquote className="mt-6 max-w-2xl border-l-4 border-red-500 pl-5 text-lg leading-relaxed text-white/90 sm:text-2xl">
            “{portrait.quote}”
          </blockquote>
          <p className="mt-5 text-sm font-medium text-blue-100/80 sm:text-base">
            {portrait.eventLabel}
            {portrait.dateLabel ? ` · ${portrait.dateLabel}` : ''}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href={galleryHref}
              className="inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-red-700"
            >
              {portrait.eventHref
                ? 'Voir l’événement lié'
                : 'Voir la galerie complète'}
              <span aria-hidden="true">→</span>
            </Link>
            <span className="text-sm text-blue-100/80">
              {portrait.images.length} photo
              {portrait.images.length > 1 ? 's' : ''} disponible
              {portrait.images.length > 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-gray-200 pb-6">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-red-600">
              En images
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight text-blue-950 sm:text-4xl">
              La galerie du portrait
            </h2>
          </div>
          <p className="text-sm text-gray-500">
            Cliquez sur une photo pour l’ouvrir en plein écran.
          </p>
        </div>

        {portrait.images.length > 0 ? (
          <PortraitLightbox images={portrait.images} title={portrait.title} />
        ) : (
          <p className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-500">
            Les photos de ce portrait seront bientôt disponibles.
          </p>
        )}
      </section>
    </main>
  );
}
