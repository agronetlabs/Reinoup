import { svg, clouds } from './shared.mjs';

export function getJonasGrandePeixeScenes() {
  const bigFish = (x, y, scale = 1, flip = false) => `
    <g transform="translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})" filter="url(#softShadow)">
      <!-- Corpo enorme e amigável do grande peixe -->
      <ellipse cx="0" cy="0" rx="160" ry="95" fill="#1D4689"/>
      <ellipse cx="20" cy="15" rx="130" ry="70" fill="#2C78BD"/>
      <ellipse cx="30" cy="35" rx="100" ry="45" fill="#68BDE7"/>
      <!-- Cauda poderosa -->
      <path d="M-130 0 L-220 -80 Q-180 0 -220 80 Z" fill="#1D4689"/>
      <!-- Nadadeiras -->
      <path d="M-40 40 Q-70 110 -20 120 Q0 80 -20 45" fill="#133E6E"/>
      <path d="M20 -80 Q40 -120 70 -85 Q50 -60 25 -70" fill="#133E6E"/>
      <!-- Olho grande, simpático e expressivo -->
      <circle cx="85" cy="-25" r="22" fill="#FFFFFF"/>
      <circle cx="92" cy="-25" r="12" fill="#14213D"/>
      <circle cx="96" cy="-29" r="4.5" fill="#FFFFFF"/>
      <!-- Sorriso gentil -->
      <path d="M80 15 Q115 35 140 10" stroke="#0B1830" stroke-width="7" stroke-linecap="round" fill="none"/>
      <!-- Jato de água espirrando do topo -->
      <g filter="url(#glow)">
        <path d="M60 -95 Q65 -150 45 -180" stroke="#BDEBFA" stroke-width="8" stroke-linecap="round" fill="none"/>
        <path d="M65 -95 Q90 -160 110 -175" stroke="#BDEBFA" stroke-width="7" stroke-linecap="round" fill="none"/>
        <circle cx="45" cy="-185" r="7" fill="#FFFFFF"/>
        <circle cx="110" cy="-180" r="7" fill="#FFFFFF"/>
      </g>
    </g>`;

  const jonah = (x, y, scale = 1, praying = false) => `
    <g transform="translate(${x} ${y}) scale(${scale})" filter="url(#softShadow)">
      <!-- Túnica simples -->
      <path d="M-30 30 Q0 5 30 30 L38 150 H-38 Z" fill="#D97736"/>
      <path d="M-22 40 Q0 60 22 40 L26 140 H-26 Z" fill="#F5E8D3"/>
      <!-- Cabeça de Jonas -->
      <circle cx="0" cy="-25" r="26" fill="#E8B084"/>
      <!-- Cabelo e barba castanho-escuro -->
      <path d="M-26 -28 C-26 -55 26 -55 26 -28 Z" fill="#4A260B"/>
      <path d="M-22 -10 Q0 45 22 -10 Q16 35 0 38 Q-16 35 -22 -10 Z" fill="#4A260B"/>
      <circle cx="-9" cy="-26" r="3.5" fill="#14213D"/>
      <circle cx="9" cy="-26" r="3.5" fill="#14213D"/>
      ${praying ? `
        <!-- Mãos postas em oração sincera -->
        <ellipse cx="0" cy="30" rx="14" ry="18" fill="#E8B084"/>
        <circle cx="0" cy="15" r="60" fill="#FFF8C5" opacity=".35" filter="url(#glow)"/>
      ` : `
        <!-- Braços abertos com surpresa e gratidão -->
        <path d="M-26 40 Q-55 15 -50 -10" stroke="#E8B084" stroke-width="14" stroke-linecap="round" fill="none"/>
        <path d="M26 40 Q55 15 50 -10" stroke="#E8B084" stroke-width="14" stroke-linecap="round" fill="none"/>
      `}
    </g>`;

  return {
    'cover.svg': svg(`
      <rect width="1200" height="800" fill="url(#daySky)"/>
      <circle cx="900" cy="160" r="140" fill="url(#sunGlow)"/>
      ${clouds()}
      <!-- Oceano aberto azul brilhante -->
      <path d="M0 450 Q300 400 650 460 T1200 430 V800 H0 Z" fill="url(#water)"/>
      <!-- Praia dourada onde Jonas está -->
      <path d="M0 620 Q350 540 700 630 T1200 600 V800 H0 Z" fill="url(#sandDune)"/>
      <!-- Grande peixe saltando amigável na água -->
      ${bigFish(780, 480, 1.25, true)}
      <!-- Jonas em terra firme, feliz e grato -->
      ${jonah(280, 520, 1.25, false)}
      <!-- Ondinhas quebrando suavemente na praia -->
      <path d="M0 640 Q250 610 500 635 T1000 625" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round" fill="none" opacity=".85"/>
    `, 'Jonas e o grande peixe na praia sob a bênção de Deus'),

    '01-fuga-jonas.svg': svg(`
      <rect width="1200" height="800" fill="url(#daySky)"/>
      <circle cx="280" cy="160" r="120" fill="url(#sunGlow)"/>
      ${clouds()}
      <!-- Porto de Jope -->
      <path d="M0 460 Q350 410 700 460 T1200 440 V800 H0 Z" fill="url(#water)"/>
      <!-- Cais de pedras antigas do porto -->
      <path d="M0 580 L480 580 L420 800 L0 800 Z" fill="#9C7844"/>
      <path d="M0 590 L460 590 L410 800 L0 800 Z" fill="#B8860B"/>
      <!-- Navio mercante atracado com grandes velas brancas -->
      <g transform="translate(820 490)" filter="url(#softShadow)">
        <!-- Casco do navio -->
        <path d="M-180 50 Q-220 0 -200 -20 L180 -20 Q220 0 160 50 Z" fill="#542B0D"/>
        <!-- Mastro principal -->
        <line x1="0" y1="50" x2="0" y2="-220" stroke="#381D06" stroke-width="14" stroke-linecap="round"/>
        <!-- Velas cheias ao vento -->
        <path d="M0 -200 Q120 -150 0 -60 Q80 -130 0 -200 Z" fill="#FFFDF0"/>
        <!-- Bandeira no mastro -->
        <polygon points="0,-220 50,-205 0,-190" fill="#FF7A29"/>
      </g>
      <!-- Jonas embarcando apressado para fugir -->
      ${jonah(360, 510, 1.15, false)}
    `, 'Jonas tenta fugir de Deus embarcando em um navio'),

    '02-tempestade-mar.svg': svg(`
      <rect width="1200" height="800" fill="url(#stormSky)"/>
      <!-- Raios na tempestade -->
      <path d="M380 0 L340 150 L390 180 L320 340" stroke="#FFF7A6" stroke-width="8" fill="none" filter="url(#strongGlow)"/>
      <path d="M850 0 L810 130 L860 150 L800 300" stroke="#FFF7A6" stroke-width="7" fill="none" filter="url(#strongGlow)"/>
      <!-- Ondas revoltas gigantescas -->
      <path d="M0 480 Q250 350 500 490 T1000 440 Q1120 370 1200 460 V800 H0 Z" fill="#0E2847"/>
      <path d="M0 560 Q200 440 450 570 T950 520 Q1100 450 1200 540 V800 H0 Z" fill="#1B426E"/>
      <!-- Barco balançando quase virando nas ondas -->
      <g transform="translate(560 490) rotate(-22)" filter="url(#softShadow)">
        <path d="M-150 40 Q-180 0 -160 -20 L150 -20 Q180 0 140 40 Z" fill="#542B0D"/>
        <line x1="0" y1="40" x2="0" y2="-180" stroke="#381D06" stroke-width="12"/>
        <path d="M0 -160 Q80 -120 0 -40 Z" fill="#FFFDF0" opacity=".85"/>
      </g>
      <!-- Jonas caindo no mar tempestuoso -->
      <g transform="translate(860 560) rotate(45)">
        ${jonah(0, 0, 0.9, false)}
      </g>
      <!-- Espuma branca das vagas -->
      <path d="M0 640 Q250 550 500 640 T1000 610" stroke="#FFFFFF" stroke-width="12" stroke-linecap="round" fill="none" opacity=".85"/>
    `, 'A grande tempestade e Jonas lançado ao mar'),

    '03-dentro-peixe.svg': svg(`
      <rect width="1200" height="800" fill="url(#oceanDeep)"/>
      <!-- Bolhas luminosas no fundo do mar -->
      ${Array.from({ length: 30 }, (_, i) => {
        const cx = (i * 47 + 23) % 1200;
        const cy = (i * 31 + 45) % 750;
        const r = 6 + (i % 5) * 4;
        return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#68BDE7" opacity=".45" filter="url(#glow)"/>`;
      }).join('')}
      <!-- Corais coloridos no leito do oceano -->
      <path d="M120 800 Q150 680 180 720 Q210 650 250 800 Z" fill="#FF7A29"/>
      <path d="M950 800 Q980 670 1020 710 Q1050 640 1090 800 Z" fill="#FFC93C"/>
      <!-- O grande peixe nadando com tranquilidade no fundo -->
      ${bigFish(600, 420, 1.85, false)}
      <!-- Jonas em oração protegido dentro do peixe -->
      <g transform="translate(620 420)" filter="url(#strongGlow)">
        <ellipse cx="0" cy="0" rx="75" ry="90" fill="#FFFDE0" opacity=".35"/>
        ${jonah(0, 10, 0.95, true)}
      </g>
    `, 'Jonas protegido dentro do grande peixe orando a Deus'),

    '04-segunda-chance.svg': svg(`
      <rect width="1200" height="800" fill="url(#morningSky)"/>
      <circle cx="600" cy="180" r="280" fill="url(#divineLight)" opacity=".85"/>
      ${clouds()}
      <path d="M0 480 Q350 430 700 480 T1200 460 V800 H0 Z" fill="url(#water)"/>
      <path d="M0 600 Q400 540 800 620 T1200 590 V800 H0 Z" fill="url(#sandDune)"/>
      <!-- Grande peixe deixando Jonas na praia firme -->
      ${bigFish(860, 560, 1.35, true)}
      <!-- Jonas na areia, salvo e recebendo a nova chance -->
      ${jonah(360, 510, 1.3, false)}
      <!-- Conchas e estrelas do mar na areia -->
      <circle cx="200" cy="680" r="8" fill="#FF7A29"/>
      <circle cx="260" cy="710" r="10" fill="#FFC93C"/>
    `, 'O grande peixe deixa Jonas na praia e Deus dá uma segunda chance'),

    '05-ninive-arrepende.svg': svg(`
      <rect width="1200" height="800" fill="url(#sunsetSky)"/>
      <circle cx="250" cy="200" r="140" fill="url(#sunGlow)"/>
      <!-- Colina com a cidade de Nínive ao longe -->
      <polygon points="400,520 700,320 1000,520" fill="#8C5828"/>
      <!-- Muralhas e cúpulas de Nínive em paz -->
      <rect x="520" y="380" width="360" height="140" rx="6" fill="#DDA876"/>
      <circle cx="600" cy="380" r="35" fill="#FFD700"/>
      <circle cx="800" cy="380" r="35" fill="#FFD700"/>
      <!-- Colina onde Jonas se senta -->
      <path d="M0 580 Q350 510 750 590 T1200 570 V800 H0 Z" fill="url(#hills)"/>
      <!-- A planta milagrosa com folhas largas dando sombra -->
      <g transform="translate(380 480)" filter="url(#softShadow)">
        <path d="M-60 140 Q-20 60 0 0 Q20 60 60 140" stroke="#2F7B45" stroke-width="18" fill="none" stroke-linecap="round"/>
        <ellipse cx="-45" cy="15" rx="55" ry="32" fill="#52C41A" transform="rotate(-30 -45 15)"/>
        <ellipse cx="45" cy="15" rx="55" ry="32" fill="#73D13D" transform="rotate(30 45 15)"/>
        <ellipse cx="0" cy="-35" rx="60" ry="35" fill="#52C41A"/>
      </g>
      <!-- Jonas descansando na sombra compreendendo a misericórdia -->
      ${jonah(380, 520, 1.25, true)}
    `, 'Nínive se arrepende e Deus ensina a Jonas sobre a Sua misericórdia'),
  };
}
