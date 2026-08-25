/* Shaiden Pillay - portfolio
   ------------------------------------------------------------
   Entry point. Every feature lives in its own module and exposes a single
   init function; this file just decides what runs and in what order.

   Progressive enhancement throughout - with JS disabled the page is still
   fully readable, and every module bails quietly if its markup is absent.

   Note: this is an ES module, so it must be served over http(s).
   Opening index.html directly from the filesystem will not run it -
   see the README for the one-line local server. */

import { initTheme } from './modules/theme.js';
import { initScroll, initNavHighlight, initReveal } from './modules/scroll.js';
import { initCounters } from './modules/counters.js';
import { initFilters } from './modules/filters.js';
import { initDialogs } from './lib/dialogs.js';
import { initDetailModal } from './modules/detail-modal.js';
import { initPalette } from './modules/palette.js';
import { initCopyButtons, initDrawer, initClock, initYear } from './modules/chrome.js';
import { initLightbox } from './modules/lightbox.js';
import { initContactForm } from './modules/contact-form.js';
import { initDeepLinks } from './modules/deep-links.js';
import { initShortcuts } from './modules/shortcuts.js';

/* Theme first - it sets an attribute on <html> and we want that resolved
   before anything paints. */
initTheme();

initScroll();
initNavHighlight();
initReveal();
initCounters();

initFilters();

/* Dialog plumbing before anything that opens a dialog. */
initDialogs();
initDetailModal();
initLightbox();
initShortcuts();

/* The palette indexes the page, so it runs after the cards have their ids
   and detail wiring in place. */
initDeepLinks();
initPalette();

initCopyButtons();
initDrawer();
initClock();
initYear();
initContactForm();
