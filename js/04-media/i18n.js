/**
 * i18n.js — Système de traduction multilingue
 * Site Dr. C. Joscky Ibrahim AHO
 * Langues supportées : fr, en, es
 */

const SUPPORTED_LANGS = ['fr', 'en', 'es'];
const DEFAULT_LANG = 'fr';
const STORAGE_KEY = 'preferred_lang';

let currentTranslations = {};

/**
 * Charge le fichier JSON de la langue demandée
 */
async function loadTranslations(lang) {
    try {
        const response = await fetch(`/lang/04-media/${lang}.json`);
        if (!response.ok) throw new Error(`Langue introuvable : ${lang}`);
        currentTranslations = await response.json();
    } catch (error) {
        console.warn(`[i18n] Impossible de charger "${lang}", fallback sur "${DEFAULT_LANG}".`, error);
        if (lang !== DEFAULT_LANG) {
            const fallback = await fetch(`/locales/${DEFAULT_LANG}.json`);
            currentTranslations = await fallback.json();
        }
    }
}

/**
 * Résout une clé imbriquée de type "section.sous_cle"
*/
function resolveKey(obj, key) {
    return key.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : null), obj);
}

/**
 * Applique les traductions sur tous les éléments marqués data-i18n*
 */
function applyTranslations() {
    // Texte principal
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const value = resolveKey(currentTranslations, key);
        if (value !== null) el.textContent = value;
    });

    // Placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        const value = resolveKey(currentTranslations, key);
        if (value !== null) el.setAttribute('placeholder', value);
    });

    // Attribut title sur balises HTML
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        const value = resolveKey(currentTranslations, key);
        if (value !== null) {
            if (el.tagName === 'TITLE') {
                document.title = value;
            } else {
                el.setAttribute('title', value);
            }
        }
    });

    // Balises meta (content)
    document.querySelectorAll('[data-i18n-meta]').forEach(el => {
        const key = el.getAttribute('data-i18n-meta');
        const value = resolveKey(currentTranslations, key);
        if (value !== null) el.setAttribute('content', value);
    });

    // Attribut aria-label
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
        const key = el.getAttribute('data-i18n-aria');
        const value = resolveKey(currentTranslations, key);
        if (value !== null) el.setAttribute('aria-label', value);
    });
}

/**
 * Initialise ou change la langue
 */
async function setLanguage(lang) {
    if (!SUPPORTED_LANGS.includes(lang)) {
        console.warn(`[i18n] Langue non supportée : "${lang}"`);
        return;
    }
    await loadTranslations(lang);
    applyTranslations();
    document.documentElement.setAttribute('lang', lang);
    localStorage.setItem(STORAGE_KEY, lang);

    // Synchronise le <select> si présent
    const select = document.getElementById('language');
    if (select) select.value = lang;
}

/**
 * Détecte la langue initiale (stockée, navigateur, ou défaut)
 */
function detectLanguage() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED_LANGS.includes(stored)) return stored;

    const browser = navigator.language?.slice(0, 2);
    if (SUPPORTED_LANGS.includes(browser)) return browser;

    return DEFAULT_LANG;
}

/**
 * Point d'entrée : initialisation au chargement de la page
 */
document.addEventListener('DOMContentLoaded', async () => {
    const lang = detectLanguage();
    await setLanguage(lang);

    // Écoute le changement de langue via le <select>
    const select = document.getElementById('language');
    if (select) {
        select.addEventListener('change', (e) => {
            setLanguage(e.target.value);
        });
    }
});