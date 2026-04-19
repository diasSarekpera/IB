const i18n = {
  currentLang: localStorage.getItem('lang') || 'fr',

  async load(lang) {
    const response = await fetch(`/lang/02-about/${lang}.json`);
    return await response.json();
  },

  async apply(lang) {
    this.currentLang = lang;
    localStorage.setItem('lang', lang);
    const translations = await this.load(lang);

    // data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[key] !== undefined) {
        el.innerHTML = translations[key];
      }
    });

    // data-i18n-placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (translations[key] !== undefined) {
        el.setAttribute('placeholder', translations[key]);
      }
    });

    // data-i18n-title (balise <title>)
    const titleEl = document.querySelector('[data-i18n-title]');
    if (titleEl) {
      const key = titleEl.getAttribute('data-i18n-title');
      if (translations[key] !== undefined) {
        titleEl.textContent = translations[key];
      }
    }

    // data-i18n-meta
    document.querySelectorAll('[data-i18n-meta]').forEach(el => {
      const key = el.getAttribute('data-i18n-meta');
      if (translations[key] !== undefined) {
        if (el.hasAttribute('content')) {
          el.setAttribute('content', translations[key]);
        }
      }
    });

    // aria-label burger
    const burger = document.getElementById('header-burger');
    if (burger && translations['aria_open_menu']) {
      burger.setAttribute('aria-label', translations['aria_open_menu']);
    }

    // select lang sync
    const select = document.getElementById('language');
    if (select) select.value = lang;
  },

  init() {
    this.apply(this.currentLang);
    const select = document.getElementById('language');
    if (select) {
      select.value = this.currentLang;
      select.addEventListener('change', (e) => this.apply(e.target.value));
    }
  }
};

document.addEventListener('DOMContentLoaded', () => i18n.init());


