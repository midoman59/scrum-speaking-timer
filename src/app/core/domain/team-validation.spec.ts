import { TeamDraft } from './model';
import { Member } from './model';
import { validateTeam } from './validation';

// Invariants d'équipe (architecture 3.2, INV-01 à INV-10), utilisés à l'enregistrement et à la lecture.
describe('Invariants d\'équipe (validateTeam)', () => {
  const people = (names: string[], allocatedSec = 0): Member[] =>
    names.map((name, index) => ({ id: `m${index}`, name, allocatedSec }));

  const draft = (overrides: Partial<TeamDraft>): TeamDraft => ({
    name: 'Équipe Alpha',
    durationSec: 900,
    allocationMode: 'equal',
    members: people(['Camille', 'Thomas'], 450),
    ...overrides,
  });

  const codesOf = (value: TeamDraft): string[] => validateTeam(value).map((e) => e.code);

  it('une équipe valide en répartition égale n\'a aucune erreur', () => {
    expect(validateTeam(draft({}))).toEqual([]);
  });

  it('INV-01 : moins de 2 Membres', () => {
    expect(codesOf(draft({ members: people(['Camille'], 900) }))).toContain('MEMBER_COUNT_MIN');
  });

  it('INV-02 : prénoms en doublon', () => {
    expect(codesOf(draft({ members: people(['Thomas', 'thomas'], 450) }))).toContain('MEMBER_NAME_DUPLICATE');
  });

  it('INV-08 : durée au-delà de 120 minutes', () => {
    expect(codesOf(draft({ durationSec: 7500 }))).toContain('DURATION_TOO_LONG');
  });

  it('INV-04 : répartition manuelle, somme inexacte avec écart signé', () => {
    const errors = validateTeam(draft({ allocationMode: 'manual', members: people(['Camille', 'Thomas'], 400) }));
    expect(errors.find((e) => e.code === 'ALLOCATION_SUM_MISMATCH')?.deltaSec).toBe(100);
  });

  it('INV-05 : temps alloué inférieur à 30 s en répartition manuelle', () => {
    const errors = validateTeam(draft({ allocationMode: 'manual', members: people(['Camille', 'Thomas'], 0) }));
    expect(errors.map((e) => e.code)).toContain('ALLOCATION_TOO_SHORT');
  });

  it('INV-10 : en répartition égale, les temps doivent suivre allocateEqual', () => {
    const names = ['A1', 'B2', 'C3', 'D4', 'E5', 'F6', 'G7'];
    expect(codesOf(draft({ members: people(names, 100) }))).toContain('ALLOCATION_SUM_MISMATCH');
  });
});
