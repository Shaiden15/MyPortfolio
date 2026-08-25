/* Page furniture: copy buttons, the mobile drawer, the Durban clock and the
   footer year. Small things with no home of their own. */

import { $, $$ } from '../lib/dom.js';
import { copy } from '../lib/toast.js';

export function initCopyButtons() {
  $$('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', () => copy(btn.getAttribute('data-copy')));
  });
}

function setDrawer(open) {
  const drawer = $('#mobile-menu');
  const openBtn = $('#menu-open');
  if (!drawer) return;

  drawer.hidden = !open;
  document.body.classList.toggle('is-locked', open);
  if (openBtn) openBtn.setAttribute('aria-expanded', String(open));
}

export function initDrawer() {
  const drawer = $('#mobile-menu');
  if (!drawer) return;

  $('#menu-open').addEventListener('click', () => setDrawer(true));
  $('#menu-close').addEventListener('click', () => setDrawer(false));

  /* backdrop, or any nav link, closes it */
  drawer.addEventListener('click', (e) => {
    if (e.target === drawer || e.target.closest('.drawer-nav a')) setDrawer(false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !drawer.hidden) setDrawer(false);
  });
}

/* SAST is UTC+2 year-round - no DST to account for. */
export function initClock() {
  const clock = $('#clock');
  if (!clock) return;

  function tick() {
    const now = new Date();
    const sast = new Date(now.getTime() + (now.getTimezoneOffset() + 120) * 60000);
    clock.textContent =
      String(sast.getHours()).padStart(2, '0') + ':' +
      String(sast.getMinutes()).padStart(2, '0') + ' SAST';
  }

  tick();
  window.setInterval(tick, 30000);
}

export function initYear() {
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();
}
