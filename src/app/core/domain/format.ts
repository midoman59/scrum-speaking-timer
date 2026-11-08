// Formats d'affichage uniques (NFR-20, S-E1-08). Fonctions pures, sans Angular.

const pad2 = (n: number): string => String(n).padStart(2, '0');

/** Durée en mm:ss, sans limite de minutes (A24). Ex. 225 -> « 03:45 ». */
export function formatMmSs(totalSec: number): string {
  const s = Math.max(0, Math.floor(totalSec));
  return `${pad2(Math.floor(s / 60))}:${pad2(s % 60)}`;
}

/** Chronomètre : mm:ss, puis h:mm:ss à partir de 3 600 s. Ex. 3 600 -> « 1:00:00 ». */
export function formatClock(totalSec: number): string {
  const s = Math.max(0, Math.floor(totalSec));
  if (s < 3600) return formatMmSs(s);
  const h = Math.floor(s / 3600);
  const rest = s % 3600;
  return `${h}:${pad2(Math.floor(rest / 60))}:${pad2(rest % 60)}`;
}

/** Dépassement « +mm:ss » : arrondi au supérieur, minimum 1 s (S-E1-08). */
export function formatOverrun(overrunMs: number): string {
  const seconds = Math.max(1, Math.ceil(overrunMs / 1000));
  return `+${formatClock(seconds)}`;
}

/** Date jj/mm/aaaa, fuseau local (NFR-20). */
export function formatDateFr(date: Date): string {
  return `${pad2(date.getDate())}/${pad2(date.getMonth() + 1)}/${date.getFullYear()}`;
}
