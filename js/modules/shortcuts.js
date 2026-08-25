/* Keyboard shortcuts.

   ?  shortcuts panel      T  toggle theme
   G then W / C / A / S / T  jump to a section

   G opens a 1.2s window for its follow-up key, the way vim-style chords in
   developer tools behave. */

import { $, $$ } from '../lib/dom.js';
import { syncDialogs, wireDismiss } from '../lib/dialogs.js';
import { goTo } from './scroll.js';
import { toggleTheme } from './theme.js';

const CHORD_MS = 1200;
const JUMPS = { w: 'projects', c: 'contact', a: 'about', s: 'skills' };

let goPending = false;
let goTimer;

function anyDialogOpen() {
  return $$('dialog[open]').length > 0;
}

function isTyping(t) {
  return t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
}

function onKeydown(e) {
  if (isTyping(e.target)) return;
  if (e.ctrlKey || e.metaKey || e.altKey) return;

  const panel = $('#shortcuts');

  if (e.key === '?') {
    e.preventDefault();
    if (!anyDialogOpen() && panel) { panel.showModal(); syncDialogs(); }
    return;
  }

  if (anyDialogOpen()) return;

  if (goPending) {
    goPending = false;
    window.clearTimeout(goTimer);

    const k = e.key.toLowerCase();
    if (JUMPS[k]) goTo(JUMPS[k]);
    else if (k === 't') window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  if (e.key.toLowerCase() === 'g') {
    goPending = true;
    goTimer = window.setTimeout(() => { goPending = false; }, CHORD_MS);
  } else if (e.key.toLowerCase() === 't') {
    toggleTheme();
  }
}

export function initShortcuts() {
  wireDismiss($('#shortcuts'), $('#shortcuts-close'));
  document.addEventListener('keydown', onKeydown);
}
