import Link from 'next/link';
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="bg-blue-950 text-white px-6 py-4 sticky top-0 z-50 border-b border-blue-900 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Logo et Nom */}
        <Link href="/" className="flex items-center gap-3 group">
 <div className="h-12 w-12 rounded-full overflow-hidden">
  <Image
    src="/images/mon-logo.png"
    alt="Logo Bilderfassung"
    width={48}
    height={48}
    className="h-full w-full object-cover"
  />
</div>
          <div>
            <h1 className="font-bold text-xl leading-tight tracking-wide">Bilderfassung</h1>
            <p className="text-[10px] text-gray-300 uppercase tracking-widest">Par Aubin Simo</p>
          </div>
        </Link>

        {/* Liens du menu */}
        <div className="hidden md:flex gap-8 text-sm font-medium items-center">
          <Link href="/" className="relative py-2 hover:text-red-400 transition-colors after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-red-500 after:transition-all hover:after:w-full">
            Accueil
          </Link>
          
          {/* CORRECTION ICI : le lien pointe vers /evenements */}
          <Link href="/evenements" className="relative py-2 hover:text-red-400 transition-colors after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-red-500 after:transition-all hover:after:w-full">
            Événements
          </Link>
          
          <Link href="/sports" className="relative py-2 hover:text-red-400 transition-colors after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-red-500 after:transition-all hover:after:w-full">
            Sports
          </Link>
          <Link href="/galerie" className="relative py-2 hover:text-red-400 transition-colors after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-red-500 after:transition-all hover:after:w-full">
            Galerie
          </Link>
          <Link href="/a-propos" className="relative py-2 hover:text-red-400 transition-colors after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-red-500 after:transition-all hover:after:w-full">
            À propos
          </Link>
          <Link href="/contact" className="bg-red-600 text-white px-5 py-2 rounded-md hover:bg-red-700 transition font-semibold shadow-sm">
            Contact
          </Link>
        </div>

      </div>
    </nav>
  );
}