// Normalise le lien de destination d'une publicité.
// Accepte aussi bien une URL complète (https://exemple.com) qu'un domaine saisi
// sans protocole (www.exemple.com), fréquent lors d'une saisie manuelle.
const HAS_SCHEME = /^[a-z][a-z0-9+.-]*:/i;

export function normalizeAdLink(value) {
  let raw = String(value ?? '').trim();

  if (!raw) {
    return { ok: false, error: 'Renseignez le lien de destination.' };
  }
  if (raw.includes('\\')) {
    return { ok: false, error: 'Le lien de destination n’est pas valide.' };
  }

  // Lien interne : /annonceurs, /galerie, etc.
  if (raw.startsWith('/') && !raw.startsWith('//')) {
    return { ok: true, url: raw };
  }

  if (!HAS_SCHEME.test(raw)) {
    raw = `https://${raw}`;
  }

  let url;
  try {
    url = new URL(raw);
  } catch {
    return {
      ok: false,
      error: 'Lien invalide : utilisez www.exemple.com ou https://exemple.com.',
    };
  }

  if (!['http:', 'https:'].includes(url.protocol)) {
    return { ok: false, error: 'Seuls les liens http(s) sont acceptés.' };
  }
  if (!url.hostname || (!url.hostname.includes('.') && url.hostname !== 'localhost')) {
    return {
      ok: false,
      error: 'Renseignez un domaine valide (ex. www.bilderfassung.com).',
    };
  }

  return { ok: true, url: url.toString() };
}
