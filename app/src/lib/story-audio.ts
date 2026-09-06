import type { AgeBand } from '../content/types';

const rawBase = import.meta.env?.BASE_URL || '/';
const base = rawBase.endsWith('/') ? rawBase : `${rawBase}/`;

/**
 * Retorna o caminho do arquivo de áudio narrado (gerado via ElevenLabs)
 * para um capítulo e página específicos.
 */
export function getStoryAudioPath(
  storyId: string,
  chapterId: string,
  pageIndex: number,
  ageBand: AgeBand
): string {
  return `${base}audio/stories/${storyId}/${ageBand}/${chapterId}-p${pageIndex + 1}.mp3`;
}
