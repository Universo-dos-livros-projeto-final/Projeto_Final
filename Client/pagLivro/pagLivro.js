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

/*=============== VARIÁVEIS GLOBAIS ===============*/
let swiperFeatured = null;

/*=============== PAGINA PRINCIPAL ===============*/

// Variáveis de quantidade

const quantityInput = document.querySelector("#qty-input");
const quantityDecrease = document.querySelector("#quantityDecrease");
const quantityIncrease = document.querySelector("#quantityIncrease");

// Pega o bookId da URL
const urlParams = new URLSearchParams(window.location.search);
const bookId = urlParams.get("id");

// Função para buscar dados do backend e atualizar a página
async function loadBookDetails() {
  if (!bookId) {
    alert("Livro não especificado.");
    return;
  }

  try {
    // Carregar detalhes do livro
    const response = await fetch(`http://localhost:3000/books/${bookId}`);
    if (!response.ok) throw new Error("Livro não encontrado");

    const { book } = await response.json();

    // Atualizar os detalhes do livro na página
    document
      .querySelector(".product-container")
      .setAttribute("data-book-id", book.id);
    document.getElementById("book-title").textContent = book.title;
    document.getElementById("book-author-main").textContent = book.author;
    document.getElementById("book-author-info").textContent = book.author;
    document.getElementById("book-price").textContent = `€${book.price}`;
    document.getElementById("book-image").src =
      book.bookphoto || "imagens/imagem-padrao.jpg";
    document.getElementById("book-image").alt = `Capa do livro ${book.title}`;
    document.getElementById("book-description").innerHTML = `<p>${
      book.description || ""
    }</p>`;
    document.getElementById("book-isbn").textContent = book.isbn || "-";
    document.getElementById("book-year").textContent =
      book.publicationYear || "-";
    document.getElementById("book-genres").textContent = book.genre || "-";

    // Verificar se o livro está no carrinho e atualizar a quantidade
    const token = Cookies.get("token");
    if (token) {
      const cartResponse = await fetch("http://localhost:3000/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (cartResponse.ok) {
        const cartItems = await cartResponse.json();
        const cartItem = cartItems.find((item) => item.bookId === bookId);

        if (cartItem && cartItem.quantity) {
          // Atualizar o input de quantidade se o livro estiver no carrinho
          const quantityInput = document.querySelector("#qty-input");
          if (quantityInput) {
            quantityInput.value = cartItem.quantity;
          }
        }
      }
    }
  } catch (error) {
    alert("Erro ao carregar dados do livro.");
    console.error(error);
  }
}

// Atualizar também os controladores de quantidade para sincronizar com o backend

if (quantityDecrease && quantityInput) {
  quantityDecrease.addEventListener("click", async () => {
    let value = parseInt(quantityInput.value);
    if (value > 1) {
      const newValue = value - 1;
      quantityInput.value = newValue;

      const token = Cookies.get("token");
      if (token) {
        await cartModal.updateQuantity(bookId, newValue);
      }
    }
  });
}

if (quantityIncrease && quantityInput) {
  quantityIncrease.addEventListener("click", async () => {
    let value = parseInt(quantityInput.value);
    const newValue = value + 1;
    quantityInput.value = newValue;

    const token = Cookies.get("token");
    if (token) {
      await cartModal.updateQuantity(bookId, newValue);
    }
  });
}

/*=============== FETCH LIVROS  ===============*/
async function fetchBooks() {
  try {
    const token = Cookies.get("token");
    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    const response = await fetch("http://localhost:3000/books", {
      headers,
    });
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    const responseText = await response.text();
    let books;
    try {
      books = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Erro ao fazer parse do JSON:", parseError);
      throw new Error("Resposta não é um JSON válido");
    }
    if (Array.isArray(books)) return books;
    if (books && Array.isArray(books.data)) return books.data;
    if (books && Array.isArray(books.books)) return books.books;
    throw new Error("Formato inválido de resposta - esperado array de livros");
  } catch (error) {
    console.error("Erro ao carregar livros do backend:", error);
    throw error;
  }
}

/*=============== FUNÇÃO PARA CRIAR CARD DE LIVRO ===============*/
function createBookCard(book) {
  const bookPrice = book.price ? parseFloat(book.price) : 0;
  const bookTitle = book.title || "Título não disponível";
  const bookImage =
    book.bookphoto || book.image || "../imagens/imagem-padrao.jpg";

  return `
    <article class="featured__card swiper-slide" data-book-id="${book.id}">
      <a href="../pagLivro/pagLivro.html?id=${book.id}" class="featured__link">
        <img src="${bookImage}" alt="${bookTitle}" class="featured__img" />
        <h3 class="featured__title">${bookTitle}</h3>
      </a>
      <div class="featured__prices">
        <span class="featured__discount">${bookPrice
          .toFixed(2)
          .replace(".", ",")}€</span>
      </div>
      <button class="button">Adicionar ao Carrinho</button>
      <div class="featured__actions">
        <button><i class="ri-search-line"></i></button>
        <button><i class="ri-heart-line"></i></button>
      </div>  
    </article>
  `;
}

/*=============== FUNÇÃO PARA REDIRECIONAR PARA PAGINA DO LIVRO ===============*/
function bindBookCardClicks() {
  document.querySelectorAll(".featured__card").forEach((card) => {
    card.addEventListener("click", (e) => {
      // Se clicar em botão ou ícone não redireciona para não conflitar
      if (
        e.target.closest("button") ||
        e.target.closest(".featured__actions button")
      ) {
        return;
      }
      const bookId = card.dataset.bookId;
      if (bookId) {
        window.location.href = `/Client/pagLivro/pagLivro.html?id=${bookId}`;
      }
    });
  });
}

/*=============== CARREGAR LIVROS - DESTAQUES ===============*/
async function loadFeaturedBooks() {
  try {
    const booksArray = await fetchBooks();
    const container = document.getElementById("featured-swiper-wrapper");
    if (!container) {
      console.error("Container 'featured-swiper-wrapper' não encontrado");
      return;
    }
    container.innerHTML = "";
    if (booksArray.length === 0) {
      container.innerHTML = "<p>Nenhum livro encontrado.</p>";
      return;
    }
    booksArray.forEach((book) => {
      const cardHTML = createBookCard(book);
      container.insertAdjacentHTML("beforeend", cardHTML);
    });
    initializeFeaturedSwiper();
    bindCardButtons(".featured__card");
    bindBookCardClicks();
  } catch (error) {
    console.error("Erro ao carregar livros em destaques:", error);
    const container = document.getElementById("featured-swiper-wrapper");
    if (container) {
      container.innerHTML =
        "<p>Erro ao carregar livros. Tente novamente mais tarde.</p>";
    }
  }
}
/*=============== INICIALIZAR SWIPER DESTAQUES ===============*/
function initializeFeaturedSwiper() {
  if (swiperFeatured && typeof swiperFeatured.destroy === "function") {
    swiperFeatured.destroy(true, true);
  }

  const container = document.querySelector(".featured__swiper");
  const slides = document.querySelectorAll(".featured__card");

  if (container && slides.length > 0) {
    if (typeof Swiper === "undefined") {
      console.error(
        "Swiper não está carregado. Verifique se o script está sendo incluído corretamente."
      );
      return;
    }

    swiperFeatured = new Swiper(".featured__swiper", {
      loop: slides.length > 1,
      spaceBetween: 16,
      slidesPerView: "auto",
      centeredSlides: true,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      breakpoints: {
        768: {
          slidesPerView: Math.min(3, slides.length),
          centeredSlides: false,
        },
        1150: {
          slidesPerView: Math.min(3, slides.length),
          centeredSlides: false,
        },
      },
    });
  }
}

/*=============== BIND EVENTOS DOS BOTÕES ===============*/
function bindCardButtons(cardSelector) {
  // Botões de adicionar ao carrinho
  document.querySelectorAll(`${cardSelector} .button`).forEach((button) => {
    button.addEventListener("click", (e) => {
      const card = e.target.closest(cardSelector);
      if (card && typeof cartModal !== "undefined") {
        cartModal.addToCart(card);
      }
    });
  });

  // Botões de favoritar (geralmente o segundo botão dentro de .featured__actions)
  document
    .querySelectorAll(`${cardSelector} .featured__actions button:nth-child(2)`)
    .forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        const card = e.target.closest(cardSelector);
        if (card && typeof favoritesModal !== "undefined") {
          favoritesModal.addToFavorites(card);
        }
      });
    });
}

/*=============== INICIALIZAÇÃO PRINCIPAL ===============*/
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM carregado, iniciando carregamento dos livros...");

  setTimeout(() => {
    Promise.all([loadFeaturedBooks()])
      .then(() => {
        console.log("Todos os livros foram carregados com sucesso!");
      })
      .catch((error) => {
        console.error("Erro ao carregar alguns livros:", error);
      });
  }, 100);
});

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

/* =================== CART MODAL COM AUTENTICAÇÃO =================== */
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

  // Alteração: aceita quantidade opcional
  async addToCart(bookCardOrId, quantity = 1) {
    const token = Cookies.get("token");
    if (!token) {
      alert("Você precisa estar logado para adicionar ao carrinho.");
      window.location.href = "/Client/PaginaLogin/paginaLogin.html";
      return;
    }

    // Permite receber o ID diretamente, para uso na página de detalhes
    let bookId, button;
    if (typeof bookCardOrId === "string") {
      // bookId foi passado diretamente
      bookId = bookCardOrId;
      button = document.querySelector("#addToCartButton");
    } else {
      // bookCard foi passado (card dos destaques)
      bookId = bookCardOrId.dataset.bookId;
      button = bookCardOrId.querySelector(".button");
    }

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
        body: JSON.stringify({ bookId, quantity }),
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
      if (button) {
        const originalText = button.textContent;
        button.textContent = "Adicionado!";
        button.style.backgroundColor = "#4CAF50";

        setTimeout(() => {
          button.textContent = originalText;
          button.style.backgroundColor = "";
        }, 2000);
      }

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
      this.cartTotalElement.textContent = "R$ 0,00";
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
          <span class="cart-item-price">R$ ${item.price.toFixed(2)}</span>
          <span class="cart-item-total">Total: R$ ${itemTotal.toFixed(2)}</span>
        </div>
        <button class="cart-item-remove" onclick="cartModal.removeItem('${
          item.bookId
        }')">×</button>
      `;

      this.cartItemsContainer.appendChild(cartItemElement);
    });

    this.cartTotalElement.textContent = `R$ ${total.toFixed(2)}`;
  }

  async updateQuantity(bookId, newQuantity) {
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

/* =================== FAVORITES MODAL COM AUTENTICAÇÃO =================== */
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
          <p class="favorites-item-price">R$ ${item.price.toFixed(2)}</p>
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

/* =================== BIND EVENTOS DOS BOTÕES NOS CARDS =================== */
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

/* =================== BIND EVENTOS DOS BOTÕES NA PAGINA =================== */

// Botão "Adicionar ao Carrinho"
const addToCartBtn = document.querySelector("#addToCartButton");

if (addToCartBtn) {
  addToCartBtn.addEventListener("click", async (event) => {
    event.preventDefault();

    const token = Cookies.get("token");
    if (!token) {
      alert("Você precisa estar logado para adicionar ao carrinho.");
      window.location.href = "/Client/PaginaLogin/paginaLogin.html";
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get("id");

    try {
      // Usar o método existente do cartModal
      await cartModal.addToCart(bookId, 1);
      // Feedback visual
      const originalText = addToCartBtn.textContent;
      addToCartBtn.textContent = "Adicionado!";
      addToCartBtn.style.backgroundColor = "#4CAF50";

      setTimeout(() => {
        addToCartBtn.textContent = originalText;
        addToCartBtn.style.backgroundColor = "";
      }, 2000);
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao adicionar ao carrinho");
    }
  });
} else {
  console.warn("Botão #addToCartButton não encontrado no DOM");
}

// Botão "Favoritos"
const favoriteButton = document.querySelector("#favoriteButton");

if (favoriteButton) {
  favoriteButton.addEventListener("click", async () => {
    const token = Cookies.get("token");

    if (!token) {
      alert("Você precisa estar logado para favoritar.");
      window.location.href = "/Client/PaginaLogin/paginaLogin.html";
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get("id");

    try {
      const response = await fetch("http://localhost:3000/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bookId }),
      });

      if (response.ok) {
        // Feedback visual
        const heartIcon = favoriteButton.querySelector("i");
        if (heartIcon) {
          heartIcon.classList.remove("ri-heart-line");
          heartIcon.classList.add("ri-heart-fill");
          heartIcon.style.color = "#ff6b6b";
        }
        alert("Livro adicionado aos favoritos!");
        await favoritesModal.loadFavoritesFromServer();
      } else {
        alert("Erro ao favoritar o livro.");
      }
    } catch (error) {
      console.error(error);
      alert("Erro de conexão com o servidor.");
    }
  });
} else {
  console.warn("Botão #favoriteButton não encontrado no DOM");
}

/* =================== CONTROLE DE QUANTIDADE =================== */

/* =================== MONITORAR ESTADO DE LOGIN =================== */
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

/* =================== INICIALIZAÇÃO =================== */
const cartModal = new CartModal();
const favoritesModal = new FavoritesModal();

/* =================== EVENTO GLOBAL PARA VERIFICAR LOGIN =================== */
document.addEventListener("DOMContentLoaded", () => {
  // Carregar detalhes do livro
  loadBookDetails();

  // Carregar livros em destaques
  loadFeaturedBooks();

  // Verificar status de login
  checkLoginStatus();

  // Verificar status de login periodicamente
  setInterval(checkLoginStatus, 30000); // A cada 30 segundos
});
