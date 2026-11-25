/** Helpers shared by the site's dialogs (CV request, contact). */

export const $ = <T extends Element>(root: ParentNode, sel: string) => root.querySelector<T>(sel);

/** Never leave the visitor waiting forever: after this the request is cancelled and an error shows. */
const TIMEOUT_MS = 25_000;
/** After this long we tell the visitor it is still on its way. */
const SLOW_MS = 4_000;

export async function post(url: string, body: unknown): Promise<{ ok: boolean; code?: string; [k: string]: unknown }> {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    return await res.json();
  } catch (e) {
    return { ok: false, code: e instanceof DOMException && e.name === 'TimeoutError' ? 'timeout' : 'network' };
  }
}

let slowTimer: number | undefined;

/**
 * Locks the form, shows the sweep bar + spinner, and announces progress to screen readers.
 * `message` is what is happening now; `slow` replaces it if the wait passes SLOW_MS.
 */
export function setBusy(form: HTMLFormElement, busy: boolean, message = '', slow = ''): void {
  const btn = $<HTMLButtonElement>(form, '.dlg__submit');
  const label = btn && $<HTMLElement>(btn, '[data-btn-text]');
  const status = $<HTMLElement>(form, '[data-status]');
  const dialog = form.closest<HTMLElement>('dialog');
  window.clearTimeout(slowTimer);
  if (busy) form.dataset.busy = '';
  else delete form.dataset.busy;
  if (dialog) {
    if (busy) dialog.dataset.busy = '';
    else delete dialog.dataset.busy;
  }
  form.setAttribute('aria-busy', String(busy));
  form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input:not([type="checkbox"]):not([type="radio"]), textarea').forEach((el) => (el.readOnly = busy));
  if (btn) btn.setAttribute('aria-disabled', String(busy)); // aria-disabled keeps keyboard focus on the button
  if (label && btn) label.textContent = (busy ? btn.dataset.busy : btn.dataset.label) ?? '';
  if (status) {
    status.textContent = busy ? message : '';
    if (busy && slow) slowTimer = window.setTimeout(() => (status.textContent = slow), SLOW_MS);
  }
}
