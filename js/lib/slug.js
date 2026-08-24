/* One slug function, used by both the deep links and the data lookups.

   If these ever drifted apart, a card would silently lose its architecture
   data — so they share this single definition. */

export function projectSlug(title) {
  return String(title)
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/* The DOM id a card carries, and what a deep link points at. */
export function projectId(title) {
  return 'project-' + projectSlug(title);
}
