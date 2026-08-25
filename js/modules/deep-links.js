/* Shareable links to a single project.

   Each card takes an id derived from its title, so #project-payitsmart
   scrolls to that card and opens its detail modal. The modal writes the
   hash on open; syncDialogs clears it on close. */

import { $$ } from '../lib/dom.js';
import { projectId } from '../lib/slug.js';
import { openDetail, hasDetail } from './detail-modal.js';

function openFromHash() {
  const id = window.location.hash.slice(1);
  if (!id || id.indexOf('project-') !== 0) return;

  const card = document.getElementById(id);
  if (!card) return;

  card.scrollIntoView({ behavior: 'auto', block: 'center' });
  if (hasDetail(card)) window.setTimeout(() => openDetail(card), 250);
}

export function initDeepLinks() {
  $$('#project-grid .card').forEach((card) => {
    card.id = projectId(card.getAttribute('data-title'));
  });

  window.addEventListener('hashchange', openFromHash);
  openFromHash();
}
