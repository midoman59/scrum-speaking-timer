import { test, expect } from './fixtures';

// S-E1-05 : parcours sur la page provisoire sans requête sortante (NFR-8, SM-8).
test.describe('Confidentialité réseau', () => {
  test('critère 3 : la page d\'accueil s\'affiche sans requête hors origine', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toHaveText('Créer votre équipe');
  });

  for (const hash of ['#/equipe', '#/preparation', '#/session', '#/bilan']) {
    test(`le parcours ${hash} ne quitte pas l'application`, async ({ page }) => {
      await page.goto(`/${hash}`);
      await expect(page.locator('h1')).toBeVisible();
    });
  }
});
