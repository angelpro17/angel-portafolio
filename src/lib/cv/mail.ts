import { CV_FROM, NOTIFY_TO, RESEND_API_KEY } from 'astro:env/server';
import { dictionaries } from '@/i18n/dictionaries';
import { renderCode, renderCv, renderLead } from '@/emails/render';
import { resend } from '@/lib/resend';
import { cvFile } from './files';

type Lang = 'es' | 'en';

export const mailConfigured = () => Boolean(RESEND_API_KEY && CV_FROM);
const fill = (s: string, vars: Record<string, string>) => s.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');

/** Required: if this fails the request fails, so the visitor can retry. */
export async function sendCode(email: string, lang: Lang, code: string) {
  const m = dictionaries[lang].cv.mail;
  const { error } = await resend().emails.send({
    from: CV_FROM!,
    to: email,
    subject: fill(m.codeSubject, { code }),
    ...(await renderCode({ lang, code })),
  });
  if (error) throw new Error(`resend:code:${error.name}`);
}

/** Required: this is the CV the visitor asked for. */
export async function sendCv(email: string, lang: Lang) {
  const m = dictionaries[lang].cv.mail;
  const { error } = await resend().emails.send({
    from: CV_FROM!,
    to: email,
    subject: m.cvSubject,
    ...(await renderCv({ lang, fileName: m.cvFile })),
    attachments: [{ filename: m.cvFile, content: cvFile(lang) }],
  });
  if (error) throw new Error(`resend:cv:${error.name}`);
}

/**
 * Best effort: a failed notification never blocks the visitor's CV (it was already sent).
 * The Resend SDK returns `{ error }` instead of throwing, so both paths are logged with scope.
 */
export async function notifyLead(lead: { email: string; reason: string; phone: string; lang: Lang }) {
  if (!NOTIFY_TO) return;
  try {
    const { error } = await resend().emails.send({
      from: CV_FROM!,
      to: NOTIFY_TO,
      replyTo: lead.email,
      subject: `CV descargado: ${lead.email}`,
      ...(await renderLead({ ...lead, at: new Date().toISOString() })),
    });
    if (error) console.warn(`[cv] notify failed: ${error.name}`);
  } catch (err) {
    console.warn('[cv] notify failed', err);
  }
}
