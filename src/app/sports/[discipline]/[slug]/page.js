import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Gallery from '@/components/Gallery';
import { getCategorySportBySlug } from '@/lib/categoriesSport';
import { DEFAULT_OG_IMAGE, pageMetadata } from '@/lib/seo';

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { discipline, slug } = await params;
  const category = await getCategorySportBySlug(discipline, slug);

  if (!category) {
    return pageMetadata({
      title: 'Catégorie sportive introuvable',
      description: 'Cette catégorie sportive n’est pas disponible.',
      path: `/sports/${discipline}/${slug}`,
    });
  }

  return pageMetadata({
    title: `${category.sousDiscipline} — ${category.discipline}`,
    description: `Photos de ${category.sousDiscipline} (${category.discipline}) par Aubin Simo — Bilderfassung.`,
    path: category.href,
    image: category.coverImage || DEFAULT_OG_IMAGE,
  });
}

export default async function CategorySportPage({ params }) {
  const { discipline, slug } = await params;
  const category = await getCategorySportBySlug(discipline, slug);
  if (!category) notFound();

  const whatsappMessage = encodeURIComponent(
    `Bonjour Aubin Simo, je souhaite commander des photos de ${category.sousDiscipline} (${category.discipline}).`
  );

  return (
    <main className="min-h-screen bg-blue-950 text-white">
      <nav aria-label="Fil d’Ariane" className="border-b border-white/10 bg-blue-950/80">
        <ol className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 py-5 text-xs font-semibold text-blue-100/80 sm:px-6 sm:text-sm">
          <li><Link href="/" className="hover:text-red-300">Accueil</Link></li>
          <li aria-hidden="true" className="text-blue-400">›</li>
          <li><Link href="/sports" className="hover:text-red-300">Sport</Link></li>
          <li aria-hidden="true" className="text-blue-400">›</li>
          <li>{category.discipline}</li>
          <li aria-hidden="true" className="text-blue-400">›</li>
          <li aria-current="page" className="font-bold text-white">{category.sousDiscipline}</li>
        </ol>
      </nav>

      <section className="relative h-[46vh] min-h-[320px] w-full overflow-hidden">
        <Image
          src={category.coverImage}
          alt={category.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-blue-950/45 to-blue-950/10" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-4 pb-10 sm:px-6">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-red-400">
            {category.discipline}
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
            {category.sousDiscipline}
          </h1>
          <p className="mt-3 text-sm text-blue-100/80">
            {category.images.length} photo{category.images.length > 1 ? 's' : ''} · Bilderfassung — Aubin Simo
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-extrabold">Toutes les photos de la catégorie</h2>
            <p className="mt-1 text-sm text-blue-100/75">
              Touchez une photo pour l’ouvrir. Les images sont protégées.
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
          images={category.images}
          title={category.sousDiscipline}
          subtitle={`${category.discipline} — ${category.sousDiscipline}`}
          sport={category.discipline}
          variant="masonry"
        />

        <div className="mt-12 text-center">
          <Link
            href="/galerie"
            className="inline-flex rounded-full border border-white/20 px-6 py-3 text-sm font-bold text-white transition hover:border-red-400 hover:bg-red-600"
          >
            Voir toute la galerie <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
