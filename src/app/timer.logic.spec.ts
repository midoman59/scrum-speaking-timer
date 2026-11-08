import { elapsedSinceTurn, isValidMemberCount, remainingFor, splitEvenly } from './timer.logic';
import { Member } from './models';

describe('splitEvenly', () => {
  it('répartit la durée à parts égales', () => {
    expect(splitEvenly(900, 5)).toBe(180);
  });

  it('renvoie 0 sans membre', () => {
    expect(splitEvenly(900, 0)).toBe(0);
  });
});

describe('elapsedSinceTurn', () => {
  it('mesure le temps à partir de l’horodatage', () => {
    expect(elapsedSinceTurn(1_000, 61_500)).toBe(60);
  });

  it('ne renvoie jamais une valeur négative', () => {
    expect(elapsedSinceTurn(5_000, 1_000)).toBe(0);
  });
});

describe('remainingFor', () => {
  const member: Member = { id: 'a', name: 'Ana', allocatedSec: 120, spokenSec: 30 };

  it('calcule le temps restant', () => {
    expect(remainingFor(member, 0, 20_000)).toBe(70);
  });

  it('devient négatif au dépassement', () => {
    expect(remainingFor(member, 0, 200_000)).toBeLessThan(0);
  });
});

describe('isValidMemberCount', () => {
  it('accepte entre 2 et 15 membres', () => {
    expect(isValidMemberCount(1)).toBe(false);
    expect(isValidMemberCount(2)).toBe(true);
    expect(isValidMemberCount(15)).toBe(true);
    expect(isValidMemberCount(16)).toBe(false);
  });
});
