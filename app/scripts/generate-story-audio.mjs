import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { STORIES } from '../src/content/stories.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, '../public/audio/stories');

const apiKey = process.env.ELEVENLABS_API_KEY;
const voiceId = process.env.ELEVENLABS_VOICE_ID || 'qLqIiyI3C8MLNhPB514E';

console.log('🎙️ Gerador de Áudio de Histórias ReinoUp (ElevenLabs)');

if (!apiKey) {
  console.log('\n⚠️  ELEVENLABS_API_KEY não foi encontrada nas variáveis de ambiente.');
  console.log('Para gerar narrações estáticas com voz humana:');
  console.log('  1. Defina ELEVENLABS_API_KEY=sua_chave no arquivo .env');
  console.log('  2. Opcional: ELEVENLABS_VOICE_ID=id_da_voz');
  console.log('  3. Execute: bun scripts/generate-story-audio.mjs\n');
  console.log('ℹ️  O app continuará usando o fallback de fala automática normalmente.');
  process.exit(0);
}

const AGE_BANDS = ['5-7', '8-10'];

let generated = 0;
let skipped = 0;

for (const story of STORIES) {
  for (const ageBand of AGE_BANDS) {
    const targetDir = path.join(publicDir, story.id, ageBand);
    await mkdir(targetDir, { recursive: true });

    for (const chapter of story.chapters) {
      const pages = chapter.pages[ageBand] || [];
      for (let pIdx = 0; pIdx < pages.length; pIdx++) {
        const text = pages[pIdx];
        const fileName = `${chapter.id}-p${pIdx + 1}.mp3`;
        const filePath = path.join(targetDir, fileName);

        if (existsSync(filePath)) {
          skipped++;
          continue;
        }

        console.log(`🔊 Gerando [${story.id}] ${chapter.id} pág ${pIdx + 1} (${ageBand})...`);

        try {
          const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
            method: 'POST',
            headers: {
              'xi-api-key': apiKey,
              'Content-Type': 'application/json',
              Accept: 'audio/mpeg',
            },
            body: JSON.stringify({
              text,
              model_id: 'eleven_multilingual_v2',
              voice_settings: {
                stability: 0.5,
                similarity_boost: 0.8,
                style: 0.2,
                use_speaker_boost: true,
              },
            }),
          });

          if (!res.ok) {
            console.error(`❌ Erro ElevenLabs (${res.status}): ${await res.text()}`);
            continue;
          }

          const buffer = Buffer.from(await res.arrayBuffer());
          await writeFile(filePath, buffer);
          generated++;
        } catch (err) {
          console.error(`❌ Erro ao gerar ${fileName}:`, err);
        }
      }
    }
  }
}

console.log(`\n✓ Concluído! Gerados: ${generated} novos áudios | Ignorados (já existentes): ${skipped}`);
