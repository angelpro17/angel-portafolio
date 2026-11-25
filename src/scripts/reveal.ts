/**
 * Adds `.is-in` to [data-reveal] and `.is-drawn` to diagrams when they enter the viewport.
 * A clipped element (data-reveal="wipe") can never intersect on its own, so its parent is observed instead.
 */
let observer: IntersectionObserver | null = null;

export function initReveal(): void {
  observer?.disconnect();
  const targets = document.querySelectorAll<HTMLElement>('[data-reveal], [data-draw]');
  if (!('IntersectionObserver' in window)) {
    targets.forEach(mark);
    return;
  }

  const hosts = new Map<Element, HTMLElement[]>();
  targets.forEach((el) => {
    const host = el.dataset.reveal === 'wipe' ? (el.parentElement ?? el) : el;
    hosts.set(host, [...(hosts.get(host) ?? []), el]);
  });

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        hosts.get(entry.target)?.forEach(mark);
        observer?.unobserve(entry.target);
      }
    },
    { threshold: 0, rootMargin: '0px 0px -8% 0px' },
  );
  hosts.forEach((_, host) => observer?.observe(host));
}

function mark(el: HTMLElement): void {
  el.classList.add(el.hasAttribute('data-draw') ? 'is-drawn' : 'is-in');
}
