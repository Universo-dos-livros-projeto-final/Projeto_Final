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
   

/*===============  ===============*/

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



/*   parte carrinho e favoritos */

class CartModal {
    constructor() {
        this.cart = [];
        this.cartModal = document.getElementById('cart-modal');
        this.cartItemsContainer = document.getElementById('cart-items');
        this.cartTotalElement = document.getElementById('cart-total');
        
        this.initEventListeners();
        this.loadCartFromLocalStorage();
    }

    initEventListeners() {
        // Open cart
        document.getElementById('carrinho').addEventListener('click', () => this.toggleCart());
        
        // Close cart
        document.querySelector('.cart-modal-close').addEventListener('click', () => this.toggleCart());
        
        // Add to cart buttons on book cards
        document.querySelectorAll('.featured__card .button').forEach(button => {
            button.addEventListener('click', (e) => this.addToCart(e.target.closest('.featured__card')));
        });
    }

    toggleCart() {
        this.cartModal.classList.toggle('show');
        this.renderCartItems();
    }

    addToCart(bookCard) {
        // Log para debugar o caminho da imagem
        const imagePath = bookCard.querySelector('.featured__img').src;
        console.log('Caminho da imagem:', imagePath);

        const book = {
            id: Date.now(), // Gerar um ID único
            title: bookCard.querySelector('.featured__title').textContent,
            price: parseFloat(bookCard.querySelector('.featured__discount').textContent.replace('$', '')),
            image: imagePath, // Usar o caminho completo da imagem
            quantity: 1
        };

        const existingItem = this.cart.find(item => item.title === book.title);
        
        if (existingItem) {
            existingItem.quantity++;
        } else {
            this.cart.push(book);
        }

        this.saveCartToLocalStorage();
        this.renderCartItems();
    }

    renderCartItems() {
        this.cartItemsContainer.innerHTML = '';
        let total = 0;

        this.cart.forEach((item, index) => {
            // Log adicional para verificar detalhes do item
            console.log('Detalhes do item:', item);

            // Verificação de segurança para imagem
            if (!item.image) {
                console.warn(`Imagem não encontrada para o livro: ${item.title}`);
                item.image = 'caminho/para/imagem/padrao.jpg'; // Imagem de fallback
            }

            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            const cartItemElement = document.createElement('div');
            cartItemElement.classList.add('cart-item');
            cartItemElement.innerHTML = `
                <img src="${item.image}" alt="${item.title}" class="cart-item-image" style="width: 80px; height: 120px; object-fit: cover;">
                <div class="cart-item-details">
                    <h3>${item.title}</h3>
                    <div class="cart-item-quantity">
                        <button onclick="cartModal.decreaseQuantity(${index})">-</button>
                        <input type="text" value="${item.quantity}" readonly>
                        <button onclick="cartModal.increaseQuantity(${index})">+</button>
                    </div>
                    <span class="cart-item-price">€ ${item.price.toFixed(2)}</span>
                </div>
                <button class="cart-item-remove" onclick="cartModal.removeItem(${index})">X</button>
            `;

            this.cartItemsContainer.appendChild(cartItemElement);
        });

        this.cartTotalElement.textContent = `R$ ${total.toFixed(2)}`;
    }

    increaseQuantity(index) {
        this.cart[index].quantity++;
        this.saveCartToLocalStorage();
        this.renderCartItems();
    }

    decreaseQuantity(index) {
        if (this.cart[index].quantity > 1) {
            this.cart[index].quantity--;
        } else {
            this.cart.splice(index, 1);
        }
        this.saveCartToLocalStorage();
        this.renderCartItems();
    }

    removeItem(index) {
        this.cart.splice(index, 1);
        this.saveCartToLocalStorage();
        this.renderCartItems();
    }

    saveCartToLocalStorage() {
        localStorage.setItem('universoLivrosCart', JSON.stringify(this.cart));
    }

    loadCartFromLocalStorage() {
        const savedCart = localStorage.getItem('universoLivrosCart');
        if (savedCart) {
            this.cart = JSON.parse(savedCart);
            this.renderCartItems();
        }
    }
}


const cartModal = new CartModal();




// favoritos
class FavoritesModal {
    constructor() {
        this.favorites = [];
        this.favoritesModal = document.getElementById('favorites-modal');
        this.favoritesItemsContainer = document.getElementById('favorites-items');
        
        this.initEventListeners();
        this.loadFavoritesFromLocalStorage();
    }

    initEventListeners() {
        // Open favorites
        const favoritosButton = document.getElementById('favoritos');
        if (favoritosButton) {
            favoritosButton.addEventListener('click', () => this.toggleFavorites());
        } else {
            console.error('Favorites button not found');
        }
        
        // Close favorites
        const closeButton = document.querySelector('.favorites-modal-close');
        if (closeButton) {
            closeButton.addEventListener('click', () => this.toggleFavorites());
        } else {
            console.error('Favorites close button not found');
        }
        
        // Add event listeners to favorite buttons
        this.addFavoriteButtonListeners();
    }

    addFavoriteButtonListeners() {
        const favoriteButtons = document.querySelectorAll('.featured__actions button:nth-child(2)');
        
        if (favoriteButtons.length === 0) {
            console.warn('No favorite buttons found');
        }

        favoriteButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const bookCard = e.target.closest('.featured__card');
                
                if (bookCard) {
                    this.addToFavorites(bookCard);
                } else {
                    console.error('No book card found for favorite button');
                }
            });
        });
    }

    addToFavorites(bookCard) {
        const imgEl = bookCard.querySelector('.featured__img');
        const titleEl = bookCard.querySelector('.featured__title');
        const priceEl = bookCard.querySelector('.featured__discount');

        if (!imgEl || !titleEl || !priceEl) {
            console.error('Missing elements in book card', {
                img: !!imgEl,
                title: !!titleEl,
                price: !!priceEl
            });
            return;
        }

        const book = {
            id: imgEl.src,
            title: titleEl.textContent.trim(),
            price: priceEl.textContent,
            bookCard: bookCard  // Store reference to the original book card
        };

        const existingItem = this.favorites.find(item => item.id === book.id);
        
        if (!existingItem) {
            this.favorites.push(book);
            this.saveFavoritesToLocalStorage();
            this.renderFavoriteItems();
            
            // Visual feedback for favorite button
            const heartIcon = bookCard.querySelector('.featured__actions button:nth-child(2) i');
            if (heartIcon) {
                heartIcon.classList.add('ri-heart-fill');
                heartIcon.classList.remove('ri-heart-line');
            }
        }
    }

    toggleFavorites() {
        this.favoritesModal.classList.toggle('show');
        this.renderFavoriteItems();
    }

    renderFavoriteItems() {
        this.favoritesItemsContainer.innerHTML = '';

        if (this.favorites.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.classList.add('favorites-empty-message');
            emptyMessage.textContent = 'Nenhum livro nos favoritos';
            this.favoritesItemsContainer.appendChild(emptyMessage);
            return;
        }

        this.favorites.forEach((item, index) => {
            const favoriteItemElement = document.createElement('div');
            favoriteItemElement.classList.add('favorites-item');
            favoriteItemElement.innerHTML = `
                <img src="${item.id}" alt="${item.title}" style="width: 80px; height: 120px; object-fit: cover;">
                <div class="favorites-item-details">
                    <h3>${item.title}</h3>
                    <p>${item.price}</p>
                </div>
                <div class="favorites-item-actions">
                    <button class="favorites-item-cart" onclick="favoritesModal.addToCart(${index})">Carrinho</button>
                    <button class="favorites-item-remove" onclick="favoritesModal.removeItem(${index})">X</button>
                </div>
            `;

            this.favoritesItemsContainer.appendChild(favoriteItemElement);
        });
    }

    addToCart(index) {
        const item = this.favorites[index];
        
        // Create a button simulation for the cart modal
        const cartButton = item.bookCard.querySelector('.button');
        if (cartButton) {
            cartButton.click();
        }
    }

    removeItem(index) {
        const removedItem = this.favorites[index];
        this.favorites.splice(index, 1);
        this.saveFavoritesToLocalStorage();
        this.renderFavoriteItems();

        // Revert heart icon in original book card
        const bookCards = document.querySelectorAll('.featured__card');
        bookCards.forEach(card => {
            const img = card.querySelector('.featured__img');
            if (img && img.src === removedItem.id) {
                const heartIcon = card.querySelector('.featured__actions button:nth-child(2) i');
                if (heartIcon) {
                    heartIcon.classList.remove('ri-heart-fill');
                    heartIcon.classList.add('ri-heart-line');
                }
            }
        });
    }

    saveFavoritesToLocalStorage() {
        localStorage.setItem('universoLivrosFavorites', JSON.stringify(this.favorites));
    }

    loadFavoritesFromLocalStorage() {
        const savedFavorites = localStorage.getItem('universoLivrosFavorites');
        if (savedFavorites) {
            this.favorites = JSON.parse(savedFavorites);
            this.renderFavoriteItems();
        }
    }
}

// Initialize the favorites modal
const favoritesModal = new FavoritesModal();


// Botao que aumenta e diminue a quantidade de produtos
document.querySelectorAll('.quantity').forEach(quantityContainer => {
  const minusBtn = quantityContainer.querySelector('.qty-btn:first-child');
  const plusBtn = quantityContainer.querySelector('.qty-btn:last-child');
  const input = quantityContainer.querySelector('input[type="number"]');

  minusBtn.addEventListener('click', () => {
    let value = parseInt(input.value) || 0;
    if (value > 0) {
      input.value = value - 1;
    }
  });

  plusBtn.addEventListener('click', () => {
    let value = parseInt(input.value) || 0;
    input.value = value + 1;
  });
});

