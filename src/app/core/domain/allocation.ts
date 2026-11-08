// Répartition du temps (FR-8, FR-9, INV-04, ADR-08). Fonctions pures.
import { Result } from './result';
import { ValidationError } from './errors';

/**
 * Répartition égale : floor(d / n) pour chacun, +1 s aux d mod n premiers (dans l'ordre).
 * La somme vaut exactement la durée (INV-04).
 */
export function allocateEqual(durationSec: number, count: number): number[] {
  if (count <= 0) return [];
  const base = Math.floor(durationSec / count);
  const remainder = durationSec % count;
  return Array.from({ length: count }, (_, index) => base + (index < remainder ? 1 : 0));
}

/** Écart signé : durée moins somme des Temps alloués. Positif = il manque du temps. */
export function allocationDelta(members: readonly { readonly allocatedSec: number }[], durationSec: number): number {
  const total = members.reduce((sum, member) => sum + member.allocatedSec, 0);
  return durationSec - total;
}

/** Lit une saisie de Temps alloué : secondes entières (« 90 ») ou mm:ss (« 01:30 »). */
export function parseAllocation(raw: string): Result<number, ValidationError> {
  const text = raw.trim();
  const formatError: Result<number, ValidationError> = {
    ok: false,
    error: { code: 'ALLOCATION_FORMAT', field: 'allocation' },
  };
  if (/^\d+$/.test(text)) return { ok: true, value: Number(text) };
  const clock = /^(\d{1,3}):([0-5]\d)$/.exec(text);
  if (clock) return { ok: true, value: Number(clock[1]) * 60 + Number(clock[2]) };
  return formatError;
}
