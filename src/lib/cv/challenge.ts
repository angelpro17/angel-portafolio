import { createHmac, randomInt, randomBytes, timingSafeEqual } from 'node:crypto';

/**
 * Stateless challenge. The token carries the lead data plus an HMAC of the code, signed with
 * OTP_SECRET. The server stores nothing; the code only exists in the email we sent.
 * Single use and attempt caps are layered on top with Upstash when configured (see limits.ts).
 */
export const CODE_TTL_MS = 10 * 60 * 1000;

export interface ChallengePayload {
  /** nonce, also the single-use key */
  n: string;
  /** expiry (ms epoch) */
  x: number;
  e: string;
  l: 'es' | 'en';
  r: string;
  p: string;
  /** HMAC(code) */
  h: string;
}

const b64 = (buf: Buffer | string) => Buffer.from(buf).toString('base64url');
const mac = (secret: string, data: string) => createHmac('sha256', secret).update(data).digest();

const codeMac = (secret: string, nonce: string, email: string, code: string) =>
  mac(secret, `code|${nonce}|${email}|${code}`).toString('base64url');

export const newCode = () => String(randomInt(0, 1_000_000)).padStart(6, '0');

export function issue(secret: string, lead: { email: string; lang: 'es' | 'en'; reason: string; phone: string }) {
  const code = newCode();
  const n = randomBytes(12).toString('base64url');
  const payload: ChallengePayload = {
    n,
    x: Date.now() + CODE_TTL_MS,
    e: lead.email,
    l: lead.lang,
    r: lead.reason,
    p: lead.phone,
    h: codeMac(secret, n, lead.email, code),
  };
  const body = b64(JSON.stringify(payload));
  const token = `${body}.${mac(secret, body).toString('base64url')}`;
  return { code, token };
}

export type Check =
  | { ok: true; payload: ChallengePayload }
  | { ok: false; reason: 'invalid' | 'expired' | 'wrong-code' };

const safeEq = (a: string, b: string) => {
  const A = Buffer.from(a);
  const B = Buffer.from(b);
  return A.length === B.length && timingSafeEqual(A, B);
};

/** Verifies signature + expiry without the code (used before burning an attempt). */
export function open(secret: string, token: string): Check {
  const [body, sig] = token.split('.');
  if (!body || !sig || !safeEq(sig, mac(secret, body).toString('base64url'))) return { ok: false, reason: 'invalid' };
  let payload: ChallengePayload;
  try {
    payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
  } catch {
    return { ok: false, reason: 'invalid' };
  }
  if (typeof payload.x !== 'number' || Date.now() > payload.x) return { ok: false, reason: 'expired' };
  return { ok: true, payload };
}

export const codeMatches = (secret: string, payload: ChallengePayload, code: string) =>
  safeEq(payload.h, codeMac(secret, payload.n, payload.e, code));
