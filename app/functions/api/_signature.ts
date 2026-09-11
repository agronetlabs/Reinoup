export function equalSignature(expected: string, actual: string | null): boolean {
  if (!actual || !/^[a-f\d]{64}$/i.test(actual)) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ actual.toLowerCase().charCodeAt(i);
  return diff === 0;
}

export async function sha256Hex(text: string): Promise<string> {
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyStripeSignature(payload: string, header: string | null, secret: string): Promise<boolean> {
  const parts = header?.split(',').map(part => part.trim().split('=')) ?? [];
  const timestamp = parts.find(([key]) => key === 't')?.[1];
  if (!timestamp || !/^\d+$/.test(timestamp) || Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return false;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signed = await crypto.subtle.sign('HMAC', key, encoder.encode(`${timestamp}.${payload}`));
  const expected = [...new Uint8Array(signed)].map(b => b.toString(16).padStart(2, '0')).join('');
  return parts.some(([name, signature]) => name === 'v1' && equalSignature(expected, signature));
}
