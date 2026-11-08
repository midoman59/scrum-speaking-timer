// S-E1-02 (critère 3) et S-E1-04 (critère 1) : contrôle statique de src/index.html.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const html = readFileSync(join(root, 'src', 'index.html'), 'utf8');

test('S-E1-02 critère 3 : lang fr, viewport, theme-color, titre', () => {
  assert.match(html, /<html[^>]*\blang="fr"/);
  assert.match(html, /<meta name="viewport" content="width=device-width, initial-scale=1">/);
  assert.match(html, /<meta name="theme-color" content="#4338CA"/);
  assert.match(html, /<title>Scrum Speaking Timer<\/title>/);
});
