import Link from 'next/link';

export default function EventCard({ event }) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(event.date || '');
  let dateValide = null;

  if (match) {
    const [, annee, mois, jour] = match.map(Number);
    const date = new Date(annee, mois - 1, jour, 12);

    if (
      date.getFullYear() === annee &&
      date.getMonth() === mois - 1 &&
      date.getDate() === jour
    ) {
      dateValide = date;
    }
  }

  const saison = event.season
    ? `Saison ${event.season}`
    : event.date && !dateValide
      ? event.date
      : 'Date à confirmer';

  return (
    <Link href={`/evenements/${event.slug}`} className="block">
      <article className="overflow-hidden rounded-lg bg-white shadow-md transition duration-300 hover:shadow-xl">
        <div className="relative h-48">
          <img
            src={event.coverImage || '/images/placeholder.jpg'}
            alt={event.title}
            className="h-full w-full object-cover"
          />

          <div className="absolute left-3 top-3 rounded bg-blue-600 px-2 py-1 text-center leading-tight text-white shadow">
            {dateValide ? (
              <>
                <div className="text-lg font-bold">{dateValide.getDate()}</div>
                <div className="text-xs uppercase">
                  {dateValide.toLocaleString('fr-FR', { month: 'short' })}
                </div>
              </>
            ) : (
              <div className="text-xs font-semibold">{saison}</div>
            )}
          </div>
        </div>

        <div className="p-4">
          <h3 className="mb-1 text-lg font-bold text-gray-900">{event.title}</h3>
          <p className="flex items-center gap-1 text-sm text-gray-600">
            📍 {event.location}
          </p>
        </div>
      </article>
    </Link>
  );
}