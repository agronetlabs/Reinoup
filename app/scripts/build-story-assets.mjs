import { mkdir, writeFile } from 'node:fs/promises';
import { getDaviGoliasScenes } from './story-art/davi-golias.mjs';
import { getArcaDeNoeScenes } from './story-art/arca-de-noe.mjs';
import { getJoseSeusIrmaosScenes } from './story-art/jose-e-seus-irmaos.mjs';
import { getMoisesMarVermelhoScenes } from './story-art/moises-mar-vermelho.mjs';
import { getJonasGrandePeixeScenes } from './story-art/jonas-grande-peixe.mjs';
import { getDanielCovaDosLeoesScenes } from './story-art/daniel-cova-dos-leoes.mjs';

const out = new URL('../public/story-art/genesis/gn-01/', import.meta.url);
await mkdir(out, { recursive: true });

const defs = `
  <defs>
    <linearGradient id="creamLight" x1="0" y1="0" x2="0" y2="1">
      <stop stop-color="#FFFBF0"/><stop offset="1" stop-color="#F3E9D7"/>
    </linearGradient>
    <linearGradient id="daySky" x1="0" y1="0" x2="0" y2="1">
      <stop stop-color="#63AFE2"/><stop offset=".65" stop-color="#CDEEFF"/><stop offset="1" stop-color="#FFF1C7"/>
    </linearGradient>
    <linearGradient id="nightSky" x1="0" y1="0" x2="0" y2="1">
      <stop stop-color="#07152F"/><stop offset=".65" stop-color="#14213D"/><stop offset="1" stop-color="#1D4689"/>
    </linearGradient>
    <linearGradient id="sunsetSky" x1="0" y1="0" x2="0" y2="1">
      <stop stop-color="#1D4689"/><stop offset=".46" stop-color="#FF7A29"/><stop offset="1" stop-color="#FFC93C"/>
    </linearGradient>
    <linearGradient id="water" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#2C78BD"/><stop offset=".55" stop-color="#68BDE7"/><stop offset="1" stop-color="#BDEBFA"/>
    </linearGradient>
    <linearGradient id="garden" x1="0" y1="0" x2="0" y2="1">
      <stop stop-color="#79B95B"/><stop offset="1" stop-color="#2F7B45"/>
    </linearGradient>
    <radialGradient id="divineLight">
      <stop stop-color="#FFF8C5" stop-opacity=".95"/><stop offset=".45" stop-color="#FFC93C" stop-opacity=".38"/><stop offset="1" stop-color="#FFC93C" stop-opacity="0"/>
    </radialGradient>
    <filter id="softShadow" x="-30%" y="-30%" width="160%" height="180%">
      <feDropShadow dx="0" dy="12" stdDeviation="14" flood-color="#14213D" flood-opacity=".25"/>
    </filter>
    <filter id="glow" x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur stdDeviation="10" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>`;

const stars = Array.from({ length: 42 }, (_, i) => {
  const x = (i * 83 + 47) % 1200;
  const y = (i * 47 + 35) % 420;
  const r = 2 + (i % 4);
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="#FFF8C5" opacity="${0.42 + (i % 5) * 0.11}"/>`;
}).join('');

const trees = `
  <g filter="url(#softShadow)">
    <path d="M174 650c15-116 49-196 84-254 40 69 70 145 82 254z" fill="#397F45"/>
    <path d="M233 650c8-157 41-271 85-347 52 88 74 202 75 347z" fill="#4E9A4D"/>
    <path d="M920 652c9-147 39-244 77-311 52 89 74 193 75 311z" fill="#3C8744"/>
    <path d="M995 652c8-122 39-210 76-272 43 76 66 163 70 272z" fill="#58A753"/>
    <path d="M308 648v-229h24v229M988 651v-223h24v223" stroke="#7B4A2B" stroke-width="22" stroke-linecap="round"/>
  </g>`;

const flowers = Array.from({ length: 24 }, (_, i) => {
  const x = 40 + ((i * 89) % 1120);
  const y = 660 + ((i * 31) % 85);
  const color = ['#FFC93C', '#FF7A29', '#FFFBF0'][i % 3];
  return `<g transform="translate(${x} ${y})"><path d="M0 12v22" stroke="#2F7B45" stroke-width="4"/><circle cx="-7" cy="7" r="7" fill="${color}"/><circle cx="7" cy="7" r="7" fill="${color}"/><circle cy="0" r="7" fill="${color}"/><circle cy="13" r="7" fill="${color}"/><circle cy="7" r="5" fill="#EBA317"/></g>`;
}).join('');

const birds = `
  <g fill="none" stroke="#14213D" stroke-width="8" stroke-linecap="round">
    <path d="M180 215q24-27 48 0 24-27 48 0"/><path d="M340 148q18-20 36 0 18-20 36 0"/>
    <path d="M830 187q22-24 44 0 22-24 44 0"/><path d="M981 125q16-18 32 0 16-18 32 0"/>
  </g>`;

const fish = `
  <g filter="url(#softShadow)">
    <g transform="translate(185 590)"><ellipse cx="0" cy="0" rx="54" ry="28" fill="#FF7A29"/><path d="m-47 0-42-31v62z" fill="#FFC93C"/><circle cx="28" cy="-6" r="5" fill="#14213D"/></g>
    <g transform="translate(570 665) scale(.75)"><ellipse cx="0" cy="0" rx="54" ry="28" fill="#FFC93C"/><path d="m-47 0-42-31v62z" fill="#FF7A29"/><circle cx="28" cy="-6" r="5" fill="#14213D"/></g>
    <g transform="translate(925 565) scale(.9)"><ellipse cx="0" cy="0" rx="54" ry="28" fill="#1D4689"/><path d="m-47 0-42-31v62z" fill="#63AFE2"/><circle cx="28" cy="-6" r="5" fill="#FFFBF0"/></g>
  </g>`;

const lion = `
  <g transform="translate(360 570)" filter="url(#softShadow)">
    <ellipse cx="0" cy="78" rx="88" ry="53" fill="#EBA317"/><circle cx="-3" cy="12" r="69" fill="#B96D25"/>
    <circle cx="-3" cy="15" r="48" fill="#E9A347"/><circle cx="-20" cy="5" r="5" fill="#14213D"/><circle cx="17" cy="5" r="5" fill="#14213D"/>
    <path d="M-18 30q15 18 30 0" fill="none" stroke="#7B4A2B" stroke-width="5" stroke-linecap="round"/>
    <path d="M-58 108v73M46 108v73" stroke="#EBA317" stroke-width="25" stroke-linecap="round"/>
  </g>`;

const elephant = `
  <g transform="translate(720 550)" filter="url(#softShadow)">
    <ellipse cx="0" cy="95" rx="115" ry="74" fill="#8296A8"/><circle cx="-75" cy="49" r="66" fill="#93A9B8"/>
    <ellipse cx="-110" cy="47" rx="41" ry="52" fill="#73899C"/><path d="M-112 65q-22 75 15 103" fill="none" stroke="#93A9B8" stroke-width="28" stroke-linecap="round"/>
    <circle cx="-91" cy="38" r="6" fill="#14213D"/><path d="M-63 128v87M56 130v85" stroke="#8296A8" stroke-width="34" stroke-linecap="round"/>
  </g>`;

const giraffe = `
  <g transform="translate(1030 430)" filter="url(#softShadow)">
    <path d="M0 69v246" stroke="#D99A3D" stroke-width="52" stroke-linecap="round"/><ellipse cx="0" cy="41" rx="45" ry="34" fill="#EFB354"/>
    <circle cx="-13" cy="35" r="5" fill="#14213D"/><path d="M-22 8-34-23M20 8 32-23" stroke="#7B4A2B" stroke-width="9" stroke-linecap="round"/>
    <ellipse cx="-11" cy="127" rx="10" ry="19" fill="#9B5F28"/><ellipse cx="14" cy="187" rx="11" ry="21" fill="#9B5F28"/>
    <path d="M-23 301v91M23 301v91" stroke="#D99A3D" stroke-width="22" stroke-linecap="round"/>
  </g>`;

const people = `
  <g filter="url(#softShadow)">
    <g transform="translate(505 430)"><circle cx="0" cy="0" r="43" fill="#A96135"/><path d="M-50 188Q0 60 50 188v155H-50z" fill="#C87843"/><path d="M-31 32q31 24 62 0" fill="none" stroke="#59321F" stroke-width="12" stroke-linecap="round"/></g>
    <g transform="translate(680 440)"><circle cx="0" cy="0" r="41" fill="#B86E40"/><path d="M-48 185Q0 64 48 185v148H-48z" fill="#D78A50"/><path d="M-38 1q38-48 76 0v48Q0 77-38 49z" fill="#59321F"/></g>
  </g>`;

function svg(body, label) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800" role="img" aria-label="${label}">
${defs}
${body}
</svg>
`;
}

const scenes = {
  'cover.svg': svg(`
    <rect width="1200" height="800" fill="url(#daySky)"/><circle cx="872" cy="168" r="176" fill="url(#divineLight)"/><circle cx="872" cy="168" r="62" fill="#FFC93C" opacity=".88"/>
    <path d="M0 474Q180 336 360 472T720 455T1200 430V800H0z" fill="#7DBB5E"/>
    <path d="M0 563Q238 470 462 575T861 543T1200 521V800H0z" fill="url(#garden)"/>
    <path d="M517 800q-63-147 23-314 72-140 157-212-22 174-111 314-55 87-69 212z" fill="url(#water)" opacity=".9"/>
    ${trees}${flowers}${birds}
    <g transform="translate(590 260)" filter="url(#softShadow)"><path d="M0 315V104" stroke="#7B4A2B" stroke-width="34" stroke-linecap="round"/><circle cx="0" cy="70" r="116" fill="#397F45"/><circle cx="-75" cy="115" r="74" fill="#4F9E4E"/><circle cx="80" cy="116" r="77" fill="#4F9E4E"/><g fill="#FF7A29"><circle cx="-60" cy="70" r="13"/><circle cx="45" cy="37" r="13"/><circle cx="75" cy="117" r="13"/><circle cx="-4" cy="145" r="13"/></g></g>
    <g transform="translate(120 622) scale(.55)">${lion}</g><g transform="translate(750 625) scale(.48)">${elephant}</g>
  `, 'Jardim da criação cheio de vida'),
  '01-no-comeco.svg': svg(`
    <rect width="1200" height="800" fill="url(#nightSky)"/>${stars}
    <ellipse cx="600" cy="310" rx="350" ry="320" fill="url(#divineLight)" opacity=".72"/>
    <path d="M505 0h190l168 800H337z" fill="#FFF8C5" opacity=".12"/>
    <path d="M0 665Q240 598 460 675T850 653T1200 637V800H0z" fill="#0B1830"/>
    <path d="M0 716Q254 654 478 730T854 710T1200 690V800H0z" fill="#14213D"/>
    <circle cx="600" cy="310" r="28" fill="#FFF8C5" filter="url(#glow)"/>
  `, 'A primeira luz surgindo na escuridão'),
  '02-haja-luz.svg': svg(`
    <rect width="1200" height="800" fill="url(#daySky)"/><ellipse cx="260" cy="160" rx="230" ry="225" fill="url(#divineLight)"/><circle cx="260" cy="160" r="72" fill="#FFC93C"/>
    <path d="M0 493Q185 395 388 500T744 481T1200 455V800H0z" fill="#E2C98A"/>
    <path d="M0 566Q208 505 388 586T750 566T1200 540V800H0z" fill="url(#water)"/>
    <path d="M350 800Q412 628 555 525 680 436 840 418 786 565 669 667 585 740 542 800z" fill="url(#garden)"/>
    <g transform="translate(727 340)" filter="url(#softShadow)"><path d="M0 300V98" stroke="#7B4A2B" stroke-width="25"/><circle cy="73" r="80" fill="#4E9A4D"/><circle cx="-54" cy="110" r="52" fill="#5CAD55"/><circle cx="56" cy="112" r="50" fill="#397F45"/></g>
    ${flowers}
  `, 'Luz sobre o mar e as primeiras plantas'),
  '03-luzes-peixes-aves.svg': svg(`
    <rect width="1200" height="800" fill="url(#sunsetSky)"/>${stars}
    <circle cx="226" cy="210" r="74" fill="#FFC93C" filter="url(#glow)"/><path d="M905 80a82 82 0 1 0 72 121 92 92 0 1 1-72-121z" fill="#FFFBF0" opacity=".92"/>
    <path d="M0 475Q240 419 441 488T805 470T1200 452V800H0z" fill="url(#water)"/>
    <path d="M0 593q180-61 360 0t360 0t360 0t360 0" fill="none" stroke="#FFFBF0" stroke-width="9" opacity=".42"/>
    ${birds}${fish}
  `, 'Sol, lua, estrelas, peixes e aves'),
  '04-animais.svg': svg(`
    <rect width="1200" height="800" fill="url(#daySky)"/><circle cx="980" cy="148" r="125" fill="url(#divineLight)"/><circle cx="980" cy="148" r="54" fill="#FFC93C"/>
    <path d="M0 465Q196 353 394 468T756 447T1200 415V800H0z" fill="#8BC66A"/>
    <path d="M0 568Q232 484 442 584T806 558T1200 532V800H0z" fill="url(#garden)"/>
    ${lion}${elephant}${giraffe}${flowers}
    <g transform="translate(85 630)" filter="url(#softShadow)"><ellipse cx="0" cy="45" rx="60" ry="42" fill="#FFFBF0"/><circle cx="-47" cy="24" r="31" fill="#F3E9D7"/><circle cx="-58" cy="20" r="4" fill="#14213D"/><path d="M-30 72v60M27 73v60" stroke="#F3E9D7" stroke-width="17" stroke-linecap="round"/></g>
  `, 'Animais reunidos em um campo'),
  '05-deus-criou-voce.svg': svg(`
    <rect width="1200" height="800" fill="url(#daySky)"/><ellipse cx="600" cy="115" rx="250" ry="230" fill="url(#divineLight)"/><circle cx="600" cy="115" r="58" fill="#FFC93C"/>
    <path d="M0 470Q190 348 386 468T756 446T1200 414V800H0z" fill="#86C165"/>
    <path d="M0 574Q225 467 432 582T806 551T1200 523V800H0z" fill="url(#garden)"/>
    <path d="M470 800q16-148 124-267 90-99 183-146-33 158-133 276-72 84-92 137z" fill="url(#water)" opacity=".9"/>
    ${trees}${people}${flowers}${birds}
  `, 'Adão e Eva contemplando o jardim'),
};

for (const [name, content] of Object.entries(scenes)) {
  await writeFile(new URL(name, out), content, 'utf8');
  console.log(`  story-art/genesis/gn-01/${name}`);
}

// ============================================================
// 2. Histórias Bônus
// ============================================================
const stories = [
  { folder: 'davi-golias', getScenes: getDaviGoliasScenes },
  { folder: 'arca-de-noe', getScenes: getArcaDeNoeScenes },
  { folder: 'jose-e-seus-irmaos', getScenes: getJoseSeusIrmaosScenes },
  { folder: 'moises-mar-vermelho', getScenes: getMoisesMarVermelhoScenes },
  { folder: 'jonas-grande-peixe', getScenes: getJonasGrandePeixeScenes },
  { folder: 'daniel-cova-dos-leoes', getScenes: getDanielCovaDosLeoesScenes },
];

for (const { folder, getScenes } of stories) {
  const targetDir = new URL(`../public/story-art/bonus/${folder}/`, import.meta.url);
  await mkdir(targetDir, { recursive: true });
  const bonusScenes = getScenes();
  for (const [name, content] of Object.entries(bonusScenes)) {
    await writeFile(new URL(name, targetDir), content, 'utf8');
    console.log(`  story-art/bonus/${folder}/${name}`);
  }
}

console.log('✓ Todas as 42 ilustrações de histórias geradas com sucesso!');
