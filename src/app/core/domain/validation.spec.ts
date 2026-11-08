import { validateDurationForMembers, validateDurationMinutes } from './validation';

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
