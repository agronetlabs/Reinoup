export const DEFS = `
  <defs>
    <linearGradient id="creamLight" x1="0" y1="0" x2="0" y2="1">
      <stop stop-color="#FFFBF0"/><stop offset="1" stop-color="#F3E9D7"/>
    </linearGradient>
    <linearGradient id="daySky" x1="0" y1="0" x2="0" y2="1">
      <stop stop-color="#63AFE2"/><stop offset=".6" stop-color="#CDEEFF"/><stop offset="1" stop-color="#FFF1C7"/>
    </linearGradient>
    <linearGradient id="morningSky" x1="0" y1="0" x2="0" y2="1">
      <stop stop-color="#4B779A"/><stop offset=".4" stop-color="#F7A064"/><stop offset=".8" stop-color="#FCE0B0"/><stop offset="1" stop-color="#FFF5D6"/>
    </linearGradient>
    <linearGradient id="sunsetSky" x1="0" y1="0" x2="0" y2="1">
      <stop stop-color="#14213D"/><stop offset=".35" stop-color="#1D4689"/><stop offset=".65" stop-color="#FF7A29"/><stop offset="1" stop-color="#FFC93C"/>
    </linearGradient>
    <linearGradient id="nightSky" x1="0" y1="0" x2="0" y2="1">
      <stop stop-color="#07152F"/><stop offset=".6" stop-color="#14213D"/><stop offset="1" stop-color="#1D4689"/>
    </linearGradient>
    <linearGradient id="stormSky" x1="0" y1="0" x2="0" y2="1">
      <stop stop-color="#121D2B"/><stop offset=".5" stop-color="#2D3E52"/><stop offset="1" stop-color="#4B627D"/>
    </linearGradient>
    <linearGradient id="water" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#2C78BD"/><stop offset=".55" stop-color="#68BDE7"/><stop offset="1" stop-color="#BDEBFA"/>
    </linearGradient>
    <linearGradient id="oceanDeep" x1="0" y1="0" x2="0" y2="1">
      <stop stop-color="#08182B"/><stop offset=".5" stop-color="#133E6E"/><stop offset="1" stop-color="#246CA8"/>
    </linearGradient>
    <linearGradient id="seaWall" x1="0" y1="0" x2="1" y2="0">
      <stop stop-color="#1D659E" stop-opacity=".92"/><stop offset=".5" stop-color="#4FA6DF" stop-opacity=".85"/><stop offset="1" stop-color="#82D2F5" stop-opacity=".95"/>
    </linearGradient>
    <linearGradient id="garden" x1="0" y1="0" x2="0" y2="1">
      <stop stop-color="#7DBB5E"/><stop offset="1" stop-color="#2F7B45"/>
    </linearGradient>
    <linearGradient id="hills" x1="0" y1="0" x2="0" y2="1">
      <stop stop-color="#94CD6E"/><stop offset=".6" stop-color="#55A14A"/><stop offset="1" stop-color="#2C6E38"/>
    </linearGradient>
    <linearGradient id="desert" x1="0" y1="0" x2="0" y2="1">
      <stop stop-color="#F5DB99"/><stop offset=".65" stop-color="#DFB35A"/><stop offset="1" stop-color="#A87A2A"/>
    </linearGradient>
    <linearGradient id="sandDune" x1="0" y1="0" x2="0" y2="1">
      <stop stop-color="#FCEAB3"/><stop offset="1" stop-color="#E2B868"/>
    </linearGradient>
    <linearGradient id="palaceWall" x1="0" y1="0" x2="0" y2="1">
      <stop stop-color="#FFF7E3"/><stop offset=".7" stop-color="#E8D5B0"/><stop offset="1" stop-color="#CBB184"/>
    </linearGradient>
    <linearGradient id="palaceGold" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#FFF0A0"/><stop offset=".5" stop-color="#FFC93C"/><stop offset="1" stop-color="#EBA317"/>
    </linearGradient>
    <linearGradient id="woodArk" x1="0" y1="0" x2="0" y2="1">
      <stop stop-color="#8B572A"/><stop offset=".5" stop-color="#6F3F19"/><stop offset="1" stop-color="#4A260B"/>
    </linearGradient>
    <linearGradient id="stoneDen" x1="0" y1="0" x2="0" y2="1">
      <stop stop-color="#283547"/><stop offset=".6" stop-color="#182332"/><stop offset="1" stop-color="#0E1622"/>
    </linearGradient>
    <linearGradient id="fireCol" x1="0" y1="1" x2="0" y2="0">
      <stop stop-color="#FF4500"/><stop offset=".4" stop-color="#FF7A29"/><stop offset=".8" stop-color="#FFC93C"/><stop offset="1" stop-color="#FFF9D6"/>
    </linearGradient>
    <radialGradient id="divineLight">
      <stop stop-color="#FFFDE0" stop-opacity=".96"/><stop offset=".45" stop-color="#FFC93C" stop-opacity=".42"/><stop offset="1" stop-color="#FFC93C" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="angelGlow">
      <stop stop-color="#FFFFFF" stop-opacity=".98"/><stop offset=".4" stop-color="#FFE885" stop-opacity=".55"/><stop offset="1" stop-color="#FFE885" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="sunGlow">
      <stop stop-color="#FFF5B8" stop-opacity="1"/><stop offset=".35" stop-color="#FFC93C" stop-opacity=".8"/><stop offset="1" stop-color="#FF7A29" stop-opacity="0"/>
    </radialGradient>
    <filter id="softShadow" x="-30%" y="-30%" width="160%" height="180%">
      <feDropShadow dx="0" dy="12" stdDeviation="14" flood-color="#14213D" flood-opacity=".25"/>
    </filter>
    <filter id="cardShadow" x="-20%" y="-20%" width="140%" height="150%">
      <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#0B1830" flood-opacity=".18"/>
    </filter>
    <filter id="glow" x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur stdDeviation="10" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="strongGlow" x="-100%" y="-100%" width="300%" height="300%">
      <feGaussianBlur stdDeviation="18" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>`;

export function svg(body, label) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800" role="img" aria-label="${label}">
${DEFS}
${body}
</svg>
`;
}

export function stars(count = 45, maxH = 450) {
  return Array.from({ length: count }, (_, i) => {
    const x = (i * 89 + 37) % 1200;
    const y = (i * 53 + 29) % maxH;
    const r = 1.8 + (i % 4) * 0.9;
    return `<circle cx="${x}" cy="${y}" r="${r.toFixed(1)}" fill="#FFFDE0" opacity="${(0.4 + (i % 6) * 0.1).toFixed(2)}"/>`;
  }).join('');
}

export function clouds(_seed = 0) {
  return `
    <g opacity=".85">
      <path d="M120 180 q40 -50 90 -20 q50 -60 110 -15 q60 -30 100 20 q30 50 -20 60 h-260 q-50 -10 -20 -45z" fill="#FFFFFF" opacity=".7"/>
      <path d="M780 140 q35 -40 80 -15 q45 -50 95 -10 q50 -25 85 15 q25 40 -15 50 h-220 q-40 -10 -25 -40z" fill="#FFFFFF" opacity=".65"/>
      <path d="M450 210 q30 -35 70 -12 q40 -40 85 -10 q45 -20 75 12 q20 35 -15 45 h-190 q-35 -10 -25 -35z" fill="#FFFFFF" opacity=".5"/>
    </g>`;
}

export function sheep(x, y, scale = 1, flip = false) {
  const transform = `translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`;
  return `
    <g transform="${transform}" filter="url(#softShadow)">
      <ellipse cx="0" cy="40" rx="46" ry="32" fill="#FFFFFF"/>
      <circle cx="-28" cy="22" r="16" fill="#FFFFFF"/>
      <circle cx="28" cy="22" r="16" fill="#FFFFFF"/>
      <circle cx="0" cy="12" r="18" fill="#FFFFFF"/>
      <circle cx="34" cy="24" r="20" fill="#E8D5B0"/>
      <ellipse cx="44" cy="18" rx="8" ry="5" fill="#CDB68D" transform="rotate(-15 44 18)"/>
      <circle cx="40" cy="20" r="3.5" fill="#14213D"/>
      <path d="M-22 66v30M-6 66v30M12 66v30M26 66v30" stroke="#CDB68D" stroke-width="8" stroke-linecap="round"/>
    </g>`;
}

export function oliveTree(x, y, scale = 1) {
  return `
    <g transform="translate(${x} ${y}) scale(${scale})" filter="url(#softShadow)">
      <path d="M0 180 Q10 80 -8 0 Q-15 -40 -4 -80 Q10 -30 18 0 Q10 90 28 180z" fill="#7B4A2B"/>
      <circle cx="-45" cy="-85" r="55" fill="#3D7D44"/>
      <circle cx="35" cy="-95" r="62" fill="#4C9652"/>
      <circle cx="-5" cy="-145" r="68" fill="#5EAA64"/>
      <circle cx="20" cy="-60" r="48" fill="#448B4A"/>
    </g>`;
}
