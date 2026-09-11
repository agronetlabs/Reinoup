import sharp from "sharp";
const f = "C:/Users/user/Desktop/APP-RAMON/02. Reino UP/01. Identidade Visual/logo.png";
const m = await sharp(f).metadata();
const s = await sharp(f).stats();
const a = s.channels.length === 4 ? s.channels[3] : null;
console.log(`logo.png | ${m.width}x${m.height} | canais:${m.channels} | alpha:${m.hasAlpha} | alphaMin:${a ? a.min : "-"} | transparente de verdade: ${a && a.min < 250}`);
