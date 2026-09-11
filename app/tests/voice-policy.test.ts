import { describe, expect, test } from 'bun:test';
import {
  APPROVED_VOICES,
  APPROVED_VOICE_IDS,
  LIVE_CONVERSATION_ENABLED,
  VOICE_ROLES,
  WITHDRAWN_VOICE_IDS,
  assertApprovedVoiceForRole,
  isApprovedVoice,
  isApprovedVoiceForRole,
} from '../shared/voice-policy';

describe('project voice permissions', () => {
  test('catalog candidates never become production approvals automatically', () => {
    expect(APPROVED_VOICES).toEqual([]);
    expect(APPROVED_VOICE_IDS).toEqual([]);
    expect(LIVE_CONVERSATION_ENABLED).toBe(false);
  });

  test('withdrawn, missing and unknown voices are rejected for every role', () => {
    for (const role of VOICE_ROLES) {
      for (const voiceId of [undefined, null, '', 42, 'unreviewed-voice', ...WITHDRAWN_VOICE_IDS]) {
        expect(isApprovedVoiceForRole(voiceId, role)).toBe(false);
        expect(() => assertApprovedVoiceForRole(voiceId, role)).toThrow('não autorizada');
      }
    }
  });

  test('opening the mascot modal never mounts the conversation provider', async () => {
    const { MascotLiveChatModal } = await import('../src/components/mascot/MascotLiveChatModal');
    const modal = MascotLiveChatModal({ open: true, onClose() {}, agentId: 'unreviewed-agent' });
    expect(modal.props.children[0].type).toBe('div');
    expect(modal.props.children[1]).toBe(false);
  });

  test('versioned remote patch keeps speech and client overrides disabled', async () => {
    const patch = await Bun.file(new URL('../elevenlabs/cordeirinho.pt-BR.json', import.meta.url)).json();
    expect(patch.conversation_config.agent.language).toBe('pt-br');
    expect(patch.conversation_config.conversation.text_only).toBe(true);
    expect(patch.conversation_config.conversation.max_duration_seconds).toBe(300);
    expect(patch.conversation_config.platform_settings.overrides.conversation_config_override.conversation.text_only).toBe(false);
  });

  test('role approvals require both authorization and human sample acceptance', async () => {
    // Load an isolated fixture so fake approvals cannot escape into the app or other tests.
    const source = await Bun.file(new URL('../shared/voice-policy.ts', import.meta.url)).text();
    const fixture = source.replace(
      'export const APPROVED_VOICES: readonly VoiceApproval[] = [];',
      `export const APPROVED_VOICES: readonly VoiceApproval[] = [
        { voiceId: 'narrator-fixture', roles: ['narration'], authorizationReference: 'test-use', sampleApprovalReference: 'test-sample' },
        { voiceId: 'guide-fixture', roles: ['mascot', 'explanation'], authorizationReference: 'test-use', sampleApprovalReference: 'test-sample' },
        { voiceId: 'missing-sample', roles: ['narration'], authorizationReference: 'test-use', sampleApprovalReference: ' ' },
        { voiceId: 'missing-rights', roles: ['narration'], authorizationReference: '', sampleApprovalReference: 'test-sample' },
        { voiceId: '${WITHDRAWN_VOICE_IDS[0]}', roles: ['narration', 'mascot'], authorizationReference: 'test-use', sampleApprovalReference: 'test-sample' },
      ];`,
    );
    expect(fixture).not.toBe(source);
    const transpiler = new Bun.Transpiler({ loader: 'ts' });
    const fixtureUrl = `data:text/javascript;base64,${Buffer.from(transpiler.transformSync(fixture)).toString('base64')}`;
    const policy: typeof import('../shared/voice-policy') = await import(fixtureUrl);
    expect(policy.isApprovedVoice('narrator-fixture')).toBe(true);
    expect(policy.isApprovedVoiceForRole('narrator-fixture', 'mascot')).toBe(false);
    expect(policy.isApprovedVoiceForRole('guide-fixture', 'mascot')).toBe(true);
    expect(policy.isApprovedVoiceForRole('guide-fixture', 'explanation')).toBe(true);
    expect(policy.isApprovedVoice('guide-fixture')).toBe(false);
    expect(policy.isApprovedVoice('missing-sample')).toBe(false);
    expect(policy.isApprovedVoice('missing-rights')).toBe(false);
    expect(policy.isApprovedVoice(WITHDRAWN_VOICE_IDS[0])).toBe(false);
    expect(policy.APPROVED_VOICE_IDS).toContain('narrator-fixture');
    expect(policy.APPROVED_VOICE_IDS).not.toContain('missing-sample');
    expect(policy.APPROVED_VOICE_IDS).not.toContain('missing-rights');
    expect(policy.APPROVED_VOICE_IDS).not.toContain(WITHDRAWN_VOICE_IDS[0]);
    expect(policy.LIVE_CONVERSATION_ENABLED).toBe(false);
    expect(isApprovedVoice('narrator-fixture')).toBe(false);
  });
});
