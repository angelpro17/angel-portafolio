import type { APIRoute } from 'astro';
import { OTP_SECRET } from 'astro:env/server';
import { requestSchema } from '@/lib/cv/schema';
import { issue } from '@/lib/cv/challenge';
import { allow } from '@/lib/cv/limits';
import { mailConfigured, sendCode } from '@/lib/cv/mail';
import { ok, fail, sameOrigin } from '@/lib/responses';

export const prerender = false;

const DEV_SECRET = 'dev-only-secret-change-me-dev-only-secret';

export const POST: APIRoute = async ({ request, clientAddress }) => {
  if (!sameOrigin(request)) return fail(403, 'invalid');

  // 1. parse
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail(400, 'invalid');
  }

  // 2. honeypot: pretend success, reveal nothing
  if (typeof body === 'object' && body && (body as Record<string, unknown>).website) return ok({ token: 'x'.repeat(40) });

  // 3. config
  const secret = OTP_SECRET ?? (import.meta.env.DEV ? DEV_SECRET : undefined);
  const dev = import.meta.env.DEV && !mailConfigured();
  if (!secret || (!dev && !mailConfigured())) return fail(503, 'unavailable');

  // 4. validate
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    const consent = parsed.error.issues.some((i) => i.path[0] === 'consent');
    return fail(422, consent ? 'consent' : 'email');
  }
  const lead = parsed.data;

  // 5. rate limit: per IP and per email
  const ipOk = await allow('req-ip', clientAddress ?? 'unknown', 8, 3600);
  const mailOk = await allow('req-email', lead.email, 3, 3600);
  if (!ipOk || !mailOk) return fail(429, 'rate');

  // 6. act
  const { code, token } = issue(secret, lead);
  if (dev) {
    console.info(`[cv] dev code for ${lead.email}: ${code}`);
    return ok({ token, devCode: code });
  }
  try {
    await sendCode(lead.email, lead.lang, code);
  } catch (err) {
    console.error('[cv] send code failed', err);
    return fail(502, 'generic', err);
  }
  return ok({ token });
};
