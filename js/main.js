/* ============================================================
   Shaiden Pillay — portfolio
   Progressive enhancement. The page is fully readable without JS.
   ------------------------------------------------------------
   1 Theme             7 Command palette
   2 Header + progress  8 Copy / toast / drawer
   3 Scroll reveal      9 Screenshots + lightbox
   4 Stat counters     10 Live GitHub panel
   5 Project filters   11 Contact form
   6 Detail modal      12 Deep links   13 Shortcuts
   ============================================================ */

(function () {
  'use strict';

  var root = document.documentElement;
  var $  = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ══ 1. Theme ══════════════════════════════════════════ */

  var chosen = null;
  try { chosen = localStorage.getItem('theme'); } catch (e) { /* private mode */ }

  var mq = window.matchMedia('(prefers-color-scheme: dark)');
  root.setAttribute('data-theme', chosen || (mq.matches ? 'dark' : 'light'));

  mq.addEventListener('change', function (e) {
    if (!chosen) root.setAttribute('data-theme', e.matches ? 'dark' : 'light');
  });

  var themeBtn = $('#theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      chosen = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', chosen);
      try { localStorage.setItem('theme', chosen); } catch (e) { /* ignore */ }
    });
  }

  /* ══ 2. Header, progress bar, back-to-top ══════════════ */

  var header = $('.site-header');
  var bar    = $('#progress-bar');
  var toTop  = $('#to-top');
  var ticking = false;

  function onScroll() {
    var y   = window.scrollY;
    var max = document.documentElement.scrollHeight - window.innerHeight;

    if (header) header.classList.toggle('is-scrolled', y > 8);
    if (bar)    bar.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    if (toTop)  toTop.classList.toggle('is-on', y > 600);

    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    });
  }

  /* ══ 3. Scroll reveal + active nav ═════════════════════ */

  if ('IntersectionObserver' in window && !reduced) {
    var revealTargets = $$(
      '.section-head, .prose, .values li, .tl-item, .card, .skill-card, ' +
      '.edu, .certs li, .subhead, .contact-blurb, .contact-actions, .contact-list, .filters, ' +
      '.contact-form'
    );

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .05 });

    revealTargets.forEach(function (el, i) {
      el.classList.add('reveal');
      el.style.transitionDelay = (i % 5) * 60 + 'ms';
      io.observe(el);
    });

    /* Failsafe: if the observer never fires — background tab on load, a
       browser quirk, a page that never composites — the content would sit
       at opacity 0 forever. Never let that happen. */
    window.setTimeout(function () {
      if (!document.querySelector('.reveal.is-in')) {
        revealTargets.forEach(function (el) {
          el.style.transitionDelay = '';
          el.classList.add('is-in');
        });
      }
    }, 2500);
  }

  var navLinks = $$('.nav a[href^="#"]');
  var watched  = navLinks
    .map(function (link) {
      return { el: document.getElementById(link.getAttribute('href').slice(1)), link: link };
    })
    .filter(function (s) { return s.el; });

  if (watched.length && 'IntersectionObserver' in window) {
    var navIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var hit = watched.filter(function (s) { return s.el === entry.target; })[0];
        if (!hit) return;
        navLinks.forEach(function (l) { l.classList.remove('is-active'); });
        hit.link.classList.add('is-active');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    watched.forEach(function (s) { navIO.observe(s.el); });
  }

  /* ══ 4. Stat counters ══════════════════════════════════ */

  var counters = $$('[data-count]');

  function runCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    if (reduced) { el.textContent = target; return; }

    var duration = 1400;
    var start = null;

    function step(now) {
      if (start === null) start = now;
      var p = Math.min((now - start) / duration, 1);
      /* easeOutExpo — fast then settles */
      var eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      el.textContent = Math.round(target * eased);
      if (p < 1) window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }

  if (counters.length && 'IntersectionObserver' in window) {
    var countIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        runCounter(entry.target);
        countIO.unobserve(entry.target);
      });
    }, { threshold: .6 });
    counters.forEach(function (el) { countIO.observe(el); });

    /* same failsafe — a stat stuck on 0 reads as broken */
    window.setTimeout(function () {
      counters.forEach(function (el) {
        if (el.textContent === '0') el.textContent = el.getAttribute('data-count');
      });
    }, 2500);
  } else {
    counters.forEach(function (el) { el.textContent = el.getAttribute('data-count'); });
  }

  /* ══ 5. Project filters ════════════════════════════════ */

  var chips = $$('.chip');
  var cards = $$('#project-grid .card');
  var empty = $('#empty-state');

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var filter = chip.getAttribute('data-filter');

      chips.forEach(function (c) { c.classList.remove('is-on'); });
      chip.classList.add('is-on');

      var shown = 0;
      cards.forEach(function (card) {
        var cats = (card.getAttribute('data-cat') || '').split(/\s+/);
        var show = filter === 'all' || cats.indexOf(filter) !== -1;
        card.classList.toggle('is-hidden', !show);
        if (show) shown++;
      });

      if (empty) empty.hidden = shown > 0;
    });
  });

  /* ══ 6. Project detail modal ═══════════════════════════ */

  /* Every dialog shares one cleanup path. We do NOT rely solely on the
     'close' event: if it ever failed to fire, the body would stay scroll-
     locked and the page would look frozen. So cleanup is idempotent and is
     also invoked directly at each close site and after Escape. */
  function syncDialogs() {
    var drawerEl = $('#mobile-menu');
    var anyOpen = $$('dialog[open]').length > 0 || (drawerEl && !drawerEl.hidden);
    document.body.classList.toggle('is-locked', !!anyOpen);

    var detail = $('#detail-modal');
    if (detail && !detail.open && window.location.hash.indexOf('#project-') === 0) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    var lb = $('#lightbox');
    if (lb && !lb.open) {
      var lbImg = $('#lightbox-img');
      if (lbImg) lbImg.removeAttribute('src');
    }
  }

  /* close any dialog and clean up immediately */
  function shut(d) {
    if (d && d.open) d.close();
    syncDialogs();
  }

  /* Escape closes dialogs natively — re-sync on the next tick */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') window.setTimeout(syncDialogs, 0);
  });

  var modal      = $('#detail-modal');
  var modalTitle = $('#detail-title');
  var modalRole  = $('#detail-role');
  var modalBody  = $('#detail-body');
  var modalTags  = $('#detail-tags');
  var modalLink  = $('#detail-link');
  var modalLinkLabel = $('#detail-link-label');
  var viewToggle = $('#detail-view-toggle');
  var dlBtn      = $('#detail-download');

  /* what the modal is currently showing — set by openDetail, read by the
     view toggle and the PDF export so they never go out of sync */
  var current = { title: '', role: '', bullets: [], arch: null, tree: '', tags: [] };
  var view = 'bullets';

  var LAYERS = [
    { key: 'fe', label: 'Frontend',            cls: 'arch-layer-fe' },
    { key: 'be', label: 'Backend / Services',  cls: 'arch-layer-be' },
    { key: 'db', label: 'Data',                cls: 'arch-layer-db' }
  ];

  /* read the JSON blob off the card; a malformed one must not kill the modal */
  function readArch(card) {
    var raw = card.getAttribute('data-arch');
    if (!raw) return null;
    try {
      var parsed = JSON.parse(raw);
      var any = LAYERS.some(function (l) { return (parsed[l.key] || []).length; });
      return any ? parsed : null;
    } catch (e) { return null; }
  }

  /* stacked layer diagram: frontend on top, data at the bottom */
  function buildDiagram(arch) {
    var wrapEl = document.createElement('div');
    wrapEl.className = 'arch-diagram';

    var present = LAYERS.filter(function (l) { return (arch[l.key] || []).length; });

    present.forEach(function (layer, i) {
      var box = document.createElement('div');
      box.className = 'arch-layer ' + layer.cls;

      var label = document.createElement('p');
      label.className = 'arch-layer-label';
      label.textContent = layer.label;
      box.appendChild(label);

      var chips = document.createElement('div');
      chips.className = 'arch-layer-chips';
      arch[layer.key].forEach(function (name) {
        var chip = document.createElement('span');
        chip.className = 'arch-chip';
        chip.textContent = name;
        chips.appendChild(chip);
      });
      box.appendChild(chips);
      wrapEl.appendChild(box);

      if (i < present.length - 1) {
        var arrow = document.createElement('div');
        arrow.className = 'arch-arrow';
        wrapEl.appendChild(arrow);
      }
    });

    return wrapEl;
  }

  /* A tree line is "path  trailing note" — two spaces separate them. The
     indentation is itself built from spaces and box-drawing glyphs, so skip
     past that prefix before looking for the separator, or a line like
     "│  ├─ src/" splits inside its own indentation. */
  var TREE_PREFIX = /^[\s│├└─]*/;

  function buildTree(text) {
    var pre = document.createElement('pre');
    pre.className = 'arch-tree';

    text.split('\n').forEach(function (line, i) {
      if (i) pre.appendChild(document.createTextNode('\n'));

      var prefix = (line.match(TREE_PREFIX) || [''])[0].length;
      var at = line.indexOf('  ', prefix);
      var path = at === -1 ? line : line.slice(0, at);
      var note = at === -1 ? ''   : line.slice(at);

      var pathEl = document.createElement('span');
      pathEl.className = 't-dir';
      pathEl.textContent = path;
      pre.appendChild(pathEl);

      if (note) {
        var noteEl = document.createElement('span');
        noteEl.className = 't-note';
        noteEl.textContent = note;
        pre.appendChild(noteEl);
      }
    });

    return pre;
  }

  function renderView() {
    modalBody.innerHTML = '';

    if (view === 'tree' && current.tree) {
      modalBody.appendChild(buildTree(current.tree));
    } else if (view === 'diagram' && current.arch) {
      modalBody.appendChild(buildDiagram(current.arch));
    } else {
      var list = document.createElement('ul');
      list.className = 'detail-list';
      current.bullets.forEach(function (html) {
        var li = document.createElement('li');
        li.innerHTML = html;
        list.appendChild(li);
      });
      modalBody.appendChild(list);
    }

    modalBody.scrollTop = 0;
  }

  var VIEWS = ['bullets', 'diagram', 'tree'];

  /* Is there anything behind this view for the project currently open? */
  function hasView(v) {
    if (v === 'bullets') return !!current.bullets.length;
    if (v === 'diagram') return !!current.arch;
    if (v === 'tree')    return !!current.tree;
    return false;
  }

  function setView(next) {
    /* Never sit on an empty view. The matching button is hidden so this
       should be unreachable, but the export reads `view` directly and an
       empty section would produce a blank PDF. */
    if (!hasView(next)) next = VIEWS.filter(hasView)[0] || 'bullets';

    view = next;
    $$('.view-btn', viewToggle).forEach(function (b) {
      b.classList.toggle('is-active', b.getAttribute('data-view') === next);
    });
    /* the export follows the toggle, so say which section it will produce */
    if (dlBtn) dlBtn.title = 'Download ' + (VIEW_LABEL[next] || '') + ' as PDF';
    renderView();
  }

  function openDetail(card) {
    if (!modal) return;

    var tpl  = $('.card-detail', card);
    var arch = readArch(card);
    if (!tpl && !arch) return;

    current.title = card.getAttribute('data-title') || '';
    current.role  = ($('.card-role', card) || {}).textContent || '';
    current.arch  = arch;
    current.bullets = tpl
      ? $$('li', tpl.content).map(function (li) { return li.innerHTML; })
      : [];

    var treeTpl = $('.card-tree', card);
    current.tree = treeTpl ? (treeTpl.content.textContent || '').replace(/^\n|\s+$/g, '') : '';
    current.tags = $$('.tags li', card).map(function (t) { return t.textContent; });

    modalTitle.textContent = current.title;
    modalRole.textContent  = current.role;

    /* only offer a view that has something behind it, and open on the first
       one that does — not every project carries all three */
    $$('.view-btn', viewToggle).forEach(function (b) {
      b.hidden = !hasView(b.getAttribute('data-view'));
    });

    setView(VIEWS.filter(hasView)[0]);

    modalTags.innerHTML = '';
    $$('.tags li', card).forEach(function (t) {
      var li = document.createElement('li');
      li.textContent = t.textContent;
      modalTags.appendChild(li);
    });

    var live = $('.card-link', card);
    if (live) {
      modalLink.href = live.href;
      /* label comes from the card, so a demo video is not called "Visit site" */
      if (modalLinkLabel) modalLinkLabel.textContent = live.getAttribute('data-cta') || 'Visit site';
      modalLink.hidden = false;
    } else {
      modalLink.hidden = true;
    }

    modal.showModal();
    syncHash(card);
    syncDialogs();
  }

  $$('[data-open-detail]').forEach(function (btn) {
    btn.addEventListener('click', function () { openDetail(btn.closest('.card')); });
  });

  if (viewToggle) {
    $$('.view-btn', viewToggle).forEach(function (btn) {
      btn.addEventListener('click', function () { setView(btn.getAttribute('data-view')); });
    });
  }

  /* ── PDF export ────────────────────────────────────────
     No library. We build a self-contained document carrying both views —
     the bullets and the diagram — and print it from an offscreen iframe,
     handing off to the browser's own "Save as PDF".

     An iframe rather than window.open: a popup would leave the visitor
     staring at a stray about:blank tab once the print dialog closes, and
     it trips popup blockers. The iframe never leaves the page. */

  function archToPrintHtml(arch) {
    if (!arch) return '';
    var present = LAYERS.filter(function (l) { return (arch[l.key] || []).length; });

    return present.map(function (layer, i) {
      var chips = arch[layer.key].map(function (n) {
        return '<span class="chip">' + escapeHtml(n) + '</span>';
      }).join('');

      return '<div class="layer"><p class="layer-label">' + escapeHtml(layer.label) +
             '</p><div class="chips">' + chips + '</div></div>' +
             (i < present.length - 1 ? '<div class="arrow">&#9660;</div>' : '');
    }).join('');
  }

  var VIEW_LABEL = { bullets: 'Overview', diagram: 'Architecture', tree: 'File structure' };

  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'];

  /* Durban time, matching the clock in the hero — SAST is UTC+2 year-round */
  function generatedStamp() {
    var now  = new Date();
    var sast = new Date(now.getTime() + (now.getTimezoneOffset() + 120) * 60000);
    var pad  = function (n) { return String(n).padStart(2, '0'); };

    return sast.getDate() + ' ' + MONTHS[sast.getMonth()] + ' ' + sast.getFullYear() +
           ' at ' + pad(sast.getHours()) + ':' + pad(sast.getMinutes()) + ' SAST';
  }

  /* Export only the section the toggle is currently on. */
  function buildPrintDoc() {
    var body = '';

    if (view === 'bullets' && current.bullets.length) {
      body = '<ul>' +
             current.bullets.map(function (b) { return '<li>' + b + '</li>'; }).join('') +
             '</ul>';
    } else if (view === 'diagram' && current.arch) {
      body = '<div class="diagram">' + archToPrintHtml(current.arch) + '</div>';
    } else if (view === 'tree' && current.tree) {
      body = '<pre class="tree">' + escapeHtml(current.tree) + '</pre>';
    }

    var section = VIEW_LABEL[view] || '';

    var tags = current.tags.length
      ? '<p class="stack"><strong>Stack:</strong> ' +
        current.tags.map(escapeHtml).join(' &middot; ') + '</p>'
      : '';

    return (
      '<!DOCTYPE html><html><head><meta charset="utf-8">' +
      '<title>' + escapeHtml(current.title + ' — ' + section) +
      ' — Shaiden Pillay</title><style>' +
      '@page { margin: 18mm; }' +
      'body { font: 11pt/1.6 -apple-system, "Segoe UI", system-ui, sans-serif; color: #15161a; margin: 0; }' +
      'header { border-bottom: 2px solid #0f766e; padding-bottom: 11px; margin-bottom: 24px; }' +
      '.doc-kicker { font-size: 8.5pt; text-transform: uppercase; letter-spacing: .12em; ' +
      '              color: #0f766e; font-weight: 700; margin: 0 0 6px; }' +
      'h1 { font-size: 21pt; margin: 0 0 3px; letter-spacing: -.02em; }' +
      '.role { color: #0f766e; font-size: 10.5pt; margin: 0 0 12px; font-weight: 500; }' +
      '.meta { margin: 0; font-size: 9pt; color: #5c5f66; line-height: 1.75; }' +
      '.meta strong { color: #15161a; font-weight: 600; }' +
      '.generated { margin: 6px 0 0; font-size: 8.5pt; color: #9a9ca2; }' +
      'h2 { font-size: 10pt; text-transform: uppercase; letter-spacing: .1em; color: #7b7d84; ' +
      '     margin: 0 0 12px; font-weight: 600; }' +
      'ul { padding: 0; margin: 0; list-style: none; }' +
      'li { position: relative; padding-left: 16px; margin-bottom: 9px; color: #35373d; }' +
      'li::before { content: ""; position: absolute; left: 0; top: .62em; width: 5px; height: 5px; ' +
      '             border-radius: 50%; background: #0f766e; }' +
      'code { font-family: ui-monospace, Menlo, monospace; font-size: .88em; background: #f0efec; ' +
      '       padding: .1em .34em; border-radius: 3px; }' +
      '.diagram { max-width: 460px; }' +
      '.layer { border: 1.5px solid #cfd6d4; border-radius: 9px; padding: 11px 13px; }' +
      '.layer:nth-child(1) { border-color: #0f766e; background: #f0f7f5; }' +
      '.layer-label { font-size: 8pt; text-transform: uppercase; letter-spacing: .1em; ' +
      '               color: #0f766e; font-weight: 700; margin: 0 0 7px; }' +
      '.chips { display: flex; flex-wrap: wrap; gap: 5px; }' +
      '.chip { border: 1px solid #d8dddb; border-radius: 20px; padding: 2px 9px; font-size: 8.5pt; ' +
      '        background: #fff; color: #35373d; }' +
      '.arrow { text-align: center; color: #0f766e; font-size: 13pt; line-height: 1; margin: 5px 0; }' +
      '.tree { font-family: ui-monospace, Menlo, "Courier New", monospace; font-size: 8pt; ' +
      '        line-height: 1.65; color: #35373d; background: #f7f7f5; border: 1px solid #e3e2dd; ' +
      '        border-radius: 6px; padding: 12px 14px; white-space: pre; overflow: hidden; ' +
      '        page-break-inside: avoid; margin: 0; }' +
      '.stack { font-size: 9pt; color: #7b7d84; margin-top: 22px; }' +
      'footer { margin-top: 30px; padding-top: 10px; border-top: 1px solid #e3e2dd; ' +
      '         font-size: 8.5pt; color: #9a9ca2; }' +
      '</style></head><body>' +
      '<header>' +
      '<p class="doc-kicker">' + escapeHtml(section) + '</p>' +
      '<h1>' + escapeHtml(current.title) + '</h1>' +
      '<p class="role">' + escapeHtml(current.role) + '</p>' +
      '<p class="meta">' +
      '<strong>Shaiden Trevino Pillay</strong> &middot; Full-Stack Developer<br>' +
      '+27 62 877 6524 &middot; shaidenpillay15@gmail.com' +
      '</p>' +
      '<p class="generated">Generated ' + escapeHtml(generatedStamp()) + '</p>' +
      '</header>' +
      '<h2>' + escapeHtml(section) + '</h2>' +
      body + tags +
      '<footer>' + escapeHtml(current.title) + ' &middot; ' + escapeHtml(section) +
      ' &middot; Shaiden Trevino Pillay &middot; +27 62 877 6524 &middot; ' +
      'shaidenpillay15@gmail.com</footer>' +
      '</body></html>'
    );
  }

  /* Captured once at load. Reading document.title inside exportPdf would pick
     up the borrowed filename if a previous export had not cleaned up yet,
     and the real title would be lost for good. */
  var siteTitle = document.title;

  /* cleanup for an export still in flight, so a second click can tear the
     first one down instead of stacking iframes */
  var pendingExport = null;

  function exportPdf() {
    if (pendingExport) pendingExport();

    var frame = document.createElement('iframe');
    frame.setAttribute('aria-hidden', 'true');
    frame.setAttribute('title', 'Print');
    /* real dimensions so the document lays out properly, parked offscreen */
    frame.style.cssText =
      'position:fixed;left:-9999px;top:0;width:820px;height:1000px;border:0;';
    document.body.appendChild(frame);

    var doc = frame.contentDocument || frame.contentWindow.document;
    doc.open();
    doc.write(buildPrintDoc());
    doc.close();

    /* The save dialog names the file after the document title — but browsers
       disagree about whose title wins when printing an iframe, so borrow the
       parent's for the duration and hand it back afterwards. */
    document.title = current.title + ' — ' + (VIEW_LABEL[view] || '') + ' — Shaiden Pillay';

    var gone = false;
    function cleanup() {
      if (gone) return;
      gone = true;
      document.title = siteTitle;
      if (pendingExport === cleanup) pendingExport = null;
      if (frame.parentNode) frame.parentNode.removeChild(frame);
    }
    pendingExport = cleanup;

    /* Pulling the frame while the dialog is still up cancels the print, so
       wait for afterprint and keep a long backstop for browsers that never
       fire it. */
    frame.contentWindow.onafterprint = function () {
      window.setTimeout(cleanup, 0);
    };

    window.setTimeout(function () {
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

  if (dlBtn) dlBtn.addEventListener('click', exportPdf);

  if (modal) {
    $('#detail-close').addEventListener('click', function () { shut(modal); });
    /* Click outside the panel closes it. A backdrop click targets the dialog
       element itself — anything inside targets a child. Do NOT test pointer
       coordinates here: keyboard activation reports 0,0, which reads as a
       backdrop click and would close the modal on every Enter press. */
    modal.addEventListener('click', function (e) {
      if (e.target === modal) shut(modal);
    });
    modal.addEventListener('close', syncDialogs);
  }

  /* ══ 7. Command palette ════════════════════════════════ */

  var cmdk    = $('#cmdk');
  var cmdkIn  = $('#cmdk-input');
  var cmdkOut = $('#cmdk-results');
  var index   = [];
  var selected = 0;

  /* build the index from the page itself, so it never goes stale */
  $$('main section[id]').forEach(function (sec) {
    var h = $('h2', sec);
    if (!h) return;
    index.push({
      group: 'Sections',
      label: h.textContent.trim(),
      sub: '#' + sec.id,
      icon: '§',
      action: function () { document.getElementById(sec.id).scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' }); }
    });
  });

  cards.forEach(function (card) {
    var title = card.getAttribute('data-title');
    index.push({
      group: 'Projects',
      label: title,
      sub: ($('.badge', card) || {}).textContent || 'Project',
      icon: ($('.card-index', card) || {}).textContent || '#',
      keywords: $$('.tags li', card).map(function (t) { return t.textContent; }).join(' '),
      action: function () {
        card.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
        if ($('.card-detail', card)) window.setTimeout(function () { openDetail(card); }, reduced ? 0 : 420);
      }
    });
  });

  index.push(
    { group: 'Links', label: 'Email Shaiden', sub: 'mailto', icon: '@',
      action: function () { window.location.href = 'mailto:shaidenpillay15@gmail.com'; } },
    { group: 'Links', label: 'Copy email address', sub: 'clipboard', icon: '⧉',
      action: function () { copy('shaidenpillay15@gmail.com'); } },
    { group: 'Links', label: 'GitHub profile', sub: 'external', icon: '↗',
      action: function () { window.open('https://github.com/Shaiden15', '_blank', 'noopener'); } },
    { group: 'Actions', label: 'Toggle light / dark theme', sub: 'theme', icon: '◐',
      action: function () { themeBtn.click(); } },
    { group: 'Actions', label: 'Print this page as a CV', sub: 'print', icon: '⎙',
      action: function () { window.print(); } },
    { group: 'Actions', label: 'Keyboard shortcuts', sub: '?', icon: '⌘',
      action: function () { if (shortcuts) { shortcuts.showModal(); syncDialogs(); } } }
  );

  function render(query) {
    var q = query.trim().toLowerCase();
    var hits = index.filter(function (item) {
      if (!q) return true;
      return (item.label + ' ' + item.group + ' ' + (item.keywords || '')).toLowerCase().indexOf(q) !== -1;
    });

    cmdkOut.innerHTML = '';
    selected = 0;

    if (!hits.length) {
      cmdkOut.innerHTML = '<li class="cmdk-empty">No results for "' + escapeHtml(query) + '"</li>';
      return;
    }

    var lastGroup = null;
    hits.forEach(function (item, i) {
      if (item.group !== lastGroup) {
        var g = document.createElement('li');
        g.className = 'cmdk-group';
        g.textContent = item.group;
        cmdkOut.appendChild(g);
        lastGroup = item.group;
      }

      var li = document.createElement('li');
      li.className = 'cmdk-item' + (i === 0 ? ' is-sel' : '');
      li.setAttribute('role', 'option');
      li.dataset.i = i;
      li.innerHTML =
        '<span class="ci-icon">' + escapeHtml(item.icon) + '</span>' +
        '<span>' + escapeHtml(item.label) + '</span>' +
        '<span class="ci-sub">' + escapeHtml(item.sub) + '</span>';

      li.addEventListener('click', function () { closeCmdk(); item.action(); });
      li.addEventListener('mousemove', function () { select(i); });
      cmdkOut.appendChild(li);
    });

    cmdkOut._hits = hits;
  }

  function items() { return $$('.cmdk-item', cmdkOut); }

  function select(i) {
    var list = items();
    if (!list.length) return;
    selected = Math.max(0, Math.min(i, list.length - 1));
    list.forEach(function (el, n) { el.classList.toggle('is-sel', n === selected); });
    list[selected].scrollIntoView({ block: 'nearest' });
  }

  function openCmdk() {
    if (!cmdk) return;
    cmdkIn.value = '';
    render('');
    cmdk.showModal();
    syncDialogs();
    cmdkIn.focus();
  }

  function closeCmdk() { shut(cmdk); }

  if (cmdk) {
    $('#cmdk-open').addEventListener('click', openCmdk);
    cmdk.addEventListener('close', syncDialogs);

    cmdkIn.addEventListener('input', function () { render(cmdkIn.value); });

    cmdkIn.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); select(selected + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); select(selected - 1); }
      else if (e.key === 'Enter') {
        e.preventDefault();
        var hit = (cmdkOut._hits || [])[selected];
        if (hit) { closeCmdk(); hit.action(); }
      }
    });

    cmdk.addEventListener('click', function (e) {
      if (e.target === cmdk) closeCmdk();
    });

    document.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        cmdk.open ? closeCmdk() : openCmdk();
      }
    });
  }

  /* ══ 8. Copy, toast, drawer, clock, year ═══════════════ */

  var toast = $('#toast');
  var toastTimer;

  function say(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('is-on');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () { toast.classList.remove('is-on'); }, 2200);
  }

  function copy(text) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(
        function () { say('Copied ' + text); },
        function () { say('Copy failed — ' + text); }
      );
    } else {
      /* file:// and plain http fall back to the old path */
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); say('Copied ' + text); }
      catch (e) { say(text); }
      document.body.removeChild(ta);
    }
  }

  $$('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () { copy(btn.getAttribute('data-copy')); });
  });

  /* mobile drawer */
  var drawer = $('#mobile-menu');
  var openBtn = $('#menu-open');

  function setDrawer(open) {
    if (!drawer) return;
    drawer.hidden = !open;
    document.body.classList.toggle('is-locked', open);
    if (openBtn) openBtn.setAttribute('aria-expanded', String(open));
  }

  if (drawer) {
    openBtn.addEventListener('click', function () { setDrawer(true); });
    $('#menu-close').addEventListener('click', function () { setDrawer(false); });
    drawer.addEventListener('click', function (e) {
      if (e.target === drawer || e.target.closest('.drawer-nav a')) setDrawer(false);
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawer && !drawer.hidden) setDrawer(false);
  });

  /* Durban clock — SAST is UTC+2 year-round, no DST */
  var clock = $('#clock');
  function tick() {
    if (!clock) return;
    var now = new Date();
    var sast = new Date(now.getTime() + (now.getTimezoneOffset() + 120) * 60000);
    clock.textContent = String(sast.getHours()).padStart(2, '0') + ':' +
                        String(sast.getMinutes()).padStart(2, '0') + ' SAST';
  }
  tick();
  window.setInterval(tick, 30000);

  var year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  /* ══ 9. Screenshots + lightbox ═════════════════════════ */

  var lightbox    = $('#lightbox');
  var lightboxImg = $('#lightbox-img');
  var lightboxCap = $('#lightbox-cap');

  $$('.card-media').forEach(function (media) {
    var img = $('img', media);
    if (!img) return;

    function missing() { media.classList.add('no-shot'); }
    function present() {
      media.classList.add('has-shot');
      media.setAttribute('role', 'button');
      media.setAttribute('tabindex', '0');
      media.setAttribute('aria-label', 'Enlarge ' + img.alt);
    }

    /* A screenshot that hasn't been added yet must never render as a broken
       image — fall through to the CSS initials placeholder instead. */
    img.addEventListener('error', missing);
    img.addEventListener('load', function () {
      /* guard against 404 pages served as images with no real dimensions */
      if (img.naturalWidth > 1) present(); else missing();
    });
    if (img.complete) {
      if (img.naturalWidth > 1) present(); else missing();
    }

    function zoom() {
      if (!media.classList.contains('has-shot') || !lightbox) return;
      lightboxImg.src = img.currentSrc || img.src;
      lightboxImg.alt = img.alt;
      lightboxCap.textContent = img.alt;
      lightbox.showModal();
      syncDialogs();
    }

    media.addEventListener('click', zoom);
    media.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); zoom(); }
    });
  });

  if (lightbox) {
    $('#lightbox-close').addEventListener('click', function () { shut(lightbox); });
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox || e.target === lightboxImg.parentNode) shut(lightbox);
    });
    lightbox.addEventListener('close', syncDialogs);
  }

  /* ══ 11. Contact form ══════════════════════════════════ */

  var form = $('#contact-form');
  var note = $('#form-note');

  if (form) {
    form.addEventListener('submit', function (e) {
      var endpoint = form.getAttribute('action');

      /* Not wired to Formspree yet? Fall back to the visitor's mail client
         with everything pre-filled, so the form is never a dead end. */
      if (endpoint.indexOf('YOUR_FORM_ID') !== -1) {
        e.preventDefault();
        var name = $('#cf-name').value.trim();
        var mail = $('#cf-email').value.trim();
        var msg  = $('#cf-message').value.trim();

        if (!name || !mail || !msg) { setNote('Please fill in every field.', 'is-bad'); return; }

        window.location.href = 'mailto:shaidenpillay15@gmail.com' +
          '?subject=' + encodeURIComponent('Portfolio enquiry from ' + name) +
          '&body=' + encodeURIComponent(msg + '\n\n,' + name + ' (' + mail + ')');

        setNote('Opening your mail app…', 'is-ok');
        return;
      }

      /* Wired up: submit over fetch so the visitor stays on the page. */
      e.preventDefault();
      var btn = $('#cf-submit');
      btn.setAttribute('aria-busy', 'true');
      setNote('Sending…', '');

      fetch(endpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      })
        .then(function (r) {
          if (!r.ok) throw new Error(r.status);
          form.reset();
          setNote('Thanks — I’ll get back to you soon.', 'is-ok');
        })
        .catch(function () {
          setNote('Something went wrong. Email me directly instead.', 'is-bad');
        })
        .then(function () { btn.removeAttribute('aria-busy'); });
    });
  }

  function setNote(msg, cls) {
    if (!note) return;
    note.textContent = msg;
    note.className = 'form-note ' + (cls || '');
  }

  /* ══ 12. Deep links to projects ════════════════════════ */

  function projectSlug(title) {
    return 'project-' + title.toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  cards.forEach(function (card) { card.id = projectSlug(card.getAttribute('data-title')); });

  /* opening a case study puts it in the URL, so the view is shareable */
  function syncHash(card) {
    if (!card) return;
    history.replaceState(null, '', '#' + card.id);
  }

  function openFromHash() {
    var id = window.location.hash.slice(1);
    if (!id || id.indexOf('project-') !== 0) return;
    var card = document.getElementById(id);
    if (!card) return;
    card.scrollIntoView({ behavior: 'auto', block: 'center' });
    if ($('.card-detail', card)) window.setTimeout(function () { openDetail(card); }, 250);
  }

  window.addEventListener('hashchange', openFromHash);
  openFromHash();

  /* ══ 13. Keyboard shortcuts ════════════════════════════ */

  var shortcuts = $('#shortcuts');
  var goPending = false;
  var goTimer;

  if (shortcuts) {
    $('#shortcuts-close').addEventListener('click', function () { shut(shortcuts); });
    shortcuts.addEventListener('close', syncDialogs);
    shortcuts.addEventListener('click', function (e) {
      if (e.target === shortcuts) shut(shortcuts);
    });
  }

  function goTo(id) {
    var el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  }

  document.addEventListener('keydown', function (e) {
    /* never hijack typing */
    var t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    var anyOpen = $$('dialog[open]').length > 0;

    if (e.key === '?') {
      e.preventDefault();
      if (!anyOpen && shortcuts) { shortcuts.showModal(); syncDialogs(); }
      return;
    }

    if (anyOpen) return;

    if (goPending) {
      goPending = false;
      window.clearTimeout(goTimer);
      var k = e.key.toLowerCase();
      if (k === 'w') goTo('projects');
      else if (k === 'c') goTo('contact');
      else if (k === 'a') goTo('about');
      else if (k === 's') goTo('skills');
      else if (k === 't') window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
      return;
    }

    if (e.key.toLowerCase() === 'g') {
      goPending = true;
      goTimer = window.setTimeout(function () { goPending = false; }, 1200);
    } else if (e.key.toLowerCase() === 't') {
      if (themeBtn) themeBtn.click();
    }
  });

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
})();
