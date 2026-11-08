/** Codes de validation stables. Leurs textes sont dans messages.ts (architecture 4.1). */
export const VALIDATION_CODES = [
  'TEAM_NAME_REQUIRED',
  'TEAM_NAME_TOO_LONG',
  'TEAM_NAME_INVALID_CHARS',
  'MEMBER_NAME_REQUIRED',
  'MEMBER_NAME_TOO_LONG',
  'MEMBER_NAME_INVALID_CHARS',
  'MEMBER_NAME_DUPLICATE',
  'MEMBER_COUNT_MIN',
  'MEMBER_COUNT_MAX',
  'DURATION_REQUIRED',
  'DURATION_NOT_INTEGER',
  'DURATION_TOO_SHORT',
  'DURATION_TOO_LONG',
  'DURATION_PER_MEMBER_TOO_SHORT',
  'ALLOCATION_REQUIRED',
  'ALLOCATION_FORMAT',
  'ALLOCATION_TOO_SHORT',
  'ALLOCATION_TOO_LONG',
  'ALLOCATION_SUM_MISMATCH',
] as const;

export type ValidationCode = (typeof VALIDATION_CODES)[number];

export interface ValidationError {
  readonly code: ValidationCode;
  readonly field: 'teamName' | 'duration' | 'member' | 'allocation' | 'members';
  readonly memberId?: string;
  /** ALLOCATION_SUM_MISMATCH : durée moins somme (positif = il manque du temps). */
  readonly deltaSec?: number;
  readonly limit?: number;
  /** DURATION_PER_MEMBER_TOO_SHORT : nombre de Membres. */
  readonly count?: number;
}
