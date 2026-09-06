import { svg, clouds, sheep } from './shared.mjs';

export function getArcaDeNoeScenes() {
  const ark = (x, y, scale = 1) => `
    <g transform="translate(${x} ${y}) scale(${scale})" filter="url(#softShadow)">
      <!-- Casco inferior de madeira escura -->
      <path d="M-220 50 Q-260 0 -240 -30 L240 -30 Q260 0 220 50 C160 110 -160 110 -220 50 Z" fill="url(#woodArk)"/>
      <!-- Linhas de tábuas de gôfer -->
      <path d="M-230 -10 C-150 15 150 15 230 -10" stroke="#381D06" stroke-width="5" fill="none"/>
      <path d="M-210 20 C-140 45 140 45 210 20" stroke="#381D06" stroke-width="5" fill="none"/>
      <path d="M-180 50 C-120 70 120 70 180 50" stroke="#381D06" stroke-width="5" fill="none"/>
      <!-- Cabine superior / convés -->
      <rect x="-180" y="-105" width="360" height="75" rx="6" fill="#7A441B"/>
      <!-- Telhado inclinado -->
      <polygon points="-200,-100 0,-145 200,-100" fill="#542B0D"/>
      <!-- Janelas da arca com luz dourada -->
      ${Array.from({ length: 8 }, (_, i) => `
        <rect x="${-150 + i * 40}" y="-85" width="22" height="26" rx="4" fill="#FFE58F" filter="url(#glow)"/>
        <line x1="${-139 + i * 40}" y1="-85" x2="${-139 + i * 40}" y2="-59" stroke="#542B0D" stroke-width="3"/>
        <line x1="${-150 + i * 40}" y1="-72" x2="${-128 + i * 40}" y2="-72" stroke="#542B0D" stroke-width="3"/>
      `).join('')}
      <!-- Girafa simpática espiando por uma janela -->
      <path d="M102 -75 v-40" stroke="#DF9B38" stroke-width="12" stroke-linecap="round"/>
      <circle cx="102" cy="-120" r="10" fill="#DF9B38"/>
      <circle cx="100" cy="-122" r="2.5" fill="#14213D"/>
      <!-- Passarinhos no telhado -->
      <circle cx="-60" cy="-148" r="6" fill="#FFFFFF"/>
      <circle cx="-45" cy="-146" r="6" fill="#FFFFFF"/>
    </g>`;

  const rainbow = (x = 600, y = 350, r = 420) => `
    <g opacity=".88" filter="url(#glow)">
      <circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#FF4D4D" stroke-width="14" opacity=".85"/>
      <circle cx="${x}" cy="${y}" r="${r - 14}" fill="none" stroke="#FFA45C" stroke-width="14" opacity=".85"/>
      <circle cx="${x}" cy="${y}" r="${r - 28}" fill="none" stroke="#FFD700" stroke-width="14" opacity=".9"/>
      <circle cx="${x}" cy="${y}" r="${r - 42}" fill="none" stroke="#52C41A" stroke-width="14" opacity=".85"/>
      <circle cx="${x}" cy="${y}" r="${r - 56}" fill="none" stroke="#1890FF" stroke-width="14" opacity=".85"/>
      <circle cx="${x}" cy="${y}" r="${r - 70}" fill="none" stroke="#722ED1" stroke-width="14" opacity=".8"/>
    </g>`;

  const dove = (x, y, scale = 1, flip = false) => `
    <g transform="translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})" filter="url(#glow)">
      <!-- Asas brancas abertas -->
      <path d="M0 0 Q-40 -50 10 -60 Q20 -30 0 0" fill="#FFFFFF"/>
      <path d="M-10 -5 Q-30 -35 15 -45" fill="#F0F5FA"/>
      <!-- Corpo da pomba -->
      <ellipse cx="10" cy="0" rx="28" ry="16" fill="#FFFFFF"/>
      <!-- Cauda -->
      <polygon points="-15,0 -40,-12 -42,12" fill="#FFFFFF"/>
      <!-- Cabeça -->
      <circle cx="32" cy="-6" r="12" fill="#FFFFFF"/>
      <circle cx="36" cy="-8" r="2.5" fill="#14213D"/>
      <!-- Bico -->
      <polygon points="42,-7 52,-4 42,-1" fill="#FFA45C"/>
      <!-- Ramo verde de oliveira no bico -->
      <path d="M48 -3 Q65 10 75 0" stroke="#2F7B45" stroke-width="3" fill="none"/>
      <ellipse cx="58" cy="4" rx="6" ry="3" fill="#52C41A" transform="rotate(30 58 4)"/>
      <ellipse cx="68" cy="2" rx="6" ry="3" fill="#52C41A" transform="rotate(-20 68 2)"/>
    </g>`;

  const noah = (x, y, scale = 1) => `
    <g transform="translate(${x} ${y}) scale(${scale})" filter="url(#softShadow)">
      <!-- Túnica marrom e manto creme -->
      <path d="M-35 40 Q0 10 35 40 L42 160 H-42 Z" fill="#F5E8D3"/>
      <path d="M-25 50 Q0 70 25 50 L30 140 H-30 Z" fill="#8C5828"/>
      <!-- Cabeça e Barba venerável -->
      <circle cx="0" cy="-25" r="26" fill="#E8B084"/>
      <path d="M-24 -15 Q0 55 24 -15 Q20 40 0 45 Q-20 40 -24 -15 Z" fill="#FFFFFF"/>
      <circle cx="-9" cy="-28" r="3.5" fill="#14213D"/>
      <circle cx="9" cy="-28" r="3.5" fill="#14213D"/>
      <!-- Braços erguidos em oração ou trabalho -->
      <path d="M-30 45 Q-65 15 -60 -20" stroke="#E8B084" stroke-width="14" stroke-linecap="round" fill="none"/>
      <path d="M30 45 Q65 15 60 -20" stroke="#E8B084" stroke-width="14" stroke-linecap="round" fill="none"/>
    </g>`;

  return {
    'cover.svg': svg(`
      <rect width="1200" height="800" fill="url(#daySky)"/>
      ${clouds()}
      ${rainbow(600, 480, 490)}
      <!-- Águas calmas do dilúvio baixando -->
      <path d="M0 520 Q300 480 600 510 T1200 490 V800 H0 Z" fill="#4B90CA"/>
      <path d="M0 580 Q400 540 800 570 T1200 550 V800 H0 Z" fill="url(#water)"/>
      <!-- Grande Arca flutuando soberana -->
      ${ark(600, 520, 1.2)}
      <!-- Pomba branca com ramo no céu -->
      ${dove(420, 240, 1.3)}
      <!-- Ondas e reflexos dourados -->
      <ellipse cx="600" cy="650" rx="320" ry="12" fill="#FFFFFF" opacity=".4"/>
    `, 'A Arca de Noé navegando sob o arco-íris da aliança'),

    '01-homem-justo.svg': svg(`
      <rect width="1200" height="800" fill="url(#morningSky)"/>
      <circle cx="600" cy="180" r="260" fill="url(#divineLight)" opacity=".75"/>
      ${clouds()}
      <path d="M0 480 Q320 400 680 470 T1200 440 V800 H0 Z" fill="#75AD55"/>
      <path d="M0 570 Q420 500 850 580 T1200 550 V800 H0 Z" fill="url(#hills)"/>
      <!-- Tenda familiar de Noé -->
      <g transform="translate(240 520)" filter="url(#softShadow)">
        <polygon points="-70,90 0,-10 70,90" fill="#E6D3B3"/>
        <polygon points="-15,90 0,25 15,90" fill="#4A260B"/>
      </g>
      <!-- Ovelhinhas pastando felizes -->
      ${sheep(380, 640, 0.85)}
      ${sheep(480, 680, 0.7, true)}
      ${sheep(880, 650, 0.8)}
      <!-- Noé em oração com Deus -->
      ${noah(680, 500, 1.25)}
      <!-- Luz divina descendo sobre ele -->
      <path d="M680 0 L580 500 L780 500 Z" fill="#FFFDE0" opacity=".22"/>
    `, 'Noé era um homem justo que andava com Deus'),

    '02-instrucoes-deus.svg': svg(`
      <rect width="1200" height="800" fill="url(#daySky)"/>
      <circle cx="700" cy="150" r="240" fill="url(#divineLight)" opacity=".8"/>
      <!-- Oficina de madeira ao ar livre -->
      <path d="M0 500 Q400 440 800 500 T1200 480 V800 H0 Z" fill="url(#hills)"/>
      <path d="M0 590 Q300 540 700 600 T1200 570 V800 H0 Z" fill="#E8C988"/>
      <!-- Vigas de madeira empilhadas -->
      <g transform="translate(200 580)" filter="url(#softShadow)">
        <rect x="0" y="40" width="220" height="28" rx="4" fill="#6F3F19"/>
        <rect x="20" y="10" width="200" height="28" rx="4" fill="#8B572A"/>
        <rect x="40" y="-20" width="180" height="28" rx="4" fill="#A86E3C"/>
      </g>
      <!-- Mesa de projeto com o pergaminho aberto -->
      <g transform="translate(620 540)" filter="url(#softShadow)">
        <!-- Cavalete da mesa -->
        <rect x="-80" y="70" width="160" height="16" rx="4" fill="#542B0D"/>
        <path d="M-60 86 L-70 170 M60 86 L70 170" stroke="#542B0D" stroke-width="16" stroke-linecap="round"/>
        <!-- Pergaminho grande iluminado -->
        <rect x="-110" y="30" width="220" height="50" rx="8" fill="#FFF8DC" filter="url(#strongGlow)"/>
        <!-- Desenho da arca no pergaminho -->
        <path d="M-70 65 L70 65 L60 50 L-60 50 Z" fill="#8B572A"/>
        <line x1="-50" y1="50" x2="-50" y2="40" stroke="#8B572A" stroke-width="3"/>
        <line x1="0" y1="50" x2="0" y2="36" stroke="#8B572A" stroke-width="3"/>
        <line x1="50" y1="50" x2="50" y2="40" stroke="#8B572A" stroke-width="3"/>
      </g>
      <!-- Noé observando as instruções celestiais -->
      ${noah(840, 480, 1.15)}
    `, 'Deus dá a Noé o projeto exato da grande arca'),

    '03-construcao-arca.svg': svg(`
      <rect width="1200" height="800" fill="url(#daySky)"/>
      <circle cx="200" cy="140" r="110" fill="url(#sunGlow)"/>
      ${clouds()}
      <path d="M0 550 Q400 480 800 550 T1200 520 V800 H0 Z" fill="#D6BA7A"/>
      <path d="M0 640 Q350 580 750 640 T1200 610 V800 H0 Z" fill="url(#hills)"/>
      <!-- Grande Arca em construção no chão seco -->
      ${ark(560, 480, 1.35)}
      <!-- Andaimes e escadas de madeira ao redor da arca -->
      <g stroke="#542B0D" stroke-width="10" stroke-linecap="round">
        <line x1="280" y1="620" x2="280" y2="340"/>
        <line x1="380" y1="640" x2="380" y2="340"/>
        <line x1="270" y1="420" x2="390" y2="420"/>
        <line x1="270" y1="520" x2="390" y2="520"/>
        <!-- Escada apoiada -->
        <line x1="720" y1="630" x2="680" y2="390"/>
        <line x1="750" y1="630" x2="710" y2="390"/>
        <line x1="710" y1="600" x2="740" y2="600" stroke-width="6"/>
        <line x1="700" y1="550" x2="730" y2="550" stroke-width="6"/>
        <line x1="690" y1="500" x2="720" y2="500" stroke-width="6"/>
      </g>
      <!-- Pessoas zombando ao longe -->
      <g transform="translate(140 570)" filter="url(#softShadow)">
        <circle cx="0" cy="0" r="16" fill="#A86E3C"/>
        <path d="M-14 16 L0 70 L14 16 Z" fill="#C5935E"/>
        <circle cx="45" cy="4" r="15" fill="#A86E3C"/>
        <path d="M32 19 L45 70 L58 19 Z" fill="#8C5828"/>
      </g>
      <!-- Noé trabalhando firme com martelo -->
      ${noah(840, 520, 1.1)}
    `, 'Noé constrói a arca fielmente apesar do deboche'),

    '04-chuva-comeca.svg': svg(`
      <rect width="1200" height="800" fill="url(#stormSky)"/>
      <!-- Relâmpagos dourados -->
      <path d="M300 0 L260 140 L310 160 L240 320" stroke="#FFF7A6" stroke-width="8" fill="none" filter="url(#strongGlow)"/>
      <path d="M920 0 L880 120 L930 140 L870 280" stroke="#FFF7A6" stroke-width="7" fill="none" filter="url(#strongGlow)"/>
      <!-- Chuva intensa caindo -->
      ${Array.from({ length: 40 }, (_, i) => {
        const x = (i * 37 + 15) % 1200;
        const y = (i * 41 + 10) % 550;
        return `<line x1="${x}" y1="${y}" x2="${x - 25}" y2="${y + 70}" stroke="#BDEBFA" stroke-width="3" opacity=".65"/>`;
      }).join('')}
      <!-- Ondas revoltas do dilúvio -->
      <path d="M0 500 Q200 420 450 510 T900 480 Q1050 430 1200 490 V800 H0 Z" fill="#1C3F66"/>
      <path d="M0 570 Q250 490 550 590 T1200 560 V800 H0 Z" fill="#245180"/>
      <!-- Arca protegida e impermeável -->
      ${ark(600, 480, 1.25)}
      <!-- Porta fechada e selada com luz protetora de Deus -->
      <g transform="translate(600 510)" filter="url(#strongGlow)">
        <rect x="-25" y="-10" width="50" height="60" rx="4" fill="#FFF9D6" opacity=".95"/>
      </g>
      <!-- Espuma branca nas ondas -->
      <path d="M0 640 Q280 570 560 640 T1200 620" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" fill="none" opacity=".8"/>
    `, 'O dilúvio começa e Deus sela a porta da arca'),

    '05-arco-iris-promessa.svg': svg(`
      <rect width="1200" height="800" fill="url(#daySky)"/>
      <circle cx="600" cy="160" r="160" fill="url(#sunGlow)"/>
      ${rainbow(600, 520, 520)}
      <!-- Monte Ararate surgindo sob as águas -->
      <polygon points="150,560 380,360 620,560" fill="#6A8099"/>
      <polygon points="550,580 820,380 1080,580" fill="#586E85"/>
      <polygon points="350,380 380,360 410,380" fill="#FFFFFF"/>
      <polygon points="790,400 820,380 850,400" fill="#FFFFFF"/>
      <!-- Chão com brotinhos verdes -->
      <path d="M0 610 Q350 540 750 610 T1200 590 V800 H0 Z" fill="url(#hills)"/>
      <!-- Arca repousada com segurança -->
      ${ark(600, 510, 1.15)}
      <!-- Pomba trazendo a esperança -->
      ${dove(440, 260, 1.45)}
      <!-- Noé e sua família agradecendo -->
      ${noah(880, 560, 1.1)}
    `, 'A pomba retorna e Deus firma a aliança com o arco-íris'),
  };
}
