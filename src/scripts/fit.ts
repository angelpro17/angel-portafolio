/** Scales every banner so its widest line fills the banner, whatever font ends up rendering. */
function fitBanners(): void {
  document.querySelectorAll<HTMLElement>('.banner').forEach((banner) => {
    const text = banner.querySelector<HTMLElement>('.banner__text');
    if (!text) return;
    const lines = Array.from(banner.querySelectorAll<HTMLElement>('.banner__line'));
    const style = getComputedStyle(banner);
    const available = banner.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
    const size = parseFloat(getComputedStyle(text).fontSize);
    const widest = Math.max(...lines.map((line) => line.getBoundingClientRect().width));
    if (!widest || !available) return;
    text.style.setProperty('--size', `${((size * available) / widest).toFixed(2)}px`);
  });
}

let frame = 0;
const schedule = () => {
  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(fitBanners);
};

export function initFit(): void {
  fitBanners();
  document.fonts?.ready.then(fitBanners);
  window.removeEventListener('resize', schedule);
  window.addEventListener('resize', schedule, { passive: true });
}
