(function () {

  const burger  = document.getElementById('header-burger');
  const nav     = document.getElementById('header-nav');
  const overlay = document.getElementById('header-overlay');

  if (!burger || !nav || !overlay) return;

  function openMenu() {
    nav.classList.add('is-open');
    overlay.classList.add('is-visible');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Fermer le menu');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    nav.classList.remove('is-open');
    overlay.classList.remove('is-visible');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Ouvrir le menu');
    document.body.style.overflow = '';
  }

  burger.addEventListener('click', () => {
    const isOpen = burger.getAttribute('aria-expanded') === 'true';
    isOpen ? closeMenu() : openMenu();
  });

  overlay.addEventListener('click', closeMenu);

  nav.querySelectorAll('.header__nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) closeMenu();
  });

  const currentUrl = window.location.pathname + window.location.hash;
  nav.querySelectorAll('.header__nav-link').forEach(link => {
    const linkUrl = new URL(link.href).pathname + new URL(link.href).hash;
    if (currentUrl === linkUrl) link.classList.add('active');
  });

})();