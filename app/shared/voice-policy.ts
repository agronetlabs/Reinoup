// Identificadores de voz, não credenciais. Aprovação de uma amostra não autoriza
// reutilizar uma voz pessoal de outro projeto.
export const WITHDRAWN_VOICE_IDS: readonly string[] = ['qLqIiyI3C8MLNhPB514E'];
export const APPROVED_VOICE_IDS: readonly string[] = [];

export function isApprovedVoice(voiceId: unknown): voiceId is string {
  return typeof voiceId === 'string'
    && !WITHDRAWN_VOICE_IDS.includes(voiceId)
    && APPROVED_VOICE_IDS.includes(voiceId);
}

export function assertApprovedVoice(voiceId: unknown): asserts voiceId is string {
  if (!isApprovedVoice(voiceId)) {
    throw new Error('Voz não autorizada para o ReinoUp. Selecione e aprove uma voz brasileira própria para este projeto antes de gerar ou validar narrações.');
  }
}
