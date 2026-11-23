import { getServerSupabase, getServerUser } from './server';
import { isSupabaseConfigured } from './config';

const configuredTables = [
  process.env.NEXT_PUBLIC_SUPABASE_USERS_TABLE,
  process.env.SUPABASE_USERS_TABLE,
]
  .filter(Boolean)
  .flatMap((value) => value.split(','))
  .map((value) => value.trim())
  .filter(Boolean);

const USER_TABLE_CANDIDATES = [
  ...configuredTables,
  'utilisateurs',
  'users',
  'profiles',
  'user_profiles',
  'admin_users',
];

const ID_COLUMNS = ['id', 'auth_user_id', 'user_id', 'uid'];
const EMAIL_COLUMNS = ['email', 'user_email', 'mail'];

function normalize(value) {
  return String(value ?? '')
    .trim()
    .toLocaleLowerCase('fr');
}

function readField(profile, names) {
  for (const name of names) {
    if (profile && profile[name] !== undefined && profile[name] !== null) {
      return profile[name];
    }
  }
  return '';
}

export function isAdminProfile(profile) {
  if (!profile) return false;

  const role = normalize(readField(profile, ['role', 'rôle', 'niveau', 'type']));
  const statut = normalize(
    readField(profile, ['statut', 'status', 'etat', 'état', 'active'])
  );

  const hasAdminRole = ['admin', 'administrateur', 'administrator'].includes(
    role
  );
  const isActive = ['actif', 'active', 'oui', 'true', '1'].includes(statut);

  return hasAdminRole && isActive;
}

async function findUserProfile(supabase, user) {
  const candidates = [
    ...ID_COLUMNS.map((column) => ({ column, value: user.id })),
    ...(user.email
      ? EMAIL_COLUMNS.map((column) => ({ column, value: user.email }))
      : []),
  ];

  for (const table of [...new Set(USER_TABLE_CANDIDATES)]) {
    for (const { column, value } of candidates) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq(column, value)
        .maybeSingle();

      if (!error && data) {
        return { profile: data, table, column };
      }
    }
  }

  return null;
}

export async function getAdminContext() {
  if (!isSupabaseConfigured) {
    return { configured: false, authenticated: false, authorized: false };
  }

  const user = await getServerUser();
  if (!user) {
    return { configured: true, authenticated: false, authorized: false };
  }

  const supabase = await getServerSupabase();
  const match = supabase ? await findUserProfile(supabase, user) : null;
  const profile = match?.profile ?? null;
  const authorized = isAdminProfile(profile);

  return {
    configured: true,
    authenticated: true,
    authorized,
    user,
    profile,
    usersTable: match?.table ?? null,
    role: readField(profile, ['role', 'rôle', 'niveau', 'type']),
    statut: readField(profile, ['statut', 'status', 'etat', 'état', 'active']),
  };
}
