import Link from 'next/link';
import Image from 'next/image';
import Gallery from '@/components/Gallery';
import { formatEventDate, getEventBySlug } from '@/lib/events';
import { pageMetadata, DEFAULT_OG_IMAGE } from '@/lib/seo';

export const revalidate = 3600;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    return { title: 'Événement non trouvé', robots: { index: false } };
  }

  return pageMetadata({
    title: event.title,
    description:
      event.excerpt ||
      event.content ||
      `Découvrez les photos de l'événement ${event.title} à ${event.location}.`,
    path: `/evenements/${slug}`,
    image: event.coverImage,
  });
}

export default async function EventPage({ params }) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    return <div className="p-10 text-center">Événement non trouvé</div>;
  }

  const photos = event.images || [];

  return (
    <main className="relative min-h-screen pb-20 overflow-hidden">
      <div className="fixed inset-0 -z-20">
        <Image
          src={event.coverImage || DEFAULT_OG_IMAGE}
          alt="Fond d'écran"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="fixed inset-0 -z-10 bg-black/70"></div>

      <div className="relative z-0 max-w-5xl mx-auto px-4 pt-12 pb-20">
        <Link
          href="/sports"
          className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition mb-8 font-medium"
        >
          ← Retour aux sports
        </Link>

        <header className="mb-12">
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white mb-6">
            {event.title}
          </h1>
          <div className="flex flex-wrap gap-4 text-gray-200 text-sm sm:text-base mb-8">
            <span className="bg-yellow-500 text-black font-bold px-3 py-1 rounded-md">
              {event.sport}
            </span>
            <p className="flex items-center gap-2">
              📅 {formatEventDate(event.date, event.season)} à {event.time}
            </p>
            <p className="flex items-center gap-2">📍 {event.location}</p>
          </div>
          <div className="text-gray-300 text-lg italic border-l-4 border-yellow-500 pl-4">
            <p>&quot;{event.content || event.excerpt}&quot;</p>
          </div>
        </header>

        <h2 className="text-2xl font-bold mb-8 text-white border-b border-gray-600 pb-4">
          Galerie Photos ({photos.length})
        </h2>

        <Gallery
          images={photos}
          title={event.title}
          subtitle={`Photographies de ${event.title}`}
          sport={event.sport}
          href="/galerie"
          hrefLabel="Ouvrir la galerie complète"
          variant="grid"
        />
      </div>
    </main>
  );
}
