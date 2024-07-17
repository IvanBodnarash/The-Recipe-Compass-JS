
// Parallax scrolling effect

document.addEventListener("scroll", function () {
    const scrollPosition = window.scrollY;
    const parallaxElement = document.querySelector(".search-container");
    parallaxElement.style.transform = "translateY(" + scrollPosition * 0.3 + "px)";
});

// Fade-in FX for loading

document.addEventListener('DOMContentLoaded', function() {
    document.body.classList.add('loaded');
});


