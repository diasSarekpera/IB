const links = document.querySelectorAll(".header__nav-link");

const currentUrl = window.location.pathname + window.location.hash;

links.forEach(link => {
  const linkUrl = new URL(link.href).pathname + new URL(link.href).hash;

  if (currentUrl === linkUrl) {
    link.classList.add("active");
  }
});




