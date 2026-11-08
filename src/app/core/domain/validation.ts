// Règles de validation du domaine (PRD section 6). Un seul endroit, réutilisé par les formulaires,
// le service et l'import (ADR-07).
import { ValidationError } from './errors';
import { Result } from './result';

/** Durée de cérémonie saisie en minutes entières, convertie en secondes (INV-08, 6.4). */
export function validateDurationMinutes(raw: string | number): Result<number, ValidationError> {
  const text = String(raw).trim();
  const fail = (code: ValidationError['code']): Result<number, ValidationError> => ({
    ok: false,
    error: { code, field: 'duration' },
  });

  if (text === '') return fail('DURATION_REQUIRED');
  if (!/^-?\d+$/.test(text)) return fail('DURATION_NOT_INTEGER');

  const minutes = Number(text);
  if (minutes < 1) return fail('DURATION_TOO_SHORT');
  if (minutes > 120) return fail('DURATION_TOO_LONG');
  return { ok: true, value: minutes * 60 };
}

/** Durée par Membre au moins 30 s (INV-09, H-5). Renvoie les erreurs, vide si valide. */
export function validateDurationForMembers(durationSec: number, memberCount: number): ValidationError[] {
  if (memberCount > 0 && durationSec < 30 * memberCount) {
    return [{ code: 'DURATION_PER_MEMBER_TOO_SHORT', field: 'duration', count: memberCount }];
  }
  return [];
}
