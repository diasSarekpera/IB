const backToTop = document.querySelector('.backtotop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 200) {
    backToTop.classList.add('backtotop--visible');
    } else {
    backToTop.classList.remove('backtotop--visible');
    }
});


