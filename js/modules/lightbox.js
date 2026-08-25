/* Project screenshots and their lightbox.

   A screenshot that has not been added yet must never render as a broken
   image — the card falls through to the CSS initials placeholder instead.
   Images therefore start hidden and are only revealed once JS confirms a
   real one loaded. */

import { $, $$ } from '../lib/dom.js';
import { syncDialogs, wireDismiss } from '../lib/dialogs.js';

function zoom(media, img) {
  const lb = $('#lightbox');
  if (!media.classList.contains('has-shot') || !lb) return;

  $('#lightbox-img').src = img.currentSrc || img.src;
  $('#lightbox-img').alt = img.alt;
  $('#lightbox-cap').textContent = img.alt;

  lb.showModal();
  syncDialogs();
}

function wireMedia(media) {
  const img = $('img', media);
  if (!img) return;

  const missing = () => media.classList.add('no-shot');

  function present() {
    media.classList.add('has-shot');
    media.setAttribute('role', 'button');
    media.setAttribute('tabindex', '0');
    media.setAttribute('aria-label', 'Enlarge ' + img.alt);

    /* Hand the blurred letterbox backdrop its image. This is set here rather
       than in the markup because a relative url() inside a custom property
       resolves against the stylesheet, not the document — it would look for
       css/parts/assets/shots/… and 404. currentSrc is already absolute. */
    if (media.classList.contains('is-contain')) {
      media.style.setProperty('--shot', 'url("' + (img.currentSrc || img.src) + '")');
    }
  }

  /* guard against 404 pages served as images with no real dimensions */
  const settle = () => (img.naturalWidth > 1 ? present() : missing());

  img.addEventListener('error', missing);
  img.addEventListener('load', settle);
  if (img.complete) settle();

  media.addEventListener('click', () => zoom(media, img));
  media.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      zoom(media, img);
    }
  });
}

export function initLightbox() {
  $$('.card-media').forEach(wireMedia);
  wireDismiss($('#lightbox'), $('#lightbox-close'));
}
