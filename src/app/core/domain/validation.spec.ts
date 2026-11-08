import { validateDurationForMembers, validateDurationMinutes, validateMemberName, validateTeamName } from './validation';
import { Member } from './model';

// S-E3-01 : Durée de cérémonie (FR-7, règle 6.4, INV-08, INV-09, H-4, H-5).
describe('Validation de la durée (S-E3-01)', () => {
  function errorCodeOf(raw: string): string | null {
    const result = validateDurationMinutes(raw);
    return result.ok ? null : result.error.code;
  }

  it('critère 1 : saisie vide', () => {
    expect(errorCodeOf('')).toBe('DURATION_REQUIRED');
    expect(errorCodeOf('   ')).toBe('DURATION_REQUIRED');
  });

  it('critère 2 : décimale et texte refusés (entier de minutes)', () => {
    expect(errorCodeOf('7,5')).toBe('DURATION_NOT_INTEGER');
    expect(errorCodeOf('7.5')).toBe('DURATION_NOT_INTEGER');
    expect(errorCodeOf('abc')).toBe('DURATION_NOT_INTEGER');
  });

  it('critère 2 : 0 et -3 sous le minimum, 121 au-dessus du maximum', () => {
    expect(errorCodeOf('0')).toBe('DURATION_TOO_SHORT');
    expect(errorCodeOf('-3')).toBe('DURATION_TOO_SHORT');
    expect(errorCodeOf('121')).toBe('DURATION_TOO_LONG');
  });

  it('critère 3 : 15 minutes valent 900 secondes', () => {
    expect(validateDurationMinutes('15')).toEqual({ ok: true, value: 900 });
    expect(validateDurationMinutes(15)).toEqual({ ok: true, value: 900 });
  });

  it('critère 4 : 1 minute pour 3 Membres (20 s) est refusée avec le message exact', () => {
    const errors = validateDurationForMembers(60, 3);
    expect(errors.map((e) => e.code)).toEqual(['DURATION_PER_MEMBER_TOO_SHORT']);
    expect(errors[0].count).toBe(3);
  });

  it('critère 4 : 1 minute pour 2 Membres (30 s) est acceptée', () => {
    expect(validateDurationForMembers(60, 2)).toEqual([]);
  });
});


// S-E2-01 : nom d'équipe (règle 6.1, INV-03).
describe('Validation du nom d\'équipe (S-E2-01)', () => {
  const codes = (raw: string): string[] => validateTeamName(raw).map((e) => e.code);

  it('critère 1 : vide ou espaces seuls', () => {
    expect(codes('')).toEqual(['TEAM_NAME_REQUIRED']);
    expect(codes('    ')).toEqual(['TEAM_NAME_REQUIRED']);
  });

  it('critère 2 : 51 caractères refusés, 50 acceptés', () => {
    expect(codes('a'.repeat(51))).toEqual(['TEAM_NAME_TOO_LONG']);
    expect(codes('a'.repeat(50))).toEqual([]);
  });

  it('critère 3 : « < » et « # » refusés ; lettres accentuées, chiffres, apostrophes, tirets, points, parenthèses acceptés', () => {
    expect(codes('Équipe <Alpha>')).toEqual(['TEAM_NAME_INVALID_CHARS']);
    expect(codes('Équipe #1')).toEqual(['TEAM_NAME_INVALID_CHARS']);
    expect(codes('L\'équipe Alpha-2 (v1.0)')).toEqual([]);
    expect(codes('Équipe’Été')).toEqual([]);
  });
});

// S-E2-02 : prénoms (règle 6.3, INV-02, INV-06, INV-07, T8).
describe('Validation des prénoms (S-E2-02)', () => {
  const member = (id: string, name: string): Member => ({ id, name, allocatedSec: 0 });
  const codes = (raw: string, others: Member[] = [], selfId?: string): string[] =>
    validateMemberName(raw, others, selfId).map((e) => e.code);

  it('critère 2 : Léa et Lea ne sont pas en doublon ; thomas et « Thomas  » le sont', () => {
    expect(codes('Léa', [member('1', 'Lea')])).toEqual([]);
    expect(codes('thomas', [member('1', 'Thomas  ')])).toEqual(['MEMBER_NAME_DUPLICATE']);
  });

  it('critère 3 : chiffre ou emoji refusés', () => {
    expect(codes('Jean3')).toEqual(['MEMBER_NAME_INVALID_CHARS']);
    expect(codes('Jean😀')).toEqual(['MEMBER_NAME_INVALID_CHARS']);
  });

  it('critère 4 : vide puis 31 caractères', () => {
    expect(codes('   ')).toEqual(['MEMBER_NAME_REQUIRED']);
    expect(codes('a'.repeat(31))).toEqual(['MEMBER_NAME_TOO_LONG']);
    expect(codes('a'.repeat(30))).toEqual([]);
  });

  it('critère 5 : forme décomposée acceptée', () => {
    expect(codes('Le\u0301a')).toEqual([]);
  });

  it('critère 6 : renommer un Membre en son propre prénom ne déclenche pas de doublon', () => {
    expect(codes('Thomas', [member('1', 'Thomas')], '1')).toEqual([]);
  });

  it('traits d\'union et apostrophes acceptés', () => {
    expect(codes('Jean-Pierre')).toEqual([]);
    expect(codes('D\'Artagnan')).toEqual([]);
  });
});
