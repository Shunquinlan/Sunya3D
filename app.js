import { BUSINESS_EMAIL } from './config.js';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
document.body.classList.add('page-ready');
document.querySelector('#year').textContent = new Date().getFullYear();
document.querySelectorAll('[data-contact-link]').forEach(link => link.href = `mailto:${BUSINESS_EMAIL}`);
document.querySelectorAll('[data-contact-text]').forEach(link => link.textContent = BUSINESS_EMAIL);

const nav = document.querySelector('#main-nav');
const menu = document.querySelector('.menu-toggle');
function closeMenu() { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Open navigation'); }
menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; nav.classList.toggle('open', open); menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation'); });
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
window.matchMedia('(min-width:901px)').addEventListener('change', e => { if (e.matches) closeMenu(); });
document.addEventListener('click', e => { if (!e.target.closest('.site-header')) closeMenu(); });

document.querySelectorAll('[data-service]').forEach(link => link.addEventListener('click', () => {
  document.querySelector('#service').value = link.dataset.service;
}));

if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
  }), { threshold: .08 });
  document.querySelectorAll('.section-heading, .service-card, .project, .principles article, .process-grid li, .contact-copy').forEach(el => { el.classList.add('reveal'); revealObserver.observe(el); });
}

let returnFocus;
function openDialog(dialog) { returnFocus = document.activeElement; document.body.classList.add('modal-open'); dialog.showModal(); }
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelector('.modal-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => { if (e.target === dialog) { const rect = dialog.getBoundingClientRect(); if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) dialog.close(); } });
  dialog.addEventListener('close', () => { document.body.classList.remove('modal-open'); returnFocus?.focus(); });
});
document.querySelector('#privacy-button').addEventListener('click', () => openDialog(document.querySelector('#privacy-dialog')));

const form = document.querySelector('#quote-form');
form.addEventListener('submit', e => {
  e.preventDefault();
  if (!form.reportValidity()) return;
  const values = Object.fromEntries(new FormData(form));
  const name = values.name.trim();
  const description = values.description.trim();
  if (!name) { document.querySelector('#name').setCustomValidity('Please enter your name.'); form.reportValidity(); return; }
  if (description.length < 10) { document.querySelector('#description').setCustomValidity('Please describe your project in at least 10 characters.'); form.reportValidity(); return; }
  const lines = ['Hello Sunya3D,', '', 'I’d like to discuss a project.', '', `Name: ${name}`, `Email: ${values.email.trim()}`, `Service: ${values.service}`, `Quantity: ${values.quantity || 'To discuss'}`, `Target timing: ${values.timeline}`, '', 'Project details:', description];
  if (values.fileLink.trim()) lines.push('', `Design / photo link: ${values.fileLink.trim()}`);
  lines.push('', 'Please let me know the next steps, estimated cost and timing.', '', `Thanks,`, name);
  const brief = lines.join('\n');
  document.querySelector('#inquiry-preview').value = brief;
  document.querySelector('#send-inquiry').href = `mailto:${BUSINESS_EMAIL}?subject=${encodeURIComponent(`Sunya3D project inquiry — ${values.service}`)}&body=${encodeURIComponent(brief)}`;
  document.querySelector('#copy-status').textContent = '';
  openDialog(document.querySelector('#quote-dialog'));
});
document.querySelector('#name').addEventListener('input', e => e.target.setCustomValidity(''));
document.querySelector('#description').addEventListener('input', e => e.target.setCustomValidity(''));
document.querySelector('#copy-inquiry').addEventListener('click', async () => {
  const preview = document.querySelector('#inquiry-preview');
  try { await navigator.clipboard.writeText(preview.value); document.querySelector('#copy-status').textContent = 'Brief copied. Paste it into an email when you’re ready.'; }
  catch { preview.focus(); preview.select(); document.querySelector('#copy-status').textContent = 'Your brief is selected. Use your device’s Copy command, then paste it into an email.'; }
});

// Keep the site useful when WebGL is unavailable. Load the 3D experience separately.
import('./scene.js').catch(() => {
  document.querySelector('.scene-controls').hidden = true;
  document.querySelector('.drag-hint').textContent = 'From digital concept to something tangible.';
});

const photoHero = document.querySelector('.photo-hero');
const photoMotion = document.querySelector('#photo-motion');
let photoPaused = reducedMotion.matches;
function applyPhotoMotion() {
  photoHero.classList.toggle('motion-paused', photoPaused);
  photoMotion.setAttribute('aria-pressed', String(!photoPaused));
  photoMotion.setAttribute('aria-label', photoPaused ? 'Play image animation' : 'Pause image animation');
  photoMotion.textContent = photoPaused ? 'Play motion ▷' : 'Pause motion Ⅱ';
}
photoMotion.addEventListener('click', () => { photoPaused = !photoPaused; applyPhotoMotion(); });
reducedMotion.addEventListener('change', e => { photoPaused=e.matches; applyPhotoMotion(); });
applyPhotoMotion();
