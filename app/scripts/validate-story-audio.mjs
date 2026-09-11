import { readFile, realpath } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { STORIES } from '../src/content/stories.ts';
import { audioAssetMatches } from '../shared/story-audio-manifest.ts';
import { storyAudioInventory } from '../shared/story-audio-segments.ts';
import { readManifest } from './lib/story-audio-generator.mjs';
import { selectAudioSources, printAudioInventory } from './lib/story-audio-selection.mjs';

const { sources, dryRun } = selectAudioSources(STORIES, process.argv.slice(2));
if (dryRun) {
  printAudioInventory(sources);
} else {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../public/audio/stories');
  const failures = [];
  let count = 0;
  for (const storyId of new Set(sources.map(source => source.storyId))) {
    const storyDir = path.join(root, storyId);
    const manifest = await readManifest(path.join(storyDir, 'manifest.json'));
    if (!manifest) { failures.push(`${storyId}: manifesto ausente ou inválido`); continue; }
    const story = STORIES.find(candidate => candidate.id === storyId);
    const inventory = ['5-7', '8-10'].flatMap(age => storyAudioInventory(story, age));
    const assets = [...manifest.pages, ...(manifest.segments ?? [])];
    // Check every published entry, even outside an age/page selection.
    for (const asset of assets) {
      const source = inventory.find(item => item.ageBand === asset.ageBand && (item.pageIndex !== undefined
        ? asset.chapterId === item.chapterId && asset.pageIndex === item.pageIndex : asset.segmentId === item.segmentId));
      if (!source || !audioAssetMatches(asset, source, manifest)) { failures.push(`${storyId}: entrada inválida ${asset.file}`); continue; }
      try {
        const audioPath = await realpath(path.join(storyDir, asset.file));
        const directory = await realpath(storyDir);
        const relative = path.relative(directory, audioPath);
        if (relative.startsWith('..') || path.isAbsolute(relative)) throw new Error('caminho externo');
        const audio = await readFile(audioPath);
        const mp3 = audio.subarray(0, 3).toString('ascii') === 'ID3' || (audio[0] === 0xff && (audio[1] & 0xe0) === 0xe0);
        if (!mp3 || audio.length < 1000) throw new Error('MP3 inválido');
        if (asset.characterCost !== undefined && (!Number.isInteger(asset.characterCost) || asset.characterCost < 1)) throw new Error('character-cost inválido');
      } catch (error) { failures.push(`${storyId}/${asset.file}: ${error.message}`); }
    }
    for (const source of sources.filter(item => item.storyId === storyId)) {
      if (!assets.some(asset => audioAssetMatches(asset, source, manifest))) failures.push(`${storyId}/${source.ageBand}/${source.segmentId}: áudio ausente ou inválido`);
      else count++;
    }
  }
  if (failures.length) { console.error(failures.join('\n')); process.exitCode = 1; }
  else console.log(`Áudio válido: ${count} entradas selecionadas.`);
}
