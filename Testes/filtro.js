/*=============== SEARCH ===============*/
const searchButton = document.getElementById('search-button'),
      searchClose = document.getElementById('search-close'),
      searchContent = document.getElementById('search-content');

//===== MENU SHOW =====//
if(searchButton){
    searchButton.addEventListener('click', () => {
        searchContent.classList.add('show-search');
    });
}

//===== MENU HIDDEN =====//
if(searchClose){
    searchClose.addEventListener('click', () => {
        searchContent.classList.remove('show-search');
    });
}

/*=============== ADD SHADOW HEADER ===============*/
const shadowHeader = () => {
    const header = document.getElementById('header');
    window.scrollY >= 50 ? header.classList.add('shadow-header')
                          : header.classList.remove('shadow-header');
}

window.addEventListener('scroll', shadowHeader)


/*=============== DARK LIGHT THEME ===============*/ 
const themeButton = document.getElementById('theme-button')
const darkTheme = 'dark-theme'
const iconTheme = 'ri-sun-line'

const selectedTheme = localStorage.getItem('selected-theme')
const selectedIcon = localStorage.getItem('selected-icon')

const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light';
const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'ri-moon-line' : 'ri-sun-line';

if (selectedTheme) {
    document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme);
    themeButton.classList[selectedIcon === 'ri-moon-line' ? 'add' : 'remove'](iconTheme);
}

themeButton.addEventListener('click', () => {
    document.body.classList.toggle(darkTheme);
    themeButton.classList.toggle(iconTheme);
    
    localStorage.setItem('selected-theme', getCurrentTheme());
    localStorage.setItem('selected-icon', getCurrentIcon());
});

/*=============== SCROLL REVEAL ANIMATION ===============*/
const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 2500,
    delay: 400,
})

sr.reveal('.home__data, .featured__container, .new__container, .footer')
sr.reveal('.home__images', {delay: 600})
sr.reveal('.services__card', {interval: 100})
sr.reveal('.discount__data', {origin: 'left'})
sr.reveal('.discount__images', {origin: 'right'})

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
        document.getElementById('carrinho').addEventListener('click', () => this.toggleCart());
        document.querySelector('.cart-modal-close').addEventListener('click', () => this.toggleCart());
        
        document.querySelectorAll('.featured__card .button').forEach(button => {
            button.addEventListener('click', (e) => this.addToCart(e.target.closest('.featured__card')));
        });
    }

    toggleCart() {
        this.cartModal.classList.toggle('show');
        this.renderCartItems();
    }

    addToCart(bookCard) {
        const book = {
            id: Date.now(),
            title: bookCard.querySelector('.featured__title').textContent,
            price: parseFloat(bookCard.querySelector('.featured__discount').textContent.replace('$', '')),
            image: bookCard.querySelector('.featured__img').src,
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

        this.cartTotalElement.textContent = `€ ${total.toFixed(2)}`;
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

class FavoritesModal {
    constructor() {
        this.favorites = [];
        this.favoritesModal = document.getElementById('favorites-modal');
        this.favoritesItemsContainer = document.getElementById('favorites-items');
        
        this.initEventListeners();
        this.loadFavoritesFromLocalStorage();
    }

    initEventListeners() {
        const favoritosButton = document.getElementById('favoritos');
        if (favoritosButton) {
            favoritosButton.addEventListener('click', () => this.toggleFavorites());
        }
        
        const closeButton = document.querySelector('.favorites-modal-close');
        if (closeButton) {
            closeButton.addEventListener('click', () => this.toggleFavorites());
        }
        
        this.addFavoriteButtonListeners();
    }

    addFavoriteButtonListeners() {
        const favoriteButtons = document.querySelectorAll('.featured__actions button:nth-child(2)');

        favoriteButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const bookCard = e.target.closest('.featured__card');
                
                if (bookCard) {
                    this.addToFavorites(bookCard);
                }
            });
        });
    }

    addToFavorites(bookCard) {
        const imgEl = bookCard.querySelector('.featured__img');
        const titleEl = bookCard.querySelector('.featured__title');
        const priceEl = bookCard.querySelector('.featured__discount');

        if (!imgEl || !titleEl || !priceEl) return;

        const book = {
            id: imgEl.src,
            title: titleEl.textContent.trim(),
            price: priceEl.textContent,
            bookCardId: bookCard.id  // Store book card identifier instead of whole card
        };

        const existingItem = this.favorites.find(item => item.id === book.id);
        
        if (!existingItem) {
            this.favorites.push(book);
            this.saveFavoritesToLocalStorage();
            this.renderFavoriteItems();
            
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
        
        const cartButton = document.getElementById(item.bookCardId)?.querySelector('.button');
        if (cartButton) {
            cartButton.click();
        }
    }

    removeItem(index) {
        const removedItem = this.favorites[index];
        this.favorites.splice(index, 1);
        this.saveFavoritesToLocalStorage();
        this.renderFavoriteItems();

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

const favoritesModal = new FavoritesModal();



