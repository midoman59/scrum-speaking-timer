#!/usr/bin/env node
// S-E1-04 : vérifie qu'aucune URL absolue vers un autre domaine n'apparaît dans le build (NFR-8).
// Usage : node scripts/check-privacy.mjs [dossier]   (défaut : dist/scrum-speaking-timer/browser)
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, extname, relative, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const target = resolve(process.argv[2] ?? join(root, 'dist', 'scrum-speaking-timer', 'browser'));

const SCANNED = new Set(['.html', '.js', '.mjs', '.css', '.json', '.webmanifest', '.svg', '.txt']);
// Ces URLs ne sont jamais demandées par l'application : identifiants de namespace et de schéma,
// liens de licence dans les commentaires du service worker, liens de documentation dans les messages
// d'avertissement d'Angular. La vraie garde est la garde réseau E2E (e2e/network-guard.mjs).
const ALLOWED_PREFIXES = [
  'http://www.w3.org/',
  'https://www.w3.org/',
  'http://json-schema.org/',
  'https://json-schema.org/',
  'https://angular.dev/license',
  'https://angular.dev/best-practices/',
  'https://angular.dev/errors',
  'https://github.com/angular/angular/',
];
const URL_PATTERN = /https?:\/\/[^\s"'`<>)]+/g;

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

function findExternalUrls(file) {
  const content = readFileSync(file, 'utf8');
  const found = [];
  for (const match of content.matchAll(URL_PATTERN)) {
    const url = match[0];
    if (!ALLOWED_PREFIXES.some((prefix) => url.startsWith(prefix))) found.push(url);
  }
  return found;
}

let statusCode;
try {
  const files = walk(target).filter((file) => SCANNED.has(extname(file)));
  const offenders = files.flatMap((file) =>
    findExternalUrls(file).map((url) => ({ file: relative(target, file), url })),
  );
  if (offenders.length > 0) {
    console.error(`check-privacy : ${offenders.length} URL externe(s) trouvée(s) :`);
    for (const { file, url } of offenders) console.error(`  ${file} -> ${url}`);
    statusCode = 1;
  } else {
    console.log(`check-privacy : ${files.length} fichier(s) analysé(s), aucune URL externe.`);
    statusCode = 0;
  }
} catch (error) {
  console.error(`check-privacy : impossible de lire ${target} (${error.message}). Lancez d'abord le build.`);
  statusCode = 2;
}
process.exit(statusCode);
