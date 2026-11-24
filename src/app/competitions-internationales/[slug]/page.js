import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Gallery from '@/components/Gallery';
import {
  formatCompetitionDate,
  getInternationalCompetitionBySlug,
} from '@/lib/internationalCompetitions';
import { pageMetadata, DEFAULT_OG_IMAGE } from '@/lib/seo';

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const competition = await getInternationalCompetitionBySlug(slug);

  if (!competition) {
    return { title: 'Compétition introuvable', robots: { index: false } };
  }

  return pageMetadata({
    title: competition.title,
    description:
      competition.content ||
      competition.eventTitle ||
      `Photographies de ${competition.title} par Aubin Simo.`,
    path: `/competitions-internationales/${slug}`,
    image: competition.coverImage,
  });
}

export default async function InternationalCompetitionPage({ params }) {
  const { slug } = await params;
  const competition = await getInternationalCompetitionBySlug(slug);

  if (!competition) notFound();

  const whatsappMessage = encodeURIComponent(
    `Bonjour Aubin Simo, je souhaite commander des photos de ${competition.title}${
      competition.eventTitle ? ` — ${competition.eventTitle}` : ''
    }.`
  );

  return (
    <main className="min-h-screen bg-blue-950 pb-20">
      <div className="relative h-[42vh] min-h-[320px] max-h-[560px]">
        <Image
          src={competition.coverImage || DEFAULT_OG_IMAGE}
          alt={`Photo principale : ${competition.title}`}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-blue-950/45 to-blue-950/10" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-4 pb-8 sm:px-6 sm:pb-12">
          <Link
            href="/competitions-internationales"
            className="mb-6 inline-flex text-sm font-semibold text-white/80 transition hover:text-white"
          >
            ← Retour aux compétitions
          </Link>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-red-300">
            {competition.competition || 'Compétition internationale'}
          </p>
          <h1 className="max-w-4xl text-3xl font-extrabold text-white sm:text-5xl">
            {competition.title}
          </h1>
          {competition.eventTitle ? (
            <p className="mt-3 text-lg font-semibold text-red-300 sm:text-xl">
              {competition.eventTitle}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 sm:pt-10">
        <div className="mb-10 flex flex-wrap gap-x-6 gap-y-3 border-b border-white/15 pb-6 text-sm text-blue-100/80">
          {[
            competition.sport,
            competition.date
              ? `${formatCompetitionDate(competition.date)}${
                  competition.time ? ` · ${competition.time}` : ''
                }`
              : '',
            competition.location,
          ]
            .filter(Boolean)
            .map((detail) => (
              <span key={detail}>{detail}</span>
            ))}
        </div>

        {competition.content && (
          <p className="mb-12 max-w-3xl text-lg leading-8 text-white/90">
            {competition.content}
          </p>
        )}

        <div className="mb-6 flex flex-col gap-4 border-b border-white/15 pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-red-300">
              En images
            </p>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              La galerie de la compétition
            </h2>
            <p className="mt-1 text-sm text-blue-100/70">
              {competition.images?.length || 0} photo
              {(competition.images?.length || 0) > 1 ? 's' : ''}
            </p>
          </div>
          <a
            href={`https://wa.me/237676978878?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-green-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-green-600"
          >
            Commander sur WhatsApp · 676 97 88 78
          </a>
        </div>

        <Gallery
          images={competition.images || []}
          title={competition.title}
          subtitle={`Photographies de ${competition.title}`}
          sport={competition.sport}
          href="/galerie"
          hrefLabel="Ouvrir la galerie complète"
          variant="grid"
        />
      </div>
    </main>
  );
}
