/* Category chips over the project grid.

   Categories come from each card's data-cat, so adding a project needs no
   change here - only a new chip in the markup if the category is new. */

import { $, $$ } from '../lib/dom.js';

export function initFilters() {
  const chips = $$('.chip');
  const cards = $$('#project-grid .card');
  const empty = $('#empty-state');

  if (!chips.length) return;

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const filter = chip.getAttribute('data-filter');

      chips.forEach((c) => c.classList.remove('is-on'));
      chip.classList.add('is-on');

      let shown = 0;
      cards.forEach((card) => {
        const cats = (card.getAttribute('data-cat') || '').split(/\s+/);
        const show = filter === 'all' || cats.indexOf(filter) !== -1;
        card.classList.toggle('is-hidden', !show);
        if (show) shown++;
      });

      if (empty) empty.hidden = shown > 0;
    });
  });
}
