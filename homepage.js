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
        let index = 0;
        const images = document.querySelectorAll(".carousel img");
        const totalImages = images.length;
       
        document.getElementById("next").addEventListener("click", () => {
            index = (index + 1) % totalImages;
            updateCarousel();
        });
     
        document.getElementById("prev").addEventListener("click", () => {
            index = (index - 1 + totalImages) % totalImages;
            updateCarousel();
        });
     
        function updateCarousel() {
            const carousel = document.querySelector(".carousel");
            carousel.style.transform = `translateX(${-index * 100}%)`;
        }
     
        setInterval(() => {
            index = (index + 1) % totalImages;
            updateCarousel();
        }, 10000); 

// Categoria teste
