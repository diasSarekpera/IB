/**
 * animations.js — Animations au scroll
 * Page : Médias — Site Dr. C. Joscky Ibrahim AHO
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
    initGalleryStagger();
  });
}


/* ─────────────────────────────────────────────
   1. SCROLL REVEAL GÉNÉRAL
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
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    }
  );

  elements.forEach(el => observer.observe(el));
}


/* ─────────────────────────────────────────────
   2. GALERIE — entrée en cascade au scroll
   Déclenche les items qui ne seraient pas encore
   dans le viewport au moment du DOMContentLoaded
   ───────────────────────────────────────────── */
function initGalleryStagger() {
  const items = document.querySelectorAll('.gallery__item');
  if (!items.length) return;

  // Les délais sont déjà injectés via data-anim-delay dans le HTML
  // On vérifie juste que le JS de révélation les prend bien en compte
  // (couvert par initScrollReveal — cette fonction sert de garde-fou)

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Assure la visibilité même si l'item n'a pas data-anim-delay
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.08,
      rootMargin: '0px 0px -30px 0px',
    }
  );

  items.forEach(el => observer.observe(el));
}