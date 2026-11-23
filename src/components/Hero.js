import Image from 'next/image';

export default function Hero() {
  return (
    <div className="relative h-[500px] flex items-center justify-center text-center">
      <Image
        src="/images/aubin-simo-photographe-football-CAN2027.jpg"
        alt="Aubin Simo, photographe sportif, au cœur d'un match de football de la CAN 2027"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/85 to-red-700/85"></div>

      <div className="relative z-10 px-4">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white mb-4">
          Bilderfassung
        </h1>
        <p className="text-lg sm:text-xl text-gray-100 mb-2 max-w-3xl mx-auto">
          L&apos;œil du sport par Aubin Simo
        </p>
        <p className="text-sm sm:text-base text-white/85 mb-8 max-w-2xl mx-auto">
          Je capture l&apos;émotion du sport.
        </p>
        <a
          href="#evenements"
          className="inline-block bg-white hover:bg-gray-100 text-blue-950 font-bold py-3 px-8 rounded-full transition duration-300 shadow-lg"
        >
          Voir les événements →
        </a>
      </div>
    </div>
  );
}
