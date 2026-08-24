# MyPortfolio

Personal website for Shaiden Pillay. Static — plain HTML, CSS and vanilla JS.
No build step, no dependencies, no framework.

## Structure

```
index.html          all content, section by section
404.html            not-found page (GitHub Pages picks this up automatically)
css/styles.css      all styling; design tokens at the top of the file
js/main.js          interactive behaviour (see below)
assets/og-image.png link-preview card for social/Slack/WhatsApp shares
assets/shots/       project screenshots — see the README in that folder
robots.txt          crawler rules
sitemap.xml         one-URL sitemap
```

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

Two things need your input before publishing:

1. **LinkedIn URL** — placeholder in the Contact section, marked `TODO`.
2. **Contact form** — sign up at [formspree.io](https://formspree.io), create a
   form, and replace `YOUR_FORM_ID` in the `<form action>` in `index.html`.
   Until then the form falls back to opening the visitor's mail client with the
   message pre-filled, so it is never a dead end.

Optional but worth doing:

- Drop screenshots into `assets/shots/` — see the filename table in that folder's
  README. Cards show a tinted placeholder until you do.
- Add your CV PDF to `assets/` and uncomment the Download CV button in the hero.
- If you move to a custom domain, update it in three places: the `<link rel="canonical">`
  and `og:`/`twitter:` tags in `index.html`, `robots.txt`, and `sitemap.xml`.

## Run it locally

Open `index.html` in a browser, or serve it:

```bash
python -m http.server 8000
```

## Making it yours

Colours, fonts, spacing and radii are CSS custom properties in `:root` at the top of
`css/styles.css`. Change `--accent` and the whole site shifts with it. The dark
palette lives in the `[data-theme="dark"]` block just below.

To add a project: copy any `<article class="card">` block, set `data-cat`
(`production`, `mobile`, `ai`, `personal`, `work`) and `data-title`, and
add a `<template class="card-detail">` if you want a case-study modal. The command
palette, deep links and filters all pick it up automatically — no JS changes needed.
Remember to bump the counts on the filter chips.

## Deploying

GitHub Pages works out of the box: repo → Settings → Pages → deploy from `main`, root folder.
