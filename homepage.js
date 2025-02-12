document.querySelector('.menu-toggle').addEventListener('click', function() {
    document.querySelector('.menu').classList.toggle('show');
});
       document.addEventListener("DOMContentLoaded", function () {
            const favoritesToggle = document.querySelector('.favorites-toggle');
            const favoritesMenu = document.querySelector('.favorites-menu');
            const cartToggle = document.querySelector('.cart-toggle');
            const cartMenu = document.querySelector('.cart-menu');
 
            function toggleMenu(menu) {
                if (menu.classList.contains('show')) {
                    menu.classList.remove('show');
                } else {
                    closeAllMenus();
                    menu.classList.add('show');
                }
            }
 
            function closeAllMenus() {
                favoritesMenu.classList.remove('show');
                cartMenu.classList.remove('show');
            }
 
            favoritesToggle.addEventListener('click', () => toggleMenu(favoritesMenu));
            cartToggle.addEventListener('click', () => toggleMenu(cartMenu));
 
            document.addEventListener('click', (e) => {
                if (!favoritesToggle.contains(e.target) && !favoritesMenu.contains(e.target) &&
                    !cartToggle.contains(e.target) && !cartMenu.contains(e.target)) {
                    closeAllMenus();
                }
            });
        });


        // parte do carrossel
        const slides = document.querySelector('.slides');
        const slideCount = document.querySelectorAll('.slide').length;
        let currentIndex = 0;
 
        function showNextSlide() {
            currentIndex = (currentIndex + 1) % slideCount;
            const offset = -currentIndex * 100;
            slides.style.transform = `translateX(${offset}%)`;
        }
 
        setInterval(showNextSlide, 3000); // Muda de slide a cada 3 segundos 