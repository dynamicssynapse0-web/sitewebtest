import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-black text-white px-6 py-4 flex justify-between items-center border-b border-gray-800">
      <div className="flex items-center gap-2">
        <span className="text-2xl">🏃</span>
        <div>
          <h1 className="font-bold text-xl leading-tight">Bilderfassung</h1>
          <p className="text-xs text-gray-400">Toute l&apos;actualité sportive en un seul endroit</p>
        </div>
      </div>
      <div className="hidden md:flex gap-6 text-sm font-medium">
        <Link href="#" className="hover:text-yellow-400">Accueil</Link>
        <Link href="#" className="hover:text-yellow-400">Événements</Link>
        <Link href="#" className="hover:text-yellow-400">Sports</Link>
        <Link href="#" className="hover:text-yellow-400">Galerie</Link>
        <Link href="#" className="hover:text-yellow-400">À propos</Link>
        <Link href="#" className="hover:text-yellow-400">Contact</Link>
      </div>
    </nav>
  );
}