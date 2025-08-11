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

/*=============== ADD SHADOW HEADER ===============*/
const shadowHeader = () => {
    const header = document.getElementById('header');
    window.scrollY >= 50 ? header.classList.add('shadow-header')
                          : header.classList.remove('shadow-header');
}

window.addEventListener('scroll', shadowHeader)


/*=============== DARK LIGHT THEME ===============*/
const themeButton = document.getElementById("theme-button");
const darkTheme = "dark-theme";
const iconTheme = "ri-sun-line";

if (themeButton) {
  const selectedTheme = localStorage.getItem("selected-theme");
  const selectedIcon = localStorage.getItem("selected-icon");
  const getCurrentTheme = () =>
    document.body.classList.contains(darkTheme) ? "dark" : "light";
  const getCurrentIcon = () =>
    themeButton.classList.contains(iconTheme) ? "ri-moon-line" : "ri-sun-line";

  if (selectedTheme) {
    document.body.classList[selectedTheme === "dark" ? "add" : "remove"](
      darkTheme
    );
    themeButton.classList[selectedIcon === "ri-moon-line" ? "add" : "remove"](
      iconTheme
    );
  }

  themeButton.addEventListener("click", () => {
    document.body.classList.toggle(darkTheme);
    themeButton.classList.toggle(iconTheme);
    localStorage.setItem("selected-theme", getCurrentTheme());
    localStorage.setItem("selected-icon", getCurrentIcon());
  });
}

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

    const bookId = bookCard.dataset.bookId; // CORRETO AQUI
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
      const button = bookCard.querySelector("button.button");
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

    this.cart.forEach((item) => {
      const cartItemElement = document.createElement("div");
      cartItemElement.classList.add("cart-item");

      cartItemElement.innerHTML = `
      <img src="${item.image}" alt="${item.title}" class="cart-item-image">
      <div class="cart-item-details">
        <h3>${item.title}</h3>
        <div class="cart-item-quantity">
          <button onclick="cartModal.changeQuantity('${
            item.bookId
          }', -1)">-</button>
          <input type="text" value="${item.quantity}" readonly>
          <button onclick="cartModal.changeQuantity('${
            item.bookId
          }', 1)">+</button>
        </div>
        <span class="cart-item-price">€ ${item.price.toFixed(2)}</span>
       
      </div>
      <button class="cart-item-remove" onclick="cartModal.removeItem('${
        item.bookId
      }')">×</button>
    `;

      this.cartItemsContainer.appendChild(cartItemElement);
    });

    // Atualiza total após renderizar todos os itens
    this.updateCartTotal();
  }

  updateCartTotal() {
    let total = 0;
    this.cart.forEach((item) => {
      total += item.price * item.quantity;
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
        method: "PUT",
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

  changeQuantity(bookId, delta) {
    const item = this.cart.find((i) => i.bookId === bookId);
    if (!item) return;

    const newQuantity = item.quantity + delta;

    if (newQuantity < 1) {
      this.removeItem(bookId);
    } else {
      this.updateQuantity(bookId, newQuantity);
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

    window.location.href = "/Client/pagPagamento/pagamentoStripe.html";
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

