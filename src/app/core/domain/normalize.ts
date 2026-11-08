// Normalisation des saisies (PRD 6.1, 6.3 ; INV-02, INV-07). Fonctions pures.

/** NFC, espaces multiples réduits à un seul, espaces de bord retirés. */
function cleanSpaces(raw: string): string {
  return raw.normalize('NFC').replace(/\s+/g, ' ').trim();
}

/** Nom d'équipe normalisé : « Équipe    Alpha » devient « Équipe Alpha ». */
export function normalizeTeamName(raw: string): string {
  return cleanSpaces(raw);
}

/**
 * Prénom normalisé : seule la première lettre est mise en majuscule si elle est minuscule.
 * Le reste est inchangé (PRD 6.3, INV-07).
 */
export function normalizeMemberName(raw: string): string {
  const name = cleanSpaces(raw);
  if (name === '') return '';
  const first = String.fromCodePoint(name.codePointAt(0) as number);
  const isLowerCase = first.toLowerCase() === first && first.toUpperCase() !== first;
  return (isLowerCase ? first.toUpperCase() : first) + name.slice(first.length);
}

/** Clé de comparaison des prénoms : NFC, espaces réduits, minuscules. Les accents comptent (H-13). */
export function memberKey(name: string): string {
  return cleanSpaces(name).toLowerCase();
}
