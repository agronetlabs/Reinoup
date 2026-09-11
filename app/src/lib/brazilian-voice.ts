export const BRAZILIAN_VOICE_UNAVAILABLE =
  'Não encontrei uma voz em português do Brasil neste aparelho. Aguarde o carregamento das vozes ou instale uma voz brasileira nas configurações de voz do sistema e tente novamente.';

export function pickBrazilianVoice<T extends { lang: string; localService?: boolean }>(voices: readonly T[]): T | null {
  const brazilian = voices.filter(voice => voice.lang.toLowerCase().replaceAll('_', '-') === 'pt-br');
  return brazilian.find(voice => voice.localService) ?? brazilian[0] ?? null;
}
