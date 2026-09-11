import { clouds, oliveTree, sheep, stars, svg } from './shared.mjs';

const person = (x, y, scale = 1, robe = '#C87843', pose = 'open') => `
  <g transform="translate(${x} ${y}) scale(${scale})" filter="url(#softShadow)">
    <circle cx="0" cy="-62" r="32" fill="#B86E40"/>
    <path d="M-36 -66q36-42 72 0v28q-36 28-72 0z" fill="#59321F"/>
    <circle cx="-11" cy="-62" r="4" fill="#14213D"/><circle cx="11" cy="-62" r="4" fill="#14213D"/>
    <path d="M-8-46q8 8 16 0" fill="none" stroke="#7B4A2B" stroke-width="4" stroke-linecap="round"/>
    <path d="M-52 180Q-38 18 0 8q38 10 52 172z" fill="${robe}"/>
    <path d="M-34 174v76M34 174v76" stroke="#B86E40" stroke-width="18" stroke-linecap="round"/>
    ${pose === 'open'
      ? '<path d="M-34 55Q-95 5-112-42M34 55Q95 5 112-42" fill="none" stroke="#B86E40" stroke-width="17" stroke-linecap="round"/>'
      : '<path d="M-34 55Q-18 72-5 92M34 55Q18 72 5 92" fill="none" stroke="#B86E40" stroke-width="17" stroke-linecap="round"/>'}
  </g>`;

const adaoEva = (x, y, scale = 1, hidden = false) => `
  <g transform="translate(${x} ${y}) scale(${scale})" filter="url(#softShadow)">
    <circle cx="-58" cy="-54" r="30" fill="#A96135"/>
    <circle cx="58" cy="-54" r="30" fill="#B86E40"/>
    <path d="M-34-60q34-46 68 0v27q-34 28-68 0z" fill="#59321F"/>
    <path d="M24-59q34-42 68 0v30q-34 28-68 0z" fill="#7B4A2B"/>
    <circle cx="-68" cy="-54" r="4" fill="#14213D"/><circle cx="-48" cy="-54" r="4" fill="#14213D"/>
    <circle cx="48" cy="-54" r="4" fill="#14213D"/><circle cx="68" cy="-54" r="4" fill="#14213D"/>
    <path d="M-92 167Q-75 18-58 10Q-35 28-6 167z" fill="#4F9E4E"/>
    <path d="M6 167Q35 28 58 10q17 8 34 157z" fill="#5CAD55"/>
    <path d="M-75 158v74M-42 158v74M42 158v74M75 158v74" stroke="#A96135" stroke-width="15" stroke-linecap="round"/>
    ${hidden ? '<path d="M-105 52Q-42 5 0 62T105 52" fill="none" stroke="#397F45" stroke-width="28" stroke-linecap="round" opacity=".9"/>' : ''}
  </g>`;

const tree = (x, y, scale = 1, fruit = false) => `
  <g transform="translate(${x} ${y}) scale(${scale})" filter="url(#softShadow)">
    <path d="M0 220V40" stroke="#7B4A2B" stroke-width="30" stroke-linecap="round"/>
    <circle cx="0" cy="12" r="96" fill="#397F45"/>
    <circle cx="-68" cy="66" r="68" fill="#4E9A4D"/><circle cx="74" cy="62" r="72" fill="#5CAD55"/>
    ${fruit ? '<g fill="#FF7A29"><circle cx="-42" cy="8" r="12"/><circle cx="42" cy="38" r="12"/><circle cx="-5" cy="83" r="12"/></g>' : ''}
  </g>`;

const serpent = (x, y, scale = 1) => `
  <g transform="translate(${x} ${y}) scale(${scale})" filter="url(#softShadow)">
    <path d="M-190 120q80-130 160 0t160 0q62-92 132-15" fill="none" stroke="#397F45" stroke-width="34" stroke-linecap="round"/>
    <circle cx="260" cy="105" r="35" fill="#4E9A4D"/>
    <circle cx="270" cy="96" r="5" fill="#FFC93C"/><circle cx="288" cy="96" r="5" fill="#FFC93C"/>
    <path d="M294 116q34 12 47 0" fill="none" stroke="#FF7A29" stroke-width="5" stroke-linecap="round"/>
  </g>`;

const grain = (x, y, scale = 1) => `
  <g transform="translate(${x} ${y}) scale(${scale})" fill="none" stroke="#EBA317" stroke-linecap="round">
    <path d="M0 130V0M0 64Q-42 48-50 12M0 85Q42 69 50 33M0 42Q-32 26-35-7M0 105Q32 89 35 53" stroke-width="12"/>
  </g>`;

const altar = (x, y, scale = 1) => `
  <g transform="translate(${x} ${y}) scale(${scale})" filter="url(#softShadow)">
    <path d="M-115 0h230l-28 82H-87z" fill="#9AA0A6"/>
    <path d="M-92 82h184l-28 76H-64z" fill="#707983"/>
    <path d="M0-30q-32 40 0 72q32-32 0-72" fill="#FFC93C" filter="url(#glow)"/>
  </g>`;

const footprints = (x, y, scale = 1, flip = false) => {
  const direction = flip ? -1 : 1;
  return `<g transform="translate(${x} ${y}) scale(${direction * scale} ${scale})" fill="#F3E9D7" opacity=".92">
    <ellipse cx="0" cy="0" rx="13" ry="27" transform="rotate(-18)"/><ellipse cx="42" cy="48" rx="13" ry="27" transform="rotate(-18)"/>
    <ellipse cx="84" cy="96" rx="13" ry="27" transform="rotate(-18)"/><ellipse cx="126" cy="144" rx="13" ry="27" transform="rotate(-18)"/>
  </g>`;
};

const ark = (x, y, scale = 1) => `
  <g transform="translate(${x} ${y}) scale(${scale})" filter="url(#softShadow)">
    <path d="M-290 50Q-250 160 0 176Q250 160 290 50L225 0H-225z" fill="url(#woodArk)"/>
    <path d="M-205 22h410v104h-410z" fill="#8B572A"/>
    <path d="M-168 36v86M-84 36v86M0 36v86M84 36v86M168 36v86" stroke="#4A260B" stroke-width="12"/>
    <path d="M-228 12Q0-66 228 12" fill="none" stroke="#B87A3A" stroke-width="24" stroke-linecap="round"/>
    <rect x="-42" y="54" width="84" height="72" rx="10" fill="#4A260B"/>
    <path d="M-270 60h540" stroke="#D99A3D" stroke-width="8" opacity=".75"/>
  </g>`;

const rain = (count = 26) => Array.from({ length: count }, (_, i) => {
  const x = 30 + ((i * 97) % 1140);
  const y = 150 + ((i * 43) % 460);
  return `<path d="M${x} ${y}l-16 38" stroke="#BDEBFA" stroke-width="7" stroke-linecap="round" opacity=".72"/>`;
}).join('');

const tower = (x, y, scale = 1) => `
  <g transform="translate(${x} ${y}) scale(${scale})" filter="url(#softShadow)">
    <path d="M-150 260L-112-120h224l38 380z" fill="#C27C3A"/>
    <path d="M-112-120l112-90 112 90z" fill="#EBA317"/>
    <path d="M-112-30h224M-122 65h244M-134 160h268" stroke="#8A542C" stroke-width="15"/>
    <path d="M-45 260v-122q45-42 90 0v122" fill="#59321F"/>
    <path d="M-112-120h224" stroke="#FFF1C7" stroke-width="12" opacity=".8"/>
  </g>`;

const bricks = (x, y, scale = 1) => `
  <g transform="translate(${x} ${y}) scale(${scale})" fill="#C27C3A" stroke="#8A542C" stroke-width="6">
    <rect x="-100" y="0" width="78" height="45" rx="5"/><rect x="-12" y="0" width="78" height="45" rx="5"/>
    <rect x="32" y="54" width="78" height="45" rx="5"/><rect x="-56" y="54" width="78" height="45" rx="5"/>
    <rect x="-145" y="108" width="78" height="45" rx="5"/><rect x="-57" y="108" width="78" height="45" rx="5"/>
  </g>`;

const scenes = {
  'gn-02': {
    'cover.svg': svg(`
      <rect width="1200" height="800" fill="url(#daySky)"/><circle cx="890" cy="150" r="180" fill="url(#divineLight)"/>
      ${clouds()}<path d="M0 500Q260 400 520 500T1200 460V800H0z" fill="#7DBB5E"/>
      <path d="M0 610Q260 500 520 620T1200 570V800H0z" fill="url(#garden)"/>
      ${tree(600, 265, 1.4, true)}${tree(180, 470, .75)}${tree(1010, 470, .8)}
      ${adaoEva(485, 500, .85)}${serpent(740, 610, .62)}
    `, 'Adão e Eva no jardim diante da escolha'),
    '01-jardim-cuidado.svg': svg(`
      <rect width="1200" height="800" fill="url(#daySky)"/><circle cx="170" cy="140" r="140" fill="url(#sunGlow)"/>
      ${clouds()}<path d="M0 475Q220 370 420 490T800 470T1200 435V800H0z" fill="#8BC66A"/>
      <path d="M0 590Q230 500 450 605T820 575T1200 550V800H0z" fill="url(#garden)"/>
      ${tree(320, 285, 1.05, true)}${tree(930, 315, .9)}${adaoEva(610, 500, .8)}
      <path d="M0 685Q300 640 600 685T1200 670" fill="none" stroke="#68BDE7" stroke-width="36" opacity=".9"/>
    `, 'Adão e Eva cuidando do jardim do Éden'),
    '02-voz-serpente.svg': svg(`
      <rect width="1200" height="800" fill="url(#sunsetSky)"/><circle cx="905" cy="180" r="150" fill="url(#divineLight)" opacity=".55"/>
      <path d="M0 500Q250 405 510 510T1200 470V800H0z" fill="url(#garden)"/>
      ${tree(620, 270, 1.35, true)}${adaoEva(380, 505, .72)}${serpent(720, 585, .78)}
      <circle cx="655" cy="385" r="18" fill="#FF7A29" filter="url(#glow)"/>
    `, 'A serpente conversa com Eva junto à árvore'),
    '03-esconderijo.svg': svg(`
      <rect width="1200" height="800" fill="url(#sunsetSky)"/><ellipse cx="600" cy="210" rx="300" ry="270" fill="url(#divineLight)" opacity=".85"/>
      <path d="M0 520Q230 405 470 520T840 490T1200 460V800H0z" fill="url(#garden)"/>
      ${tree(260, 285, 1.12)}${tree(970, 280, 1.1)}${adaoEva(600, 520, .9, true)}
      <path d="M520 90q80 80 160 0" fill="none" stroke="#FFF8C5" stroke-width="11" stroke-linecap="round" opacity=".9"/>
    `, 'Adão e Eva se escondem entre as árvores'),
    '04-novo-caminho.svg': svg(`
      <rect width="1200" height="800" fill="url(#daySky)"/><circle cx="860" cy="150" r="170" fill="url(#divineLight)"/>
      <path d="M0 490Q250 380 510 500T1200 450V800H0z" fill="#86C165"/>
      <path d="M0 600Q260 520 500 625T1200 560V800H0z" fill="url(#garden)"/>
      <path d="M580 800q-28-170 20-282 35-84 92-145" fill="none" stroke="#E2C98A" stroke-width="92" stroke-linecap="round"/>
      ${adaoEva(370, 505, .78)}${tree(930, 280, 1.1)}${footprints(575, 665, .7)}
    `, 'Adão e Eva seguem por um novo caminho com cuidado'),
  },
  'gn-03': {
    'cover.svg': svg(`
      <rect width="1200" height="800" fill="url(#sunsetSky)"/><circle cx="920" cy="160" r="160" fill="url(#sunGlow)"/>
      <path d="M0 490Q220 395 460 500T820 470T1200 450V800H0z" fill="#83B85C"/>
      <path d="M0 595Q260 500 520 610T1200 555V800H0z" fill="url(#garden)"/>
      ${grain(180, 530, 1.15)}${grain(300, 555, .9)}${sheep(850, 610, 1.05)}${altar(570, 585, .75)}
      ${person(435, 500, .7, '#B96D25', 'closed')}${person(660, 510, .7, '#3B7080', 'open')}
    `, 'Caim e Abel levam seus presentes ao Senhor'),
    '01-dois-irmaos.svg': svg(`
      <rect width="1200" height="800" fill="url(#daySky)"/>${clouds()}
      <path d="M0 480Q260 390 500 490T1200 450V800H0z" fill="#86C165"/><path d="M0 600Q250 510 500 615T1200 560V800H0z" fill="url(#garden)"/>
      ${grain(220, 520, 1.1)}${grain(335, 535, .8)}${sheep(880, 610, 1.1)}${sheep(1010, 650, .75)}
      ${person(470, 500, .78, '#B96D25', 'open')}${person(680, 500, .78, '#3B7080', 'open')}
    `, 'Caim trabalha a terra e Abel cuida das ovelhas'),
    '02-raiva-cresce.svg': svg(`
      <rect width="1200" height="800" fill="url(#sunsetSky)"/><circle cx="260" cy="170" r="130" fill="url(#sunGlow)" opacity=".6"/>
      <path d="M0 510Q260 410 500 510T1200 465V800H0z" fill="#698E50"/><path d="M0 620Q240 530 480 630T1200 580V800H0z" fill="#2F7B45"/>
      ${altar(820, 565, .8)}${grain(170, 555, 1)}${person(525, 500, .95, '#B96D25', 'closed')}
      <path d="M485 280q40 40 80 0q40 40 80 0" fill="none" stroke="#FF7A29" stroke-width="18" stroke-linecap="round" filter="url(#glow)"/>
    `, 'Caim sente a raiva crescer e precisa escolher o bem'),
    '03-escolher-ajuda.svg': svg(`
      <rect width="1200" height="800" fill="url(#sunsetSky)"/><circle cx="600" cy="160" r="170" fill="url(#divineLight)" opacity=".6"/>
      <path d="M0 500Q280 420 560 510T1200 470V800H0z" fill="#6FA553"/><path d="M0 620Q300 530 620 640T1200 580V800H0z" fill="url(#garden)"/>
      ${person(390, 500, .8, '#B96D25', 'closed')}${person(810, 500, .8, '#3B7080', 'open')}
      ${footprints(485, 690, .7, true)}${footprints(690, 690, .7)}<circle cx="600" cy="330" r="48" fill="#FFC93C" opacity=".25" filter="url(#strongGlow)"/>
    `, 'Caim e Abel separados enquanto a escolha ainda é possível'),
    '04-deus-protege.svg': svg(`
      <rect width="1200" height="800" fill="url(#nightSky)"/>${stars(38, 410)}
      <path d="M0 540Q270 450 530 550T1200 500V800H0z" fill="#193C36"/><path d="M0 650Q280 570 600 665T1200 620V800H0z" fill="#14213D"/>
      ${grain(180, 590, .8)}${footprints(460, 650, .75)}${person(760, 500, .76, '#B96D25', 'closed')}
      <circle cx="760" cy="250" r="140" fill="url(#divineLight)" opacity=".48"/><path d="M760 170v180" stroke="#FFF8C5" stroke-width="8" opacity=".65"/>
    `, 'Deus vê a dor e protege a vida no campo silencioso'),
  },
  'gn-04': {
    'cover.svg': svg(`
      <rect width="1200" height="800" fill="url(#daySky)"/><ellipse cx="850" cy="180" rx="260" ry="250" fill="url(#divineLight)"/>
      ${clouds()}<path d="M0 500Q240 390 480 500T820 470T1200 450V800H0z" fill="#86C165"/><path d="M0 620Q240 530 480 630T1200 565V800H0z" fill="url(#garden)"/>
      <path d="M80 760Q300 650 480 690T850 510" fill="none" stroke="#E2C98A" stroke-width="82" stroke-linecap="round"/>
      ${footprints(155, 695, .72)}${person(690, 495, .9, '#3B7080', 'open')}${oliveTree(1040, 480, .7)}
    `, 'Enoque caminha com Deus por uma estrada iluminada'),
    '01-vida-comum.svg': svg(`
      <rect width="1200" height="800" fill="url(#daySky)"/>${clouds()}
      <path d="M0 500Q250 400 500 510T1200 460V800H0z" fill="#86C165"/><path d="M0 620Q250 535 500 630T1200 570V800H0z" fill="url(#garden)"/>
      <path d="M210 610h230l-115-120z" fill="#FFF7E3"/><path d="M210 610h230" stroke="#7B4A2B" stroke-width="13"/>
      ${person(670, 500, .8, '#3B7080', 'open')}${person(820, 525, .55, '#C87843', 'closed')}${grain(1020, 575, .75)}${sheep(320, 680, .75)}
    `, 'Enoque vive com sua família e cuida da rotina'),
    '02-andar-com-deus.svg': svg(`
      <rect width="1200" height="800" fill="url(#sunsetSky)"/><circle cx="870" cy="180" r="150" fill="url(#divineLight)"/>
      <path d="M0 520Q250 410 520 520T1200 470V800H0z" fill="#76A957"/><path d="M0 650Q260 560 520 660T1200 600V800H0z" fill="url(#garden)"/>
      <path d="M120 770Q330 680 530 640T920 360" fill="none" stroke="#E2C98A" stroke-width="78" stroke-linecap="round"/>
      ${footprints(170, 715, .72)}${person(670, 480, .88, '#3B7080', 'open')}<circle cx="865" cy="210" r="34" fill="#FFF8C5" filter="url(#glow)"/>
      <path d="M845 285q35-42 70 0" fill="none" stroke="#FFF8C5" stroke-width="11" stroke-linecap="round"/>
    `, 'Enoque anda perto de Deus passo a passo'),
    '03-um-passo.svg': svg(`
      <rect width="1200" height="800" fill="url(#daySky)"/>${clouds()}
      <path d="M0 510Q250 400 520 520T1200 470V800H0z" fill="#86C165"/><path d="M0 650Q260 550 560 665T1200 600V800H0z" fill="url(#garden)"/>
      ${footprints(170, 690, .75)}${person(570, 480, .85, '#3B7080', 'open')}${person(860, 535, .55, '#C87843', 'open')}
      <circle cx="570" cy="205" r="130" fill="url(#divineLight)" opacity=".6"/><path d="M530 230q40-45 80 0" fill="none" stroke="#FFF8C5" stroke-width="10" stroke-linecap="round"/>
    `, 'Um passo de bondade e verdade na rotina'),
    '04-deus-levou.svg': svg(`
      <rect width="1200" height="800" fill="url(#sunsetSky)"/>${stars(32, 360)}
      <path d="M0 555Q260 450 520 560T1200 510V800H0z" fill="#4C7A4B"/><path d="M0 680Q260 600 520 690T1200 640V800H0z" fill="#2F6040"/>
      ${footprints(170, 720, .7)}${person(600, 485, .9, '#3B7080', 'open')}
      <ellipse cx="600" cy="180" rx="270" ry="230" fill="url(#angelGlow)" opacity=".9"/><path d="M520 230q80-110 160 0" fill="none" stroke="#FFF8C5" stroke-width="18" stroke-linecap="round"/>
      <path d="M505 300l-75 100M695 300l75 100" stroke="#FFF8C5" stroke-width="12" stroke-linecap="round" opacity=".8"/>
    `, 'Enoque é levado para junto de Deus sob uma luz serena'),
  },
  'gn-05': {
    'cover.svg': svg(`
      <rect width="1200" height="800" fill="url(#stormSky)"/>${rain(30)}
      <path d="M0 600Q220 500 450 610T830 580T1200 550V800H0z" fill="url(#water)"/>
      ${ark(600, 475, 1.2)}${sheep(340, 625, .7)}${sheep(870, 620, .7)}
      <path d="M200 210Q600 40 1000 210" fill="none" stroke="#FFC93C" stroke-width="24" opacity=".9"/>
      <path d="M260 210Q600 90 940 210" fill="none" stroke="#FF7A29" stroke-width="18" opacity=".82"/>
      <circle cx="600" cy="265" r="32" fill="#FFFBF0" filter="url(#glow)"/>
    `, 'A arca de Noé atravessa a chuva sob o arco-íris'),
    '01-noe-ouve.svg': svg(`
      <rect width="1200" height="800" fill="url(#daySky)"/>${clouds()}
      <path d="M0 500Q240 395 500 510T1200 460V800H0z" fill="#86C165"/><path d="M0 620Q240 530 520 635T1200 570V800H0z" fill="url(#garden)"/>
      ${person(430, 490, .88, '#C87843', 'open')}${ark(900, 600, .55)}
      <ellipse cx="460" cy="170" rx="220" ry="180" fill="url(#divineLight)" opacity=".7"/><path d="M410 180q50-55 100 0" fill="none" stroke="#FFF8C5" stroke-width="12" stroke-linecap="round"/>
    `, 'Noé ouve a orientação de Deus no campo'),
    '02-constroi-arca.svg': svg(`
      <rect width="1200" height="800" fill="url(#sunsetSky)"/><circle cx="950" cy="160" r="140" fill="url(#sunGlow)" opacity=".7"/>
      <path d="M0 540Q270 430 500 540T1200 490V800H0z" fill="#7BA95D"/><path d="M0 680Q260 590 520 680T1200 620V800H0z" fill="#477F48"/>
      ${ark(700, 410, 1.05)}${person(280, 500, .7, '#C87843', 'open')}${person(420, 535, .58, '#3B7080', 'closed')}${bricks(205, 650, .65)}
    `, 'Noé e sua família constroem uma arca enorme'),
    '03-entrar-confiar.svg': svg(`
      <rect width="1200" height="800" fill="url(#stormSky)"/>${rain(24)}
      <path d="M0 610Q220 500 450 620T820 590T1200 560V800H0z" fill="url(#water)"/>
      ${ark(610, 460, 1.15)}${sheep(250, 625, .7)}${sheep(950, 620, .72)}${person(375, 540, .62, '#C87843', 'open')}
      <path d="M90 235q160-85 300 0M900 220q130-75 250 0" fill="none" stroke="#8296A8" stroke-width="40" stroke-linecap="round" opacity=".8"/>
    `, 'Noé recebe a família e os animais na arca'),
    '04-promessa.svg': svg(`
      <rect width="1200" height="800" fill="url(#daySky)"/><circle cx="900" cy="150" r="150" fill="url(#sunGlow)"/>
      <path d="M0 570Q250 470 500 580T1200 530V800H0z" fill="url(#water)"/>${ark(600, 480, 1.05)}
      <path d="M150 235Q600 35 1050 235" fill="none" stroke="#FFC93C" stroke-width="25"/><path d="M210 235Q600 85 990 235" fill="none" stroke="#FF7A29" stroke-width="17"/>
      <path d="M780 260q35-38 70 0q-35 35-70 0z" fill="#FFFBF0"/><path d="M815 260l45-20" stroke="#7B4A2B" stroke-width="5"/>
    `, 'O arco-íris marca a promessa de Deus'),
  },
  'gn-06': {
    'cover.svg': svg(`
      <rect width="1200" height="800" fill="url(#daySky)"/><circle cx="920" cy="145" r="160" fill="url(#sunGlow)"/>
      ${clouds()}<path d="M0 520Q260 410 500 520T1200 470V800H0z" fill="#86C165"/><path d="M0 640Q260 550 520 650T1200 590V800H0z" fill="url(#garden)"/>
      ${tower(650, 470, .95)}${person(270, 535, .62, '#C87843', 'open')}${person(430, 550, .55, '#3B7080', 'open')}${bricks(220, 665, .5)}
    `, 'A torre de Babel se ergue na planície de Sinar'),
    '01-uma-lingua.svg': svg(`
      <rect width="1200" height="800" fill="url(#daySky)"/>${clouds()}
      <path d="M0 500Q250 410 510 515T1200 465V800H0z" fill="#86C165"/><path d="M0 630Q260 545 530 640T1200 580V800H0z" fill="url(#garden)"/>
      <path d="M190 605h230l-115-122z" fill="#FFF7E3"/><path d="M190 605h230" stroke="#7B4A2B" stroke-width="13"/>
      ${person(610, 510, .65, '#C87843', 'open')}${person(770, 520, .6, '#3B7080', 'open')}${person(930, 525, .58, '#B96D25', 'open')}${bricks(340, 660, .65)}
    `, 'O povo de Babel trabalha junto falando a mesma língua'),
    '02-torre-orgulho.svg': svg(`
      <rect width="1200" height="800" fill="url(#sunsetSky)"/><circle cx="230" cy="150" r="130" fill="url(#sunGlow)"/>
      <path d="M0 550Q260 440 520 550T1200 500V800H0z" fill="#6F9B57"/><path d="M0 680Q250 590 520 690T1200 630V800H0z" fill="#3E7044"/>
      ${tower(600, 420, 1.2)}${person(220, 555, .6, '#C87843', 'open')}${person(970, 555, .6, '#3B7080', 'open')}
      <circle cx="600" cy="130" r="42" fill="#FFC93C" opacity=".35" filter="url(#strongGlow)"/>
    `, 'A torre cresce enquanto o orgulho toma o centro'),
    '03-cooperar.svg': svg(`
      <rect width="1200" height="800" fill="url(#daySky)"/>${clouds()}
      <path d="M0 510Q250 410 510 520T1200 470V800H0z" fill="#86C165"/><path d="M0 650Q260 550 530 660T1200 590V800H0z" fill="url(#garden)"/>
      ${person(330, 490, .65, '#C87843', 'open')}${person(600, 490, .65, '#3B7080', 'open')}${person(870, 490, .65, '#B96D25', 'open')}
      ${bricks(550, 650, .7)}<circle cx="600" cy="220" r="55" fill="#FFF8C5" opacity=".4" filter="url(#glow)"/>
      <path d="M400 405q200-95 400 0" fill="none" stroke="#FFC93C" stroke-width="12" stroke-dasharray="18 18"/>
    `, 'Pessoas diferentes cooperam e dividem as tarefas'),
    '04-muitas-linguas.svg': svg(`
      <rect width="1200" height="800" fill="url(#sunsetSky)"/>${stars(24, 340)}
      <path d="M0 550Q250 440 500 550T1200 500V800H0z" fill="#698E50"/><path d="M0 680Q260 590 520 690T1200 630V800H0z" fill="#365E40"/>
      ${tower(600, 455, .65)}${footprints(160, 720, .62, true)}${footprints(920, 720, .62)}
      ${person(315, 520, .62, '#C87843', 'open')}${person(885, 520, .62, '#3B7080', 'open')}
      <path d="M600 320L390 240M600 320l210-80" stroke="#FFF8C5" stroke-width="10" stroke-linecap="round" opacity=".75"/>
    `, 'As famílias seguem por caminhos diferentes e Deus continua cuidando'),
  },
};

export function getGenesisNextScenes(folder) {
  return scenes[folder];
}
