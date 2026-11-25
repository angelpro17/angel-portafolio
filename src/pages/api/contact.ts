import type { APIRoute } from 'astro';
import { contactSchema, MIN_FILL_MS } from '@/lib/contact/schema';
import { contactConfigured, sendContact, sendReceipt } from '@/lib/contact/mail';
import { allow } from '@/lib/cv/limits';
import { ok, fail, sameOrigin } from '@/lib/responses';

export const prerender = false;

const FIELDS = new Set(['name', 'email', 'message', 'consent']);

export const POST: APIRoute = async ({ request, clientAddress }) => {
  if (!sameOrigin(request)) return fail(403, 'generic');

  // 1. parse
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail(400, 'generic');
  }

  // 2. honeypot: pretend success, reveal nothing
  if (typeof body === 'object' && body && (body as Record<string, unknown>).website) return ok();

  // 3. config (in dev without mail keys the message is logged instead of sent)
  const dev = import.meta.env.DEV && !contactConfigured();
  if (!dev && !contactConfigured()) return fail(503, 'unavailable');

  // 4. validate with the shared schema
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) return fail(422, FIELDS.has(String(parsed.error.issues[0]?.path[0])) ? String(parsed.error.issues[0].path[0]) : 'generic');
  const msg = parsed.data;

  // 5. too fast to be a person: same quiet success as the honeypot
  if (!dev && msg.elapsed < MIN_FILL_MS) return ok();

  // 6. rate limit: per IP and per email
  const ipOk = await allow('contact-ip', clientAddress ?? 'unknown', 5, 3600);
  const mailOk = await allow('contact-email', msg.email, 3, 3600);
  if (!ipOk || !mailOk) return fail(429, 'rate');

  // 7. act
  if (dev) {
    console.info(`[contact] dev message from ${msg.name} <${msg.email}>: ${msg.message}`);
    return ok();
  }
  try {
    await sendContact(msg);
  } catch (err) {
    console.error('[contact] send failed', err);
    return fail(502, 'generic', err);
  }
  // Never email a visitor-supplied address from a local run: only the owner's inbox receives dev tests.
  if (import.meta.env.DEV) console.info(`[contact] dev: receipt to ${msg.email} skipped`);
  else await sendReceipt(msg);
  return ok();
};
