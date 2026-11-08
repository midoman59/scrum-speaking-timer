// S-E1-02 (critère 3) et S-E1-04 (critère 1) : contrôle statique de src/index.html.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
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

// I-4 : les icônes SVG référencées doivent être versionnées, sinon un clone propre n'a pas de favicon.
test('I-4 : favicon.svg et icons/logo.svg sont suivis par git', { skip: !existsSync(join(root, '.git')) && 'pas de dépôt git' }, () => {
  const tracked = execFileSync('git', ['ls-files', 'public'], { cwd: root, encoding: 'utf8' })
    .split('\n')
    .map((line) => line.trim());
  assert.ok(tracked.includes('public/favicon.svg'), 'public/favicon.svg doit être versionné');
  assert.ok(tracked.includes('public/icons/logo.svg'), 'public/icons/logo.svg doit être versionné');
});
