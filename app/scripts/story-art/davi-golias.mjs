import { svg, clouds, sheep, oliveTree } from './shared.mjs';

export function getDaviGoliasScenes() {
  const giant = (x, y, scale = 1) => `
    <g transform="translate(${x} ${y}) scale(${scale})" filter="url(#softShadow)">
      <!-- Lança -->
      <path d="M-80 -240 L-65 320" stroke="#7A4D27" stroke-width="16" stroke-linecap="round"/>
      <polygon points="-83,-285 -70,-235 -95,-235" fill="#D4AF37"/>
      <!-- Corpo armadura -->
      <ellipse cx="0" cy="80" rx="95" ry="140" fill="#9C6B30"/>
      <!-- Placas de bronze -->
      <path d="M-75 0 C-60 -40 60 -40 75 0 L65 140 C50 170 -50 170 -65 140 Z" fill="#B8860B"/>
      <path d="M-55 20 C-30 40 30 40 55 20" stroke="#E6C655" stroke-width="8" fill="none"/>
      <path d="M-50 70 C-25 90 25 90 50 70" stroke="#E6C655" stroke-width="8" fill="none"/>
      <!-- Pernas grevas -->
      <path d="M-50 190 v110 M40 190 v110" stroke="#8C6226" stroke-width="36" stroke-linecap="round"/>
      <path d="M-50 210 v70 M40 210 v70" stroke="#D4AF37" stroke-width="22" stroke-linecap="round"/>
      <!-- Braços -->
      <path d="M-80 0 Q-120 70 -75 140" stroke="#A87532" stroke-width="32" stroke-linecap="round" fill="none"/>
      <path d="M80 0 Q130 60 90 140" stroke="#A87532" stroke-width="32" stroke-linecap="round" fill="none"/>
      <!-- Escudo de bronze -->
      <ellipse cx="105" cy="110" rx="55" ry="90" fill="#D4AF37"/>
      <ellipse cx="105" cy="110" rx="42" ry="72" fill="#B8860B"/>
      <circle cx="105" cy="110" r="16" fill="#FFD700"/>
      <!-- Cabeça e Capacete -->
      <ellipse cx="0" cy="-75" rx="52" ry="60" fill="#8C5828"/>
      <!-- Barba -->
      <path d="M-45 -50 Q0 30 45 -50 Q30 45 0 55 Q-30 45 -45 -50 Z" fill="#2E1C0C"/>
      <circle cx="-18" cy="-80" r="6" fill="#14213D"/>
      <circle cx="18" cy="-80" r="6" fill="#14213D"/>
      <!-- Capacete pontudo com crista -->
      <path d="M-54 -75 C-52 -130 52 -130 54 -75 Z" fill="#D4AF37"/>
      <polygon points="0,-165 -16,-120 16,-120" fill="#C53030"/>
      <path d="M-18 -120 L0 -170 L18 -120" stroke="#E53E3E" stroke-width="12" stroke-linecap="round"/>
    </g>`;

  const david = (x, y, scale = 1, showSling = true) => `
    <g transform="translate(${x} ${y}) scale(${scale})" filter="url(#softShadow)">
      <!-- Pernas -->
      <path d="M-16 110 v70 M16 110 v70" stroke="#C98A58" stroke-width="18" stroke-linecap="round"/>
      <!-- Sandálias -->
      <path d="M-26 180 h22 M8 180 h22" stroke="#6F4320" stroke-width="8" stroke-linecap="round"/>
      <!-- Túnica de pastor -->
      <path d="M-36 20 Q0 -10 36 20 L44 120 Q0 135 -44 120 Z" fill="#3B7080"/>
      <!-- Cinto com bolsinha de pedras -->
      <rect x="-38" y="60" width="76" height="12" rx="4" fill="#6F4320"/>
      <ellipse cx="-24" cy="80" rx="14" ry="16" fill="#8C5528"/>
      <!-- Cabeça -->
      <circle cx="0" cy="-35" r="32" fill="#E8B084"/>
      <!-- Cabelo ruivo/castanho cacheado -->
      <path d="M-34 -38 C-35 -72 35 -72 34 -38 C26 -65 -26 -65 -34 -38 Z" fill="#A84E22"/>
      <circle cx="-28" cy="-45" r="12" fill="#A84E22"/>
      <circle cx="28" cy="-45" r="12" fill="#A84E22"/>
      <circle cx="0" cy="-62" r="15" fill="#A84E22"/>
      <!-- Olhos e sorriso confiante -->
      <circle cx="-11" cy="-35" r="4.5" fill="#14213D"/>
      <circle cx="11" cy="-35" r="4.5" fill="#14213D"/>
      <path d="M-8 -20 Q0 -12 8 -20" stroke="#7A3918" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <!-- Cajado -->
      <path d="M-45 180 L-45 -70 Q-45 -95 -25 -95 Q-15 -95 -15 -80" stroke="#6F4320" stroke-width="10" fill="none" stroke-linecap="round"/>
      <!-- Braço e Funda -->
      ${showSling ? `
        <path d="M30 40 Q65 20 80 -10" stroke="#C98A58" stroke-width="16" stroke-linecap="round" fill="none"/>
        <path d="M80 -10 Q120 -50 90 -90 Q50 -110 30 -60" stroke="#8C5528" stroke-width="5" fill="none"/>
        <ellipse cx="65" cy="-90" rx="10" ry="10" fill="#FFC93C" filter="url(#glow)"/>
      ` : `
        <path d="M30 40 Q55 60 45 90" stroke="#C98A58" stroke-width="16" stroke-linecap="round" fill="none"/>
      `}
    </g>`;

  return {
    'cover.svg': svg(`
      <rect width="1200" height="800" fill="url(#daySky)"/>
      <circle cx="920" cy="140" r="140" fill="url(#sunGlow)"/>
      ${clouds()}
      <!-- Montanhas ao fundo -->
      <path d="M0 480 Q250 360 520 450 T1200 420 V800 H0 Z" fill="#78B35A"/>
      <path d="M0 550 Q380 430 760 540 T1200 510 V800 H0 Z" fill="url(#hills)"/>
      <!-- Acampamento distante com tendas -->
      <polygon points="180,480 215,440 250,480" fill="#FFF7E3"/>
      <polygon points="230,485 260,445 290,485" fill="#E8D5B0"/>
      <polygon points="850,470 885,430 920,470" fill="#9C6B30"/>
      <polygon points="900,475 930,438 960,475" fill="#7A4D27"/>
      <!-- Golias no vale -->
      ${giant(880, 480, 0.72)}
      <!-- Colina em primeiro plano com Davi -->
      <path d="M0 640 Q280 560 620 670 Q850 750 1200 710 V800 H0 Z" fill="url(#garden)"/>
      ${david(280, 520, 1.15, true)}
      ${sheep(480, 680, 0.7)}
      ${oliveTree(110, 620, 0.85)}
      <g transform="translate(600 240)" filter="url(#strongGlow)">
        <polygon points="0,-40 25,0 70,8 35,40 45,85 0,60 -45,85 -35,40 -70,8 -25,0" fill="#FFC93C" opacity=".7"/>
      </g>
    `, 'Davi e Golias no Vale de Elá'),

    '01-davi-escolhido.svg': svg(`
      <rect width="1200" height="800" fill="url(#morningSky)"/>
      <circle cx="600" cy="120" r="280" fill="url(#divineLight)" opacity=".8"/>
      ${clouds()}
      <path d="M0 490 Q300 420 650 490 T1200 470 V800 H0 Z" fill="#80B85E"/>
      <path d="M0 580 Q400 500 800 590 T1200 560 V800 H0 Z" fill="url(#hills)"/>
      ${oliveTree(180, 520, 0.9)}
      ${oliveTree(1020, 540, 0.95)}
      <!-- Ovelhinhas no pasto -->
      ${sheep(300, 620, 0.85)}
      ${sheep(420, 660, 0.7, true)}
      ${sheep(880, 640, 0.8)}
      <!-- Samuel ungindo Davi -->
      <g transform="translate(520 460)" filter="url(#softShadow)">
        <!-- Profeta Samuel com manto branco/creme -->
        <path d="M-60 80 Q-20 0 0 -20 Q20 0 60 80 L70 210 H-70 Z" fill="#F4EADB"/>
        <path d="M-40 40 Q0 60 40 40 L45 170 H-45 Z" fill="#C5A065"/>
        <circle cx="0" cy="-55" r="34" fill="#E8B084"/>
        <!-- Barba branca comprida -->
        <path d="M-30 -40 Q0 60 30 -40 Q25 40 0 50 Q-25 40 -30 -40 Z" fill="#FFFFFF"/>
        <!-- Chifre de azeite brilhando -->
        <path d="M40 -30 Q75 -80 110 -50 Q95 -25 55 -15 Z" fill="#FFD700" filter="url(#glow)"/>
        <!-- Azeite sagrado caindo como luz -->
        <path d="M95 -30 Q120 10 135 60" stroke="#FFC93C" stroke-width="8" stroke-linecap="round" fill="none" filter="url(#strongGlow)"/>
      </g>
      <!-- Jovem Davi recebendo a unção -->
      ${david(670, 510, 0.95, false)}
    `, 'O profeta Samuel unge Davi como novo rei'),

    '02-gigante-golias.svg': svg(`
      <rect width="1200" height="800" fill="url(#daySky)"/>
      <circle cx="250" cy="160" r="110" fill="url(#sunGlow)"/>
      <!-- Céu com nuvens pontiagudas -->
      <path d="M0 450 L300 370 L600 440 L900 380 L1200 430 V800 H0 Z" fill="#88967A"/>
      <path d="M0 530 Q350 460 700 540 T1200 510 V800 H0 Z" fill="url(#desert)"/>
      <!-- Tendas de guerra dos filisteus -->
      <polygon points="120,530 180,440 240,530" fill="#6B4826"/>
      <polygon points="200,540 250,460 300,540" fill="#4A3018"/>
      <polygon points="920,520 980,430 1040,520" fill="#6B4826"/>
      <!-- Golias enorme em primeiro plano -->
      ${giant(600, 390, 1.45)}
      <!-- Lanças e estandartes fincados -->
      <line x1="280" y1="620" x2="280" y2="400" stroke="#14213D" stroke-width="7"/>
      <polygon points="280,400 330,420 280,440" fill="#C53030"/>
      <line x1="950" y1="620" x2="950" y2="390" stroke="#14213D" stroke-width="7"/>
      <polygon points="950,390 1000,410 950,430" fill="#1D4689"/>
    `, 'O gigante Golias desafia o exército de Israel'),

    '03-davi-ouve-desafio.svg': svg(`
      <rect width="1200" height="800" fill="url(#daySky)"/>
      <circle cx="850" cy="150" r="130" fill="url(#sunGlow)"/>
      ${clouds()}
      <path d="M0 460 Q350 380 700 450 T1200 430 V800 H0 Z" fill="#75A85A"/>
      <path d="M0 550 Q450 480 850 560 T1200 530 V800 H0 Z" fill="url(#hills)"/>
      <!-- Soldados medrosos na tenda -->
      <g transform="translate(750 490)" filter="url(#softShadow)">
        <polygon points="0,110 60,10 120,110" fill="#FFFBF0"/>
        <!-- Dois capacetes espiando trêmulos -->
        <circle cx="35" cy="80" r="16" fill="#A87A2A"/>
        <circle cx="75" cy="80" r="16" fill="#A87A2A"/>
      </g>
      <!-- Davi no primeiro plano com cestas de pão para os irmãos -->
      <path d="M0 620 Q300 540 680 660 T1200 680 V800 H0 Z" fill="url(#garden)"/>
      ${david(320, 500, 1.1, false)}
      <!-- Cesto com pães -->
      <g transform="translate(430 650)" filter="url(#softShadow)">
        <ellipse cx="0" cy="20" rx="36" ry="24" fill="#8C5528"/>
        <ellipse cx="-12" cy="5" rx="14" ry="10" fill="#E2B868"/>
        <ellipse cx="12" cy="5" rx="14" ry="10" fill="#DFB35A"/>
        <ellipse cx="0" cy="-5" rx="15" ry="10" fill="#FCEAB3"/>
      </g>
      <!-- Silhueta de Golias ao longe no vale -->
      ${giant(950, 480, 0.45)}
    `, 'Davi ouve a afronta de Golias e confia em Deus'),

    '04-davi-se-prepara.svg': svg(`
      <rect width="1200" height="800" fill="url(#daySky)"/>
      <circle cx="300" cy="140" r="120" fill="url(#sunGlow)"/>
      ${clouds()}
      <path d="M0 460 Q350 390 750 460 T1200 430 V800 H0 Z" fill="#6DA654"/>
      <!-- Riacho de águas límpidas -->
      <path d="M0 580 Q250 510 550 570 T1200 540 V800 H0 Z" fill="url(#hills)"/>
      <path d="M150 800 Q320 620 540 600 Q780 580 1050 800 Z" fill="url(#water)"/>
      <!-- Ondinhas brilhantes no riacho -->
      <path d="M380 640 Q450 630 520 645" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" fill="none" opacity=".8"/>
      <path d="M560 670 Q640 660 720 675" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" fill="none" opacity=".8"/>
      <!-- Cinco pedras lisas brilhando -->
      <g filter="url(#strongGlow)">
        <ellipse cx="440" cy="690" rx="16" ry="11" fill="#FFFFFF"/>
        <ellipse cx="480" cy="710" rx="18" ry="12" fill="#F0F4F8"/>
        <ellipse cx="530" cy="695" rx="17" ry="11" fill="#E2E8F0"/>
        <ellipse cx="580" cy="715" rx="19" ry="13" fill="#FFFFFF"/>
        <ellipse cx="630" cy="690" rx="16" ry="12" fill="#CBD5E1"/>
      </g>
      <!-- Davi escolhendo as pedras -->
      ${david(350, 490, 1.05, true)}
      ${oliveTree(950, 520, 0.9)}
    `, 'Davi escolhe cinco pedras lisas no riacho'),

    '05-vitoria-davi.svg': svg(`
      <rect width="1200" height="800" fill="url(#morningSky)"/>
      <circle cx="600" cy="220" r="340" fill="url(#divineLight)" opacity=".9"/>
      <!-- Raios de vitória -->
      <path d="M600 220 L300 0 L420 0 Z" fill="#FFF9D6" opacity=".35"/>
      <path d="M600 220 L780 0 L900 0 Z" fill="#FFF9D6" opacity=".35"/>
      <path d="M600 220 L1100 120 L1200 180 Z" fill="#FFF9D6" opacity=".3"/>
      <!-- Chão da batalha -->
      <path d="M0 560 Q350 490 750 560 T1200 530 V800 H0 Z" fill="url(#hills)"/>
      <path d="M0 640 Q400 580 800 660 T1200 630 V800 H0 Z" fill="url(#garden)"/>
      <!-- Golias caindo derrotado -->
      <g transform="translate(820 540) rotate(55)" filter="url(#softShadow)">
        ${giant(0, 0, 0.95)}
      </g>
      <!-- Trajetória da pedra luminosa -->
      <path d="M380 480 Q560 380 780 470" stroke="#FFC93C" stroke-width="8" stroke-dasharray="16 12" fill="none" filter="url(#strongGlow)"/>
      <!-- Davi vitorioso com a funda erguida -->
      ${david(320, 480, 1.25, true)}
      <!-- Coroa dourada prometida no céu -->
      <g transform="translate(600 150)" filter="url(#strongGlow)">
        <polygon points="-50,20 -40,-25 -15,0 0,-35 15,0 40,-25 50,20" fill="#FFC93C"/>
        <rect x="-48" y="20" width="96" height="14" rx="4" fill="#EBA317"/>
        <circle cx="0" cy="27" r="5" fill="#D64545"/>
        <circle cx="-25" cy="27" r="4" fill="#2E7D32"/>
        <circle cx="25" cy="27" r="4" fill="#1D4689"/>
      </g>
    `, 'A grande vitória de Davi sobre Golias'),
  };
}
