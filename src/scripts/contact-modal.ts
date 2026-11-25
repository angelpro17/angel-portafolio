import { $, post, setBusy } from './dialog-ui';

interface I18n {
  errors: Record<string, string>;
  status: { sending: string; slow: string };
}

type Step = 'request' | 'done';
let openedAt = 0;

function show(dialog: HTMLDialogElement, step: Step): void {
  dialog.querySelectorAll<HTMLElement>('[data-step]').forEach((el) => {
    el.hidden = el.dataset.step !== step;
    const msg = el.querySelector<HTMLElement>('[data-error]');
    if (msg) msg.textContent = '';
  });
  $<HTMLElement>(dialog, `[data-step="${step}"] input:not(.dlg__trap), [data-step="${step}"] button.dlg__submit`)?.focus();
}

function wire(dialog: HTMLDialogElement): void {
  if (dialog.dataset.ready) return;
  dialog.dataset.ready = '';
  const lang = dialog.dataset.lang === 'en' ? 'en' : 'es';
  const i18n = JSON.parse(document.getElementById('contact-i18n')?.textContent ?? '{}') as I18n;
  const form = $<HTMLFormElement>(dialog, '[data-step="request"]')!;
  const err = (code: string) => {
    const el = $<HTMLElement>(form, '[data-error]');
    if (el) el.textContent = code ? (i18n.errors[code] ?? i18n.errors.generic ?? '') : '';
  };

  dialog.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target === dialog || target.closest('[data-contact-close]')) dialog.close();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (form.dataset.busy !== undefined) return; // double click / Enter while waiting
    err('');
    const data = new FormData(form);
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();
    const field = (n: string) => $<HTMLElement>(form, `[name="${n}"]`);
    if (name.length < 2) return err('name'), field('name')?.focus();
    if (!$<HTMLInputElement>(form, 'input[name="email"]')!.checkValidity() || !email) return err('email'), field('email')?.focus();
    if (message.length < 10) return err('message'), field('message')?.focus();
    if (!data.get('consent')) return err('consent');

    setBusy(form, true, i18n.status.sending, i18n.status.slow);
    const res = await post('/api/contact', {
      name,
      email,
      topic: String(data.get('topic') ?? ''),
      message,
      lang,
      consent: true,
      website: String(data.get('website') ?? ''),
      elapsed: Date.now() - openedAt,
    });
    setBusy(form, false);
    if (!res.ok) return err(res.code ?? 'generic');

    const text = $<HTMLElement>(dialog, '[data-done-text]')!;
    text.textContent = (text.dataset.template ?? '').replace('{name}', name.split(/\s+/)[0] ?? name).replace('{email}', email);
    form.reset();
    show(dialog, 'done');
  });
}

let bound = false;
/** One delegated listener for the whole session; the dialog itself is re-created on navigation. */
export function initContactModal(): void {
  const dialog = document.getElementById('contact-dialog') as HTMLDialogElement | null;
  if (dialog) wire(dialog);
  if (bound) return;
  bound = true;
  document.addEventListener('click', (e) => {
    const trigger = (e.target as HTMLElement).closest('[data-contact-open]');
    if (!trigger) return;
    e.preventDefault();
    const d = document.getElementById('contact-dialog') as HTMLDialogElement | null;
    if (!d) return;
    // The mobile menu is a <details>: close it so the dialog is not hidden behind it.
    document.querySelector<HTMLDetailsElement>('.site-header__menu')?.removeAttribute('open');
    show(d, 'request');
    openedAt = Date.now();
    if (!d.open) d.showModal();
    $<HTMLElement>(d, '[data-step="request"] input[name="name"]')?.focus();
  });
}
