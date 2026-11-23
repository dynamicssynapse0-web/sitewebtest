const rawUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
const rawKey = (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '').trim();

export const SUPABASE_URL = rawUrl;
export const SUPABASE_PUBLISHABLE_KEY = rawKey;
export const SUPABASE_MEDIA_BUCKET = 'media';

const PLACEHOLDER_KEY =
  /^(collez|remplacez|your|votre|replace|changez|todo|xxx)/i.test(rawKey) ||
  rawKey.length < 20;

function isValidUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

export const isSupabaseConfigured = Boolean(
  isValidUrl(rawUrl) && rawKey && !PLACEHOLDER_KEY
);

export function safeAdminNext(value) {
  if (
    typeof value === 'string' &&
    value.startsWith('/admin') &&
    !value.startsWith('//')
  ) {
    return value;
  }
  return '/admin';
}
