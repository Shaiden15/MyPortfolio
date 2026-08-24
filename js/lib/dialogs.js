/* Shared dialog state.

   Every dialog on the page routes its cleanup through syncDialogs(). We do
   NOT rely on the native 'close' event alone: if it ever failed to fire the
   body would stay scroll-locked and the page would look frozen. So cleanup
   reads live DOM state, is idempotent, and is called directly at each close
   site as well as after Escape. */

import { $, $$ } from './dom.js';

export function syncDialogs() {
  const drawer = $('#mobile-menu');
  const anyOpen = $$('dialog[open]').length > 0 || (drawer && !drawer.hidden);
  document.body.classList.toggle('is-locked', !!anyOpen);

  /* a closed detail modal must not leave its deep link in the URL */
  const detail = $('#detail-modal');
  if (detail && !detail.open && window.location.hash.indexOf('#project-') === 0) {
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }

  /* drop the lightbox source so the image is not held in memory */
  const lb = $('#lightbox');
  if (lb && !lb.open) {
    const img = $('#lightbox-img');
    if (img) img.removeAttribute('src');
  }
}

/* Close a dialog and clean up immediately. */
export function shut(d) {
  if (d && d.open) d.close();
  syncDialogs();
}

/* Wire the two ways every dialog can be dismissed.

   Backdrop detection compares the event target against the dialog itself —
   a backdrop click targets the dialog element, anything inside targets a
   child. Do NOT test pointer coordinates: keyboard activation reports 0,0,
   which reads as a backdrop click and would close the dialog on every
   Enter press. */
export function wireDismiss(dialog, closeBtn) {
  if (!dialog) return;

  if (closeBtn) closeBtn.addEventListener('click', () => shut(dialog));

  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) shut(dialog);
  });

  dialog.addEventListener('close', syncDialogs);
}

/* Escape closes dialogs natively — re-sync on the next tick. */
export function initDialogs() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') window.setTimeout(syncDialogs, 0);
  });
}
