import { $, post, setBusy } from './dialog-ui';

type Step = 'request' | 'verify' | 'done';
interface I18n {
  errors: Record<string, string>;
  devNote: string;
  status: { sending: string; verifying: string; slow: string };
}


let token = '';
let email = '';


function show(dialog: HTMLDialogElement, step: Step): void {
  dialog.querySelectorAll<HTMLElement>('[data-step]').forEach((el) => {
    el.hidden = el.dataset.step !== step;
    const msg = el.querySelector<HTMLElement>('[data-error]');
    if (msg) msg.textContent = '';
  });
  const first = $<HTMLElement>(dialog, `[data-step="${step}"] input:not(.dlg__trap), [data-step="${step}"] button.dlg__submit`);
  first?.focus();
}

function wire(dialog: HTMLDialogElement): void {
  if (dialog.dataset.ready) return;
  dialog.dataset.ready = '';
  const lang = dialog.dataset.lang === 'en' ? 'en' : 'es';
  const i18n = JSON.parse(document.getElementById('cv-i18n')?.textContent ?? '{}') as I18n;
  const err = (form: HTMLElement, code: string) => {
    const el = $<HTMLElement>(form, '[data-error]');
    if (el) el.textContent = code ? (i18n.errors[code] ?? i18n.errors.generic ?? '') : '';
  };

  dialog.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target === dialog || target.closest('[data-cv-close]')) dialog.close();
    if (target.closest('[data-cv-restart]')) show(dialog, 'request');
  });

  const requestForm = $<HTMLFormElement>(dialog, '[data-step="request"]')!;

  // Reason: pick a preset or "Other" and write it. The text box only exists for "Other".
  const other = $<HTMLElement>(requestForm, '[data-other]')!;
  const syncOther = () => {
    const open = $<HTMLInputElement>(requestForm, 'input[name="reasonKind"]:checked')?.value === 'other';
    other.hidden = !open;
    return open;
  };
  requestForm.addEventListener('change', (e) => {
    if ((e.target as HTMLInputElement).name !== 'reasonKind') return;
    if (syncOther()) $<HTMLTextAreaElement>(other, 'textarea')?.focus();
  });
  requestForm.addEventListener('reset', () => queueMicrotask(syncOther));
  /** The reason sent to the server: the chosen preset, or the typed text for "Other". */
  const readReason = (data: FormData): string => {
    const checked = $<HTMLInputElement>(requestForm, 'input[name="reasonKind"]:checked');
    if (!checked) return '';
    if (checked.value !== 'other') return checked.dataset.label ?? '';
    return String(data.get('reasonOther') ?? '').trim() || (checked.dataset.label ?? '');
  };
  requestForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (requestForm.dataset.busy !== undefined) return; // double click / Enter while waiting
    err(requestForm, '');
    const data = new FormData(requestForm);
    const mail = String(data.get('email') ?? '').trim();
    const input = $<HTMLInputElement>(requestForm, 'input[name="email"]')!;
    if (!input.checkValidity() || !mail) return err(requestForm, 'email'), input.focus();
    if (!data.get('consent')) return err(requestForm, 'consent');

    setBusy(requestForm, true, i18n.status.sending, i18n.status.slow);
    const res = await post('/api/cv/request', {
      email: mail,
      reason: readReason(data),
      phone: String(data.get('phone') ?? ''),
      lang,
      consent: true,
      website: String(data.get('website') ?? ''),
    });
    setBusy(requestForm, false);
    if (!res.ok) return err(requestForm, res.code ?? 'generic');

    token = String(res.token);
    email = mail;
    const intro = $<HTMLElement>(dialog, '[data-code-intro]')!;
    intro.textContent = (intro.dataset.template ?? '').replace('{email}', mail);
    const dev = $<HTMLElement>(dialog, '[data-dev]')!;
    dev.hidden = !res.devCode;
    if (res.devCode) dev.textContent = `${i18n.devNote} ${res.devCode}`;
    show(dialog, 'verify');
  });

  const verifyForm = $<HTMLFormElement>(dialog, '[data-step="verify"]')!;
  // Keyboard autofill (iOS Mail/Messages) and paste fill all six digits at once: verify right away.
  $<HTMLInputElement>(verifyForm, 'input[name="code"]')?.addEventListener('input', (e) => {
    const input = e.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '');
    if (digits !== input.value) input.value = digits;
    if (digits.length === 6 && verifyForm.dataset.busy === undefined) verifyForm.requestSubmit();
  });
  verifyForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (verifyForm.dataset.busy !== undefined) return;
    err(verifyForm, '');
    const code = String(new FormData(verifyForm).get('code') ?? '').replace(/\s/g, '');
    if (!/^\d{6}$/.test(code)) return err(verifyForm, 'code');

    setBusy(verifyForm, true, i18n.status.verifying, i18n.status.slow);
    const res = await post('/api/cv/verify', { token, code });
    setBusy(verifyForm, false);
    if (!res.ok) {
      if (res.code === 'expired' || res.code === 'invalid' || res.code === 'used') {
        err(verifyForm, res.code);
      } else err(verifyForm, res.code ?? 'generic');
      return;
    }
    const text = $<HTMLElement>(dialog, '[data-done-text]')!;
    text.textContent = (text.dataset.template ?? '').replace('{email}', email);
    token = '';
    verifyForm.reset();
    requestForm.reset();
    show(dialog, 'done');
  });
}

let bound = false;
/** One delegated listener for the whole session; the dialog itself is re-created on navigation. */
export function initCvModal(): void {
  const dialog = document.getElementById('cv-dialog') as HTMLDialogElement | null;
  if (dialog) wire(dialog);
  if (bound) return;
  bound = true;
  document.addEventListener('click', (e) => {
    const trigger = (e.target as HTMLElement).closest('[data-cv-open]');
    if (!trigger) return;
    e.preventDefault();
    const d = document.getElementById('cv-dialog') as HTMLDialogElement | null;
    if (!d) return;
    // The mobile menu is a <details>: close it so the dialog is not hidden behind it.
    document.querySelector<HTMLDetailsElement>('.site-header__menu')?.removeAttribute('open');
    show(d, 'request');
    if (!d.open) d.showModal();
    $<HTMLElement>(d, '[data-step="request"] input[name="email"]')?.focus();
  });
}
