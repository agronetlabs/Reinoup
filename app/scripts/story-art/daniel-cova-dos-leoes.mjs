import { svg, stars } from './shared.mjs';

export function getDanielCovaDosLeoesScenes() {
  const lion = (x, y, scale = 1, flip = false, sleeping = false) => `
    <g transform="translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})" filter="url(#softShadow)">
      <!-- Corpo do leão -->
      <ellipse cx="0" cy="40" rx="90" ry="52" fill="#EBA317"/>
      <!-- Patas dianteiras e traseiras -->
      ${sleeping ? `
        <ellipse cx="70" cy="70" rx="35" ry="16" fill="#D99A3D"/>
        <ellipse cx="-60" cy="70" rx="32" ry="16" fill="#D99A3D"/>
      ` : `
        <path d="M-55 70 v50 M-25 70 v50 M35 70 v50 M65 70 v50" stroke="#D99A3D" stroke-width="22" stroke-linecap="round"/>
      `}
      <!-- Cauda com tufo -->
      <path d="M-85 30 Q-130 10 -140 -20" stroke="#D99A3D" stroke-width="10" fill="none" stroke-linecap="round"/>
      <ellipse cx="-140" cy="-22" rx="14" ry="10" fill="#8C5528"/>
      <!-- Juba farta e majestosa -->
      <circle cx="55" cy="5" r="68" fill="#B96D25"/>
      <circle cx="55" cy="5" r="54" fill="#C97D2D"/>
      <!-- Rosto do leão -->
      <circle cx="65" cy="8" r="42" fill="#EBA317"/>
      <!-- Orelhas -->
      <circle cx="45" cy="-25" r="14" fill="#B96D25"/>
      <circle cx="85" cy="-25" r="14" fill="#B96D25"/>
      <!-- Olhos mansos -->
      ${sleeping ? `
        <path d="M52 5 Q60 15 68 5" stroke="#14213D" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <path d="M78 5 Q86 15 94 5" stroke="#14213D" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      ` : `
        <circle cx="60" cy="5" r="5" fill="#14213D"/>
        <circle cx="85" cy="5" r="5" fill="#14213D"/>
      `}
      <!-- Focinho e boca fechada e mansa -->
      <polygon points="72,16 66,24 78,24" fill="#7A4D27"/>
      <path d="M66 28 Q72 34 78 28" stroke="#7A4D27" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    </g>`;

  const daniel = (x, y, scale = 1, praying = true) => `
    <g transform="translate(${x} ${y}) scale(${scale})" filter="url(#softShadow)">
      <!-- Túnica nobre azul e branca -->
      <path d="M-32 30 Q0 5 32 30 L40 160 H-40 Z" fill="#1D4689"/>
      <path d="M-24 40 Q0 60 24 40 L30 150 H-30 Z" fill="#FFFFFF"/>
      <rect x="-28" y="80" width="56" height="12" rx="4" fill="#FFD700"/>
      <!-- Cabeça de Daniel -->
      <circle cx="0" cy="-28" r="28" fill="#E8B084"/>
      <!-- Barba grisalha e sábia -->
      <path d="M-25 -14 Q0 52 25 -14 Q18 40 0 45 Q-18 40 -25 -14 Z" fill="#D9D9D9"/>
      <circle cx="-10" cy="-30" r="4" fill="#14213D"/>
      <circle cx="10" cy="-30" r="4" fill="#14213D"/>
      <!-- Olhar sereno e confiante -->
      <path d="M-6 -18 Q0 -12 6 -18" stroke="#7A3918" stroke-width="3" fill="none" stroke-linecap="round"/>
      ${praying ? `
        <!-- Mãos em oração devota -->
        <ellipse cx="0" cy="35" rx="14" ry="18" fill="#E8B084"/>
        <circle cx="0" cy="20" r="65" fill="#FFF8C5" opacity=".35" filter="url(#strongGlow)"/>
      ` : `
        <path d="M-26 40 Q-50 70 -45 100" stroke="#E8B084" stroke-width="14" stroke-linecap="round" fill="none"/>
        <path d="M26 40 Q50 70 45 100" stroke="#E8B084" stroke-width="14" stroke-linecap="round" fill="none"/>
      `}
    </g>`;

  const angel = (x, y, scale = 1) => `
    <g transform="translate(${x} ${y}) scale(${scale})" filter="url(#strongGlow)">
      <!-- Aura de luz radiante -->
      <circle cx="0" cy="20" r="140" fill="url(#angelGlow)" opacity=".8"/>
      <!-- Asas celestiais abertas -->
      <path d="M0 20 Q-120 -80 -140 -20 Q-120 40 0 40" fill="#FFFFFF" opacity=".95"/>
      <path d="M0 20 Q120 -80 140 -20 Q120 40 0 40" fill="#FFFFFF" opacity=".95"/>
      <!-- Manto brilhante -->
      <path d="M-35 40 Q0 10 35 40 L50 180 H-50 Z" fill="#FFFFFF"/>
      <path d="M-20 40 L0 180 L20 40 Z" fill="#FFF8C5" opacity=".7"/>
      <!-- Auréola e cabeça -->
      <ellipse cx="0" cy="-55" rx="32" ry="10" fill="none" stroke="#FFD700" stroke-width="6"/>
      <circle cx="0" cy="-25" r="26" fill="#FCEAB3"/>
      <!-- Braços abertos protegendo os leões -->
      <path d="M-30 45 Q-75 30 -110 50" stroke="#FFFFFF" stroke-width="14" stroke-linecap="round" fill="none"/>
      <path d="M30 45 Q75 30 110 50" stroke="#FFFFFF" stroke-width="14" stroke-linecap="round" fill="none"/>
    </g>`;

  return {
    'cover.svg': svg(`
      <rect width="1200" height="800" fill="url(#stoneDen)"/>
      <!-- Abertura circular no teto da cova com luz divina descendo -->
      <ellipse cx="600" cy="60" rx="140" ry="35" fill="#FFFDE0" filter="url(#strongGlow)"/>
      <polygon points="460,60 740,60 920,800 280,800" fill="#FFFDE0" opacity=".22"/>
      <!-- Paredes de rocha talhada -->
      <path d="M0 0 L260 0 L180 800 L0 800 Z" fill="#182332"/>
      <path d="M940 0 L1200 0 L1200 800 L1020 800 Z" fill="#182332"/>
      <!-- Daniel em oração serena no centro iluminado -->
      ${daniel(600, 480, 1.25, true)}
      <!-- Anjo do Senhor velando ao lado -->
      ${angel(600, 240, 1.15)}
      <!-- Leões mansos descansando com boca fechada -->
      ${lion(320, 620, 1.1, false, true)}
      ${lion(880, 620, 1.1, true, false)}
    `, 'Daniel na cova dos leões protegido pelo anjo de Deus'),

    '01-servo-fiel.svg': svg(`
      <rect width="1200" height="800" fill="url(#morningSky)"/>
      <!-- Aposento superior em Babilônia -->
      <rect width="1200" height="800" fill="url(#palaceWall)"/>
      <!-- Janela aberta em arco voltada para Jerusalém ao nascer do dia -->
      <g filter="url(#strongGlow)">
        <path d="M400 120 C400 30 800 30 800 120 L800 520 L400 520 Z" fill="url(#morningSky)"/>
        <!-- Sol nascendo ao longe na janela -->
        <circle cx="600" cy="320" r="70" fill="#FFC93C"/>
        <!-- Moldura de pedra da janela -->
        <path d="M380 120 C380 10 820 10 820 120 L820 540 L380 540 Z" fill="none" stroke="#8C5828" stroke-width="26"/>
      </g>
      <!-- Mesa com pergaminho sagrado -->
      <g transform="translate(240 560)" filter="url(#softShadow)">
        <rect x="-60" y="40" width="120" height="18" fill="#542B0D"/>
        <path d="M-45 58 v80 M45 58 v80" stroke="#542B0D" stroke-width="14"/>
        <rect x="-40" y="20" width="80" height="20" rx="4" fill="#FFF8DC"/>
      </g>
      <!-- Daniel ajoelhado em oração sincera a Deus -->
      ${daniel(600, 470, 1.35, true)}
    `, 'Daniel ora a Deus três vezes ao dia junto à janela aberta'),

    '02-inveja-lideres.svg': svg(`
      <rect width="1200" height="800" fill="url(#palaceWall)"/>
      <!-- Colunata do palácio persa -->
      <rect x="180" y="160" width="80" height="500" rx="6" fill="#B8860B"/>
      <rect x="560" y="160" width="80" height="500" rx="6" fill="#B8860B"/>
      <rect x="940" y="160" width="80" height="500" rx="6" fill="#B8860B"/>
      <!-- Líderes invejosos cochichando nas sombras -->
      <g transform="translate(360 480)" filter="url(#softShadow)">
        <path d="M-30 40 L30 40 L25 160 H-25 Z" fill="#4A260B"/>
        <circle cx="0" cy="-20" r="26" fill="#DDA876"/>
        <!-- Turbante suntuoso -->
        <ellipse cx="0" cy="-35" rx="30" ry="14" fill="#722ED1"/>
      </g>
      <g transform="translate(450 490)" filter="url(#softShadow)">
        <path d="M-30 40 L30 40 L25 160 H-25 Z" fill="#6F3F19"/>
        <circle cx="0" cy="-20" r="26" fill="#DDA876"/>
        <ellipse cx="0" cy="-35" rx="30" ry="14" fill="#135200"/>
      </g>
      <!-- Daniel fiel trabalhando com retidão e sabedoria -->
      <g transform="translate(800 460)">
        ${daniel(0, 0, 1.25, false)}
      </g>
    `, 'Os líderes tramam contra Daniel por causa de sua fidelidade'),

    '03-lei-armadilha.svg': svg(`
      <rect width="1200" height="800" fill="url(#nightSky)"/>
      ${stars(30, 350)}
      <!-- Salão real com decreto -->
      <rect x="0" y="420" width="1200" height="380" fill="url(#palaceWall)"/>
      <!-- Mesa do trono com o decreto de 30 dias -->
      <g transform="translate(600 500)" filter="url(#softShadow)">
        <rect x="-180" y="30" width="360" height="24" fill="#542B0D"/>
        <!-- Rolo de decreto estendido -->
        <rect x="-120" y="0" width="240" height="30" rx="4" fill="#FFF8DC"/>
        <!-- Selo real de cera vermelha -->
        <circle cx="30" cy="15" r="14" fill="#D64545" filter="url(#glow)"/>
        <!-- Rei Dario com anel-selo preocupado -->
        <g transform="translate(-50 -60)">
          <path d="M-35 40 L35 40 L30 160 H-30 Z" fill="#722ED1"/>
          <circle cx="0" cy="-25" r="28" fill="#DDA876"/>
          <!-- Coroa real de ouro -->
          <polygon points="-25,-40 -20,-65 -5,-48 0,-68 5,-48 20,-65 25,-40" fill="#FFD700"/>
        </g>
      </g>
    `, 'O rei assina a lei que proíbe orar a Deus'),

    '04-cova-leoes.svg': svg(`
      <rect width="1200" height="800" fill="url(#stoneDen)"/>
      <!-- Cova fechada com a grande pedra na entrada -->
      <ellipse cx="600" cy="60" rx="150" ry="40" fill="#4B5A6E"/>
      <ellipse cx="600" cy="60" rx="120" ry="25" fill="#283547"/>
      <!-- Leões ao redor na escuridão -->
      ${lion(280, 580, 1.25, false, false)}
      ${lion(920, 580, 1.25, true, false)}
      <!-- Daniel firme e calmo confiando no Senhor -->
      ${daniel(600, 480, 1.35, true)}
    `, 'Daniel na cova dos leões durante a noite'),

    '05-anjo-fecha-boca.svg': svg(`
      <rect width="1200" height="800" fill="url(#stoneDen)"/>
      <!-- Luz do amanhecer invadindo a cova aberta -->
      <polygon points="450,0 750,0 1050,800 150,800" fill="#FFFDE0" opacity=".35"/>
      <ellipse cx="600" cy="50" rx="160" ry="40" fill="#FFF8C5" filter="url(#strongGlow)"/>
      <!-- Anjo do Senhor fechando a boca dos leões -->
      ${angel(600, 260, 1.35)}
      <!-- Leões mansos como cordeiros -->
      ${lion(280, 620, 1.15, false, true)}
      ${lion(920, 620, 1.15, true, true)}
      <!-- Daniel vitorioso e ileso -->
      ${daniel(600, 510, 1.25, false)}
    `, 'Deus envia Seu anjo e fecha a boca dos leões'),
  };
}
