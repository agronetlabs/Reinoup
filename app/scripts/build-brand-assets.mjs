import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { dirname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const SRC = join(ROOT, "02. Reino UP", "01. Identidade Visual") + sep;
const OUT = join(ROOT, "app", "public", "brand") + sep;
await mkdir(OUT, { recursive: true });

async function tirarFundoBranco(entrada, tolerancia = 12) {
  const img = sharp(entrada).ensureAlpha();
  const { width, height } = await img.metadata();
  const raw = await img.raw().toBuffer();
  for (let i = 0; i < raw.length; i += 4) {
    if (raw[i] >= 255 - tolerancia && raw[i + 1] >= 255 - tolerancia && raw[i + 2] >= 255 - tolerancia) raw[i + 3] = 0;
  }
  return sharp(raw, { raw: { width, height, channels: 4 } }).png();
}

async function salvar(pipe, nome, largura) {
  const webp = await pipe.clone().resize({ width: largura }).webp({ quality: 90 }).toBuffer();
  const png = await pipe.clone().resize({ width: Math.round(largura / 2) }).png({ compressionLevel: 9, palette: true }).toBuffer();
  await sharp(webp).toFile(OUT + nome + ".webp");
  await sharp(png).toFile(OUT + nome + ".png");
  console.log(`  ${nome}  webp ${largura}px: ${Math.round(webp.length / 1024)}kB   png ${Math.round(largura / 2)}px: ${Math.round(png.length / 1024)}kB`);
}

console.log("MASCOTE corpo inteiro");
await salvar(sharp(SRC + "MArcote oficial.png").trim({ threshold: 1 }), "mascote", 600);

const m = await sharp(SRC + "MArcote oficial.png").trim({ threshold: 1 }).toBuffer();
const md = await sharp(m).metadata();
console.log("MASCOTE busto (baloes)");
await salvar(sharp(m).extract({ left: 0, top: 0, width: md.width, height: Math.round(md.height * 0.52) }), "mascote-busto", 360);

console.log("LOGO");
await salvar((await tirarFundoBranco(SRC + "logo.png")).trim({ threshold: 1 }), "logo", 804);

await import("./build-mascot-fallbacks.mjs");
