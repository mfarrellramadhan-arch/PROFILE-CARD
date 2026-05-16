// ============================================================
//  NAVBAR — Hamburger Toggle
// ============================================================

const hamburger = document.getElementById('hamburger');
const menu = document.getElementById('menu');
const hamburgerIcon = hamburger.querySelector('i');

function openMenu() {
  menu.classList.add('active');
  hamburgerIcon.classList.replace('fa-bars', 'fa-xmark');
  hamburger.setAttribute('aria-expanded', 'true');
}

function closeMenu() {
  menu.classList.remove('active');
  hamburgerIcon.classList.replace('fa-xmark', 'fa-bars');
  hamburger.setAttribute('aria-expanded', 'false');
}

function toggleMenu() {
  menu.classList.contains('active') ? closeMenu() : openMenu();
}

// Toggle on hamburger click
hamburger.addEventListener('click', toggleMenu);

// Close when a nav link is clicked (mobile UX)
menu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeMenu);
});

// Close when clicking outside the navbar
document.addEventListener('click', (e) => {
  if (!hamburger.contains(e.target) && !menu.contains(e.target)) {
    closeMenu();
  }
});