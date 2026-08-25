/* PDF export.

   No library. We build a self-contained document for whichever section the
   toggle is on, then print it from an offscreen iframe, handing off to the
   browser's own "Save as PDF".

   An iframe rather than window.open: a popup would leave the visitor staring
   at a stray about:blank tab once the print dialog closes, and it trips
   popup blockers. The iframe never leaves the page. */

import { escapeHtml } from '../lib/dom.js';
import { say } from '../lib/toast.js';
import { presentLayers } from './architecture-view.js';
import { PDF_CSS } from './pdf-styles.js';

const NAME = 'Shaiden Trevino Pillay';
const PHONE = '+27 62 877 6524';
const EMAIL = 'shaidenpillay15@gmail.com';

const VIEW_LABEL = { bullets: 'Overview', diagram: 'Architecture', tree: 'File structure' };

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'];

export function viewLabel(view) {
  return VIEW_LABEL[view] || '';
}

/* Durban time, matching the clock in the hero - SAST is UTC+2 year-round. */
function generatedStamp() {
  const now = new Date();
  const sast = new Date(now.getTime() + (now.getTimezoneOffset() + 120) * 60000);
  const pad = (n) => String(n).padStart(2, '0');

  return `${sast.getDate()} ${MONTHS[sast.getMonth()]} ${sast.getFullYear()}` +
         ` at ${pad(sast.getHours())}:${pad(sast.getMinutes())} SAST`;
}

function diagramHtml(arch) {
  const present = presentLayers(arch);

  return present.map((layer, i) => {
    const chips = arch[layer.key]
      .map((n) => `<span class="chip">${escapeHtml(n)}</span>`)
      .join('');

    return `<div class="layer"><p class="layer-label">${escapeHtml(layer.label)}</p>` +
           `<div class="chips">${chips}</div></div>` +
           (i < present.length - 1 ? '<div class="arrow">&#9660;</div>' : '');
  }).join('');
}

/* Only the section the toggle is currently on. */
function sectionHtml(project, view) {
  if (view === 'bullets' && project.bullets.length) {
    return '<ul>' + project.bullets.map((b) => `<li>${b}</li>`).join('') + '</ul>';
  }
  if (view === 'diagram' && project.arch) {
    return `<div class="diagram">${diagramHtml(project.arch)}</div>`;
  }
  if (view === 'tree' && project.tree) {
    return `<pre class="tree">${escapeHtml(project.tree)}</pre>`;
  }
  return '';
}

function buildPrintDoc(project, view) {
  const section = viewLabel(view);

  const stack = project.tags.length
    ? `<p class="stack"><strong>Stack:</strong> ${project.tags.map(escapeHtml).join(' &middot; ')}</p>`
    : '';

  return `<!DOCTYPE html><html><head><meta charset="utf-8">` +
    `<title>${escapeHtml(project.title + ' - ' + section)} - Shaiden Pillay</title>` +
    `<style>${PDF_CSS}</style></head><body>` +
    `<header>` +
      `<p class="doc-kicker">${escapeHtml(section)}</p>` +
      `<h1>${escapeHtml(project.title)}</h1>` +
      `<p class="role">${escapeHtml(project.role)}</p>` +
      `<p class="meta"><strong>${NAME}</strong> &middot; Full-Stack Developer<br>` +
      `${PHONE} &middot; ${EMAIL}</p>` +
      `<p class="generated">Generated ${escapeHtml(generatedStamp())}</p>` +
    `</header>` +
    `<h2>${escapeHtml(section)}</h2>` +
    sectionHtml(project, view) + stack +
    `<footer>${escapeHtml(project.title)} &middot; ${escapeHtml(section)} &middot; ` +
    `${NAME} &middot; ${PHONE} &middot; ${EMAIL}</footer>` +
    `</body></html>`;
}

/* Captured once at load. Reading document.title inside exportPdf would pick
   up the borrowed filename if a previous export had not cleaned up yet, and
   the real title would be lost for good. */
const siteTitle = document.title;

/* Cleanup for an export still in flight, so a second click tears the first
   one down instead of stacking iframes. */
let pending = null;

export function exportPdf(project, view) {
  if (pending) pending();

  const frame = document.createElement('iframe');
  frame.setAttribute('aria-hidden', 'true');
  frame.setAttribute('title', 'Print');
  /* real dimensions so the document lays out properly, parked offscreen */
  frame.style.cssText = 'position:fixed;left:-9999px;top:0;width:820px;height:1000px;border:0;';
  document.body.appendChild(frame);

  const doc = frame.contentDocument || frame.contentWindow.document;
  doc.open();
  doc.write(buildPrintDoc(project, view));
  doc.close();

  /* The save dialog names the file after the document title - but browsers
     disagree about whose title wins when printing an iframe, so borrow the
     parent's for the duration and hand it back afterwards. */
  document.title = `${project.title} - ${viewLabel(view)} - Shaiden Pillay`;

  let gone = false;
  function cleanup() {
    if (gone) return;
    gone = true;
    document.title = siteTitle;
    if (pending === cleanup) pending = null;
    if (frame.parentNode) frame.parentNode.removeChild(frame);
  }
  pending = cleanup;

  /* Pulling the frame while the dialog is still up cancels the print, so
     wait for afterprint and keep a long backstop for browsers that never
     fire it. */
  frame.contentWindow.onafterprint = () => window.setTimeout(cleanup, 0);

  window.setTimeout(() => {
    try {
      frame.contentWindow.focus();
      frame.contentWindow.print();
    } catch (e) {
      cleanup();
      say('Could not open the print dialog.');
      return;
    }
    window.setTimeout(cleanup, 60000);
  }, 250);
}
