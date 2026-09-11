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

const edenDefs = `
  <defs>
    <linearGradient id="edenDawn" x1="0" y1="0" x2="0" y2="1">
      <stop stop-color="#1D4689"/><stop offset=".34" stop-color="#63AFE2"/><stop offset=".72" stop-color="#FFC93C"/><stop offset="1" stop-color="#FFFBF0"/>
    </linearGradient>
    <linearGradient id="edenEvening" x1="0" y1="0" x2="0" y2="1">
      <stop stop-color="#14213D"/><stop offset=".38" stop-color="#1D4689"/><stop offset=".76" stop-color="#FF7A29"/><stop offset="1" stop-color="#FFC93C"/>
    </linearGradient>
    <linearGradient id="edenLeaf" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#8BC66A"/><stop offset=".48" stop-color="#4E9A4D"/><stop offset="1" stop-color="#2F7B45"/>
    </linearGradient>
    <linearGradient id="edenBark" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#B86E40"/><stop offset=".52" stop-color="#7B4A2B"/><stop offset="1" stop-color="#59321F"/>
    </linearGradient>
    <linearGradient id="edenRiver" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#BDEBFA"/><stop offset=".48" stop-color="#68BDE7"/><stop offset="1" stop-color="#1D4689"/>
    </linearGradient>
    <linearGradient id="wovenAmber" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#FFC93C"/><stop offset=".52" stop-color="#FF7A29"/><stop offset="1" stop-color="#B86E40"/>
    </linearGradient>
    <linearGradient id="wovenBlue" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#68BDE7"/><stop offset=".5" stop-color="#1D4689"/><stop offset="1" stop-color="#14213D"/>
    </linearGradient>
    <radialGradient id="skinAdam" cx=".34" cy=".24" r=".85">
      <stop stop-color="#D58A56"/><stop offset=".58" stop-color="#A96135"/><stop offset="1" stop-color="#7B4A2B"/>
    </radialGradient>
    <radialGradient id="skinEva" cx=".34" cy=".24" r=".85">
      <stop stop-color="#E49A66"/><stop offset=".58" stop-color="#B86E40"/><stop offset="1" stop-color="#8B572A"/>
    </radialGradient>
    <linearGradient id="hairAdam" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#7B4A2B"/><stop offset="1" stop-color="#3C251B"/>
    </linearGradient>
    <linearGradient id="hairEva" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#9A5732"/><stop offset="1" stop-color="#59321F"/>
    </linearGradient>
    <linearGradient id="meadowPaint" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#8BC66A"/><stop offset=".47" stop-color="#5CAD55"/><stop offset="1" stop-color="#397F45"/>
    </linearGradient>
    <pattern id="leafSpeckle" width="28" height="24" patternUnits="userSpaceOnUse">
      <circle cx="4" cy="5" r="2.5" fill="#FFFBF0" opacity=".18"/>
      <path d="M15 17q5-7 10-1" fill="none" stroke="#14213D" stroke-width="2" opacity=".11"/>
    </pattern>
    <pattern id="earthSpeckle" width="34" height="28" patternUnits="userSpaceOnUse">
      <circle cx="8" cy="8" r="2" fill="#59321F" opacity=".18"/><circle cx="26" cy="20" r="1.5" fill="#FFFBF0" opacity=".2"/>
      <path d="M12 23l8-5" stroke="#7B4A2B" stroke-width="2" opacity=".16"/>
    </pattern>
    <pattern id="clothWeave" width="18" height="18" patternUnits="userSpaceOnUse">
      <path d="M0 4h18M4 0v18" stroke="#FFFBF0" stroke-width="1.5" opacity=".16"/>
    </pattern>
    <filter id="edenDepth" x="-25%" y="-25%" width="150%" height="170%">
      <feDropShadow dx="0" dy="14" stdDeviation="11" flood-color="#14213D" flood-opacity=".22"/>
    </filter>
    <filter id="farBlur" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2.4"/>
    </filter>
    <filter id="watercolorGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="7"/>
    </filter>
  </defs>`;

const edenTree = (x, y, scale = 1, fruit = true, flip = false) => `
  <g transform="translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})" filter="url(#edenDepth)">
    <path d="M-48 300Q-34 214-25 125Q-22 57-62-8Q-15 6 5 56Q27 10 78-26Q39 30 34 92Q74 65 108 68Q61 91 38 137Q45 218 65 300z" fill="url(#edenBark)"/>
    <path d="M-20 275q18-118 8-216M17 265q-8-95 11-175" fill="none" stroke="#FFAF5C" stroke-width="8" opacity=".23" stroke-linecap="round"/>
    <g fill="url(#edenLeaf)">
      <path d="M-185-18q14-65 71-71q18-68 84-48q45-53 101-10q67-10 82 52q62 17 51 79q-8 51-70 56q-35 54-95 28q-54 35-101 1q-66 15-87-38q-43-12-36-49z"/>
      <path d="M-158 7q52-34 102-2t98 0t117 9q-24 70-99 62q-52 32-106-1q-80 13-112-68z" fill="#397F45" opacity=".48"/>
    </g>
    <path d="M-160-20q60-34 112-2t99-9t117 20M-123 35q49-29 99 0t103-5" fill="none" stroke="#8BC66A" stroke-width="10" opacity=".28" stroke-linecap="round"/>
    <path d="M-185-18q14-65 71-71q18-68 84-48q45-53 101-10q67-10 82 52q62 17 51 79q-8 51-70 56q-35 54-95 28q-54 35-101 1q-66 15-87-38q-43-12-36-49z" fill="url(#leafSpeckle)" opacity=".9"/>
    ${fruit ? `<g fill="#FF7A29" stroke="#FFC93C" stroke-width="4">
      <circle cx="-92" cy="-22" r="15"/><circle cx="-19" cy="-82" r="16"/><circle cx="72" cy="-41" r="15"/><circle cx="37" cy="29" r="16"/><circle cx="126" cy="5" r="13"/>
    </g>` : ''}
  </g>`;

const face = (skin, hair, mood = 'smile', flip = false) => `
  <g transform="scale(${flip ? -1 : 1} 1)">
    <ellipse cx="-42" cy="-102" rx="9" ry="14" fill="${skin}"/><ellipse cx="42" cy="-102" rx="9" ry="14" fill="${skin}"/>
    <ellipse cx="0" cy="-105" rx="42" ry="48" fill="${skin}"/>
    <ellipse cx="-13" cy="-119" rx="21" ry="18" fill="#FFFBF0" opacity=".08" transform="rotate(-22 -13 -119)"/>
    <path d="M-43-111q4-51 47-55q45 4 44 59q-13-29-35-36q-27 24-56 25z" fill="${hair}"/>
    <path d="M-36-127q9-17 20-23M-16-145q13-17 27-17M10-145q16-11 28-4M30-132q13-8 18 0" fill="none" stroke="${hair}" stroke-width="14" stroke-linecap="round"/>
    <path d="M-26-114q10-8 20-1M7-115q10-7 20 1" fill="none" stroke="#59321F" stroke-width="3.5" stroke-linecap="round"/>
    <ellipse cx="-15" cy="-103" rx="6" ry="8" fill="#14213D"/><ellipse cx="16" cy="-103" rx="6" ry="8" fill="#14213D"/>
    <circle cx="-13" cy="-106" r="2" fill="#FFFBF0"/><circle cx="18" cy="-106" r="2" fill="#FFFBF0"/>
    <path d="M0-103l-5 14q5 4 11 0" fill="none" stroke="#7B4A2B" stroke-width="3" stroke-linecap="round"/>
    ${mood === 'worried'
      ? '<path d="M-18-122l13-5M7-127l14 5M-12-76q12-10 24 0" fill="none" stroke="#59321F" stroke-width="4" stroke-linecap="round"/>'
      : mood === 'wonder'
        ? '<path d="M-18-123q8-5 14 0M6-123q8-5 14 0" fill="none" stroke="#59321F" stroke-width="4" stroke-linecap="round"/><ellipse cx="0" cy="-77" rx="8" ry="10" fill="#7B4A2B"/>'
        : '<path d="M-18-122q8-4 14 0M6-122q8-4 14 0M-14-78q14 16 28 0" fill="none" stroke="#59321F" stroke-width="4" stroke-linecap="round"/>'}
    <ellipse cx="-29" cy="-87" rx="9" ry="5" fill="#FF7A29" opacity=".22"/><ellipse cx="29" cy="-87" rx="9" ry="5" fill="#FF7A29" opacity=".22"/>
  </g>`;

const edenPerson = (kind, x, y, scale = 1, pose = 'stand', mood = 'smile', flip = false, outer = false) => {
  const isAdam = kind === 'adam';
  const skin = isAdam ? 'url(#skinAdam)' : 'url(#skinEva)';
  const hair = isAdam ? 'url(#hairAdam)' : 'url(#hairEva)';
  const cloth = outer ? (isAdam ? 'url(#wovenBlue)' : 'url(#wovenAmber)') : (isAdam ? '#3D7D44' : '#5CAD55');
  const arms = {
    tend: '<path d="M-34-18Q-86 13-112 72M34-18Q75 12 102 52" fill="none"',
    offer: '<path d="M-34-18Q-72 8-87 47M34-18Q85-40 125-72" fill="none"',
    hide: '<path d="M-34-18Q-7 24 18 42M34-18Q8 10-17 39" fill="none"',
    walk: '<path d="M-34-18Q-72 19-91 55M34-18Q73 9 94 44" fill="none"',
    stand: '<path d="M-34-18Q-61 26-66 68M34-18Q61 26 66 68" fill="none"',
  }[pose];
  const hands = {
    tend: [[-112, 72], [102, 52]],
    offer: [[-87, 47], [125, -72]],
    hide: [[18, 42], [-17, 39]],
    walk: [[-91, 55], [94, 44]],
    stand: [[-66, 68], [66, 68]],
  }[pose];
  const legs = pose === 'walk'
    ? `<path d="M-20 112Q-32 168-62 218M20 112Q44 163 70 205" fill="none" stroke="${skin}" stroke-width="25" stroke-linecap="round"/>
       <ellipse cx="-72" cy="222" rx="27" ry="12" fill="#59321F" transform="rotate(-13 -72 222)"/><ellipse cx="80" cy="209" rx="27" ry="12" fill="#59321F" transform="rotate(12 80 209)"/>`
    : `<path d="M-20 112v98M20 112v98" fill="none" stroke="${skin}" stroke-width="25" stroke-linecap="round"/>
       <ellipse cx="-27" cy="216" rx="26" ry="11" fill="#59321F"/><ellipse cx="27" cy="216" rx="26" ry="11" fill="#59321F"/>`;
  return `
    <g transform="translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})" filter="url(#edenDepth)">
      ${legs}
      ${arms} stroke="${skin}" stroke-width="22" stroke-linecap="round"/>
      <circle cx="${hands[0][0]}" cy="${hands[0][1]}" r="12" fill="${skin}"/><circle cx="${hands[1][0]}" cy="${hands[1][1]}" r="12" fill="${skin}"/>
      <path d="M-47-54Q0-79 47-54L62 111Q42 137 0 130Q-42 139-62 111z" fill="${cloth}"/>
      <path d="M-47-54Q0-79 47-54L62 111Q42 137 0 130Q-42 139-62 111z" fill="url(#clothWeave)"/>
      <path d="M-39-45Q0-18 42-45M-49 12q48 27 99 0" fill="none" stroke="${outer ? '#FFC93C' : '#2F7B45'}" stroke-width="11" opacity=".72"/>
      <path d="M-45-48q12 79 5 144" fill="none" stroke="#FFFBF0" stroke-width="7" opacity=".12" stroke-linecap="round"/>
      ${!outer ? '<path d="M-54 66q29-23 54 1q26-25 54-1q-28 15-54 47q-26-32-54-47z" fill="#397F45" opacity=".94"/><path d="M0 67v42" stroke="#8BC66A" stroke-width="4" opacity=".6"/>' : ''}
      ${face(skin, hair, mood, false)}
      ${isAdam ? '<path d="M-38-76q38 28 76 0q-2 39-38 42q-36-3-38-42z" fill="url(#hairAdam)" opacity=".88"/><path d="M-23-57q23 10 46 0" stroke="#B86E40" stroke-width="4" opacity=".5"/>' : '<path d="M-39-135q-36 34-29 101M38-135q40 40 29 105" fill="none" stroke="url(#hairEva)" stroke-width="19" stroke-linecap="round"/><path d="M-53-68q9 22 0 45M53-68q-9 22 0 45" fill="none" stroke="#FFAF5C" stroke-width="4" opacity=".2"/>'}
      ${pose === 'tend' ? '<path d="M-120 67q20-24 42 0q-18 21-42 0z" fill="#FFC93C" stroke="#2F7B45" stroke-width="5"/>' : ''}
      ${pose === 'offer' ? '<circle cx="127" cy="-77" r="16" fill="#FF7A29" stroke="#FFC93C" stroke-width="4"/>' : ''}
    </g>`;
};

const gentleSerpent = (x, y, scale = 1, flip = false) => `
  <g transform="translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})" filter="url(#edenDepth)">
    <path d="M-145 70q58-76 112-5t101 4q52-76 93-23q28 36-9 72" fill="none" stroke="#2F7B45" stroke-width="31" stroke-linecap="round"/>
    <path d="M-139 66q55-53 103 4t92 2" fill="none" stroke="#8BC66A" stroke-width="9" stroke-linecap="round" opacity=".75"/>
    <ellipse cx="148" cy="112" rx="38" ry="31" fill="#4E9A4D"/>
    <ellipse cx="161" cy="103" rx="6" ry="8" fill="#FFC93C"/><circle cx="162" cy="104" r="3" fill="#14213D"/>
    <path d="M168 123q13 9 26-1" fill="none" stroke="#14213D" stroke-width="4" stroke-linecap="round"/>
    <path d="M191 121l18-7" stroke="#FF7A29" stroke-width="4" stroke-linecap="round"/>
    <circle cx="127" cy="96" r="5" fill="#FFC93C" opacity=".72"/>
  </g>`;

const botanicalForeground = (side = 'left', y = 610) => {
  const flip = side === 'right' ? -1 : 1;
  const x = side === 'right' ? 1200 : 0;
  return `<g transform="translate(${x} ${y}) scale(${flip} 1)" filter="url(#edenDepth)">
    <path d="M0 180Q95 66 180-30M0 215Q136 145 254 116M18 210Q55 90 24 5" fill="none" stroke="#2F7B45" stroke-width="22" stroke-linecap="round"/>
    <g fill="url(#edenLeaf)" stroke="#397F45" stroke-width="4">
      <ellipse cx="72" cy="88" rx="62" ry="27" transform="rotate(-42 72 88)"/><ellipse cx="137" cy="22" rx="69" ry="30" transform="rotate(-31 137 22)"/>
      <ellipse cx="172" cy="139" rx="70" ry="30" transform="rotate(-8 172 139)"/><ellipse cx="71" cy="165" rx="60" ry="27" transform="rotate(22 71 165)"/>
      <ellipse cx="33" cy="37" rx="51" ry="24" transform="rotate(72 33 37)"/>
    </g>
    <g fill="#FFC93C"><circle cx="114" cy="106" r="9"/><circle cx="203" cy="118" r="8"/><circle cx="48" cy="137" r="7"/></g>
  </g>`;
};

const smallBirds = (x, y, scale = 1) => `
  <g transform="translate(${x} ${y}) scale(${scale})" fill="none" stroke="#14213D" stroke-width="6" stroke-linecap="round" opacity=".7">
    <path d="M0 16q18-25 36 0q18-25 36 0M102 0q14-20 28 0q14-20 28 0"/>
  </g>`;

const meadowDetails = (x, y, scale = 1, flip = false) => `
  <g transform="translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})">
    <g fill="none" stroke="#397F45" stroke-width="5" stroke-linecap="round">
      <path d="M0 48q2-31-13-52M3 47q12-29 28-42M64 48q-2-29-18-43M66 48q12-24 28-35M128 48q1-26-12-43M130 48q10-28 27-37"/>
    </g>
    <g stroke="#FFFBF0" stroke-width="3">
      <circle cx="-13" cy="-6" r="8" fill="#FF7A29"/><circle cx="31" cy="4" r="7" fill="#FFC93C"/>
      <circle cx="46" cy="3" r="7" fill="#FFAF5C"/><circle cx="94" cy="12" r="8" fill="#FF7A29"/>
      <circle cx="116" cy="3" r="7" fill="#FFC93C"/><circle cx="157" cy="9" r="7" fill="#FFAF5C"/>
    </g>
  </g>`;

const butterfly = (x, y, scale = 1, flip = false) => `
  <g transform="translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})" filter="url(#edenDepth)">
    <path d="M0 0q-28-31-47-4q13 28 47 16q34 12 47-16Q28-31 0 0z" fill="#FFC93C" stroke="#FF7A29" stroke-width="4"/>
    <path d="M0-4v27M0-2l-9-12M0-2l9-12" fill="none" stroke="#14213D" stroke-width="3" stroke-linecap="round"/>
  </g>`;

const edenSvg = (body, label) => svg(body, label).replace(/[ \t]+$/gm, '');

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
    'cover.svg': edenSvg(`
      ${edenDefs}
      <rect width="1200" height="800" fill="url(#daySky)"/>
      <ellipse cx="778" cy="190" rx="305" ry="260" fill="url(#divineLight)" opacity=".82"/>
      ${clouds()}${smallBirds(170, 168, .82)}
      <g filter="url(#farBlur)" opacity=".74">
        <path d="M0 456Q164 330 333 452T675 430T1010 403T1200 420V800H0z" fill="#8BC66A"/>
        <g fill="#397F45"><circle cx="108" cy="410" r="93"/><circle cx="284" cy="407" r="72"/><circle cx="1010" cy="382" r="102"/><circle cx="1140" cy="418" r="92"/></g>
      </g>
      <path d="M0 542Q202 432 425 540T806 514T1200 486V800H0z" fill="url(#edenLeaf)"/>
      <path d="M0 660Q244 565 505 674T1200 610V800H0z" fill="#2F7B45"/>
      <path d="M0 660Q244 565 505 674T1200 610V800H0z" fill="url(#leafSpeckle)" opacity=".72"/>
      <path d="M498 800q-18-136 78-244q80-91 182-148q-42 140-125 240q-82 99-89 152z" fill="url(#edenRiver)" opacity=".86"/>
      <path d="M550 742q68-70 128-103" fill="none" stroke="#FFFBF0" stroke-width="12" stroke-linecap="round" opacity=".55"/>
      ${edenTree(786, 376, 1.16, true, false)}
      ${edenPerson('adam', 350, 530, .84, 'stand', 'smile', false)}
      ${edenPerson('eva', 551, 526, .87, 'stand', 'wonder', false)}
      ${gentleSerpent(785, 514, .58, true)}
      ${meadowDetails(248, 694, .72)}${meadowDetails(930, 699, .62, true)}${butterfly(239, 439, .62)}
      ${botanicalForeground('left', 610)}${botanicalForeground('right', 626)}
    `, 'Adão e Eva observam a árvore no jardim luminoso enquanto a serpente se aproxima com calma'),
    '01-jardim-cuidado.svg': edenSvg(`
      ${edenDefs}
      <rect width="1200" height="800" fill="url(#edenDawn)"/>
      <circle cx="190" cy="150" r="70" fill="#FFC93C"/><circle cx="190" cy="150" r="175" fill="url(#sunGlow)" opacity=".78"/>
      ${smallBirds(756, 146, .85)}
      <g filter="url(#farBlur)" opacity=".8">
        <path d="M0 464Q220 328 449 452T835 416T1200 390V800H0z" fill="#8BC66A"/>
        <path d="M0 529Q215 430 440 528T800 494T1200 470V800H0z" fill="#5CAD55"/>
        <g fill="#397F45"><circle cx="80" cy="416" r="86"/><circle cx="1062" cy="414" r="104"/><circle cx="1164" cy="438" r="83"/></g>
      </g>
      <path d="M0 583Q195 490 388 586T725 555T1200 524V800H0z" fill="url(#edenLeaf)"/>
      <path d="M0 583Q195 490 388 586T725 555T1200 524V800H0z" fill="url(#leafSpeckle)" opacity=".55"/>
      <path d="M770 800q-42-108 24-197q57-78 218-152q-69 99-123 194q-47 81-55 155z" fill="url(#edenRiver)"/>
      <path d="M832 755q58-98 121-154" fill="none" stroke="#FFFBF0" stroke-width="10" opacity=".63" stroke-linecap="round"/>
      ${edenTree(144, 385, .88, false, false)}${edenTree(1100, 410, .73, true, true)}
      <g transform="translate(520 681)" filter="url(#edenDepth)">
        <path d="M-145 62q128-92 290 0v57h-290z" fill="#7B4A2B"/><path d="M-145 62q128-92 290 0" fill="none" stroke="#F3E9D7" stroke-width="14"/>
        <g fill="#FFC93C" stroke="#2F7B45" stroke-width="4"><circle cx="-94" cy="53" r="12"/><circle cx="-31" cy="21" r="11"/><circle cx="43" cy="26" r="12"/><circle cx="101" cy="50" r="10"/></g>
      </g>
      ${edenPerson('adam', 365, 505, .8, 'tend', 'smile', false)}
      ${edenPerson('eva', 655, 500, .81, 'tend', 'smile', true)}
      <g transform="translate(736 588)" filter="url(#edenDepth)">
        <path d="M-38 4q38-31 76 0l-9 71q-29 18-58 0z" fill="url(#wovenBlue)"/>
        <path d="M30 17q40-20 53 16q5 22-14 35" fill="none" stroke="#1D4689" stroke-width="12" stroke-linecap="round"/>
        <path d="M-30 14q31 12 61 0" fill="none" stroke="#BDEBFA" stroke-width="5" opacity=".75"/>
        <path d="M82 66q21 24 39 56M91 64q30 18 55 45M100 61q35 10 65 26" fill="none" stroke="#68BDE7" stroke-width="6" stroke-linecap="round"/>
      </g>
      <g transform="translate(908 648)" filter="url(#edenDepth)">
        <ellipse cx="0" cy="24" rx="49" ry="34" fill="#FFFBF0"/><circle cx="38" cy="10" r="24" fill="#F3E9D7"/>
        <path d="M47-5q18-27 27 5M29-5q-14-27-24 0" fill="#F3E9D7"/><circle cx="45" cy="7" r="4" fill="#14213D"/>
        <path d="M-28 51v42M20 51v42" stroke="#B86E40" stroke-width="10" stroke-linecap="round"/>
      </g>
      ${meadowDetails(222, 695, .68)}${meadowDetails(1012, 706, .54, true)}${butterfly(811, 387, .52, true)}
      ${botanicalForeground('left', 663)}
    `, 'Adão planta e Eva cuida das flores em um Éden cheio de animais, água e vida'),
    '02-voz-serpente.svg': edenSvg(`
      ${edenDefs}
      <rect width="1200" height="800" fill="url(#edenEvening)"/>
      <ellipse cx="856" cy="232" rx="285" ry="236" fill="url(#divineLight)" opacity=".38"/>
      ${smallBirds(192, 178, .7)}
      <path d="M0 493Q215 400 420 496T792 468T1200 438V800H0z" fill="#5CAD55" opacity=".7"/>
      <g filter="url(#farBlur)" opacity=".65">
        ${edenTree(74, 438, .66, false, false)}
        <path d="M0 594Q214 495 445 596T1200 535V800H0z" fill="#397F45"/>
      </g>
      <path d="M0 650Q255 550 500 657T1200 590V800H0z" fill="#2F7B45"/>
      <path d="M0 650Q255 550 500 657T1200 590V800H0z" fill="url(#leafSpeckle)" opacity=".62"/>
      ${edenTree(830, 386, 1.26, true, true)}
      <path d="M595 617q105-58 197-17" fill="none" stroke="#7B4A2B" stroke-width="18" stroke-linecap="round" opacity=".65"/>
      ${gentleSerpent(728, 450, .62, false)}
      ${edenPerson('eva', 533, 510, .97, 'offer', 'wonder', false)}
      ${edenPerson('adam', 208, 542, .59, 'stand', 'smile', true)}
      <g transform="translate(493 635)" fill="#FFC93C" opacity=".78">
        <path d="M0 0q28-28 56 0q-28 26-56 0z"/><path d="M38 28q24-22 47 2q-25 21-47-2z"/>
      </g>
      <path d="M411 378q66-43 124-5" fill="none" stroke="#FFFBF0" stroke-width="7" stroke-linecap="round" opacity=".52" stroke-dasharray="4 18"/>
      ${meadowDetails(168, 696, .62)}${meadowDetails(922, 698, .58, true)}
      ${botanicalForeground('right', 650)}
    `, 'Eva escuta uma serpente de aparência gentil junto à árvore enquanto Adão está mais distante'),
    '03-esconderijo.svg': edenSvg(`
      ${edenDefs}
      <rect width="1200" height="800" fill="url(#edenEvening)"/>
      <ellipse cx="572" cy="176" rx="310" ry="245" fill="url(#divineLight)" opacity=".68"/>
      <path d="M390 0q76 122 175 191T724 413" fill="none" stroke="#FFFBF0" stroke-width="34" opacity=".17" stroke-linecap="round"/>
      <g filter="url(#farBlur)" opacity=".74">
        <path d="M0 470Q215 352 432 478T814 446T1200 408V800H0z" fill="#4E9A4D"/>
        <g fill="#2F7B45"><circle cx="110" cy="397" r="112"/><circle cx="1035" cy="383" r="128"/></g>
      </g>
      <path d="M0 596Q240 486 480 606T1200 540V800H0z" fill="#397F45"/>
      <path d="M0 692Q255 603 510 704T1200 638V800H0z" fill="#2F7B45"/>
      <path d="M0 692Q255 603 510 704T1200 638V800H0z" fill="url(#leafSpeckle)" opacity=".66"/>
      ${edenTree(73, 405, 1.08, false, false)}${edenTree(1122, 412, 1.06, false, true)}
      <g transform="translate(600 613)">
        <ellipse cx="0" cy="128" rx="250" ry="52" fill="#14213D" opacity=".22"/>
        ${edenPerson('adam', -91, -46, .86, 'hide', 'worried', false)}
        ${edenPerson('eva', 99, -43, .86, 'hide', 'worried', true)}
        <path d="M-236 36Q-145-41-53 44T118 36T244 20" fill="none" stroke="#2F7B45" stroke-width="38" stroke-linecap="round"/>
        <g fill="url(#edenLeaf)" stroke="#397F45" stroke-width="4">
          <ellipse cx="-174" cy="11" rx="75" ry="34" transform="rotate(-17 -174 11)"/><ellipse cx="-55" cy="34" rx="76" ry="33" transform="rotate(14 -55 34)"/>
          <ellipse cx="82" cy="27" rx="78" ry="34" transform="rotate(-13 82 27)"/><ellipse cx="188" cy="2" rx="73" ry="33" transform="rotate(17 188 2)"/>
        </g>
      </g>
      <path d="M580 304q-38 47-77 92M601 299q6 58-7 108M623 306q38 42 56 91" fill="none" stroke="#FFFBF0" stroke-width="9" stroke-linecap="round" opacity=".7"/>
      <g fill="#F3E9D7" opacity=".62">
        <ellipse cx="558" cy="432" rx="10" ry="20" transform="rotate(18 558 432)"/><ellipse cx="609" cy="476" rx="10" ry="20" transform="rotate(-18 609 476)"/>
      </g>
      ${meadowDetails(269, 711, .56)}${meadowDetails(986, 712, .52, true)}
      ${botanicalForeground('left', 618)}${botanicalForeground('right', 620)}
    `, 'Adão e Eva se escondem entre folhas, mas uma luz acolhedora abre caminho até eles'),
    '04-novo-caminho.svg': edenSvg(`
      ${edenDefs}
      <rect width="1200" height="800" fill="url(#edenDawn)"/>
      <ellipse cx="888" cy="166" rx="255" ry="224" fill="url(#divineLight)" opacity=".9"/>
      <circle cx="888" cy="166" r="48" fill="#FFC93C" opacity=".82"/>
      ${smallBirds(230, 167, .9)}
      <g filter="url(#farBlur)" opacity=".77">
        <path d="M0 463Q195 344 403 458T765 427T1200 390V800H0z" fill="#8BC66A"/>
        <path d="M0 535Q205 431 420 535T815 492T1200 468V800H0z" fill="#5CAD55"/>
      </g>
      <path d="M0 623Q220 515 449 624T1200 558V800H0z" fill="url(#edenLeaf)"/>
      <path d="M0 623Q220 515 449 624T1200 558V800H0z" fill="url(#leafSpeckle)" opacity=".53"/>
      <path d="M393 800Q426 674 536 594Q646 513 821 385Q715 557 657 662Q618 732 613 800z" fill="#F3E9D7"/>
      <path d="M393 800Q426 674 536 594Q646 513 821 385Q715 557 657 662Q618 732 613 800z" fill="url(#earthSpeckle)" opacity=".68"/>
      <g transform="translate(894 386)" filter="url(#edenDepth)">
        <path d="M-76 170V-8M76 170V-8" stroke="#7B4A2B" stroke-width="30" stroke-linecap="round"/>
        <path d="M-108-6q32-92 108-94q77 1 108 94" fill="none" stroke="#59321F" stroke-width="28" stroke-linecap="round"/>
        <path d="M-77 22h154" stroke="#FFC93C" stroke-width="12" opacity=".8"/>
      </g>
      ${edenPerson('adam', 379, 522, .86, 'walk', 'smile', false, true)}
      ${edenPerson('eva', 574, 508, .87, 'walk', 'smile', false, true)}
      <path d="M465 466q49-47 97 0" fill="none" stroke="#B86E40" stroke-width="18" stroke-linecap="round"/>
      <g transform="translate(712 665)" filter="url(#edenDepth)">
        <path d="M0 72V8" stroke="#2F7B45" stroke-width="9" stroke-linecap="round"/><path d="M0 38q-38-29-51-6q24 35 51 6M0 24q38-30 52-4q-25 34-52 4" fill="#5CAD55"/>
      </g>
      <g transform="translate(997 631)" filter="url(#edenDepth)">
        <path d="M0 55q35-42 74-8q-18 52-74 8z" fill="#FFFBF0"/><circle cx="58" cy="38" r="5" fill="#14213D"/>
        <path d="M72 46l24 9M17 58l-28 31" stroke="#FF7A29" stroke-width="6" stroke-linecap="round"/>
      </g>
      ${meadowDetails(126, 708, .68)}${meadowDetails(960, 714, .56, true)}${butterfly(748, 454, .48)}
      ${botanicalForeground('left', 671)}
    `, 'Vestidos com túnicas, Adão e Eva caminham juntos por uma estrada iluminada enquanto uma nova planta nasce'),
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
