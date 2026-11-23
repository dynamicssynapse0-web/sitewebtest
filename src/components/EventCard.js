import Link from 'next/link';
import Image from 'next/image';
import { formatEventDate } from '@/lib/events';
import { DEFAULT_OG_IMAGE } from '@/lib/seo';

export default function EventCard({ event }) {
  const parsedDate = /^\d{4}-\d{2}-\d{2}$/.test(event.date || '')
    ? new Date(`${event.date}T12:00:00`)
    : null;
  const hasCalendarDate = parsedDate && !Number.isNaN(parsedDate.getTime());

  return (
    <Link href={`/evenements/${event.slug}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300 cursor-pointer">
        <div className="relative h-48">
          <Image
            src={event.coverImage || DEFAULT_OG_IMAGE}
            alt={event.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
          {hasCalendarDate ? (
            <div className="absolute top-3 left-3 bg-blue-600 text-white text-center rounded p-1 leading-tight shadow">
              <div className="text-lg font-bold">{parsedDate.getDate()}</div>
              <div className="text-xs uppercase">
                {parsedDate.toLocaleString('fr-FR', { month: 'short' })}
              </div>
            </div>
          ) : (
            <div className="absolute top-3 left-3 max-w-[calc(100%-1.5rem)] bg-blue-950/90 text-white rounded px-3 py-2 text-xs font-semibold shadow">
              {formatEventDate(event.date, event.season)}
            </div>
          )}
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
