import Link from 'next/link';
import Image from 'next/image';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Gallery from '@/components/Gallery';

// SEO
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), 'content/events', `${slug}.md`);
  if (!fs.existsSync(filePath)) return { title: 'Événement non trouvé' };
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data } = matter(fileContents);
  return {
    title: `${data.title} | Aubin Simo`,
    description: `Découvrez les photos de l'événement ${data.title} à ${data.location}.`,
  };
}

export default async function EventPage({ params }) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), 'content/events', `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    return <div className="p-10 text-center">Événement non trouvé</div>;
  }

  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);

  return (
    <main className="relative min-h-screen pb-20 overflow-hidden">
      
      {/* 1. L'IMAGE DE FOND (celle du fichier .md) */}
      <div className="fixed inset-0 -z-20">
        <Image
          src={data.coverImage || "/images/placeholder.jpg"}
          alt="Fond d'écran"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* 2. LE FILTRE SOMBRE (pour lire le texte) */}
      <div className="fixed inset-0 -z-10 bg-black/70"></div>

      {/* 3. LE CONTENU */}
      <div className="relative z-0 max-w-5xl mx-auto px-4 pt-12 pb-20">
        
        <Link href="/sports" className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition mb-8 font-medium">
          ← Retour aux sports
        </Link>

        <header className="mb-12">
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white mb-6">{data.title}</h1>
          <div className="flex flex-wrap gap-4 text-gray-200 text-sm sm:text-base mb-8">
            <span className="bg-yellow-500 text-black font-bold px-3 py-1 rounded-md">{data.sport}</span>
            <p className="flex items-center gap-2">📅 {new Date(data.date).toLocaleDateString('fr-FR')} à {data.time}</p>
            <p className="flex items-center gap-2">📍 {data.location}</p>
          </div>
          <div className="text-gray-300 text-lg italic border-l-4 border-yellow-500 pl-4">
            <p>"{content}"</p>
          </div>
        </header>

        <h2 className="text-2xl font-bold mb-8 text-white border-b border-gray-600 pb-4">Galerie Photos ({data.images?.length || 0})</h2>
        
        {data.images && data.images.length > 0 ? (
          <Gallery images={data.images} title={data.title} />
        ) : (
          <p className="text-gray-400">Aucune photo disponible pour cet événement.</p>
        )}
      </div>
    </main>
  );
}