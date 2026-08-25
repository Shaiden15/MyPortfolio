# MyPortfolio

Personal website for Shaiden Pillay. Static — plain HTML, CSS and vanilla JS.
No build step, no dependencies, no framework.

## Structure

```
index.html              all markup, section by section
404.html                not-found page (GitHub Pages picks this up automatically)

css/parts/              one file per concern; load order in index.html IS the cascade
  tokens.css              every colour, font and scale — change these, change the site
  base.css                reset, typography, shared utilities
  header.css              sticky header, nav, mobile drawer
  hero.css                hero panel, stats, rotating role
  sections.css            section shells, about grid, timeline
  cards.css               project grid, filter chips
  card-media.css          screenshot slots + initials placeholder
  skills.css              skills, education, certifications
  buttons.css             buttons and footer
  contact.css             contact section and form
  modal.css               detail dialog, view toggle, shortcuts panel
  architecture.css        layer diagram and file tree
  palette.css             command palette
  toast.css               copy confirmation
  motion.css              scroll reveal, reduced motion, print

js/
  main.js                 entry point — decides what runs, in what order
  lib/                    shared helpers with no feature knowledge
    dom.js                  $, $$, escapeHtml, reduced-motion flag
    dialogs.js              scroll lock, dismiss wiring, cleanup
    toast.js                status messages and clipboard
    slug.js                 title → slug, shared by deep links and data lookups
  data/                   content that is data, not markup
    architecture.js         layer breakdown per project
    file-trees.js           file structures (personal projects only)
  modules/                one feature each, exposing an init function
    theme.js  scroll.js  counters.js  filters.js  detail-modal.js
    architecture-view.js  pdf-export.js  pdf-styles.js  palette.js
    chrome.js  lightbox.js  contact-form.js  deep-links.js  shortcuts.js

assets/og-image.png     link-preview card for social/Slack/WhatsApp shares
assets/shots/           project screenshots — see the README in that folder
robots.txt              crawler rules
sitemap.xml             one-URL sitemap
```

Every CSS and JS file is under 200 lines. `index.html` is not — markup cannot
be split without a build step or client-side rendering, and this site
deliberately has neither. Its content is markup, not logic.

**`js/main.js` is an ES module**, so the site must be served over http(s).
Opening `index.html` straight off the filesystem will load the CSS but not
the JS — use the local server below.

## Features

| Feature | Notes |
|---|---|
| Command palette | `Ctrl`/`Cmd`+`K` — searches sections, projects, tech tags, actions |
| Keyboard shortcuts | `?` for the list; `T` theme, `G`+`W`/`C`/`A`/`S`/`T` to jump |
| Project filtering | chips filter the 12 cards by category |
| Case-study modals | full detail per project, with shareable deep links |
| Screenshot lightbox | click a card image to enlarge; falls back to a placeholder |
| Contact form | Formspree-ready, with a mailto fallback until you wire it up |
| Light / dark theme | follows the OS until you pick a side, then remembers |
| Animated stat counters | count up when scrolled into view |
| Reading progress bar | fixed to the top of the viewport |
| Scroll reveal | staggered fade-up, disabled under reduced-motion |
| Mobile drawer nav | slides in below 900px |
| SEO | JSON-LD `Person`, Open Graph, Twitter card, canonical, sitemap |
| Print stylesheet | `Ctrl`+`P` gives a clean CV printout |

Everything degrades gracefully — with JS disabled the page is still fully readable.

## Setup checklist

One thing still needs your input before publishing:

1. **Contact form** — sign up at [formspree.io](https://formspree.io), create a
   form, and replace `YOUR_FORM_ID` in the `<form action>` in `index.html`.
   Until then the form falls back to opening the visitor's mail client with the
   message pre-filled, so it is never a dead end.

Already done: LinkedIn URL, all twelve project screenshots, and the CV
(`assets/Shaiden_Pillay_CV.pdf`, linked from the header and the hero).

Optional but worth doing:

- **Replace the CV** by overwriting `assets/Shaiden_Pillay_CV.pdf` — both
  download buttons point at that fixed path, so nothing else needs touching.
- Two screenshots could be better: Peer-to-Peer Tutoring still includes the
  Android Studio window chrome, and AwehPay is a splash screen rather than a
  working view of the app.
- If you move to a custom domain, update it in three places: the `<link rel="canonical">`
  and `og:`/`twitter:` tags in `index.html`, `robots.txt`, and `sitemap.xml`.

## Run it locally

You must serve it — do not open `index.html` off the filesystem. ES modules are
blocked over `file://`, so the JS would silently not run.

```bash
python -m http.server 8000
```

Then visit <http://localhost:8000>.

## Making it yours

Colours, fonts, spacing and radii are CSS custom properties in
`css/parts/tokens.css`. Change `--accent` and the whole site shifts with it.
The dark palette lives in the `[data-theme="dark"]` block in the same file.

### Adding a project

1. Copy any `<article class="card">` block in `index.html`. Set `data-title`
   and `data-cat` (`production`, `mobile`, `ai`, `personal`, `work`).
2. Optionally add a `<template class="card-detail">` with the prose bullets.
3. Optionally add an entry to `js/data/architecture.js` for the layer diagram,
   and `js/data/file-trees.js` for the file structure.

Both data files are keyed by **slug** — the title lowercased with non-alphanumerics
collapsed to hyphens (`GovGuide SA` → `govguide-sa`). `js/lib/slug.js` owns that
rule and both the deep links and the data lookups use it, so they cannot drift.

The command palette, deep links, filters and view toggle all pick the card up
automatically. Tabs appear only where there is content behind them, so a project
with no bullets opens straight on Architecture. Remember to bump the counts on the
filter chips.

### Adding a module

Create it in `js/modules/`, export a single `init` function, and call that from
`js/main.js`. Modules should bail quietly when their markup is absent — that is
what keeps the page working when a section is removed.

Shared helpers live in `js/lib/` and must not import from `js/modules/`; keeping
that direction one-way is what prevents circular imports.

## Deploying

GitHub Pages works out of the box: repo → Settings → Pages → deploy from `main`, root folder.
