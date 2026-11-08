// S-E1-04 (critère 1) : CSP de l'ADR-12 dans src/index.html.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const html = readFileSync(join(root, 'src', 'index.html'), 'utf8');

test('S-E1-04 critère 1 : CSP de l\'ADR-12 présente dans une balise meta', () => {
  const expected =
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; " +
    "font-src 'self'; connect-src 'self'; media-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'";
  assert.match(html, /<meta http-equiv="Content-Security-Policy" content="([^"]*)"/);
  const content = html.match(/<meta http-equiv="Content-Security-Policy" content="([^"]*)"/)[1];
  assert.equal(content, expected);
});
