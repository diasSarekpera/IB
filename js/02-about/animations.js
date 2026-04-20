/**
 * animations.js — Animations au scroll
 * Page : About — Site Dr. C. Joscky Ibrahim AHO
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
    initTimelineDots();
    initQuoteReveal();
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
   2. TIMELINE DOTS — activation séquentielle
   ───────────────────────────────────────────── */
function initTimelineDots() {
  const items = document.querySelectorAll('.timeline__item');
  if (!items.length) return;

  // Observer dédié avec un seuil plus faible pour les items de timeline
  // (ils peuvent être longs et n'atteindre jamais 12% de visibilité)
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Le dot scale(1) est déclenché par la classe is-visible via CSS
          // Elle est déjà ajoutée par initScrollReveal si l'item porte anim-reveal
          // Ici on s'assure que même les items sans anim-reveal déclenchent le dot
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.05,
      rootMargin: '0px 0px -30px 0px',
    }
  );

  items.forEach(el => observer.observe(el));
}


/* ─────────────────────────────────────────────
   3. CITATION — activation de la pulsation
   ───────────────────────────────────────────── */
function initQuoteReveal() {
  const quote = document.querySelector('.philosophical-vision__quote');
  if (!quote) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // La pulsation CSS démarre dès que is-visible est présent
          // Elle est déjà gérée par initScrollReveal
          // On ajoute un délai supplémentaire pour laisser le fade-in finir
          setTimeout(() => {
            quote.classList.add('is-visible');
          }, 200);
          observer.unobserve(quote);
        }
      });
    },
    { threshold: 0.4 }
  );

  observer.observe(quote);
}