// S-E1-04 (critères 2 et 3) : scripts/check-privacy.mjs sur un dist de test.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const scriptPath = join(dirname(fileURLToPath(import.meta.url)), '..', 'check-privacy.mjs');

function makeDist(files) {
  const dir = mkdtempSync(join(tmpdir(), 'privacy-dist-'));
  for (const [name, content] of Object.entries(files)) {
    mkdirSync(dirname(join(dir, name)), { recursive: true });
    writeFileSync(join(dir, name), content);
  }
  return dir;
}

function run(dir) {
  return spawnSync(process.execPath, [scriptPath, dir], { encoding: 'utf8' });
}

test('critère 2 : un dist avec une URL vers un autre domaine échoue (code 1) et nomme fichier et URL', () => {
  const dir = makeDist({
    'index.html': '<script src="https://cdn.example.com/lib.js"></script>',
    'main.js': 'const ok = "./assets";',
  });
  try {
    const result = run(dir);
    assert.equal(result.status, 1);
    assert.match(result.stdout + result.stderr, /index\.html/);
    assert.match(result.stdout + result.stderr, /https:\/\/cdn\.example\.com\/lib\.js/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('critère 3 : un dist sans URL externe réussit (code 0)', () => {
  const dir = makeDist({
    'index.html': '<link rel="stylesheet" href="styles.css"><script src="main.js"></script>',
    'main.js': 'const ns = "http://www.w3.org/2000/svg";',
    'styles.css': 'body { font-family: system-ui; }',
  });
  try {
    const result = run(dir);
    assert.equal(result.status, 0, result.stdout + result.stderr);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

// I-3 : les URL sans schéma et les WebSocket sont aussi des appels réseau hors origine (NFR-8).
test('I-3 : une URL sans schéma (//hôte) dans index.html échoue (code 1)', () => {
  const dir = makeDist({
    'index.html': '<script src="//cdn.example.com/lib.js"></script>',
  });
  try {
    const result = run(dir);
    assert.equal(result.status, 1, result.stdout + result.stderr);
    assert.match(result.stdout + result.stderr, /\/\/cdn\.example\.com\/lib\.js/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('I-3 : une URL WebSocket dans le code échoue (code 1)', () => {
  const dir = makeDist({
    'main.js': 'const socket = new WebSocket("wss://relay.example.com/ws");',
  });
  try {
    const result = run(dir);
    assert.equal(result.status, 1, result.stdout + result.stderr);
    assert.match(result.stdout + result.stderr, /wss:\/\/relay\.example\.com\/ws/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('I-3 : les commentaires et chemins relatifs ne sont pas des URL externes (code 0)', () => {
  const dir = makeDist({
    'main.js': '// commentaire court\nconst a = "/assets/x.png";\n//# sourceMappingURL=main.js.map\n',
    'index.html': '<a href="#/equipe">x</a><img src="./icons/a.png">',
  });
  try {
    const result = run(dir);
    assert.equal(result.status, 0, result.stdout + result.stderr);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
