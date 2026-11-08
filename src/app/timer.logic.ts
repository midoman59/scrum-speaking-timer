import { Member } from './models';

export const MIN_MEMBERS = 2;
export const MAX_MEMBERS = 15;
export const DEFAULT_DURATION_SEC = 15 * 60;

/** Répartit la durée de la session à parts égales entre les membres. */
export function splitEvenly(durationSec: number, count: number): number {
  if (count <= 0) return 0;
  return Math.floor(durationSec / count);
}

/**
 * Temps réellement parlé à partir de l'horodatage (et non d'un compteur),
 * pour rester exact quand l'onglet est en arrière-plan.
 */
export function elapsedSinceTurn(turnStartedAt: number, now: number): number {
  return Math.max(0, Math.floor((now - turnStartedAt) / 1000));
}

/** Temps restant pour le membre courant (négatif = dépassement). */
export function remainingFor(member: Member, turnStartedAt: number, now: number): number {
  return member.allocatedSec - member.spokenSec - elapsedSinceTurn(turnStartedAt, now);
}

export function isValidMemberCount(count: number): boolean {
  return count >= MIN_MEMBERS && count <= MAX_MEMBERS;
}
