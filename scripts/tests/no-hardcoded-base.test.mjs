// S-E1-03 (critère 4) : le préfixe de déploiement ne doit jamais être écrit en dur dans src/.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

test('aucune occurrence du préfixe /scrum-speaking-timer dans src/', () => {
  const offenders = walk(join(root, 'src'))
    .filter((file) => /\.(ts|html|css|json|webmanifest)$/.test(file))
    .filter((file) => readFileSync(file, 'utf8').includes('/scrum-speaking-timer'));
  assert.deepEqual(offenders, []);
});
