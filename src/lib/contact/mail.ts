import { CV_FROM, NOTIFY_TO, RESEND_API_KEY } from 'astro:env/server';
import { dictionaries } from '@/i18n/dictionaries';
import { renderContact, renderReceipt } from '@/emails/render';
import { resend } from '@/lib/resend';
import type { ContactMessage } from './schema';

export const contactConfigured = () => Boolean(RESEND_API_KEY && CV_FROM && NOTIFY_TO);

type Msg = Pick<ContactMessage, 'name' | 'email' | 'topic' | 'message' | 'lang'>;

/** Required: it is the only record of the message. If it fails the request fails and the visitor can retry. */
export async function sendContact(msg: Msg) {
  const { error } = await resend().emails.send({
    from: CV_FROM!,
    to: NOTIFY_TO!,
    replyTo: msg.email,
    // Local runs use your real Resend key: mark them so a test is never mistaken for a real visitor.
    subject: `${import.meta.env.DEV ? '[DEV] ' : ''}${dictionaries.es.email.contact.eyebrow}: ${msg.name}`,
    ...(await renderContact({ ...msg, at: new Date().toISOString() })),
  });
  if (error) throw new Error(`resend:contact:${error.name}`);
}

/**
 * Best effort: the message already reached Angel, so a failed receipt must not turn a success into an error.
 * The SDK returns `{ error }` instead of throwing, so both paths are logged with scope.
 */
export async function sendReceipt(msg: Msg) {
  try {
    const { error } = await resend().emails.send({
      from: CV_FROM!,
      to: msg.email,
      subject: dictionaries[msg.lang].email.receipt.title,
      ...(await renderReceipt(msg)),
    });
    if (error) console.warn(`[contact] receipt failed: ${error.name}`);
  } catch (err) {
    console.warn('[contact] receipt failed', err);
  }
}
