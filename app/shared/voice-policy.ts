// Identificadores de voz, não credenciais. Aprovação de uma amostra não autoriza
// reutilizar uma voz pessoal de outro projeto.
export const WITHDRAWN_VOICE_IDS: readonly string[] = ['qLqIiyI3C8MLNhPB514E'];

export const VOICE_ROLES = ['narration', 'mascot', 'explanation', 'hero', 'challenge', 'premium'] as const;
export type VoiceRole = typeof VOICE_ROLES[number];

export interface VoiceApproval {
  voiceId: string;
  roles: readonly VoiceRole[];
  authorizationReference: string;
  sampleApprovalReference: string;
}

// Referências de aprovação sem dados pessoais ou segredos, nunca só o nome no catálogo.
export const APPROVED_VOICES: readonly VoiceApproval[] = [];
export const APPROVED_VOICE_IDS: readonly string[] = APPROVED_VOICES
  .filter(approval => isApprovedVoiceForRole(approval.voiceId, 'narration'))
  .map(approval => approval.voiceId);

// Aprovar áudio estático não autoriza microfone, sessão do SDK ou conversa remota.
export const LIVE_CONVERSATION_ENABLED: boolean = false;

export function isApprovedVoiceForRole(voiceId: unknown, role: VoiceRole): voiceId is string {
  return typeof voiceId === 'string'
    && !WITHDRAWN_VOICE_IDS.includes(voiceId)
    && APPROVED_VOICES.some(approval =>
      approval.voiceId === voiceId
      && approval.roles.includes(role)
      && approval.authorizationReference.trim().length > 0
      && approval.sampleApprovalReference.trim().length > 0
    );
}

export function isApprovedVoice(voiceId: unknown): voiceId is string {
  return isApprovedVoiceForRole(voiceId, 'narration');
}

export function assertApprovedVoiceForRole(voiceId: unknown, role: VoiceRole): asserts voiceId is string {
  if (!isApprovedVoiceForRole(voiceId, role)) {
    throw new Error(`Voz não autorizada para a função ${role} no ReinoUp. Confirme autorização de uso e aprovação da amostra antes de gerar áudio.`);
  }
}

export function assertApprovedVoice(voiceId: unknown): asserts voiceId is string {
  if (!isApprovedVoice(voiceId)) {
    throw new Error('Voz não autorizada para o ReinoUp. Selecione e aprove uma voz brasileira própria para este projeto antes de gerar ou validar narrações.');
  }
}
