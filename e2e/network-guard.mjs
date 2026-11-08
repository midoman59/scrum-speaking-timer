// Garde réseau des tests E2E (NFR-8). Logique pure, testée sous scripts/tests.

/** Schémas qui ne quittent pas le navigateur. */
const LOCAL_SCHEMES = new Set(['data:', 'blob:']);

/**
 * Renvoie les URLs de requêtes qui ne sont pas de l'origine de l'application.
 * @param {string} appOrigin ex. « http://localhost:4200 »
 * @param {string[]} urls URLs réellement demandées
 * @returns {string[]}
 */
export function externalRequests(appOrigin, urls) {
  const expected = new URL(appOrigin).origin;
  return urls.filter((raw) => {
    const url = new URL(raw);
    if (LOCAL_SCHEMES.has(url.protocol)) return false;
    return url.origin !== expected;
  });
}

/** Message d'échec qui nomme chaque URL fautive. */
export function describeExternal(urls) {
  return `Requêtes hors de l'application (NFR-8) :\n${urls.map((u) => `  - ${u}`).join('\n')}`;
}
