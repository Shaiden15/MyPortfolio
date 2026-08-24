/* Renders the two architecture views: the stacked layer diagram and the
   file-structure tree. Pure builders — they take data and return an element,
   touching no global state, so the PDF export can reuse the same shapes. */

export const LAYERS = [
  { key: 'fe', label: 'Frontend' },
  { key: 'be', label: 'Backend / Services' },
  { key: 'db', label: 'Data' }
];

const LAYER_CLASS = { fe: 'arch-layer-fe', be: 'arch-layer-be', db: 'arch-layer-db' };

/* Which layers this project actually defines, in top-down order. */
export function presentLayers(arch) {
  return LAYERS.filter((l) => (arch[l.key] || []).length);
}

export function buildDiagram(arch) {
  const wrap = document.createElement('div');
  wrap.className = 'arch-diagram';

  const present = presentLayers(arch);

  present.forEach((layer, i) => {
    const box = document.createElement('div');
    box.className = 'arch-layer ' + LAYER_CLASS[layer.key];

    const label = document.createElement('p');
    label.className = 'arch-layer-label';
    label.textContent = layer.label;
    box.appendChild(label);

    const chips = document.createElement('div');
    chips.className = 'arch-layer-chips';
    arch[layer.key].forEach((name) => {
      const chip = document.createElement('span');
      chip.className = 'arch-chip';
      chip.textContent = name;
      chips.appendChild(chip);
    });

    box.appendChild(chips);
    wrap.appendChild(box);

    /* one arrow between each pair — never a trailing one */
    if (i < present.length - 1) {
      const arrow = document.createElement('div');
      arrow.className = 'arch-arrow';
      wrap.appendChild(arrow);
    }
  });

  return wrap;
}

/* Indentation is built from spaces and box-drawing glyphs, so skip past that
   prefix before looking for the note separator — otherwise a line like
   "│  ├─ src/" splits inside its own indentation. */
const TREE_PREFIX = /^[\s│├└─]*/;

export function splitTreeLine(line) {
  const prefix = (line.match(TREE_PREFIX) || [''])[0].length;
  const at = line.indexOf('  ', prefix);
  return at === -1
    ? { path: line, note: '' }
    : { path: line.slice(0, at), note: line.slice(at) };
}

export function buildTree(text) {
  const pre = document.createElement('pre');
  pre.className = 'arch-tree';

  text.split('\n').forEach((line, i) => {
    if (i) pre.appendChild(document.createTextNode('\n'));

    const { path, note } = splitTreeLine(line);

    const pathEl = document.createElement('span');
    pathEl.className = 't-dir';
    pathEl.textContent = path;
    pre.appendChild(pathEl);

    if (note) {
      const noteEl = document.createElement('span');
      noteEl.className = 't-note';
      noteEl.textContent = note;
      pre.appendChild(noteEl);
    }
  });

  return pre;
}
