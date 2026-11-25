/** Counts a number from `data-count-from` to `data-count-to` once, when it scrolls into view. */
let observer: IntersectionObserver | null = null;

export function initCounters(): void {
  observer?.disconnect();
  const items = document.querySelectorAll<HTMLElement>('[data-count-to]');
  if (!items.length || matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        run(entry.target as HTMLElement);
        observer?.unobserve(entry.target);
      }
    },
    { threshold: 0.6 },
  );
  items.forEach((el) => observer?.observe(el));
}

function run(el: HTMLElement): void {
  const from = Number(el.dataset.countFrom ?? 0);
  const to = Number(el.dataset.countTo ?? 0);
  const prefix = el.dataset.prefix ?? '';
  const suffix = el.dataset.suffix ?? '';
  if (from === to) return;
  const duration = 1200;
  const start = performance.now();
  const ease = (t: number) => 1 - Math.pow(1 - t, 4);
  const frame = (now: number) => {
    const t = Math.min((now - start) / duration, 1);
    el.textContent = `${prefix}${Math.round(from + (to - from) * ease(t))}${suffix}`;
    if (t < 1) requestAnimationFrame(frame);
  };
  el.textContent = `${prefix}${from}${suffix}`;
  requestAnimationFrame(frame);
}
