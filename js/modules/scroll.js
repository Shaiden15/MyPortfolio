/* Everything driven by scroll position: the header border, the reading
   progress bar, the back-to-top button, and which nav link is lit. */

import { $, $$, reduced, scrollBehavior } from '../lib/dom.js';

let ticking = false;

function onScroll() {
  const y = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;

  const header = $('.site-header');
  const bar = $('#progress-bar');
  const toTop = $('#to-top');

  if (header) header.classList.toggle('is-scrolled', y > 8);
  if (bar) bar.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
  if (toTop) toTop.classList.toggle('is-on', y > 600);

  ticking = false;
}

export function initScroll() {
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });

  onScroll();

  const toTop = $('#to-top');
  if (toTop) {
    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: scrollBehavior });
    });
  }
}

/* Highlight the nav link for whichever section is centred in the viewport. */
export function initNavHighlight() {
  const links = $$('.nav a[href^="#"]');
  const watched = links
    .map((link) => ({ el: document.getElementById(link.getAttribute('href').slice(1)), link }))
    .filter((s) => s.el);

  if (!watched.length || !('IntersectionObserver' in window)) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const hit = watched.find((s) => s.el === entry.target);
      if (!hit) return;
      links.forEach((l) => l.classList.remove('is-active'));
      hit.link.classList.add('is-active');
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  watched.forEach((s) => io.observe(s.el));
}

const REVEAL_TARGETS =
  '.section-head, .prose, .values li, .tl-item, .card, .skill-card, ' +
  '.edu, .certs li, .subhead, .contact-blurb, .contact-actions, .contact-list, ' +
  '.filters, .contact-form';

export function initReveal() {
  if (!('IntersectionObserver' in window) || reduced) return;

  const targets = $$(REVEAL_TARGETS);

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      io.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

  targets.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = (i % 5) * 60 + 'ms';
    io.observe(el);
  });

  /* Failsafe: if the observer never fires — a background tab on load, a
     browser quirk, a page that never composites — the content would sit at
     opacity 0 forever. Never let that happen. */
  window.setTimeout(() => {
    if (document.querySelector('.reveal.is-in')) return;
    targets.forEach((el) => {
      el.style.transitionDelay = '';
      el.classList.add('is-in');
    });
  }, 2500);
}

export function goTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: scrollBehavior });
}
