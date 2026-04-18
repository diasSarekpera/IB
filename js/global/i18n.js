const languageSelect = document.getElementById("language");

async function loadLanguage(lang) {
  try {
    const response = await fetch(`/lang/${lang}.json`);
    const translations = await response.json();

    // 1) Traduction des textes normaux
    document.querySelectorAll("[data-i18n]").forEach(element => {
      const key = element.getAttribute("data-i18n");

      if (translations[key]) {
        element.textContent = translations[key];
      }
    });

    // 2) Traduction des placeholders
    document.querySelectorAll("[data-i18n-placeholder]").forEach(element => {
      const key = element.getAttribute("data-i18n-placeholder");

      if (translations[key]) {
        element.setAttribute("placeholder", translations[key]);
      }
    });

    // 3) Traduction du TITLE de la page
    const titleKey = document.documentElement.getAttribute("data-i18n-title");
    if (titleKey && translations[titleKey]) {
      document.title = translations[titleKey];
    }

    // 4) Traduction des meta tags (description, og:title, og:description, twitter:title...)
    document.querySelectorAll("meta[data-i18n-meta]").forEach(meta => {
      const metaName = meta.getAttribute("data-i18n-meta");

      if (translations[metaName]) {
        meta.setAttribute("content", translations[metaName]);
      }
    });

  } catch (error) {
    console.error("Erreur de chargement de langue :", error);
  }
}

function setLanguage(lang) {
  localStorage.setItem("lang", lang);
  loadLanguage(lang);
}

window.addEventListener("DOMContentLoaded", () => {
  const savedLang = localStorage.getItem("lang") || "fr";

  if (languageSelect) {
    languageSelect.value = savedLang;

    languageSelect.addEventListener("change", (e) => {
      setLanguage(e.target.value);
    });
  }

  loadLanguage(savedLang);
});