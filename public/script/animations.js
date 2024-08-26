
// Parallax scrolling effect

document.addEventListener("scroll", function () {
    const scrollPosition = window.scrollY;
    const parallaxElement = document.querySelector(".search-container");
    if (parallaxElement) {
        parallaxElement.style.transform = "translateY(" + scrollPosition * 0.3 + "px)";
    } else {
        return;
    }
});

// Fade-in FX for loading

document.addEventListener('DOMContentLoaded', function() {
    document.body.classList.add('loaded');
});


