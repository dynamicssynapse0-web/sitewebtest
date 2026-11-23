// Garantit que tout ce qui traverse la frontière Server Component → Client Component
// (ou Server Action → client) est un arbre JSON simple : chaînes, nombres finis,
// booléens, null, tableaux et objets à prototype Object.prototype uniquement.
// Les instances Date, les objets de classes (User Supabase, etc.), undefined,
// les fonctions et les références circulaires sont convertis ou écartés.

const CIRCULAR_VALUE = '[Circular]';

function isPlainObject(value) {
  if (value === null || typeof value !== 'object') return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

export function toPlainJson(value, stack = new Set()) {
  if (value === null) return null;

  switch (typeof value) {
    case 'string':
    case 'boolean':
      return value;
    case 'number':
      return Number.isFinite(value) ? value : null;
    case 'undefined':
    case 'function':
    case 'symbol':
    case 'bigint':
      return null;
    default:
      break;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value.toISOString();
  }
  if (value instanceof Error) {
    return value.message || null;
  }
  if (typeof URL !== 'undefined' && value instanceof URL) {
    return value.toString();
  }
  if (ArrayBuffer.isView(value)) {
    return Array.from(value);
  }
  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return Array.from(new Uint8Array(value));
  }
  if (typeof Map !== 'undefined' && value instanceof Map) {
    return toPlainJson(Array.from(value.entries()), stack);
  }
  if (typeof Set !== 'undefined' && value instanceof Set) {
    return toPlainJson(Array.from(value.values()), stack);
  }

  // Cycle détecté : on coupe la référence plutôt que de boucler.
  if (stack.has(value)) return CIRCULAR_VALUE;
  stack.add(value);

  try {
    if (typeof value.toJSON === 'function') {
      return toPlainJson(value.toJSON(), stack);
    }

    if (Array.isArray(value)) {
      return value.map((entry) => toPlainJson(entry, stack));
    }

    // Les instances de classes sont reconstruites en objets simples.
    const result = {};
    for (const [key, entry] of Object.entries(value)) {
      if (entry === undefined) continue;
      result[key] = toPlainJson(entry, stack);
    }
    return result;
  } catch {
    return null;
  } finally {
    stack.delete(value);
  }
}

export function toPlainRows(rows) {
  if (!Array.isArray(rows)) return [];
  return rows.map((row) => toPlainJson(row));
}

// Force une valeur affichable dans un JSX (rôle, statut, e-mail…) sans risquer
// « Objects are not valid as a React child » si la colonne est de type jsonb.
export function safeText(value) {
  const plain = toPlainJson(value);
  if (plain === null || typeof plain === 'object') return '';
  return String(plain);
}

export function errorText(error) {
  if (error instanceof Error) return error.message || 'Erreur inconnue.';
  if (typeof error === 'string' && error) return error;
  return 'Une erreur est survenue.';
}
