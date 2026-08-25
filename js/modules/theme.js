/* Light / dark theme.

   Follows the OS until the visitor picks a side, then remembers that choice.
   localStorage is wrapped because private mode can throw on access. */

import { $ } from '../lib/dom.js';

const root = document.documentElement;
let chosen = null;

function remember(value) {
  try {
    localStorage.setItem('theme', value);
  } catch (e) {
    /* private mode - the choice still applies for this session */
  }
}

export function initTheme() {
  try {
    chosen = localStorage.getItem('theme');
  } catch (e) {
    chosen = null;
  }

  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  root.setAttribute('data-theme', chosen || (mq.matches ? 'dark' : 'light'));

  /* only track the OS while the visitor has not overridden it */
  mq.addEventListener('change', (e) => {
    if (!chosen) root.setAttribute('data-theme', e.matches ? 'dark' : 'light');
  });

  const btn = $('#theme-toggle');
  if (!btn) return;

  btn.addEventListener('click', () => {
    chosen = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', chosen);
    remember(chosen);
  });
}

/* Used by the command palette and the T shortcut. */
export function toggleTheme() {
  const btn = $('#theme-toggle');
  if (btn) btn.click();
}
