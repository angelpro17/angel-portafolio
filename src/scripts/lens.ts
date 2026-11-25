/**
 * X-ray lens: a circle that follows the pointer and shows the system layer under the product.
 * Pointer devices get the lens; touch and keyboard get a "See system / See product" toggle.
 */
const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initLens(): void {
  document.querySelectorAll<HTMLElement>('[data-lens]').forEach((card) => {
    if (card.dataset.lensReady) return;
    card.dataset.lensReady = '1';

    const stage = card.querySelector<HTMLElement>('.lens__stage');
    if (!stage || card.dataset.hasShot !== 'true') return;

    stage.style.setProperty('--lens-radius', `${Number(card.dataset.lensRadius ?? 150)}px`);

    const follow = (event: PointerEvent) => {
      const box = stage.getBoundingClientRect();
      stage.style.setProperty('--lens-x', `${event.clientX - box.left}px`);
      stage.style.setProperty('--lens-y', `${event.clientY - box.top}px`);
    };
    const usable = (event: PointerEvent) => event.pointerType !== 'touch' && !reduceMotion();

    card.addEventListener('pointerenter', (event) => {
      if (!usable(event)) return;
      follow(event);
      stage.dataset.on = '';
    });
    card.addEventListener('pointermove', (event) => {
      if (usable(event)) follow(event);
    });
    card.addEventListener('pointerleave', () => {
      delete stage.dataset.on;
    });

    const toggle = card.querySelector<HTMLButtonElement>('[data-lens-toggle]');
    toggle?.addEventListener('click', () => {
      const system = card.dataset.mode !== 'system';
      card.dataset.mode = system ? 'system' : 'product';
      toggle.setAttribute('aria-pressed', String(system));
      toggle.textContent = system ? (toggle.dataset.hide ?? '') : (toggle.dataset.show ?? '');
    });
  });
}
