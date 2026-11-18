import Link from 'next/link';

export default function Hero() {
  return (
    <div 
      className="relative bg-cover bg-center h-[500px] flex items-center justify-center text-center"
      style={{ backgroundImage: "url('/images/images.jpg')" }}
    >
      {/* Le même dégradé que la page À propos, avec une légère transparence pour voir l'image */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-red-700/90"></div>
      
      <div className="relative z-10 px-4">
        <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-4">
          Bilder <span className="text-white">Fassung</span>
        </h2>
        <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto">
          L'œil du sport par Aubin Simo
        </p>
        <Link 
          href="#evenements" 
          className="bg-white hover:bg-gray-100 text-blue-950 font-bold py-3 px-8 rounded-full transition duration-300 shadow-lg"
        >
          Voir les événements →
        </Link>
      </div>
    </div>
  );
}