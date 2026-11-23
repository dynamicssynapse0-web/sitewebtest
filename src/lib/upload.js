// Utilitaire serveur : génère un horodatage Unix (secondes) pour les noms de fichiers.
// Gardé hors des composants React pour respecter la règle de pureté du render.
export function getUploadTimestamp() {
  return Math.floor(Date.now() / 1000);
}

const ACCENTED_CHARACTERS = /[\u0300-\u036f]/g;

export function uploadFileBase(title) {
  return (
    String(title || '')
      .normalize('NFD')
      .replace(ACCENTED_CHARACTERS, '')
      .toLocaleLowerCase('fr')
      .replace(/['’]/g, '-')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 90) || 'photo'
  );
}
