/* Tiny DOM helpers shared by every module.
   Deliberately not a library - just the three things we reach for. */

export function $(sel, ctx) {
  return (ctx || document).querySelector(sel);
}

export function $$(sel, ctx) {
  return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
}

export function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

/* Read once at load. Every animation path checks this before running. */
export const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Scroll behaviour that respects the reduced-motion setting. */
export const scrollBehavior = reduced ? 'auto' : 'smooth';
