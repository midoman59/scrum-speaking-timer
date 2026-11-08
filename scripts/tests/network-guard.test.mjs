// S-E1-05 (critères 2 et 3) : logique de la garde réseau utilisée par e2e/fixtures.ts.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { externalRequests, describeExternal } from '../../e2e/network-guard.mjs';

const APP = 'http://localhost:4200';

test('critère 3 : aucune requête hors origine n\'est retenue', () => {
  const urls = [
    'http://localhost:4200/',
    'http://localhost:4200/main.js',
    'http://localhost:4200/styles.css',
    'data:image/png;base64,AAAA',
    'blob:http://localhost:4200/abc',
  ];
  assert.deepEqual(externalRequests(APP, urls), []);
});

test('critère 2 : une requête vers une autre origine est retenue et nommée', () => {
  const urls = ['http://localhost:4200/main.js', 'https://fonts.googleapis.com/css2?family=Inter'];
  assert.deepEqual(externalRequests(APP, urls), ['https://fonts.googleapis.com/css2?family=Inter']);
  assert.match(describeExternal(['https://fonts.googleapis.com/css2?family=Inter']), /https:\/\/fonts\.googleapis\.com\/css2\?family=Inter/);
});
