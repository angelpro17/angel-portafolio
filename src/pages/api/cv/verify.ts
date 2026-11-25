import type { APIRoute } from 'astro';
import { OTP_SECRET } from 'astro:env/server';
import { verifySchema } from '@/lib/cv/schema';
import { open, codeMatches, CODE_TTL_MS } from '@/lib/cv/challenge';
import { allow, consume } from '@/lib/cv/limits';
import { mailConfigured, sendCv, notifyLead } from '@/lib/cv/mail';
import { ok, fail, sameOrigin } from '@/lib/responses';

export const prerender = false;

const DEV_SECRET = 'dev-only-secret-change-me-dev-only-secret';

export const POST: APIRoute = async ({ request, clientAddress }) => {
  if (!sameOrigin(request)) return fail(403, 'invalid');

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail(400, 'invalid');
  }

  const secret = OTP_SECRET ?? (import.meta.env.DEV ? DEV_SECRET : undefined);
  const dev = import.meta.env.DEV && !mailConfigured();
  if (!secret || (!dev && !mailConfigured())) return fail(503, 'unavailable');

  const parsed = verifySchema.safeParse(body);
  if (!parsed.success) return fail(422, 'code');

  if (!(await allow('verify-ip', clientAddress ?? 'unknown', 20, 3600))) return fail(429, 'rate');

  const challenge = open(secret, parsed.data.token);
  if (!challenge.ok) return fail(400, challenge.reason === 'expired' ? 'expired' : 'invalid');
  const { payload } = challenge;

  // 5 guesses per challenge: a 6-digit code must not be brute-forceable.
  if (!(await allow('verify-nonce', payload.n, 5, CODE_TTL_MS / 1000))) return fail(429, 'rate');
  if (!codeMatches(secret, payload, parsed.data.code)) return fail(401, 'wrong');

  // Single use: the same code cannot trigger a second send.
  if (!(await consume(payload.n, CODE_TTL_MS / 1000))) return fail(409, 'used');

  if (dev) {
    console.info(`[cv] verified ${payload.e} (dev, no email sent)`);
    return ok({ email: payload.e, sent: false });
  }
  try {
    await sendCv(payload.e, payload.l);
  } catch (err) {
    console.error('[cv] send cv failed', err);
    return fail(502, 'generic', err);
  }
  await notifyLead({ email: payload.e, reason: payload.r, phone: payload.p, lang: payload.l });
  return ok({ email: payload.e, sent: true });
};
