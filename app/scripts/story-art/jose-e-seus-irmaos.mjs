import { svg, clouds, stars } from './shared.mjs';

export function getJoseSeusIrmaosScenes() {
  const coatOfManyColors = (x, y, scale = 1) => `
    <g transform="translate(${x} ${y}) scale(${scale})" filter="url(#softShadow)">
      <!-- Manto com listras multicoloridas -->
      <path d="M-45 20 C-30 -10 30 -10 45 20 L55 160 H-55 Z" fill="#FF4D4F"/>
      <!-- Listras coloridas verticais -->
      <path d="M-35 25 L-42 160 H-25 L-20 25 Z" fill="#FFA940"/>
      <path d="M-20 25 L-25 160 H-8 L-5 25 Z" fill="#FFEC3D"/>
      <path d="M-5 25 L-8 160 H8 L5 25 Z" fill="#73D13D"/>
      <path d="M5 25 L8 160 H25 L20 25 Z" fill="#40A9FF"/>
      <path d="M20 25 L25 160 H42 L35 25 Z" fill="#9254DE"/>
      <!-- Mangas compridas listradas -->
      <path d="M-45 20 Q-80 60 -65 110" stroke="#FF4D4F" stroke-width="22" stroke-linecap="round" fill="none"/>
      <path d="M-52 35 Q-75 60 -60 90" stroke="#FFEC3D" stroke-width="12" stroke-linecap="round" fill="none"/>
      <path d="M45 20 Q80 60 65 110" stroke="#FF4D4F" stroke-width="22" stroke-linecap="round" fill="none"/>
      <path d="M52 35 Q75 60 60 90" stroke="#40A9FF" stroke-width="12" stroke-linecap="round" fill="none"/>
      <!-- Gola dourada -->
      <ellipse cx="0" cy="18" rx="22" ry="10" fill="#FFD700"/>
    </g>`;

  const joseph = (x, y, scale = 1, isGovernor = false) => `
    <g transform="translate(${x} ${y}) scale(${scale})" filter="url(#softShadow)">
      <!-- Pernas -->
      <path d="M-15 140 v65 M15 140 v65" stroke="#DDA876" stroke-width="18" stroke-linecap="round"/>
      <!-- Sandálias -->
      <path d="M-25 205 h20 M5 205 h20" stroke="#7A4D27" stroke-width="8" stroke-linecap="round"/>
      ${isGovernor ? `
        <!-- Veste nobre egípcia de linho fino e ouro -->
        <path d="M-40 20 C-20 -5 20 -5 40 20 L50 160 H-50 Z" fill="#FFFFFF"/>
        <!-- Faixa azul e dourada de governador -->
        <path d="M-20 20 L40 160 H15 L-35 20 Z" fill="#1890FF"/>
        <path d="M-15 20 L45 160 H35 L-25 20 Z" fill="#FFD700"/>
        <!-- Colar usekh egípcio de ouro e pedras -->
        <path d="M-45 22 C-35 60 35 60 45 22" fill="#FFD700" stroke="#E6A800" stroke-width="3"/>
        <circle cx="-25" cy="38" r="4" fill="#008080"/>
        <circle cx="0" cy="45" r="4" fill="#C53030"/>
        <circle cx="25" cy="38" r="4" fill="#008080"/>
      ` : `
        <!-- Túnica colorida -->
        ${coatOfManyColors(0, 0, 1)}
      `}
      <!-- Cabeça de José -->
      <circle cx="0" cy="-35" r="30" fill="#E8B084"/>
      <!-- Cabelo e olhos jovens -->
      <path d="M-30 -38 C-30 -70 30 -70 30 -38 C22 -62 -22 -62 -30 -38 Z" fill="#4A260B"/>
      <circle cx="-10" cy="-35" r="4" fill="#14213D"/>
      <circle cx="10" cy="-35" r="4" fill="#14213D"/>
      <path d="M-8 -20 Q0 -12 8 -20" stroke="#7A3918" stroke-width="3" fill="none" stroke-linecap="round"/>
      ${isGovernor ? `
        <!-- Touca / adorno real de ouro egípcio -->
        <path d="M-32 -45 C-32 -75 32 -75 32 -45 L36 -25 L28 -25 L24 -45 C15 -62 -15 -62 -24 -45 L-28 -25 L-36 -25 Z" fill="#FFD700"/>
        <!-- Cajado de governador -->
        <path d="M45 200 L45 -40 Q45 -65 65 -65 Q75 -65 75 -50" stroke="#FFD700" stroke-width="8" fill="none" stroke-linecap="round"/>
      ` : ''}
    </g>`;

  const wheatSheaf = (x, y, scale = 1) => `
    <g transform="translate(${x} ${y}) scale(${scale})" filter="url(#softShadow)">
      <!-- Feixe de trigo dourado -->
      <path d="M-25 60 Q-40 0 -15 -50 Q0 -70 15 -50 Q40 0 25 60 Z" fill="#E2B868"/>
      <path d="M-20 60 Q-30 0 -10 -40 Q0 -55 10 -40 Q30 0 20 60 Z" fill="#FFD700"/>
      <!-- Cordão amarrando o feixe -->
      <rect x="-24" y="5" width="48" height="12" rx="4" fill="#A86E3C"/>
      <!-- Espigas no topo -->
      <ellipse cx="-15" cy="-55" rx="7" ry="14" fill="#FFE58F" transform="rotate(-20 -15 -55)"/>
      <ellipse cx="0" cy="-65" rx="8" ry="16" fill="#FFE58F"/>
      <ellipse cx="15" cy="-55" rx="7" ry="14" fill="#FFE58F" transform="rotate(20 15 -55)"/>
    </g>`;

  return {
    'cover.svg': svg(`
      <rect width="1200" height="800" fill="url(#sunsetSky)"/>
      <circle cx="920" cy="220" r="140" fill="url(#sunGlow)"/>
      <!-- Terraço do palácio egípcio -->
      <path d="M0 480 Q350 420 700 480 T1200 460 V800 H0 Z" fill="url(#desert)"/>
      <!-- Rio Nilo ao longe -->
      <path d="M0 540 Q300 500 650 550 T1200 520 V620 H0 Z" fill="url(#water)"/>
      <!-- Colunata do palácio -->
      <g filter="url(#softShadow)">
        <rect x="80" y="240" width="60" height="360" rx="4" fill="url(#palaceWall)"/>
        <polygon points="60,240 160,240 140,290 80,290" fill="#E2B868"/>
        <rect x="1060" y="240" width="60" height="360" rx="4" fill="url(#palaceWall)"/>
        <polygon points="1040,240 1140,240 1120,290 1060,290" fill="#E2B868"/>
      </g>
      <!-- Piso do terraço do palácio -->
      <path d="M0 600 L1200 600 L1200 800 L0 800 Z" fill="url(#palaceWall)"/>
      <!-- José como governador com a túnica colorida em destaque -->
      ${joseph(600, 470, 1.35, true)}
      <!-- Feixes de trigo fartos -->
      ${wheatSheaf(420, 650, 1.2)}
      ${wheatSheaf(780, 650, 1.2)}
    `, 'José no Egito com seus celeiros e vestes nobres'),

    '01-sonho-jose.svg': svg(`
      <rect width="1200" height="800" fill="url(#nightSky)"/>
      ${stars(60, 480)}
      <!-- Sol, lua e 11 estrelas brilhantes no sonho -->
      <circle cx="600" cy="180" r="50" fill="#FFD700" filter="url(#strongGlow)"/>
      <path d="M720 150 A35 35 0 0 0 755 210 A45 45 0 1 1 720 150 Z" fill="#FFFDE0" filter="url(#glow)"/>
      <!-- As 11 estrelas do sonho -->
      ${Array.from({ length: 11 }, (_, i) => {
        const angle = (i * 32.7 - 90) * (Math.PI / 180);
        const cx = 600 + Math.cos(angle) * 190;
        const cy = 200 + Math.sin(angle) * 90;
        return `
          <g transform="translate(${cx.toFixed(1)} ${cy.toFixed(1)})" filter="url(#strongGlow)">
            <circle cx="0" cy="0" r="8" fill="#FFF7A6"/>
            <polygon points="0,-16 4,-4 16,0 4,4 0,16 -4,4 -16,0 -4,-4" fill="#FFC93C"/>
          </g>`;
      }).join('')}
      <!-- Colinas de Canaã à noite -->
      <path d="M0 520 Q350 460 750 540 T1200 500 V800 H0 Z" fill="#14213D"/>
      <path d="M0 600 Q400 550 800 620 T1200 590 V800 H0 Z" fill="#1D4689"/>
      <!-- José contemplando o sonho com sua linda túnica colorida -->
      ${joseph(360, 490, 1.2, false)}
      <!-- Feixes de trigo que se curvam no sonho -->
      <g transform="translate(750 630) rotate(-15)">${wheatSheaf(0, 0, 1.1)}</g>
      <g transform="translate(850 630) rotate(15)">${wheatSheaf(0, 0, 1.1)}</g>
    `, 'O sonho profético de José com o sol, a lua e as onze estrelas'),

    '02-vendido-irmaos.svg': svg(`
      <rect width="1200" height="800" fill="url(#morningSky)"/>
      <circle cx="280" cy="160" r="130" fill="url(#sunGlow)"/>
      <!-- Dunas do deserto de Dotã -->
      <path d="M0 450 Q300 380 650 460 T1200 420 V800 H0 Z" fill="url(#desert)"/>
      <path d="M0 540 Q400 470 850 560 T1200 520 V800 H0 Z" fill="url(#sandDune)"/>
      <!-- Caravana de camelos ao longe a caminho do Egito -->
      <g transform="translate(860 480) scale(.6)" filter="url(#softShadow)">
        <ellipse cx="0" cy="0" rx="35" ry="25" fill="#8C5828"/>
        <circle cx="35" cy="-25" r="16" fill="#8C5828"/>
        <path d="M-15 -35 Q0 -55 15 -35" fill="#8C5828"/>
        <path d="M-20 20 v40 M-5 20 v40 M10 20 v40 M25 20 v40" stroke="#8C5828" stroke-width="8"/>
        <!-- Segundo camelo -->
        <g transform="translate(90 10)">
          <ellipse cx="0" cy="0" rx="32" ry="22" fill="#A86E3C"/>
          <circle cx="32" cy="-22" r="15" fill="#A86E3C"/>
          <path d="M-12 -30 Q0 -48 12 -30" fill="#A86E3C"/>
          <path d="M-18 18 v36 M-4 18 v36 M8 18 v36 M22 18 v36" stroke="#A86E3C" stroke-width="7"/>
        </g>
      </g>
      <!-- Poço de pedras antigas em primeiro plano -->
      <g transform="translate(420 590)" filter="url(#softShadow)">
        <ellipse cx="0" cy="40" rx="110" ry="45" fill="#7A4D27"/>
        <ellipse cx="0" cy="35" rx="88" ry="32" fill="#14213D"/>
        <!-- Pedras empilhadas do poço -->
        ${Array.from({ length: 8 }, (_, i) => `
          <ellipse cx="${-80 + i * 22}" cy="${48 + (i % 2) * 8}" rx="14" ry="10" fill="#B8860B"/>
        `).join('')}
      </g>
      <!-- Túnica colorida de José caída na borda do poço -->
      <g transform="translate(560 590) rotate(25)">
        ${coatOfManyColors(0, 0, 0.9)}
      </g>
    `, 'José é vendido pelos irmãos e levado para o Egito'),

    '03-jose-egito.svg': svg(`
      <rect width="1200" height="800" fill="url(#daySky)"/>
      <circle cx="850" cy="160" r="130" fill="url(#sunGlow)"/>
      ${clouds()}
      <!-- Grande celeiro do Egito -->
      <path d="M0 480 Q400 420 800 480 T1200 460 V800 H0 Z" fill="url(#palaceWall)"/>
      <!-- Montes enormes de trigo dourado estocado -->
      <path d="M120 620 Q280 340 440 620 Z" fill="#E2B868" filter="url(#softShadow)"/>
      <path d="M140 620 Q280 360 420 620 Z" fill="#FFD700"/>
      <path d="M780 620 Q940 320 1100 620 Z" fill="#E2B868" filter="url(#softShadow)"/>
      <path d="M800 620 Q940 340 1080 620 Z" fill="#FFD700"/>
      <!-- Sacas de trigo empilhadas -->
      <g transform="translate(440 620)" filter="url(#softShadow)">
        <ellipse cx="0" cy="0" rx="40" ry="24" fill="#C5A065"/>
        <ellipse cx="60" cy="5" rx="38" ry="23" fill="#C5A065"/>
        <ellipse cx="30" cy="-25" rx="36" ry="22" fill="#E2B868"/>
      </g>
      <!-- José governador administrando com sabedoria -->
      ${joseph(610, 460, 1.3, true)}
    `, 'José governa com sabedoria e armazena trigo para a fome'),

    '04-reencontro-irmaos.svg': svg(`
      <rect width="1200" height="800" fill="url(#daySky)"/>
      <!-- Salão do trono do palácio egípcio -->
      <rect width="1200" height="800" fill="url(#palaceWall)"/>
      <path d="M0 0 L1200 0 L1100 240 L100 240 Z" fill="#E8D5B0"/>
      <!-- Colunata grandiosa -->
      <rect x="180" y="240" width="70" height="420" rx="6" fill="#D4AF37"/>
      <rect x="950" y="240" width="70" height="420" rx="6" fill="#D4AF37"/>
      <!-- Trono do governador José -->
      <g transform="translate(800 420)" filter="url(#softShadow)">
        <polygon points="-60,180 60,180 50,0 -50,0" fill="#B8860B"/>
        <rect x="-70" y="-30" width="140" height="40" rx="8" fill="#FFD700"/>
        <!-- José no trono -->
        ${joseph(0, 40, 1.25, true)}
      </g>
      <!-- Irmãos curvados diante dele em respeito, pedindo trigo -->
      <g transform="translate(320 540)" filter="url(#softShadow)">
        <!-- Três irmãos ajoelhados -->
        <g transform="translate(-80 40)">
          <path d="M-30 40 Q-5 10 35 30 L45 90 H-35 Z" fill="#8C5828"/>
          <circle cx="45" cy="25" r="18" fill="#DDA876"/>
        </g>
        <g transform="translate(0 30)">
          <path d="M-30 40 Q-5 10 35 30 L45 90 H-35 Z" fill="#6F4320"/>
          <circle cx="45" cy="25" r="18" fill="#DDA876"/>
        </g>
        <g transform="translate(80 40)">
          <path d="M-30 40 Q-5 10 35 30 L45 90 H-35 Z" fill="#A86E3C"/>
          <circle cx="45" cy="25" r="18" fill="#DDA876"/>
        </g>
      </g>
    `, 'Os irmãos se curvam diante de José sem o reconhecer'),

    '05-perdao-jose.svg': svg(`
      <rect width="1200" height="800" fill="url(#morningSky)"/>
      <circle cx="600" cy="260" r="320" fill="url(#divineLight)" opacity=".85"/>
      <!-- Salão aconchegante de banquete e reconciliação -->
      <path d="M0 500 L1200 500 L1200 800 L0 800 Z" fill="url(#palaceWall)"/>
      <!-- Mesa de banquete com frutas, pães e trigo -->
      <g transform="translate(600 680)" filter="url(#softShadow)">
        <rect x="-350" y="0" width="700" height="30" rx="6" fill="#8C5828"/>
        <path d="M-300 30 v70 M300 30 v70" stroke="#8C5828" stroke-width="24"/>
        <!-- Cesta de frutas e pães -->
        <ellipse cx="-150" cy="-10" rx="45" ry="18" fill="#FFC93C"/>
        <circle cx="-165" cy="-20" r="10" fill="#FF4D4F"/>
        <circle cx="-135" cy="-20" r="10" fill="#73D13D"/>
        <ellipse cx="150" cy="-10" rx="55" ry="20" fill="#FCEAB3"/>
      </g>
      <!-- Abraço emocionante de José e seus irmãos -->
      <g transform="translate(560 480)" filter="url(#softShadow)">
        <!-- José abraçando -->
        ${joseph(0, 0, 1.25, false)}
        <!-- Irmão chorando de alegria no abraço -->
        <g transform="translate(80 30)">
          <path d="M-30 40 Q0 10 30 40 L35 150 H-35 Z" fill="#8C5828"/>
          <circle cx="0" cy="-20" r="26" fill="#DDA876"/>
          <!-- Braços no abraço -->
          <path d="M-25 40 Q-50 20 -70 40" stroke="#DDA876" stroke-width="16" stroke-linecap="round" fill="none"/>
        </g>
      </g>
      <!-- Luz divina do perdão e amor -->
      <circle cx="600" cy="450" r="140" fill="#FFC93C" opacity=".2" filter="url(#strongGlow)"/>
    `, 'José abraça e perdoa seus irmãos com lágrimas de amor'),
  };
}
