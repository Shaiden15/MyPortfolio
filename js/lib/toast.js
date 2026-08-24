/* Transient status messages, and the clipboard helper that uses them. */

import { $ } from './dom.js';

let timer;

export function say(msg) {
  const toast = $('#toast');
  if (!toast) return;

  toast.textContent = msg;
  toast.classList.add('is-on');

  window.clearTimeout(timer);
  timer = window.setTimeout(() => toast.classList.remove('is-on'), 2200);
}

export function copy(text) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(
      () => say('Copied ' + text),
      () => say('Copy failed — ' + text)
    );
    return;
  }

  /* file:// and plain http fall back to the old path */
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();

  try {
    document.execCommand('copy');
    say('Copied ' + text);
  } catch (e) {
    say(text);
  }

  document.body.removeChild(ta);
}
