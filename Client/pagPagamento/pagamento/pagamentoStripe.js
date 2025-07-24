const stripe = Stripe('pk_test_51RiwxXRpegXRgAZ8mmpsxJTbCjoxZnsA9gdLBdsmF9GR27Q09Zp5F63PqASkoqtdVSTJ7vWIt6lVgCNDeyZ4OIgE00CRYBFHuT');
  const elements = stripe.elements();
  const card = elements.create('card', {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  });
  card.mount('#card-element');

  const form = document.getElementById('payment-form');
  const mensagem = document.getElementById('mensagem');
  const submitButton = document.getElementById('submit');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    submitButton.disabled = true;
    submitButton.innerHTML = `
      <span class="flex items-center justify-center space-x-2">
        <svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
        <span>Processando...</span>
      </span>
    `;

    const { paymentIntent, error: paymentIntentError } = await criarIntentDePagamento();

    if (paymentIntentError) {
      alert(paymentIntentError);
      submitButton.disabled = false;
      submitButton.textContent = 'Pagar €34,90';
      return;
    }

    const { error } = await stripe.confirmCardPayment(paymentIntent.clientSecret, {
      payment_method: {
        card: card,
        billing_details: {
          name: document.getElementById('name').value,
          email: document.getElementById('email').value,
        },
      },
    });

    if (error) {
      alert(error.message);
      submitButton.disabled = false;
      submitButton.textContent = 'Pagar €34,90';
    } else {
      mensagem.classList.remove('hidden');
      form.reset();
      card.clear();
      submitButton.disabled = false;
      submitButton.textContent = 'Pagar €34,90';
    }
  });

  async function criarIntentDePagamento() {
    try {
      const response = await fetch('http://127.0.0.1:3000/criar-intent', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    total: 34.90,
    nome: document.getElementById('name').value,
    email: document.getElementById('email').value,
  }),
});


      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar Payment Intent');
      }

      return { paymentIntent: data, error: null };
    } catch (error) {
      return { paymentIntent: null, error: error.message };
    }
  }


/*=============== DARK LIGHT THEME ===============*/
 const themeButton = document.getElementById("theme-button");
  const themeIcon = document.getElementById("theme-icon");
  const darkThemeClass = "dark-theme";

  // Classe dos ícones Remix
  const iconMoon = "ri-moon-line";
  const iconSun = "ri-sun-line";

  // Carrega tema salvo
  const savedTheme = localStorage.getItem("selected-theme");
  if (savedTheme === "dark") {
    document.body.classList.add(darkThemeClass);
    themeIcon.classList.remove(iconMoon);
    themeIcon.classList.add(iconSun);
  }

  // Toggle ao clicar
  themeButton.addEventListener("click", () => {
    document.body.classList.toggle(darkThemeClass);
    const isDark = document.body.classList.contains(darkThemeClass);

    themeIcon.classList.toggle(iconMoon, !isDark);
    themeIcon.classList.toggle(iconSun, isDark);

    localStorage.setItem("selected-theme", isDark ? "dark" : "light");
  });

  // botao de pesquisa 
     document.addEventListener("DOMContentLoaded", function () {
    const searchButton = document.getElementById("search-button");
    const searchClose = document.getElementById("search-close");
    const searchContent = document.getElementById("search-content");

    searchButton?.addEventListener("click", () => {
      searchContent.classList.add("show-search");
    });

    searchClose?.addEventListener("click", () => {
      searchContent.classList.remove("show-search");
    });
  });

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

/*=============== User Page ===============*/
document.addEventListener("DOMContentLoaded", () => {
  const userLink = document.getElementById("user-link");  

  if (userLink) {
    userLink.addEventListener("click", async (e) => {
      e.preventDefault();

      const token = Cookies.get("token");
      console.log("Token atual:", token);

      if (!token) {
        console.warn("Sem token — redirecionando para login");
        window.location.href = "/Client/PaginaLogin/paginaLogin.html";
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/validate-token", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          console.log("Token válido — redirecionando para o dashboard");
          window.location.href =
            "/Client/userDashboard/userDashboardInfo/userDashboard.html";
        } else {
          console.warn("Token inválido — redirecionando para login");
          Cookies.remove("token");
          window.location.href = "/Client/PaginaLogin/paginaLogin.html";
        }
      } catch (error) {
        console.error("Erro ao validar token:", error);
        Cookies.remove("token");
        window.location.href = "/Client/PaginaLogin/paginaLogin.html";
      }
    });
  } else {
    console.error("#user-link não encontrado no DOM");
  }
});


