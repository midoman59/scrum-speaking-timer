import { test as base, expect } from '@playwright/test';
import { externalRequests, describeExternal } from './network-guard.mjs';

/**
 * Garde réseau automatique (S-E1-05) : chaque test échoue si l'application
 * émet une requête vers une autre origine. Le message nomme les URLs fautives.
 */
export const test = base.extend<{ networkGuard: void }>({
  networkGuard: [
    async ({ page, baseURL }, use) => {
      const origin = new URL(baseURL ?? 'http://localhost:4200').origin;
      const requested: string[] = [];
      page.on('request', (request) => requested.push(request.url()));
      await use();
      const external = externalRequests(origin, requested);
      if (external.length > 0) {
        throw new Error(describeExternal(external));
      }
    },
    { auto: true },
  ],
});

export { expect };
