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
const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'ri-moon-line' : 'ru-sun-line';

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


/*=============== SCROLL REVEAL ANIMATION ===============*/
const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration:2500,
    delay:400,
})

sr.reveal('.home__data, .featured__container, .new__container, .footer')
sr.reveal('.home__images', {delay:600})
sr.reveal('.services__card',{interval:100})
sr.reveal('.discount__data',{origin: 'left'})
sr.reveal('.discount__images', {origin: 'right'})


