import { readFileSync } from 'node:fs';

const { packageManager, engines } = JSON.parse(
  readFileSync(new URL('../package.json', import.meta.url), 'utf8'),
);
const expected = packageManager.replace(/^bun@/, '');
const actual = process.versions.bun;

if (packageManager !== `bun@${engines.bun}` || actual !== expected) {
  console.error(
    `ReinoUp exige Bun ${expected}; runtime atual: ${actual ?? 'não é Bun'}. ` +
    `Use essa versão localmente e BUN_VERSION=${expected} no Cloudflare Pages ` +
    '(Production e Preview). packageManager e engines.bun devem coincidir.',
  );
  process.exit(1);
}

console.log(`Bun ${actual}: versão do projeto confirmada.`);
