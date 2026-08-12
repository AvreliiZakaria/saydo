const HEX: string[] = [];
for (let index = 0; index < 256; index += 1) HEX.push((index + 0x100).toString(16).slice(1));

type MaybeCrypto = { getRandomValues?: (array: Uint8Array) => Uint8Array };

function randomBytes(length: number): Uint8Array {
  const bytes = new Uint8Array(length);
  const webCrypto = (globalThis as { crypto?: MaybeCrypto }).crypto;
  if (webCrypto && typeof webCrypto.getRandomValues === 'function') {
    webCrypto.getRandomValues(bytes);
    return bytes;
  }
  for (let index = 0; index < length; index += 1) bytes[index] = Math.floor(Math.random() * 256);
  return bytes;
}

/**
 * RFC 4122 v4 identifier.
 *
 * Supabase stores `saydo_commitments.id` as `uuid`, so anything else is rejected
 * by Postgres before row level security is even evaluated. Uses the platform CSPRNG
 * when Hermes exposes one and falls back to Math.random otherwise; these ids are
 * database keys, not secrets.
 */
export function createId(): string {
  const bytes = randomBytes(16);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) => HEX[byte]);
  return [hex.slice(0, 4).join(''), hex.slice(4, 6).join(''), hex.slice(6, 8).join(''), hex.slice(8, 10).join(''), hex.slice(10, 16).join('')].join('-');
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isUuid(value: string): boolean {
  return UUID_PATTERN.test(value);
}
