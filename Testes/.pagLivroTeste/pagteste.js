/*=============== SEARCH ===============*/

const searchButton = document.getElementById('search-button'),
      searchClose = document.getElementById('search-close'),
      searchContent = document.getElementById('search-content');

//===== MENU SHOW =====//
/* Validate if constant exists */
if(searchButton){
    searchButton.addEventListener('click', () =>{
        searchContent.classList.add('show-search');
    });
}

//===== MENU HIDDEN =====//
/* Validate if constant exists */
if(searchClose){
    searchClose.addEventListener('click', () =>{
        searchContent.classList.remove('show-search');
    });
}


/*=============== LOGIN ===============*/


/*=============== ADD SHADOW HEADER ===============*/
const shadowHeader = () => {
    const header = document.getElementById('header');
    // When the scroll is greater than 50 viewport height, add class 's-header'
    this.scrollY >= 50 ? header.classList.add('shadow-header')
                       : header.classList.remove('shadow-header');
}

window.addEventListener('scroll', shadowHeader)

/*=============== HOME SWIPER ===============*/
let swiperHome = new Swiper('.home__swiper', {
    loop: true,
    spaceBetween: -24,
    grabCursor: true,
    slidesPerView: 'auto',
    centeredSlides: 'auto',

    autoplay:{
        delay:3000,
        disableOnInteraction:false,
    },

    breakpoints:{
        1220:{
            spaceBetween: -32,
        }
    }
})
    
/*=============== FEATURED SWIPER ===============*/
let swiperFeatured = new Swiper('.featured__swiper', {
    loop: true,
    spaceBetween: 16,
    grabCursor: true,
    slidesPerView: 'auto',
    centeredSlides: 'auto',

    navigation:{
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },

    breakpoints:{
        1150:{
            slidesPerView:4,
            centeredSlides:false,
        }
    }
})
   

/*=============== nao lembro pra que serve isso ===============*/

$(".wish-icon i").click(function(){
    $(this).toggleClass("fa-heart fa-heart-o");
});
	
/*=============== NEW SWIPER ===============*/
let swiperNew = new Swiper('.new__swiper', {
    loop: true,
    spaceBetween: 16,
    slidesPerView: 'auto',

    breakpoints:{
        1150:{
            slidesPerView:3,
           
        }
    }
})

/*=============== TESTIMONIAL SWIPER ===============*/


/*=============== SHOW SCROLL UP ===============*/ 


/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/


/*=============== DARK LIGHT THEME ===============*/ 
const themeButton = document.getElementById('theme-button')
const darkTheme ='dark-theme'
const iconTheme = 'ri-sun-line'

const selectedTheme = localStorage.getItem('selected-theme')
const selectedIcon = localStorage.getItem('selected-icon')

// Obtemos o tema atual que a interface tem validando a classe dark-theme
const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light';
const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'ri-moon-line' : 'ri-sun-line';

// Validamos se o usuário já escolheu um tema anteriormente
if (selectedTheme) {
    // Se a validação for preenchida, adiciona ou remove o tema baseado na escolha anterior
    document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme);
    themeButton.classList[selectedIcon === 'ri-moon-line' ? 'add' : 'remove'](iconTheme);
}

// Ativa ou desativa o tema manualmente com o botão
themeButton.addEventListener('click', () => {
    // Alterna entre dark/light e os ícones
    document.body.classList.toggle(darkTheme);
    themeButton.classList.toggle(iconTheme);
    
    // Salvamos o tema e o ícone atual escolhido pelo usuário
    localStorage.setItem('selected-theme', getCurrentTheme());
    localStorage.setItem('selected-icon', getCurrentIcon());
});

















//teste do carrinho e quantidade
document.addEventListener('DOMContentLoaded', function() {
    const minusButton = document.querySelector('.quantity-input button:first-child');
    const plusButton = document.querySelector('.quantity-input button:last-child');
    const input = document.querySelector('.quantity-input input');
    
    // Set minimum value
    const minValue = parseInt(input.getAttribute('min')) || 0;
    
    // Function to update quantity
    function updateQuantity(newValue) {
        // Ensure the value is not less than minimum
        newValue = Math.max(newValue, minValue);
        
        // Update input value
        input.value = newValue;
    }
    
    // Decrease quantity when minus button is clicked
    minusButton.addEventListener('click', function() {
        const currentValue = parseInt(input.value) || 0;
        updateQuantity(currentValue - 1);
    });
    
    // Increase quantity when plus button is clicked
    plusButton.addEventListener('click', function() {
        const currentValue = parseInt(input.value) || 0;
        updateQuantity(currentValue + 1);
    });
    
    // Handle manual input changes
    input.addEventListener('change', function() {
        const currentValue = parseInt(input.value) || 0;
        updateQuantity(currentValue);
    });
});