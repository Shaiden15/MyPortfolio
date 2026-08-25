/* Project detail dialog and its three views.

   Content comes from three places, by design:
     - prose bullets   <template class="card-detail"> in the markup
     - architecture    data/architecture.js
     - file structure  data/file-trees.js

   Rich prose stays as HTML because that is what it is; structured data lives
   in JS because that is what it is. */

import { $, $$ } from '../lib/dom.js';
import { syncDialogs, wireDismiss } from '../lib/dialogs.js';
import { projectSlug } from '../lib/slug.js';
import { ARCHITECTURE } from '../data/architecture.js';
import { FILE_TREES } from '../data/file-trees.js';
import { buildDiagram, buildTree } from './architecture-view.js';
import { exportPdf, viewLabel } from './pdf-export.js';

const VIEWS = ['bullets', 'diagram', 'tree'];

/* What the modal is currently showing. The view toggle and the PDF export
   both read this, so they can never disagree about what is on screen. */
let current = { title: '', role: '', bullets: [], arch: null, tree: '', tags: [] };
let view = 'bullets';

function hasView(v) {
  if (v === 'bullets') return !!current.bullets.length;
  if (v === 'diagram') return !!current.arch;
  if (v === 'tree') return !!current.tree;
  return false;
}

function renderView() {
  const body = $('#detail-body');
  body.innerHTML = '';

  if (view === 'tree' && current.tree) {
    body.appendChild(buildTree(current.tree));
  } else if (view === 'diagram' && current.arch) {
    body.appendChild(buildDiagram(current.arch));
  } else {
    const list = document.createElement('ul');
    list.className = 'detail-list';
    current.bullets.forEach((html) => {
      const li = document.createElement('li');
      li.innerHTML = html;
      list.appendChild(li);
    });
    body.appendChild(list);
  }

  body.scrollTop = 0;
}

function setView(next) {
  /* Never sit on an empty view. The matching button is hidden so this should
     be unreachable, but the export reads `view` directly and an empty
     section would produce a blank PDF. */
  if (!hasView(next)) next = VIEWS.filter(hasView)[0] || 'bullets';

  view = next;

  $$('.view-btn', $('#detail-view-toggle')).forEach((b) => {
    b.classList.toggle('is-active', b.getAttribute('data-view') === next);
  });

  /* the export follows the toggle, so say which section it will produce */
  const dl = $('#detail-download');
  if (dl) dl.title = 'Download ' + viewLabel(next) + ' as PDF';

  renderView();
}

function readCard(card) {
  const title = card.getAttribute('data-title') || '';
  const key = projectSlug(title);
  const tpl = $('.card-detail', card);

  return {
    title,
    role: ($('.card-role', card) || {}).textContent || '',
    bullets: tpl ? $$('li', tpl.content).map((li) => li.innerHTML) : [],
    arch: ARCHITECTURE[key] || null,
    tree: FILE_TREES[key] || '',
    tags: $$('.tags li', card).map((t) => t.textContent)
  };
}

export function openDetail(card) {
  const modal = $('#detail-modal');
  if (!modal || !card) return;

  current = readCard(card);
  if (!current.bullets.length && !current.arch && !current.tree) return;

  $('#detail-title').textContent = current.title;
  $('#detail-role').textContent = current.role;

  /* only offer a view that has something behind it, and open on the first
     one that does — not every project carries all three */
  $$('.view-btn', $('#detail-view-toggle')).forEach((b) => {
    b.hidden = !hasView(b.getAttribute('data-view'));
  });
  setView(VIEWS.filter(hasView)[0]);

  const tags = $('#detail-tags');
  tags.innerHTML = '';
  current.tags.forEach((t) => {
    const li = document.createElement('li');
    li.textContent = t;
    tags.appendChild(li);
  });

  const link = $('#detail-link');
  const live = $('.card-link', card);
  if (live) {
    link.href = live.href;
    /* label comes from the card, so a demo video is not called "Visit site" */
    $('#detail-link-label').textContent = live.getAttribute('data-cta') || 'Visit site';
    link.hidden = false;
  } else {
    link.hidden = true;
  }

  modal.showModal();
  history.replaceState(null, '', '#' + card.id);
  syncDialogs();
}

export function initDetailModal() {
  const modal = $('#detail-modal');
  if (!modal) return;

  $$('[data-open-detail]').forEach((btn) => {
    btn.addEventListener('click', () => openDetail(btn.closest('.card')));
  });

  $$('.view-btn', $('#detail-view-toggle')).forEach((btn) => {
    btn.addEventListener('click', () => setView(btn.getAttribute('data-view')));
  });

  const dl = $('#detail-download');
  if (dl) dl.addEventListener('click', () => exportPdf(current, view));

  wireDismiss(modal, $('#detail-close'));
}

/* Used by the command palette and deep links to decide whether a card can
   open a modal at all. */
export function hasDetail(card) {
  const key = projectSlug(card.getAttribute('data-title') || '');
  return !!($('.card-detail', card) || ARCHITECTURE[key] || FILE_TREES[key]);
}
