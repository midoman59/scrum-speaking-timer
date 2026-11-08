// S-E1-02 : contrôle du manifeste PWA (NFR-1). Lu depuis le dossier public servi par Karma.
describe('Manifeste PWA (S-E1-02)', () => {
  let manifest: {
    name: string;
    short_name: string;
    start_url: string;
    scope: string;
    display: string;
    theme_color: string;
    background_color: string;
    lang: string;
    icons: { src: string; sizes: string; type: string; purpose?: string }[];
  };

  beforeAll(async () => {
    const response = await fetch('manifest.webmanifest');
    manifest = await response.json();
  });

  it('critère 1 : nom, nom court, chemins relatifs, affichage standalone et couleurs', () => {
    expect(manifest.name).toBe('Scrum Speaking Timer');
    expect(manifest.short_name).toBeTruthy();
    expect(manifest.start_url).toBe('./');
    expect(manifest.scope).toBe('./');
    expect(manifest.display).toBe('standalone');
    expect(manifest.theme_color).toBe('#4338CA');
    expect(manifest.background_color).toBe('#FFFFFF');
    expect(manifest.lang).toBe('fr');
  });

  it('critère 2 : icônes PNG 192 px et 512 px référencées', () => {
    const sizes = manifest.icons.filter((i) => i.type === 'image/png').map((i) => i.sizes);
    expect(sizes).toContain('192x192');
    expect(sizes).toContain('512x512');
  });

  it('critère 4 : une icône maskable 512 px est déclarée et accessible', async () => {
    const maskable = manifest.icons.find((i) => i.purpose === 'maskable' && i.sizes === '512x512');
    expect(maskable).toBeDefined();
    const response = await fetch(maskable!.src);
    expect(response.ok).toBeTrue();
  });
});
