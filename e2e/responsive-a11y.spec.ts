import { test, expect, Page } from './fixtures';

// S-E1-07 : responsive à 320 px, cibles tactiles d'au moins 44 px, mouvement réduit (NFR-16).
const PAGES = ['#/equipe', '#/preparation', '#/session', '#/bilan'];
const STORAGE_KEY = 'scrum-timer:v1';
const SEEDED_TEAM = {
  schemaVersion: 1,
  team: {
    id: 't1',
    name: 'Équipe Alpha',
    durationSec: 900,
    allocationMode: 'equal',
    members: [
      { id: 'm1', name: 'Camille', allocatedSec: 450 },
      { id: 'm2', name: 'Thomas', allocatedSec: 450 },
    ],
  },
  settings: { soundEnabled: true },
  session: null,
};

/** Une équipe valide est en place, comme après une visite précédente (la garde laisse passer /preparation). */
async function seedTeam(page: Page): Promise<void> {
  const raw = JSON.stringify(SEEDED_TEAM);
  await page.addInitScript(
    ([key, value]) => {
      if (window.localStorage.getItem(key) === null) window.localStorage.setItem(key, value);
    },
    [STORAGE_KEY, raw] as const,
  );
}

test.describe('Responsive et accessibilité à 320 px (S-E1-07)', () => {
  test.beforeEach(async ({ page }) => {
    await seedTeam(page);
    await page.setViewportSize({ width: 320, height: 640 });
  });

  for (const hash of PAGES) {
    test(`critère 1 : ${hash} sans défilement horizontal, contenu dans une marge de 16 px`, async ({ page }) => {
      await page.goto(`/${hash}`);
      await expect(page.locator('h1')).toBeVisible();

      const layout = await page.evaluate(() => {
        const root = document.documentElement;
        const overflow = root.scrollWidth - root.clientWidth;
        const outside = Array.from(document.querySelectorAll('main *'))
          .map((el) => ({ el, rect: el.getBoundingClientRect() }))
          .filter(({ rect }) => rect.width > 0 && rect.height > 0)
          .filter(({ rect }) => rect.left < 15.5 || rect.right > window.innerWidth - 15.5)
          .map(({ el }) => `${el.tagName.toLowerCase()}.${el.className}`);
        return { overflow, outside };
      });

      expect(layout.overflow, 'défilement horizontal').toBeLessThanOrEqual(0);
      expect(layout.outside, 'éléments hors marge de 16 px').toEqual([]);
    });

    test(`critère 2 : ${hash} boutons, liens, champs et lignes de Membre d'au moins 44 px`, async ({ page }) => {
      await page.goto(`/${hash}`);
      await expect(page.locator('h1')).toBeVisible();

      const small = await page.evaluate(() => {
        const selector = 'main button, main a[href], main input, main .member-list li';
        return Array.from(document.querySelectorAll(selector))
          .filter((el) => (el as HTMLElement).offsetParent !== null || el.getBoundingClientRect().width > 0)
          .map((el) => ({ el, rect: el.getBoundingClientRect() }))
          .filter(({ rect }) => rect.width > 0 && rect.height > 0)
          .filter(({ rect }) => rect.height < 44 || rect.width < 44)
          .map(({ el, rect }) => `${el.tagName.toLowerCase()} "${(el.textContent ?? '').trim()}" ${Math.round(rect.width)}x${Math.round(rect.height)}`);
      });

      expect(small, 'cibles trop petites').toEqual([]);
    });
  }

  test('critère 3 : mouvement réduit, durée des transitions à 0 ms', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/#/equipe');
    await expect(page.locator('h1')).toBeVisible();

    const durations = await page.evaluate(() =>
      Array.from(document.querySelectorAll('button')).map((b) => getComputedStyle(b).transitionDuration),
    );
    expect(durations.length).toBeGreaterThan(0);
    for (const duration of durations) {
      expect(duration).toBe('0s');
    }
  });
});
