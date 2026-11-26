// Tables « propres » au projet Bilderfassung. Les tables historiques restent
// en secours : si la table _bilderfassung n'existe pas encore, le code retombe
// sur l'ancienne table sans casser le site.
//
// `event_bilderfassung` et `admin_bilderfassung` sont déjà migrées et ne sont
// volontairement pas listing ici : leur routage existe déjà dans leur propre
// module.
export const PROJECT_TABLES = {
  images_sport: 'images_sport_bilderfassung',
  categories_sport: 'categories_sport_bilderfassung',
  sportifs_semaine: 'sportifs_semaine_bilderfassung',
  vitrine_items: 'vitrine_items_bilderfassung',
  ads: 'ads_bilderfassung',
  ad_clicks: 'ad_clicks_bilderfassung',
  site_pageviews: 'site_pageviews_bilderfassung',
};

export const PROJECT_TABLE_NAMES = new Set([
  ...Object.keys(PROJECT_TABLES),
  ...Object.values(PROJECT_TABLES),
]);

export function isMissingTableError(error) {
  const message = String(error?.message || '');
  return (
    /PGRST205/i.test(message) ||
    /Could not find the table/i.test(message) ||
    /does not exist/i.test(message)
  );
}

// Renvoie la table _bilderfassung quand elle est disponible, sinon la table
// historique. Le client passé peut être public (lecture) ou serveur (écriture).
export async function resolveTable(supabase, table) {
  const target = PROJECT_TABLES[table] ?? table;
  if (!supabase || !PROJECT_TABLES[table]) return target;

  try {
    const { error } = await supabase.from(target).select('id').limit(0);
    if (error && isMissingTableError(error)) return table;
    return target;
  } catch {
    return target;
  }
}

// Nom « historique » d'une table, utilisé pour les invalidations de cache.
export function canonicalTableName(table) {
  const match = Object.entries(PROJECT_TABLES).find(
    ([, target]) => target === table
  );
  return match ? match[0] : table;
}
