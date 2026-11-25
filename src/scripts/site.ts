import { initReveal } from './reveal';
import { initLens } from './lens';
import { initTabs } from './tabs';
import { initCounters } from './counters';
import { initFit } from './fit';
import { initC4 } from './c4';
import { initCvModal } from './cv-modal';
import { initContactModal } from './contact-modal';

const updateHeader = () =>
  document.querySelector('[data-header]')?.toggleAttribute('data-scrolled', window.scrollY > 8);
// One listener for the whole session; the header element itself is swapped on navigation.
window.addEventListener('scroll', updateHeader, { passive: true });

function initVeil(): void {
  const veil = document.querySelector('.veil');
  veil?.addEventListener('animationend', (event) => {
    if ((event as AnimationEvent).animationName === 'veil-out') document.documentElement.dataset.veil = 'done';
  });
}

// `astro:page-load` fires on the first load and after every client-side navigation.
document.addEventListener('astro:page-load', () => {
  initVeil();
  initFit();
  updateHeader();
  initTabs();
  initC4();
  initLens();
  initCvModal();
  initContactModal();
  initCounters();
  initReveal();
});
