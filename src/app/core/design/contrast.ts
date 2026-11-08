// Utilitaire de contraste WCAG 2.1 (luminance relative). Hors domaine métier : sert aux tests de DESIGN.md.

function channel(value: number): number {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

/** Luminance relative d'une couleur hexadécimale #RRGGBB (ou #RGB). */
export function relativeLuminance(hex: string): number {
  const clean = hex.trim().replace('#', '');
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) {
    throw new Error(`Couleur hexadécimale invalide : ${hex}`);
  }
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** Ratio de contraste entre deux couleurs hexadécimales, arrondi à deux décimales. */
export function contrastRatio(foreground: string, background: string): number {
  const l1 = relativeLuminance(foreground);
  const l2 = relativeLuminance(background);
  const [light, dark] = l1 >= l2 ? [l1, l2] : [l2, l1];
  return Math.round(((light + 0.05) / (dark + 0.05)) * 100) / 100;
}
