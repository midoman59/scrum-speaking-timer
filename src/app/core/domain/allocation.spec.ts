import { allocateEqual, allocationDelta, parseAllocation } from './allocation';

// S-E3-02 : répartition égale exacte, écart et lecture de la saisie (FR-8, INV-04, ADR-08).
describe('Répartition (S-E3-02)', () => {
  it('critère 1 : 900 s pour 4 Membres donne 225 s chacun', () => {
    expect(allocateEqual(900, 4)).toEqual([225, 225, 225, 225]);
  });

  it('critère 2 : 900 s pour 7 Membres donne 129 s (x4) puis 128 s (x3)', () => {
    expect(allocateEqual(900, 7)).toEqual([129, 129, 129, 129, 128, 128, 128]);
  });

  it('critère 3 : la somme égale exactement la durée pour toute durée multiple de 60 et n de 2 à 15', () => {
    for (let n = 2; n <= 15; n++) {
      for (let duration = 60; duration <= 7200; duration += 60) {
        const parts = allocateEqual(duration, n);
        const sum = parts.reduce((acc, part) => acc + part, 0);
        expect(sum).toBe(duration);
        expect(Math.max(...parts) - Math.min(...parts)).toBeLessThanOrEqual(1);
      }
    }
  });

  it('critère 4 : allocationDelta renvoie durée moins somme (positif = il manque du temps)', () => {
    expect(allocationDelta([{ allocatedSec: 200 }, { allocatedSec: 200 }], 900)).toBe(500);
    expect(allocationDelta([{ allocatedSec: 500 }, { allocatedSec: 430 }], 900)).toBe(-30);
  });

  it('critère 5 : parseAllocation accepte secondes et mm:ss, refuse le reste', () => {
    expect(parseAllocation('90')).toEqual({ ok: true, value: 90 });
    expect(parseAllocation('01:30')).toEqual({ ok: true, value: 90 });
    const bad = parseAllocation('4min');
    expect(bad.ok).toBeFalse();
    if (!bad.ok) expect(bad.error.code).toBe('ALLOCATION_FORMAT');
  });
});
