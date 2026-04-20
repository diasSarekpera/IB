/**
 * animations.js
 * Gestion des animations au scroll — Publications
 * À placer dans : js/03-publications/animations.js
 *
 * Stratégie :
 *  - Intersection Observer pour les apparitions au scroll
 *  - Les éléments du header s'animent via CSS pur (chargement)
 *  - Les cartes se révèlent en stagger selon leur position dans la liste
 *  - Un seul Observer pour toute la page (performance optimale)
 */

(function () {
  'use strict';

  /* -------------------------------------------------------
     Vérification support Intersection Observer
  ------------------------------------------------------- */
  if (!('IntersectionObserver' in window)) {
    // Fallback : rendre tous les éléments visibles immédiatement
    document.querySelectorAll('.anim-reveal, .anim-card').forEach(function (el) {
      el.classList.add('is-visible');
    });
    return;
  }

  /* -------------------------------------------------------
     Constantes
  ------------------------------------------------------- */
  const STAGGER_BASE_MS  = 80;   // délai entre chaque carte d'un même groupe
  const STAGGER_MAX      = 4;    // plafond du stagger (évite des attentes trop longues)
  const THRESHOLD        = 0.12; // % de l'élément visible pour déclencher
  const ROOT_MARGIN      = '0px 0px -48px 0px'; // déclenche légèrement avant le bas du viewport

  /* -------------------------------------------------------
     Utilitaire : appliquer un délai de transition dynamique
  ------------------------------------------------------- */
  function applyDelay(el, delayMs) {
    el.style.transitionDelay = delayMs + 'ms';
  }

  function clearDelay(el) {
    // On retire le délai après l'animation pour ne pas bloquer les hovers
    el.addEventListener('transitionend', function handler() {
      el.style.transitionDelay = '';
      el.removeEventListener('transitionend', handler);
    });
  }

  /* -------------------------------------------------------
     Observer principal : .anim-reveal (sections, headers, textes)
  ------------------------------------------------------- */
  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        const el    = entry.target;
        const delay = parseInt(el.dataset.animDelay || '0', 10);
        const ms    = Math.min(delay, STAGGER_MAX) * STAGGER_BASE_MS;

        applyDelay(el, ms);
        el.classList.add('is-visible');
        clearDelay(el);

        // On n'observe plus cet élément une fois visible
        revealObserver.unobserve(el);
      });
    },
    {
      threshold:  THRESHOLD,
      rootMargin: ROOT_MARGIN,
    }
  );

  /* -------------------------------------------------------
     Observer des cartes : .anim-card
     Stagger calculé dynamiquement par groupe (même liste parente)
  ------------------------------------------------------- */
  const cardObserver = new IntersectionObserver(
    function (entries) {
      // Regrouper les entrées intersectantes par liste parente
      const visibleByParent = new Map();

      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const parent = entry.target.parentElement;
        if (!visibleByParent.has(parent)) {
          visibleByParent.set(parent, []);
        }
        visibleByParent.get(parent).push(entry.target);
      });

      // Pour chaque groupe, calculer le stagger à partir de l'index visible
      visibleByParent.forEach(function (cards) {
        cards.forEach(function (card, index) {
          // On récupère l'index dans la liste complète des cartes visibles
          const staggerIndex = Math.min(index, STAGGER_MAX);
          const delayMs      = staggerIndex * STAGGER_BASE_MS;

          applyDelay(card, delayMs);
          card.classList.add('is-visible');
          clearDelay(card);

          cardObserver.unobserve(card);
        });
      });
    },
    {
      threshold:  THRESHOLD,
      rootMargin: ROOT_MARGIN,
    }
  );

  /* -------------------------------------------------------
     Initialisation : observer tous les éléments cibles
  ------------------------------------------------------- */
  function init() {
    // Éléments à révélation simple
    document.querySelectorAll('.anim-reveal').forEach(function (el) {
      revealObserver.observe(el);
    });

    // Cartes de publication
    document.querySelectorAll('.anim-card').forEach(function (el) {
      cardObserver.observe(el);
    });
  }

  /* -------------------------------------------------------
     Lancement après chargement du DOM
  ------------------------------------------------------- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();