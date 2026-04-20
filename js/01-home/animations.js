/**
 * animations.js — Gestion des animations au scroll
 * Site Dr. C. Joscky Ibrahim AHO
 * Utilise l'Intersection Observer API (moderne, performant)
 */

'use strict';

/* ─────────────────────────────────────────────
   1. RESPECT DE LA PRÉFÉRENCE UTILISATEUR
   ───────────────────────────────────────────── */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initCounters();
    initBadgeFloat();
  });
}


/* ─────────────────────────────────────────────
   2. SCROLL REVEAL — Intersection Observer
   ───────────────────────────────────────────── */
function initScrollReveal() {
  const elements = document.querySelectorAll('.anim-reveal');

  if (!elements.length) return;

  // Lecture des délais depuis data-anim-delay et injection en CSS variable
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
      // L'élément déclenche quand 12% de sa surface est visible
      threshold: 0.12,
      // Légère marge pour déclencher un peu avant l'entrée dans le viewport
      rootMargin: '0px 0px -40px 0px',
    }
  );

  elements.forEach(el => observer.observe(el));
}


/* ─────────────────────────────────────────────
   3. COMPTEURS ANIMÉS — metric cards
   ───────────────────────────────────────────── */
function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');

  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(el => observer.observe(el));
}

/**
 * Anime un compteur de 0 jusqu'à sa valeur cible
 * @param {HTMLElement} el — élément portant data-counter="N"
 */
function animateCounter(el) {
  const target  = parseInt(el.getAttribute('data-counter'), 10);
  const suffix  = el.textContent.replace(/[0-9]/g, '').trim(); // ex: "+"
  const duration = 1400; // ms
  const startTime = performance.now();

  function step(currentTime) {
    const elapsed  = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Easing "ease-out" maison
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);

    el.textContent = `${current}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = `${target}${suffix}`;
    }
  }

  requestAnimationFrame(step);
}


/* ─────────────────────────────────────────────
   4. BADGE FLOTTANT — activation après révélation
   ───────────────────────────────────────────── */
function initBadgeFloat() {
  const badge = document.querySelector('.about__badge');
  if (!badge) return;

  // On attend que le badge soit révélé par le scroll reveal
  // pour démarrer son animation flottante (géré via CSS + is-visible)
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Petit délai pour laisser le fade-in terminer avant de flotter
          setTimeout(() => {
            badge.classList.add('is-visible');
          }, 500);
          observer.unobserve(badge);
        }
      });
    },
    { threshold: 0.5 }
  );

  observer.observe(badge);
}