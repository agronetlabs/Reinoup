import { svg, clouds } from './shared.mjs';

export function getMoisesMarVermelhoScenes() {
  const moses = (x, y, scale = 1, staffUp = true) => `
    <g transform="translate(${x} ${y}) scale(${scale})" filter="url(#softShadow)">
      <!-- Túnica e manto do líder -->
      <path d="M-36 30 Q0 0 36 30 L45 160 H-45 Z" fill="#9C3D28"/>
      <path d="M-28 40 Q0 60 28 40 L35 150 H-35 Z" fill="#FFF5E0"/>
      <!-- Faixa na cintura -->
      <rect x="-32" y="80" width="64" height="14" rx="4" fill="#6F3F19"/>
      <!-- Cabeça de Moisés com barba branca/grisalha -->
      <circle cx="0" cy="-30" r="28" fill="#E8B084"/>
      <path d="M-25 -15 Q0 60 25 -15 Q20 45 0 50 Q-20 45 -25 -15 Z" fill="#EDEDED"/>
      <circle cx="-10" cy="-32" r="4" fill="#14213D"/>
      <circle cx="10" cy="-32" r="4" fill="#14213D"/>
      <!-- Braço e Cajado -->
      ${staffUp ? `
        <path d="M25 40 Q55 -10 65 -50" stroke="#E8B084" stroke-width="16" stroke-linecap="round" fill="none"/>
        <!-- Cajado estendido aos céus -->
        <path d="M65 -130 L65 190" stroke="#7A4D27" stroke-width="12" stroke-linecap="round"/>
        <!-- Brilho no topo do cajado -->
        <circle cx="65" cy="-130" r="16" fill="#FFF8C5" filter="url(#strongGlow)"/>
      ` : `
        <path d="M25 40 Q45 70 40 100" stroke="#E8B084" stroke-width="16" stroke-linecap="round" fill="none"/>
        <path d="M40 0 L40 190" stroke="#7A4D27" stroke-width="12" stroke-linecap="round"/>
      `}
    </g>`;

  const firePillar = (x, y, scale = 1) => `
    <g transform="translate(${x} ${y}) scale(${scale})" filter="url(#strongGlow)">
      <!-- Coluna de Fogo brilhante -->
      <path d="M-35 300 Q-70 150 -20 0 Q20 -100 0 -250 Q60 -100 20 0 Q70 150 35 300 Z" fill="url(#fireCol)" opacity=".95"/>
      <path d="M-20 280 Q-40 140 -10 0 Q10 -80 0 -200 Q40 -80 10 0 Q40 140 20 280 Z" fill="#FFE58F" opacity=".9"/>
      <circle cx="0" cy="-50" r="40" fill="#FFFFFF" filter="url(#glow)"/>
    </g>`;

  return {
    'cover.svg': svg(`
      <rect width="1200" height="800" fill="url(#sunsetSky)"/>
      ${firePillar(600, 280, 0.95)}
      <!-- Muralhas do Mar Vermelho abertas -->
      <path d="M0 0 L260 0 L200 800 L0 800 Z" fill="url(#seaWall)"/>
      <path d="M940 0 L1200 0 L1200 800 L1000 800 Z" fill="url(#seaWall)"/>
      <!-- Ondas e espuma nas paredes de água -->
      <path d="M240 60 Q210 200 230 400 T210 750" stroke="#FFFFFF" stroke-width="12" stroke-linecap="round" fill="none" opacity=".85"/>
      <path d="M960 60 Q990 200 970 400 T990 750" stroke="#FFFFFF" stroke-width="12" stroke-linecap="round" fill="none" opacity=".85"/>
      <!-- Peixes visíveis nas paredes de água límpida -->
      <ellipse cx="140" cy="320" rx="28" ry="14" fill="#FFA45C" opacity=".8"/>
      <polygon points="115,320 95,305 95,335" fill="#FFA45C" opacity=".8"/>
      <ellipse cx="1060" cy="280" rx="30" ry="15" fill="#FFC93C" opacity=".8"/>
      <polygon points="1085,280 1105,265 1105,295" fill="#FFC93C" opacity=".8"/>
      <!-- Caminho de terra seca no meio -->
      <polygon points="260,0 940,0 1000,800 200,800" fill="url(#desert)"/>
      <!-- Moisés no rochedo com cajado erguido -->
      <path d="M380 800 Q480 620 600 620 Q720 620 820 800 Z" fill="#6B4826"/>
      ${moses(600, 480, 1.35, true)}
    `, 'Moisés ergue o cajado e o Mar Vermelho se abre'),

    '01-bebe-cesto.svg': svg(`
      <rect width="1200" height="800" fill="url(#daySky)"/>
      <circle cx="950" cy="150" r="120" fill="url(#sunGlow)"/>
      ${clouds()}
      <!-- Rio Nilo calmo -->
      <path d="M0 400 Q400 350 800 410 T1200 390 V800 H0 Z" fill="url(#water)"/>
      <!-- Juncos e papiros verdes -->
      ${Array.from({ length: 18 }, (_, i) => {
        const x = 40 + i * 45;
        const h = 260 + (i % 5) * 40;
        return `<path d="M${x} 680 Q${x + (i % 2 ? 20 : -20)} ${680 - h / 2} ${x} ${680 - h}" stroke="#2F7B45" stroke-width="14" stroke-linecap="round" fill="none"/>`;
      }).join('')}
      <!-- Flor de lótus flutuando -->
      <circle cx="260" cy="580" r="14" fill="#FF85C0"/>
      <circle cx="340" cy="620" r="16" fill="#FFFFFF"/>
      <!-- Cesto impermeabilizado com piche -->
      <g transform="translate(480 560)" filter="url(#softShadow)">
        <ellipse cx="0" cy="30" rx="90" ry="45" fill="#8C5828"/>
        <ellipse cx="0" cy="20" rx="78" ry="36" fill="#DDA876"/>
        <!-- Bebê Moisés enroladinho em panos brancos -->
        <ellipse cx="0" cy="15" rx="50" ry="24" fill="#FFFFFF"/>
        <circle cx="28" cy="8" r="16" fill="#E8B084"/>
        <circle cx="32" cy="6" r="2.5" fill="#14213D"/>
      </g>
      <!-- Princesa egípcia encontrando o bebê com ternura -->
      <g transform="translate(760 480)" filter="url(#softShadow)">
        <path d="M-35 40 Q0 10 35 40 L45 190 H-45 Z" fill="#FFFFFF"/>
        <ellipse cx="0" cy="25" rx="28" ry="12" fill="#FFD700"/>
        <circle cx="0" cy="-30" r="28" fill="#DDA876"/>
        <!-- Cabelo preto com tiara de ouro -->
        <path d="M-30 -32 C-30 -65 30 -65 30 -32 L34 20 L24 20 L20 -32 C10 -50 -10 -50 -20 -32 L-24 20 L-34 20 Z" fill="#14213D"/>
        <rect x="-24" y="-48" width="48" height="8" rx="2" fill="#FFD700"/>
        <!-- Braços estendidos com carinho -->
        <path d="M-30 45 Q-70 60 -110 50" stroke="#DDA876" stroke-width="14" stroke-linecap="round" fill="none"/>
      </g>
    `, 'O bebê Moisés é encontrado no cesto às margens do Nilo'),

    '02-sarca-ardente.svg': svg(`
      <rect width="1200" height="800" fill="url(#sunsetSky)"/>
      <!-- Monte Horeb / Sinai com rochas imponentes -->
      <polygon points="100,560 380,240 660,560" fill="#6B4826"/>
      <polygon points="500,580 820,280 1140,580" fill="#543317"/>
      <path d="M0 550 Q400 480 800 550 T1200 520 V800 H0 Z" fill="url(#desert)"/>
      <!-- A Sarça Ardente queimando sem se queimar -->
      <g transform="translate(780 460)" filter="url(#strongGlow)">
        <!-- Galhos da sarça -->
        <path d="M0 90 L-40 0 L-20 -70 M0 90 L40 -10 L25 -80 M0 90 L0 -90" stroke="#4A260B" stroke-width="14" stroke-linecap="round"/>
        <!-- Labaredas de fogo divino -->
        <path d="M-80 60 Q-120 -40 -30 -120 Q0 -160 30 -120 Q120 -40 80 60 Q0 100 -80 60 Z" fill="url(#fireCol)" opacity=".95"/>
        <circle cx="0" cy="-30" r="60" fill="#FFF9D6" filter="url(#glow)"/>
      </g>
      <!-- Moisés tirando as sandálias e ajoelhado -->
      <g transform="translate(380 500)" filter="url(#softShadow)">
        ${moses(0, 0, 1.15, false)}
        <!-- Sandálias deixadas no chão -->
        <ellipse cx="-45" cy="180" rx="14" ry="6" fill="#4A260B"/>
        <ellipse cx="-20" cy="185" rx="14" ry="6" fill="#4A260B"/>
      </g>
    `, 'Deus chama Moisés na sarça que ardia sem se queimar'),

    '03-deixe-meu-povo-ir.svg': svg(`
      <rect width="1200" height="800" fill="url(#palaceWall)"/>
      <!-- Salão do Faraó com grandes colunas egípcias -->
      <rect x="120" y="160" width="80" height="500" rx="8" fill="#D4AF37"/>
      <rect x="1000" y="160" width="80" height="500" rx="8" fill="#D4AF37"/>
      <!-- Trono elevado do Faraó -->
      <g transform="translate(850 420)" filter="url(#softShadow)">
        <polygon points="-80,200 80,200 60,-40 -60,-40" fill="#B8860B"/>
        <rect x="-70" y="-80" width="140" height="40" rx="8" fill="#FFD700"/>
        <!-- Faraó no trono -->
        <path d="M-40 40 L40 40 L30 180 H-30 Z" fill="#FFFFFF"/>
        <circle cx="0" cy="-20" r="30" fill="#DDA876"/>
        <!-- Coroa Nemes egípcia com serpente de ouro -->
        <path d="M-36 -25 C-36 -65 36 -65 36 -25 L45 20 L28 20 L24 -25 C15 -45 -15 -45 -24 -25 L-28 20 L-45 20 Z" fill="#1890FF"/>
        <rect x="-2" y="-60" width="6" height="18" fill="#FFD700"/>
      </g>
      <!-- Moisés e Arão firmes diante do Faraó -->
      ${moses(420, 450, 1.35, true)}
      <g transform="translate(290 470)" filter="url(#softShadow)">
        <path d="M-32 30 Q0 5 32 30 L40 160 H-40 Z" fill="#3B7080"/>
        <circle cx="0" cy="-25" r="26" fill="#E8B084"/>
        <path d="M-20 -15 Q0 45 20 -15 Z" fill="#D9D9D9"/>
      </g>
    `, 'Moisés e Arão dizem ao Faraó: "Deixe meu povo ir"'),

    '04-entre-mar-exercito.svg': svg(`
      <rect width="1200" height="800" fill="url(#sunsetSky)"/>
      ${firePillar(580, 240, 1.15)}
      <!-- Mar à esquerda e à frente -->
      <path d="M0 450 Q300 400 600 470 T1200 430 V800 H0 Z" fill="url(#water)"/>
      <!-- Praia onde o povo acampa -->
      <path d="M0 580 Q400 520 800 590 T1200 560 V800 H0 Z" fill="url(#sandDune)"/>
      <!-- Carruagens do Faraó impedidas pela coluna de fogo -->
      <g transform="translate(1000 540)" filter="url(#softShadow)">
        <circle cx="0" cy="40" r="28" fill="#B8860B"/>
        <rect x="-40" y="0" width="60" height="35" rx="4" fill="#8C5828"/>
        <!-- Silhueta dos cavalos e poeira -->
        <ellipse cx="70" cy="20" rx="35" ry="24" fill="#6F3F19"/>
      </g>
      <!-- Moisés encorajando o povo -->
      ${moses(320, 500, 1.25, true)}
      <!-- Tendas de Israel protegidas -->
      <polygon points="120,620 180,540 240,620" fill="#FFF7E3"/>
    `, 'Deus protege Seu povo com a coluna de nuvem e fogo'),

    '05-mar-se-abre.svg': svg(`
      <rect width="1200" height="800" fill="url(#daySky)"/>
      <circle cx="600" cy="120" r="160" fill="url(#sunGlow)"/>
      <!-- Muralhas gigantescas do mar aberto -->
      <path d="M0 0 L240 0 L180 800 L0 800 Z" fill="url(#seaWall)"/>
      <path d="M960 0 L1200 0 L1200 800 L1020 800 Z" fill="url(#seaWall)"/>
      <!-- Borrifos e cristas de água -->
      <path d="M220 50 Q180 250 200 500 T190 750" stroke="#FFFFFF" stroke-width="12" stroke-linecap="round" fill="none" opacity=".9"/>
      <path d="M980 50 Q1020 250 1000 500 T1010 750" stroke="#FFFFFF" stroke-width="12" stroke-linecap="round" fill="none" opacity=".9"/>
      <!-- Chão seco com conchas -->
      <polygon points="240,0 960,0 1020,800 180,800" fill="url(#desert)"/>
      <!-- Povo atravessando com cânticos de alegria -->
      <g transform="translate(600 480)">
        ${moses(0, 0, 1.35, true)}
        <!-- Famílias caminhando à frente com alegria -->
        <g transform="translate(-180 40)">
          <path d="M-20 20 L20 20 L15 90 H-15 Z" fill="#FF7A29"/>
          <circle cx="0" cy="-10" r="18" fill="#E8B084"/>
        </g>
        <g transform="translate(180 30)">
          <path d="M-20 20 L20 20 L15 90 H-15 Z" fill="#2E7D32"/>
          <circle cx="0" cy="-10" r="18" fill="#E8B084"/>
          <!-- Tamborim de Miriam -->
          <circle cx="28" cy="15" r="12" fill="#FFD700"/>
        </g>
      </g>
    `, 'O povo de Israel atravessa o mar a pé enxuto'),
  };
}
