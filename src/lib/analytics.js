import { getPublicSupabase } from './supabase/publicClient';
import { getAllEvents } from './events';
import { getAllInternationalCompetitions } from './internationalCompetitions';
import { getGalleryImages } from './gallery';
import { getAllSports } from './sports';

// Compteur first-party : une ligne par page vue, sans cookie ni script tiers.
// La table reste absente tant que sql/advertising.sql n'a pas été exécuté :
// dans ce cas on renvoie simplement 0 et le kit média reste lisible.
export async function getMonthlyPageviews() {
  const supabase = getPublicSupabase();
  if (!supabase) return 0;

  try {
    const since = new Date();
    since.setUTCDate(since.getUTCDate() - 30);

    const { count, error } = await supabase
      .from('site_pageviews')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', since.toISOString());

    if (error) return 0;
    return Number(count) || 0;
  } catch {
    return 0;
  }
}

// Chiffres affichés sur /annonceurs : uniquement des valeurs calculées à partir
// du contenu réellement publié (aucun chiffre inventé).
export async function getAudienceStats() {
  const [events, competitions, sports, photos, pageviews] = await Promise.all([
    getAllEvents(),
    getAllInternationalCompetitions(),
    getAllSports(),
    getGalleryImages(),
    getMonthlyPageviews(),
  ]);

  return {
    events: events.length,
    competitions: competitions.length,
    sports: sports.length,
    photos: photos.length,
    pageviews,
  };
}
