import Link from 'next/link';

export default function EventCard({ event }) {
  return (
    <Link href={`/evenements/${event.slug}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300 cursor-pointer">
        <div className="relative h-48">
          <img 
            src={event.coverImage || "/images/placeholder.jpg"} 
            alt={event.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3 bg-blue-600 text-white text-center rounded p-1 leading-tight shadow">
            <div className="text-lg font-bold">{new Date(event.date).getDate()}</div>
            <div className="text-xs uppercase">{new Date(event.date).toLocaleString('fr-FR', { month: 'short' })}</div>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-bold text-lg text-gray-900 mb-1">{event.title}</h3>
          <p className="text-sm text-gray-600 flex items-center gap-1">
            📍 {event.location}
          </p>
        </div>
      </div>
    </Link>
  );
}