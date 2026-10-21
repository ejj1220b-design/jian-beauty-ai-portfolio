'use strict';

// Keep the screenshot tabs usable with both pointer and keyboard input.
document.querySelectorAll('[role="tablist"]').forEach(tablist => {
  const tabs = [...tablist.querySelectorAll('[role="tab"]')];
  function select(tab, focus = false) {
    tabs.forEach(item => {
      const active = item === tab;
      item.setAttribute('aria-selected', String(active));
      item.tabIndex = active ? 0 : -1;
      const panel = document.getElementById(item.getAttribute('aria-controls'));
      if (panel) panel.hidden = !active;
    });
    if (focus) tab.focus();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { event.preventDefault(); select(tabs[next], true); }
    });
  });
});

const viewer = document.getElementById('image-viewer');
let returnFocus;
if (viewer) {
  const image = viewer.querySelector('img');
  const caption = viewer.querySelector('figcaption');
  const closeButton = viewer.querySelector('.lightbox-close');
  function closeImage() { viewer.close(); }
  document.querySelectorAll('[data-zoom]').forEach(button => {
    button.addEventListener('click', () => {
      returnFocus = button;
      image.src = button.dataset.zoom;
      image.alt = button.querySelector('img')?.alt || button.dataset.caption || '';
      caption.textContent = button.dataset.caption || '';
      viewer.showModal();
      document.body.style.overflow = 'hidden';
      closeButton.focus();
    });
  });
  closeButton.addEventListener('click', closeImage);
  viewer.addEventListener('click', event => { if (event.target === viewer) closeImage(); });
  viewer.addEventListener('close', () => {
    document.body.style.overflow = '';
    returnFocus?.focus();
  });
}

if ('IntersectionObserver' in window) {
  const navLinks = [...document.querySelectorAll('.site-header nav a')];
  const sections = navLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          if (link.hash === '#' + entry.target.id) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      }
    });
  }, { rootMargin: '-15% 0px -65% 0px' });
  sections.forEach(section => observer.observe(section));
}
