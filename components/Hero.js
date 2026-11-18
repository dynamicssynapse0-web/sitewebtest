import Link from 'next/link';

export default function Hero() {
  return (
    <div 
      className="relative bg-cover bg-center h-[500px] flex items-center justify-center text-center"
      style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
    >
      {/* Le dégradé Bleu vers Rouge (avec une légère transparence pour voir l'image derrière) */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 to-red-900/80"></div>
      
      <div className="relative z-10 px-4">
        <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-4 tracking-tight drop-shadow-lg">
          Bilder<span className="text-red-500">fassung</span>
        </h2>
        <p className="text-xl md:text-2xl text-gray-100 mb-8 max-w-2xl mx-auto drop-shadow-md font-medium">
          L'œil du sport par Aubin Simo
        </p>
        <Link 
          href="#evenements" 
          className="bg-white hover:bg-gray-100 text-blue-950 font-bold py-4 px-10 rounded-full transition duration-300 shadow-xl transform hover:-translate-y-1 inline-block"
        >
          Voir les événements →
        </Link>
      </div>
    </div>
  );
}