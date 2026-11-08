import { formatClock, formatDateFr, formatMmSs, formatOverrun } from './format';

// S-E1-08 critère 1 à 4 : formats uniques de l'application (NFR-20, A24).
describe('Formats (S-E1-08)', () => {
  it('critère 1 : mm:ss, sans limite de minutes', () => {
    expect(formatMmSs(225)).toBe('03:45');
    expect(formatMmSs(7380)).toBe('123:00');
  });

  it('critère 2 : clock, passage à h:mm:ss à 3 600 s', () => {
    expect(formatClock(3599)).toBe('59:59');
    expect(formatClock(3600)).toBe('1:00:00');
  });

  it('critère 3 : dépassement arrondi au supérieur, minimum 1 s', () => {
    expect(formatOverrun(20_000)).toBe('+00:20');
    expect(formatOverrun(1)).toBe('+00:01');
  });

  it('critère 4 : date jj/mm/aaaa', () => {
    expect(formatDateFr(new Date(2026, 10, 8))).toBe('08/11/2026');
  });
});
