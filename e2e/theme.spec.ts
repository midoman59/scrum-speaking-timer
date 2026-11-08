import { test, expect } from './fixtures';

// S-E1-06 critère 1 : le thème sombre suit prefers-color-scheme, et data-theme prime sur le système.
const BG = '--color-bg';

async function background(page: import('@playwright/test').Page): Promise<string> {
  return page.evaluate((token) => getComputedStyle(document.documentElement).getPropertyValue(token).trim(), BG);
}

test.describe('Thème clair et sombre (S-E1-06)', () => {
  test('système en sombre, sans data-theme : jetons sombres', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/#/equipe');
    await expect(page.locator('h1')).toBeVisible();
    expect(await background(page)).toBe('#111827');
  });

  test('système en clair, sans data-theme : jetons clairs', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/#/equipe');
    await expect(page.locator('h1')).toBeVisible();
    expect(await background(page)).toBe('#FFFFFF');
  });

  test('data-theme="light" force le clair même si le système est en sombre', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/#/equipe');
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
    expect(await background(page)).toBe('#FFFFFF');
  });

  test('data-theme="dark" force le sombre même si le système est en clair', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/#/equipe');
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
    expect(await background(page)).toBe('#111827');
  });
});
