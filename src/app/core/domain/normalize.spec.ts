import { memberKey, normalizeMemberName, normalizeTeamName } from './normalize';

// S-E2-01 et S-E2-02 : normalisation (NFC, espaces) et clé de doublon (INV-02, INV-07).
describe('Normalisation (S-E2-01, S-E2-02)', () => {
  it('nom d\'équipe : espaces multiples et de bord réduits', () => {
    expect(normalizeTeamName('  Équipe    Alpha  ')).toBe('Équipe Alpha');
  });

  it('prénom : première lettre mise en majuscule si elle est minuscule', () => {
    expect(normalizeMemberName('thomas')).toBe('Thomas');
  });

  it('prénom : seule la première lettre est corrigée, le reste est inchangé (PRD 6.3, INV-07)', () => {
    expect(normalizeMemberName('jEAN')).toBe('JEAN');
    expect(normalizeMemberName('mARIE')).toBe('MARIE');
    expect(normalizeMemberName('Anne-Marie')).toBe('Anne-Marie');
  });

  it('prénom : forme décomposée convertie en NFC', () => {
    const decomposed = 'Le\u0301a';
    expect(normalizeMemberName(decomposed)).toBe('Léa');
    expect(normalizeMemberName(decomposed).normalize('NFC')).toBe(normalizeMemberName(decomposed));
  });

  it('clé de doublon : casse et espaces ignorés, accents comptent (INV-02, H-13)', () => {
    expect(memberKey('thomas')).toBe(memberKey('Thomas  '));
    expect(memberKey('Léa')).not.toBe(memberKey('Lea'));
  });
});
