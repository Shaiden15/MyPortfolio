/* Contact form.

   Until a Formspree endpoint is wired in, submitting falls back to the
   visitor's mail client with everything pre-filled — so the form is never a
   dead end, even unconfigured. */

import { $ } from '../lib/dom.js';

const EMAIL = 'shaidenpillay15@gmail.com';
const PLACEHOLDER = 'YOUR_FORM_ID';

function setNote(msg, cls) {
  const note = $('#form-note');
  if (!note) return;
  note.textContent = msg;
  note.className = 'form-note ' + (cls || '');
}

function mailtoFallback(e) {
  e.preventDefault();

  const name = $('#cf-name').value.trim();
  const mail = $('#cf-email').value.trim();
  const msg = $('#cf-message').value.trim();

  if (!name || !mail || !msg) {
    setNote('Please fill in every field.', 'is-bad');
    return;
  }

  window.location.href = 'mailto:' + EMAIL +
    '?subject=' + encodeURIComponent('Portfolio enquiry from ' + name) +
    '&body=' + encodeURIComponent(`${msg}\n\n— ${name} (${mail})`);

  setNote('Opening your mail app…', 'is-ok');
}

function submitOverFetch(e, form, endpoint) {
  e.preventDefault();

  const btn = $('#cf-submit');
  btn.setAttribute('aria-busy', 'true');
  setNote('Sending…', '');

  fetch(endpoint, {
    method: 'POST',
    body: new FormData(form),
    headers: { Accept: 'application/json' }
  })
    .then((r) => {
      if (!r.ok) throw new Error(r.status);
      form.reset();
      setNote('Thanks — I’ll get back to you soon.', 'is-ok');
    })
    .catch(() => setNote('Something went wrong. Email me directly instead.', 'is-bad'))
    .then(() => btn.removeAttribute('aria-busy'));
}

export function initContactForm() {
  const form = $('#contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    const endpoint = form.getAttribute('action');
    if (endpoint.indexOf(PLACEHOLDER) !== -1) mailtoFallback(e);
    else submitOverFetch(e, form, endpoint);
  });
}
