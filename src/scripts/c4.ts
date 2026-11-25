/** Level switcher for the architecture section. Without JS every level stays visible, stacked. */
export function initC4(): void {
  document.querySelectorAll<HTMLElement>('[data-c4]').forEach((root) => {
    if (root.dataset.ready) return;
    const tabs = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-c4-tab]'));
    const views = Array.from(root.querySelectorAll<HTMLElement>('[data-c4-view]'));
    if (tabs.length < 2) return;
    root.dataset.ready = '';

    const select = (index: number, focus = false) => {
      tabs.forEach((tab, i) => {
        const on = i === index;
        tab.setAttribute('aria-selected', String(on));
        tab.tabIndex = on ? 0 : -1;
        views[i].hidden = !on;
        if (on && focus) tab.focus();
      });
    };
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(i));
      tab.addEventListener('keydown', (event) => {
        const last = tabs.length - 1;
        const next =
          event.key === 'ArrowRight' ? (i === last ? 0 : i + 1)
          : event.key === 'ArrowLeft' ? (i === 0 ? last : i - 1)
          : -1;
        if (next < 0) return;
        event.preventDefault();
        select(next, true);
      });
    });
    select(Math.min(1, tabs.length - 1));
  });
}
