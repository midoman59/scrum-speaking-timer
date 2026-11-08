import { contrastRatio } from './contrast';

// S-E1-06 : jetons de couleur (DESIGN.md 2.2), focus visible et contrastes (DESIGN.md 3).

/** Lit la valeur calculée d'un jeton CSS sur la racine. */
function token(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function setTheme(theme: 'light' | 'dark'): void {
  document.documentElement.setAttribute('data-theme', theme);
}

describe('Contrastes (S-E1-06)', () => {
  afterEach(() => document.documentElement.removeAttribute('data-theme'));

  it('calcule le ratio WCAG : noir sur blanc = 21', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBe(21);
  });

  it('calcule le ratio de DESIGN.md : #1A202C sur #FFFFFF = 16,32', () => {
    expect(contrastRatio('#1A202C', '#FFFFFF')).toBe(16.32);
  });

  // Couples texte / fond (seuil 4,5 : 1) et composants (seuil 3 : 1), DESIGN.md section 3.
  const lightPairs: [string, string, number][] = [
    ['--color-text', '--color-bg', 4.5],
    ['--color-text', '--color-surface', 4.5],
    ['--color-text-muted', '--color-bg', 4.5],
    ['--color-text-muted', '--color-surface', 4.5],
    ['--color-primary', '--color-bg', 4.5],
    ['--color-on-primary', '--color-primary', 4.5],
    ['--color-on-primary', '--color-primary-hover', 4.5],
    ['--color-on-primary-soft', '--color-primary-soft', 4.5],
    ['--color-on-secondary', '--color-secondary', 4.5],
    ['--color-success', '--color-bg', 4.5],
    ['--color-success', '--color-success-soft', 4.5],
    ['--color-danger', '--color-bg', 4.5],
    ['--color-danger', '--color-danger-soft', 4.5],
    ['--color-on-danger', '--color-danger', 4.5],
    ['--color-warning', '--color-warning-soft', 4.5],
    ['--color-border', '--color-bg', 3],
    ['--color-focus', '--color-bg', 3],
    ['--color-danger', '--color-bg', 3],
  ];

  const darkPairs: [string, string, number][] = [
    ['--color-text', '--color-bg', 4.5],
    ['--color-text', '--color-surface', 4.5],
    ['--color-text-muted', '--color-bg', 4.5],
    ['--color-text-muted', '--color-surface-hover', 4.5],
    ['--color-primary', '--color-bg', 4.5],
    ['--color-on-primary', '--color-primary', 4.5],
    ['--color-on-primary', '--color-primary-hover', 4.5],
    ['--color-on-primary-soft', '--color-primary-soft', 4.5],
    ['--color-on-secondary', '--color-secondary', 4.5],
    ['--color-success', '--color-bg', 4.5],
    ['--color-danger', '--color-surface', 4.5],
    ['--color-on-danger', '--color-danger', 4.5],
    ['--color-danger-hover', '--color-danger-soft', 4.5],
    ['--color-warning', '--color-warning-soft', 4.5],
    ['--color-border', '--color-bg', 3],
    ['--color-focus', '--color-bg', 3],
    ['--color-danger', '--color-bg', 3],
  ];

  it('critère 2 (clair) : chaque couple atteint son seuil', () => {
    setTheme('light');
    for (const [fg, bg, min] of lightPairs) {
      const ratio = contrastRatio(token(fg), token(bg));
      expect(ratio).toBeGreaterThanOrEqual(min, `${fg} sur ${bg} (clair) : ${ratio}`);
    }
  });

  it('critère 2 (sombre) : chaque couple atteint son seuil', () => {
    setTheme('dark');
    for (const [fg, bg, min] of darkPairs) {
      const ratio = contrastRatio(token(fg), token(bg));
      expect(ratio).toBeGreaterThanOrEqual(min, `${fg} sur ${bg} (sombre) : ${ratio}`);
    }
  });
});

describe('Jetons et focus (S-E1-06)', () => {
  afterEach(() => document.documentElement.removeAttribute('data-theme'));

  it('critère 1 : jetons clairs définis sur la racine', () => {
    setTheme('light');
    expect(token('--color-bg')).toBe('#FFFFFF');
    expect(token('--color-text')).toBe('#1A202C');
    expect(token('--color-primary')).toBe('#4338CA');
    expect(token('--color-danger')).toBe('#C53030');
  });

  it('critère 1 : jetons sombres sous data-theme="dark"', () => {
    setTheme('dark');
    expect(token('--color-bg')).toBe('#111827');
    expect(token('--color-text')).toBe('#F3F4F6');
    expect(token('--color-primary')).toBe('#A5B4FC');
  });

  it('critère 4 : body a un fond explicite var(--color-bg)', () => {
    setTheme('light');
    expect(getComputedStyle(document.body).backgroundColor).toBe('rgb(255, 255, 255)');
  });

  it('critère 3 : un anneau de focus var(--color-focus) est défini, sans outline: none', () => {
    const cssText: string[] = [];
    for (const sheet of Array.from(document.styleSheets)) {
      for (const rule of Array.from(sheet.cssRules)) cssText.push(rule.cssText);
    }
    const joined = cssText.join('\n');
    expect(joined).toMatch(/:focus-visible[^}]*outline:[^;}]*var\(--color-focus\)/);
    expect(joined).not.toMatch(/outline:\s*(none|0)\b/);
  });
});
