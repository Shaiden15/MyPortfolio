/* Hero stat counters — count up when scrolled into view. */

import { $$, reduced } from '../lib/dom.js';

const DURATION = 1400;

function run(el) {
  const target = parseInt(el.getAttribute('data-count'), 10);

  if (reduced) {
    el.textContent = target;
    return;
  }

  let start = null;

  function step(now) {
    if (start === null) start = now;
    const p = Math.min((now - start) / DURATION, 1);
    /* easeOutExpo — fast, then settles */
    const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
    el.textContent = Math.round(target * eased);
    if (p < 1) window.requestAnimationFrame(step);
  }

  window.requestAnimationFrame(step);
}

export function initCounters() {
  const counters = $$('[data-count]');
  if (!counters.length) return;

  if (!('IntersectionObserver' in window)) {
    counters.forEach((el) => { el.textContent = el.getAttribute('data-count'); });
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      run(entry.target);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.6 });

  counters.forEach((el) => io.observe(el));

  /* Same failsafe as the scroll reveal — a stat stuck on 0 reads as broken. */
  window.setTimeout(() => {
    counters.forEach((el) => {
      if (el.textContent === '0') el.textContent = el.getAttribute('data-count');
    });
  }, 2500);
}
