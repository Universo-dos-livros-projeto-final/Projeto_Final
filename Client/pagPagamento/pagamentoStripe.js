/*=============== SEARCH ===============*/
const searchButton = document.getElementById("search-button"),
  searchClose = document.getElementById("search-close"),
  searchContent = document.getElementById("search-content");

if (searchButton) {
  searchButton.addEventListener("click", () => {
    searchContent.classList.add("show-search");
  });
}

if (searchClose) {
  searchClose.addEventListener("click", () => {
    searchContent.classList.remove("show-search");
  });
}

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

// ========== Stripe Elements ==========
const stripe = Stripe(
  "pk_test_51RiwxXRpegXRgAZ8mmpsxJTbCjoxZnsA9gdLBdsmF9GR27Q09Zp5F63PqASkoqtdVSTJ7vWIt6lVgCNDeyZ4OIgE00CRYBFHuT"
);
const elements = stripe.elements();
const card = elements.create("card", {
  style: {
    base: {
      fontSize: "16px",
      color: "#424770",
      "::placeholder": { color: "#aab7c4" },
    },
    invalid: { color: "#9e2146" },
  },
});
card.mount("#card-element");

// ========== Seletores ==========
const form = document.getElementById("payment-form");
const mensagem = document.getElementById("mensagem");
const submitButton = document.getElementById("submit");
const productList = document.getElementById("product-list");
const subtotalEl = document.getElementById("subtotal");
const totalEl = document.getElementById("total");

// ========== Atualiza Resumo do Pedido ==========
async function atualizarCarrinho() {
  const token = Cookies.get("token");
  if (!token) return;

  try {
    const res = await fetch("http://localhost:3000/cart", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Erro ao obter carrinho");

    const cartItems = await res.json();
    productList.innerHTML = "";
    let total = 0;

   cartItems.forEach((item) => {
  const preco = parseFloat(item.book.price);
  const qtd = item.quantity;
  const subtotal = preco * qtd;
  total += subtotal;

  const produto = document.createElement("div");
  produto.className =
    "flex items-center space-x-4 p-4 bg-container rounded-lg";
  produto.innerHTML = `
      <div class="w-16 h-16 bg-first/10 rounded-lg flex items-center justify-center">
        <img src="${item.book.bookphoto}" alt="${item.book.title}" class="w-full h-full object-contain rounded" />
      </div>
      <div class="flex-1">
        <h4 class="font-medium text-title">${item.book.title}</h4>
        <p class="text-sm text-text line-clamp-2">${item.book.description}</p>
        <div class="flex items-center justify-between mt-2">
          <span class="text-sm text-text">Qtd: ${qtd}</span>
          <span class="font-semibold text-title">€${subtotal.toFixed(2)}</span>
        </div>
      </div>
    `;
  productList.appendChild(produto);
});


    subtotalEl.textContent = `€${total.toFixed(2)}`;
    totalEl.textContent = `€${total.toFixed(2)}`;
    submitButton.textContent = `Pagar €${total.toFixed(2)}`;
  } catch (error) {
    console.error(error);
  }
}

// ========== Criação do Payment Intent ==========
async function criarIntentDePagamento() {
  try {
    const token = Cookies.get("token");
    if (!token) throw new Error("Usuário não autenticado");

    const resCart = await fetch("http://localhost:3000/cart", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const cartItems = await resCart.json();
    if (cartItems.length === 0) throw new Error("Carrinho está vazio");

    let total = 0;
    cartItems.forEach(
      (item) => (total += parseFloat(item.book.price) * item.quantity)
    );

    const response = await fetch("http://localhost:3000/createIntent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        total: Math.round(total * 100),
        nome: document.getElementById("name").value,
        email: document.getElementById("email").value,
      }),
    });

    const data = await response.json();

    if (!response.ok)
      throw new Error(data.error || "Erro ao criar Payment Intent");

    console.log("Client Secret:", data.clientSecret);

    return { paymentIntentSecret: data.clientSecret, error: null };
  } catch (error) {
    return { paymentIntentSecret: null, error: error.message };
  }
}

// No submit handler
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  submitButton.disabled = true;

  const { paymentIntentSecret, error } = await criarIntentDePagamento();

  if (error) {
    alert(error);
    submitButton.disabled = false;
    return;
  }

  if (!paymentIntentSecret) {
    alert("Erro: clientSecret não foi retornado");
    submitButton.disabled = false;
    return;
  }

  const result = await stripe.confirmCardPayment(paymentIntentSecret, {
    payment_method: {
      card,
      billing_details: {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
      },
    },
  });

  if (result.error) {
    alert(result.error.message);
    submitButton.disabled = false;
  } else {
    // sucesso
    mensagem.classList.remove("hidden");
    form.reset();
    card.clear();
    submitButton.disabled = false;
  }
});

// ========== Envio do Formulário ==========
form.addEventListener("submit", async (e) => {
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

  try {
    const { paymentIntentSecret, error: intentError } =
      await criarIntentDePagamento();

    if (intentError) throw new Error(intentError);
    if (!paymentIntentSecret)
      throw new Error("Erro: clientSecret não foi retornado");

    const result = await stripe.confirmCardPayment(paymentIntentSecret, {
      payment_method: {
        card,
        billing_details: {
          name: document.getElementById("name").value,
          email: document.getElementById("email").value,
        },
      },
    });

    if (result.error) throw new Error(result.error.message);

    const token = Cookies.get("token");
    if (!token) throw new Error("Usuário não autenticado");

    const resCheckout = await fetch("http://localhost:3000/cart/checkout", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!resCheckout.ok) {
      const errorData = await resCheckout.json();
      throw new Error(errorData.message || "Erro ao finalizar compra");
    }

    const checkoutData = await resCheckout.json();

    localStorage.removeItem("cart");

    mensagem.textContent =
      checkoutData.message || "Compra finalizada com sucesso!";
    mensagem.classList.remove("hidden");

    form.reset();
    card.clear();

    await atualizarCarrinho();

    setTimeout(() => {
      window.location.href = "/Client/paginaInicial/index.html";
    }, 3000);
  } catch (error) {
    alert(error.message);
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = `Pagar`;
  }
});

/* ========== Controle do Tema Dark/Light ========== */
const themeButton = document.getElementById("theme-button");
const themeIcon = document.getElementById("theme-icon");
const darkThemeClass = "dark-theme";

const iconMoon = "ri-moon-line";
const iconSun = "ri-sun-line";

const savedTheme = localStorage.getItem("selected-theme");
if (savedTheme === "dark") {
  document.body.classList.add(darkThemeClass);
  themeIcon.classList.remove(iconMoon);
  themeIcon.classList.add(iconSun);
}

themeButton.addEventListener("click", () => {
  document.body.classList.toggle(darkThemeClass);
  const isDark = document.body.classList.contains(darkThemeClass);

  themeIcon.classList.toggle(iconMoon, !isDark);
  themeIcon.classList.toggle(iconSun, isDark);

  localStorage.setItem("selected-theme", isDark ? "dark" : "light");
});

/* ========== Botão Pesquisa - Abrir/Fechar ========== */
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

/*   parte carrinho e favoritos */

// =================== CART MODAL COM AUTENTICAÇÃO ===================

class CartModal {
  constructor() {
    this.cart = [];
    this.cartModal = document.getElementById("cart-modal");
    this.cartItemsContainer = document.getElementById("cart-items");
    this.cartTotalElement = document.getElementById("cart-total");

    this.initEventListeners();
    this.loadCartFromServer();
  }

  initEventListeners() {
    // Abrir carrinho
    document.getElementById("carrinho").addEventListener("click", () => {
      this.toggleCart();
    });

    // Fechar carrinho
    document
      .querySelector(".cart-modal-close")
      .addEventListener("click", () => {
        this.toggleCart();
      });

    // Finalizar compra
    document
      .querySelector(".cart-finalize-button")
      .addEventListener("click", () => {
        this.checkout();
      });
  }

  toggleCart() {
    this.cartModal.classList.toggle("show");
    this.loadCartFromServer(); // Recarregar sempre que abrir
  }

  async addToCart(bookCard) {
    const token = Cookies.get("token");
    if (!token) {
      alert("Você precisa estar logado para adicionar ao carrinho.");
      window.location.href = "/Client/PaginaLogin/paginaLogin.html";
      return;
    }

    const bookId = bookCard.dataset.bookId;
    if (!bookId) {
      alert("Erro: ID do livro não encontrado.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bookId, quantity: 1 }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          alert("Sessão expirada. Faça login novamente.");
          Cookies.remove("token");
          window.location.href = "/Client/PaginaLogin/paginaLogin.html";
          return;
        }
        throw new Error(data.message || "Erro ao adicionar ao carrinho");
      }

      // Feedback visual
      const button = bookCard.querySelector(".button");
      const originalText = button.textContent;
      button.textContent = "Adicionado!";
      button.style.backgroundColor = "#4CAF50";

      setTimeout(() => {
        button.textContent = originalText;
        button.style.backgroundColor = "";
      }, 2000);

      // Recarregar carrinho
      this.loadCartFromServer();
    } catch (error) {
      console.error("Erro ao adicionar ao carrinho:", error);
      alert("Erro ao adicionar ao carrinho: " + error.message);
    }
  }

  async loadCartFromServer() {
    const token = Cookies.get("token");
    if (!token) {
      this.cart = [];
      this.renderCartItems();
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          Cookies.remove("token");
          this.cart = [];
          this.renderCartItems();
          return;
        }
        throw new Error("Erro ao carregar carrinho");
      }

      const cartItems = await response.json();

      // Transformar dados do servidor para o formato esperado pelo frontend
      this.cart = cartItems.map((item) => ({
        id: item.id,
        bookId: item.bookId,
        title: item.book.title,
        price: parseFloat(item.book.price),
        image: item.book.bookphoto || "../imagens/imagem-padrao.jpg",
        quantity: item.quantity,
      }));

      this.renderCartItems();
    } catch (error) {
      console.error("Erro ao carregar carrinho:", error);
      this.cart = [];
      this.renderCartItems();
    }
  }

  renderCartItems() {
    this.cartItemsContainer.innerHTML = "";
    let total = 0;

    if (this.cart.length === 0) {
      this.cartItemsContainer.innerHTML = `
        <div class="cart-empty-message">
          <p>Seu carrinho está vazio</p>
          <p>Adicione alguns livros para começar!</p>
        </div>
      `;
      this.cartTotalElement.textContent = "€ 0,00";
      return;
    }

    this.cart.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;

      const cartItemElement = document.createElement("div");
      cartItemElement.classList.add("cart-item");
      cartItemElement.innerHTML = `
        <img src="${item.image}" alt="${item.title}" class="cart-item-image">
        <div class="cart-item-details">
          <h3>${item.title}</h3>
          <div class="cart-item-quantity">
            <button onclick="cartModal.updateQuantity('${item.bookId}', ${
        item.quantity - 1
      })">-</button>
            <input type="text" value="${item.quantity}" readonly>
            <button onclick="cartModal.updateQuantity('${item.bookId}', ${
        item.quantity + 1
      })">+</button>
          </div>
          <span class="cart-item-price">€ ${item.price.toFixed(2)}</span>
          <span class="cart-item-total">Total: € ${itemTotal.toFixed(2)}</span>
        </div>
        <button class="cart-item-remove" onclick="cartModal.removeItem('${
          item.bookId
        }')">×</button>
      `;

      this.cartItemsContainer.appendChild(cartItemElement);
    });

    this.cartTotalElement.textContent = `€ ${total.toFixed(2)}`;
  }

  async updateQuantity(bookId, newQuantity) {
    if (newQuantity < 1) {
      this.removeItem(bookId);
      return;
    }

    const token = Cookies.get("token");
    if (!token) {
      alert("Você precisa estar logado.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bookId, quantity: newQuantity }),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar quantidade");
      }

      this.loadCartFromServer();
    } catch (error) {
      console.error("Erro ao atualizar quantidade:", error);
      alert("Erro ao atualizar quantidade");
    }
  }

  async removeItem(bookId) {
    const token = Cookies.get("token");
    if (!token) {
      alert("Você precisa estar logado.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/cart/${bookId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao remover item");
      }

      this.loadCartFromServer();
    } catch (error) {
      console.error("Erro ao remover item:", error);
      alert("Erro ao remover item do carrinho");
    }
  }

  async checkout() {
    const token = Cookies.get("token");
    if (!token) {
      alert("Você precisa estar logado para finalizar a compra.");
      return;
    }

    if (this.cart.length === 0) {
      alert("Seu carrinho está vazio.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/cart/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao finalizar compra");
      }

      alert("Compra finalizada com sucesso!");
      this.loadCartFromServer();
      this.toggleCart();
    } catch (error) {
      console.error("Erro ao finalizar compra:", error);
      alert("Erro ao finalizar compra: " + error.message);
    }
  }
}

// =================== FAVORITES MODAL COM AUTENTICAÇÃO ===================
class FavoritesModal {
  constructor() {
    this.favorites = [];
    this.favoritesModal = document.getElementById("favorites-modal");
    this.favoritesItemsContainer = document.getElementById("favorites-items");

    this.initEventListeners();
    this.loadFavoritesFromServer();
  }

  initEventListeners() {
    // Abrir favoritos
    const favoritosButton = document.getElementById("favoritos");
    if (favoritosButton) {
      favoritosButton.addEventListener("click", () => this.toggleFavorites());
    }

    // Fechar favoritos
    const closeButton = document.querySelector(".favorites-modal-close");
    if (closeButton) {
      closeButton.addEventListener("click", () => this.toggleFavorites());
    }
  }

  toggleFavorites() {
    this.favoritesModal.classList.toggle("show");
    this.loadFavoritesFromServer();
  }

  async addToFavorites(bookCard) {
    const token = Cookies.get("token");
    if (!token) {
      alert("Você precisa estar logado para favoritar um livro.");
      window.location.href = "/Client/PaginaLogin/paginaLogin.html";
      return;
    }

    const bookId = bookCard.dataset.bookId;
    if (!bookId) {
      alert("Erro: ID do livro não encontrado.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bookId }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          alert("Sessão expirada. Faça login novamente.");
          Cookies.remove("token");
          window.location.href = "/Client/PaginaLogin/paginaLogin.html";
          return;
        }
        throw new Error(data.message || "Erro ao favoritar livro");
      }

      // Feedback visual
      const heartIcon = bookCard.querySelector(
        ".featured__actions button:nth-child(2) i"
      );
      if (heartIcon) {
        heartIcon.classList.remove("ri-heart-line");
        heartIcon.classList.add("ri-heart-fill");
        heartIcon.style.color = "#ff6b6b";
      }

      // Recarregar favoritos
      this.loadFavoritesFromServer();
    } catch (error) {
      console.error("Erro ao favoritar livro:", error);
      alert("Erro ao favoritar livro: " + error.message);
    }
  }

  async loadFavoritesFromServer() {
    const token = Cookies.get("token");
    if (!token) {
      this.favorites = [];
      this.renderFavoriteItems();
      this.updateFavoriteIcons();
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/favorites", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          Cookies.remove("token");
          this.favorites = [];
          this.renderFavoriteItems();
          this.updateFavoriteIcons();
          return;
        }
        throw new Error("Erro ao carregar favoritos");
      }

      const favoriteItems = await response.json();

      // Transformar dados do servidor para o formato esperado pelo frontend
      this.favorites = favoriteItems.map((item) => ({
        id: item.id,
        bookId: item.bookId,
        title: item.book.title,
        price: parseFloat(item.book.price),
        image: item.book.bookphoto || "../imagens/imagem-padrao.jpg",
      }));

      this.renderFavoriteItems();
      this.updateFavoriteIcons();
    } catch (error) {
      console.error("Erro ao carregar favoritos:", error);
      this.favorites = [];
      this.renderFavoriteItems();
      this.updateFavoriteIcons();
    }
  }

  renderFavoriteItems() {
    this.favoritesItemsContainer.innerHTML = "";

    if (this.favorites.length === 0) {
      this.favoritesItemsContainer.innerHTML = `
        <div class="favorites-empty-message">
          <p>Você não tem livros favoritos ainda</p>
          <p>Adicione alguns livros aos seus favoritos!</p>
        </div>
      `;
      return;
    }

    this.favorites.forEach((item) => {
      const favoriteItemElement = document.createElement("div");
      favoriteItemElement.classList.add("favorites-item");
      favoriteItemElement.innerHTML = `
        <img src="${item.image}" alt="${
        item.title
      }" class="favorites-item-image">
        <div class="favorites-item-details">
          <h3>${item.title}</h3>
          <p class="favorites-item-price">€ ${item.price.toFixed(2)}</p>
        </div>
        <div class="favorites-item-actions">
          <button class="favorites-item-cart" onclick="favoritesModal.addToCartFromFavorites('${
            item.bookId
          }')">
            <i class="ri-shopping-cart-line"></i>
          </button>
          <button class="favorites-item-remove" onclick="favoritesModal.removeFromFavorites('${
            item.bookId
          }')">
            <i class="ri-close-line"></i>
          </button>
        </div>
      `;

      this.favoritesItemsContainer.appendChild(favoriteItemElement);
    });
  }

  updateFavoriteIcons() {
    // Resetar todos os ícones
    document
      .querySelectorAll(".featured__actions button:nth-child(2) i")
      .forEach((icon) => {
        icon.classList.remove("ri-heart-fill");
        icon.classList.add("ri-heart-line");
        icon.style.color = "";
      });

    // Marcar os favoritos
    this.favorites.forEach((favorite) => {
      const bookCard = document.querySelector(
        `[data-book-id="${favorite.bookId}"]`
      );
      if (bookCard) {
        const heartIcon = bookCard.querySelector(
          ".featured__actions button:nth-child(2) i"
        );
        if (heartIcon) {
          heartIcon.classList.remove("ri-heart-line");
          heartIcon.classList.add("ri-heart-fill");
          heartIcon.style.color = "#ff6b6b";
        }
      }
    });
  }

  async addToCartFromFavorites(bookId) {
    const bookCard = document.querySelector(`[data-book-id="${bookId}"]`);
    if (bookCard && typeof cartModal !== "undefined") {
      await cartModal.addToCart(bookCard);
    }
  }

  async removeFromFavorites(bookId) {
    const token = Cookies.get("token");
    if (!token) {
      alert("Você precisa estar logado.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/favorites/${bookId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao remover dos favoritos");
      }

      this.loadFavoritesFromServer();
    } catch (error) {
      console.error("Erro ao remover dos favoritos:", error);
      alert("Erro ao remover dos favoritos");
    }
  }
}

// =================== INICIALIZAÇÃO ===================
const cartModal = new CartModal();
const favoritesModal = new FavoritesModal();

// =================== BIND EVENTOS DOS BOTÕES NOS CARDS ===================
function bindFeaturedCardButtons() {
  // Botões de adicionar ao carrinho
  document.querySelectorAll(".featured__card .button").forEach((button) => {
    button.addEventListener("click", (e) => {
      const card = e.target.closest(".featured__card");
      if (card) {
        cartModal.addToCart(card);
      }
    });
  });

  // Botões de favoritar
  document
    .querySelectorAll(".featured__actions button:nth-child(2)")
    .forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        const card = e.target.closest(".featured__card");
        if (card) {
          const heartIcon = button.querySelector("i");
          if (heartIcon && heartIcon.classList.contains("ri-heart-fill")) {
            // Se já está favoritado, remover
            favoritesModal.removeFromFavorites(card.dataset.bookId);
          } else {
            // Se não está favoritado, adicionar
            favoritesModal.addToFavorites(card);
          }
        }
      });
    });
}

// =================== MONITORAR ESTADO DE LOGIN ===================
function checkLoginStatus() {
  const token = Cookies.get("token");
  const userLink = document.getElementById("user-link");

  if (token) {
    // Usuário logado - carregar dados do servidor
    cartModal.loadCartFromServer();
    favoritesModal.loadFavoritesFromServer();
  } else {
    // Usuário não logado - limpar dados
    cartModal.cart = [];
    favoritesModal.favorites = [];
    cartModal.renderCartItems();
    favoritesModal.renderFavoriteItems();
    favoritesModal.updateFavoriteIcons();
  }
}

// =================== EVENTO GLOBAL PARA VERIFICAR LOGIN ===================
document.addEventListener("DOMContentLoaded", () => {
  checkLoginStatus();

  // Verificar status de login periodicamente
  setInterval(checkLoginStatus, 30000); // A cada 30 segundos
});

document.addEventListener("DOMContentLoaded", atualizarCarrinho);
