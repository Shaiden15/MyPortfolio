/* Command palette (Ctrl/Cmd + K).

   The index is built from the page itself at load, so it never goes stale:
   add a section or a project and it appears here with no change to this
   file. */

import { $, $$, escapeHtml, reduced, scrollBehavior } from '../lib/dom.js';
import { shut, syncDialogs, wireDismiss } from '../lib/dialogs.js';
import { copy } from '../lib/toast.js';
import { toggleTheme } from './theme.js';
import { openDetail, hasDetail } from './detail-modal.js';

const EMAIL = 'shaidenpillay15@gmail.com';
const GITHUB = 'https://github.com/Shaiden15';

let index = [];
let selected = 0;

function buildIndex() {
  const items = [];

  $$('main section[id]').forEach((sec) => {
    const h = $('h2', sec);
    if (!h) return;
    items.push({
      group: 'Sections', label: h.textContent.trim(), sub: '#' + sec.id, icon: '§',
      action: () => document.getElementById(sec.id).scrollIntoView({ behavior: scrollBehavior })
    });
  });

  $$('#project-grid .card').forEach((card) => {
    items.push({
      group: 'Projects',
      label: card.getAttribute('data-title'),
      sub: ($('.badge', card) || {}).textContent || 'Project',
      icon: ($('.card-index', card) || {}).textContent || '#',
      keywords: $$('.tags li', card).map((t) => t.textContent).join(' '),
      action: () => {
        card.scrollIntoView({ behavior: scrollBehavior, block: 'center' });
        if (hasDetail(card)) {
          window.setTimeout(() => openDetail(card), reduced ? 0 : 420);
        }
      }
    });
  });

  items.push(
    { group: 'Links', label: 'Email Shaiden', sub: 'mailto', icon: '@',
      action: () => { window.location.href = 'mailto:' + EMAIL; } },
    { group: 'Links', label: 'Copy email address', sub: 'clipboard', icon: '⧉',
      action: () => copy(EMAIL) },
    { group: 'Links', label: 'GitHub profile', sub: 'external', icon: '↗',
      action: () => window.open(GITHUB, '_blank', 'noopener') },
    { group: 'Links', label: 'Download CV', sub: 'PDF', icon: '⤓',
      keywords: 'resume cv pdf download',
      action: () => { const a = $('.cv-btn'); if (a) a.click(); } },
    { group: 'Actions', label: 'Toggle light / dark theme', sub: 'theme', icon: '◐',
      action: toggleTheme },
    { group: 'Actions', label: 'Print this page as a CV', sub: 'print', icon: '⎙',
      action: () => window.print() },
    { group: 'Actions', label: 'Keyboard shortcuts', sub: '?', icon: '⌘',
      action: () => { const s = $('#shortcuts'); if (s) { s.showModal(); syncDialogs(); } } }
  );

  return items;
}

function items() { return $$('.cmdk-item', $('#cmdk-results')); }

function select(i) {
  const list = items();
  if (!list.length) return;
  selected = Math.max(0, Math.min(i, list.length - 1));
  list.forEach((el, n) => el.classList.toggle('is-sel', n === selected));
  list[selected].scrollIntoView({ block: 'nearest' });
}

function render(query) {
  const out = $('#cmdk-results');
  const q = query.trim().toLowerCase();

  const hits = index.filter((item) => {
    if (!q) return true;
    return (item.label + ' ' + item.group + ' ' + (item.keywords || ''))
      .toLowerCase().indexOf(q) !== -1;
  });

  out.innerHTML = '';
  selected = 0;

  if (!hits.length) {
    out.innerHTML = `<li class="cmdk-empty">No results for "${escapeHtml(query)}"</li>`;
    return;
  }

  let lastGroup = null;
  hits.forEach((item, i) => {
    if (item.group !== lastGroup) {
      const g = document.createElement('li');
      g.className = 'cmdk-group';
      g.textContent = item.group;
      out.appendChild(g);
      lastGroup = item.group;
    }

    const li = document.createElement('li');
    li.className = 'cmdk-item' + (i === 0 ? ' is-sel' : '');
    li.setAttribute('role', 'option');
    li.dataset.i = i;
    li.innerHTML =
      `<span class="ci-icon">${escapeHtml(item.icon)}</span>` +
      `<span>${escapeHtml(item.label)}</span>` +
      `<span class="ci-sub">${escapeHtml(item.sub)}</span>`;

    li.addEventListener('click', () => { close(); item.action(); });
    li.addEventListener('mousemove', () => select(i));
    out.appendChild(li);
  });

  out._hits = hits;
}

function open() {
  const cmdk = $('#cmdk');
  if (!cmdk) return;
  const input = $('#cmdk-input');
  input.value = '';
  render('');
  cmdk.showModal();
  syncDialogs();
  input.focus();
}

function close() { shut($('#cmdk')); }

export function initPalette() {
  const cmdk = $('#cmdk');
  if (!cmdk) return;

  index = buildIndex();

  const input = $('#cmdk-input');
  $('#cmdk-open').addEventListener('click', open);
  input.addEventListener('input', () => render(input.value));

  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); select(selected + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); select(selected - 1); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      const hit = ($('#cmdk-results')._hits || [])[selected];
      if (hit) { close(); hit.action(); }
    }
  });

  wireDismiss(cmdk, null);

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      cmdk.open ? close() : open();
    }
  });
}
