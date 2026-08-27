/**
 * animations.js — Animations au scroll
 * Page : Publications — Site Dr. C. Joscky Ibrahim AHO
 * Intersection Observer API — propre, moderne, optimisé
 */

'use strict';

/* ─────────────────────────────────────────────
   RESPECT DE LA PRÉFÉRENCE UTILISATEUR
   ───────────────────────────────────────────── */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
  });
}


/* ─────────────────────────────────────────────
   SCROLL REVEAL — Intersection Observer
   ───────────────────────────────────────────── */
function initScrollReveal() {
  const elements = document.querySelectorAll('.anim-reveal');
  if (!elements.length) return;

  // Injection des délais CSS depuis data-anim-delay
  elements.forEach(el => {
    const delay = el.getAttribute('data-anim-delay');
    if (delay) {
      el.style.setProperty('--anim-delay', `${delay}s`);
    }
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // On arrête d'observer une fois l'animation jouée
          observer.unobserve(entry.target);
        }
      });
    },
    {
      // Déclenche quand 10% de l'élément est visible
      threshold: 0.1,
      // Légère marge pour déclencher un peu avant l'entrée dans le viewport
      rootMargin: '0px 0px -50px 0px',
    }
  );

  elements.forEach(el => observer.observe(el));
}