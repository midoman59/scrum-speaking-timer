// Règles de validation du domaine (PRD section 6). Un seul endroit, réutilisé par les formulaires,
// le service et l'import (ADR-07).
import { ValidationError } from './errors';
import { Member } from './model';
import { memberKey, normalizeMemberName, normalizeTeamName } from './normalize';
import { Result } from './result';

const TEAM_NAME_PATTERN = /^[\p{L}\p{M}\p{N} '’\-.()]+$/u; // INV-03
const MEMBER_NAME_PATTERN = /^[\p{L}\p{M}]+(?:[ '’\-][\p{L}\p{M}]+)*$/u; // INV-06

/** Nom d'équipe : 1 à 50 caractères après normalisation, caractères autorisés (INV-03, 6.1). */
export function validateTeamName(raw: string): ValidationError[] {
  const name = normalizeTeamName(raw);
  const fail = (code: ValidationError['code']): ValidationError[] => [{ code, field: 'teamName' }];
  if (name === '') return fail('TEAM_NAME_REQUIRED');
  if (Array.from(name).length > 50) return fail('TEAM_NAME_TOO_LONG');
  if (!TEAM_NAME_PATTERN.test(name)) return fail('TEAM_NAME_INVALID_CHARS');
  return [];
}

/**
 * Prénom : 1 à 30 caractères, lettres et séparateurs simples, pas de doublon (INV-02, INV-06, 6.3).
 * `selfId` exclut le Membre renommé de la recherche de doublon.
 */
export function validateMemberName(raw: string, others: readonly Member[], selfId?: string): ValidationError[] {
  const name = normalizeMemberName(raw);
  const fail = (code: ValidationError['code']): ValidationError[] => [{ code, field: 'member' }];
  if (name === '') return fail('MEMBER_NAME_REQUIRED');
  if (Array.from(name).length > 30) return fail('MEMBER_NAME_TOO_LONG');
  if (!MEMBER_NAME_PATTERN.test(name)) return fail('MEMBER_NAME_INVALID_CHARS');
  const key = memberKey(name);
  const duplicate = others.some((m) => m.id !== selfId && memberKey(m.name) === key);
  if (duplicate) return fail('MEMBER_NAME_DUPLICATE');
  return [];
}

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
