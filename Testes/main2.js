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

/*=============== LOGIN ===============*/
const userLink = document.getElementById("user-link");

if (userLink) {
  userLink.addEventListener("click", (e) => {
    e.preventDefault();
    const token = Cookies.get("token");
    if (token) {
      window.location.href =
        "/Client/userDashboard/userDashboardInfo/userDashboard.html";
    } else {
      window.location.href = "/Client/PaginaLogin/paginaLogin.html";
    }
  });
}

/*=============== ADD SHADOW HEADER ===============*/
const shadowHeader = () => {
  const header = document.getElementById("header");
  if (header) {
    window.scrollY >= 50
      ? header.classList.add("shadow-header")
      : header.classList.remove("shadow-header");
  }
};
window.addEventListener("scroll", shadowHeader);

/*=============== HOME SWIPER ===============*/
let swiperHome = null;
const homeSwiper = document.querySelector(".home__swiper");
if (homeSwiper) {
  swiperHome = new Swiper(".home__swiper", {
    loop: true,
    spaceBetween: -24,
    grabCursor: true,
    slidesPerView: "auto",
    centeredSlides: "auto",
    autoplay: { delay: 3000, disableOnInteraction: false },
    breakpoints: { 1220: { spaceBetween: -32 } },
  });
}

/*=============== FEATURED SWIPER ===============*/
let swiperFeatured = null;

/*=============== NEW SWIPER ===============*/
let swiperNew = null;

/*=============== FETCH LIVROS DO BACKEND ===============*/
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

/*=============== FUNÇÃO SIMPLES PARA CRIAR CARD DE LIVRO ===============*/
function createBookCard(book) {
  const bookPrice = book.price ? parseFloat(book.price) : 0;
  const bookTitle = book.title || "Título não disponível";
  const bookImage =
    book.bookphoto || book.image || "../imagens/imagem-padrao.jpg";

  return `
    <article class="featured__card swiper-slide" data-book-id="${book.id}">
      <img src="${bookImage}" alt="${bookTitle}" class="featured__img" />
      <h3 class="featured__title">${bookTitle}</h3>
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
    bindFeaturedCardButtons();
  } catch (error) {
    console.error("Erro ao carregar livros em destaques:", error);
    const container = document.getElementById("featured-swiper-wrapper");
    if (container) {
      container.innerHTML =
        "<p>Erro ao carregar livros. Tente novamente mais tarde.</p>";
    }
  }
}

/*=============== CARREGAR LIVROS - POPULARES ===============*/
async function loadPopularBooks() {
  try {
    const books = await fetchBooks();
    const container = document.getElementById("popular-swiper-wrapper");
    if (!container) {
      console.error("Container 'popular-swiper-wrapper' não encontrado");
      return;
    }
    container.innerHTML = books.map(createBookCard).join("");
  } catch (error) {
    console.error("Erro ao carregar livros populares:", error);
  }
}

/*=============== CARREGAR LIVROS - NOVOS LIVROS ===============*/
async function loadNewBooks() {
  try {
    const books = await fetchBooks();
    const container = document.getElementById("new-swiper-wrapper");
    if (!container) {
      console.error("Container 'new-swiper-wrapper' não encontrado");
      return;
    }
    container.innerHTML = books.map(createBookCard).join("");
  } catch (error) {
    console.error("Erro ao carregar novos livros:", error);
  }
}

/*=============== CARREGAR LIVROS - HOME  ===============*/

async function loadHomeBooks() {
  try {
    const books = await fetchBooks();
    const container = document.querySelector(".home__swiper .swiper-wrapper");
    if (!container) {
      console.error("Container da Home não encontrado");
      return;
    }
    container.innerHTML = "";

    if (books.length >= 3) {
      // Garantir que sempre há pelo menos 3 livros
      const [firstBook, secondBook, thirdBook] = books;

      const firstBookHTML = `
          <article class="home__article swiper-slide">
            <img src="${
              firstBook.bookphoto ||
              firstBook.image ||
              "../imagens/imagem-padrao.jpg"
            }" alt="${
        firstBook.title || "Livro sem título"
      }" class="home__img" />
          </article>
        `;

      const secondBookHTML = `
          <article class="home__article swiper-slide home__article--center">
            <img src="${
              secondBook.bookphoto ||
              secondBook.image ||
              "../imagens/imagem-padrao.jpg"
            }" alt="${
        secondBook.title || "Livro sem título"
      }" class="home__img" />
          </article>
        `;

      const thirdBookHTML = `
          <article class="home__article swiper-slide">
            <img src="${
              thirdBook.bookphoto ||
              thirdBook.image ||
              "../imagens/imagem-padrao.jpg"
            }" alt="${
        thirdBook.title || "Livro sem título"
      }" class="home__img" />
          </article>
        `;

      container.insertAdjacentHTML("beforeend", firstBookHTML);
      container.insertAdjacentHTML("beforeend", secondBookHTML);
      container.insertAdjacentHTML("beforeend", thirdBookHTML);
    } else {
      // Se não houver pelo menos 3 livros, preencher com livros padrão
      const defaultBooks = [
        { title: "Livro 1", image: "../imagens/imagem-padrao.jpg" },
        { title: "Livro 2", image: "../imagens/imagem-padrao.jpg" },
        { title: "Livro 3", image: "../imagens/imagem-padrao.jpg" },
      ];

      defaultBooks.forEach((book, index) => {
        const bookHTML = `
            <article class="home__article swiper-slide ${
              index === 1 ? "home__article--center" : ""
            }">
              <img src="${book.image}" alt="${book.title}" class="home__img" />
            </article>
          `;
        container.insertAdjacentHTML("beforeend", bookHTML);
      });
    }

    initializeHomeSwiper();
  } catch (error) {
    console.error("Erro ao carregar livros na Home:", error);
  }
}

function initializeHomeSwiper() {
  if (swiperHome) {
    swiperHome.destroy(true, true);
  }

  const slides = document.querySelectorAll(".home__article");
  if (slides.length > 0) {
    swiperHome = new Swiper(".home__swiper", {
      loop: slides.length > 1,
      grabCursor: true,
      spaceBetween: 16,
      slidesPerView: "auto",
      centeredSlides: true,
      breakpoints: {
        768: {
          slidesPerView: Math.min(3, slides.length),
          centeredSlides: false,
        },
      },
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM carregado, iniciando carregamento dos livros...");

  setTimeout(() => {
    Promise.all([
      loadFeaturedBooks(),
      loadPopularBooks(),
      loadNewBooks(),
      loadHomeBooks(),
    ])
      .then(() => {
        console.log("Todos os livros foram carregados com sucesso!");
      })
      .catch((error) => {
        console.error("Erro ao carregar alguns livros:", error);
      });
  }, 100);
});

/*=============== INICIALIZAR SWIPER DESTAQUES ===============*/
function initializeFeaturedSwiper() {
  if (swiperFeatured && typeof swiperFeatured.destroy === "function") {
    swiperFeatured.destroy(true, true);
  }

  const container = document.querySelector(".featured__swiper");
  const slides = document.querySelectorAll(".featured__card");
  if (container && slides.length > 0) {
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

/*=============== INICIALIZAR SWIPER HOME ===============*/

function initializeHomeSwiper() {
  if (swiperHome) {
    swiperHome.destroy(true, true);
  }

  const slides = document.querySelectorAll(".home__article");
  if (slides.length > 0)
    swiperHome = new Swiper(".home__swiper", {
      loop: slides.length > 1,
      grabCursor: true,
      spaceBetween: 16,
      slidesPerView: "auto",
      centeredSlides: true,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      breakpoints: {
        768: {
          slidesPerView: Math.min(3, slides.length),
          centeredSlides: true,
        },
      },
    });
}

/*=============== INICIALIZAR SWIPER NOVOS LIVROS ===============*/
function initializeNewSwiper() {
  if (swiperNew) {
    swiperNew.destroy(true, true);
  }
  const container = document.querySelector(".new__swiper");
  const slides = document.querySelectorAll(".new__card");
  if (container && slides.length > 0) {
    swiperNew = new Swiper(".new__swiper", {
      loop: slides.length > 1,
      spaceBetween: 16,
      slidesPerView: "auto",
      breakpoints: {
        1150: {
          slidesPerView: Math.min(3, slides.length),
        },
      },
    });
  }
}

/*=============== BIND EVENTOS DOS BOTÕES ===============*/
function bindFeaturedCardButtons() {
  document.querySelectorAll(".featured__card .button").forEach((button) => {
    button.addEventListener("click", (e) => {
      const card = e.target.closest(".featured__card");
      if (card && typeof cartModal !== "undefined") {
        cartModal.addToCart(card);
      }
    });
  });

  document
    .querySelectorAll(".featured__card .featured__actions button:nth-child(2)")
    .forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        const card = e.target.closest(".featured__card");
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
    Promise.all([
      loadFeaturedBooks(),
      loadPopularBooks(),
      loadNewBooks(),
      loadHomeBooks(),
    ])
      .then(() => {
        console.log("Todos os livros foram carregados com sucesso!");
      })
      .catch((error) => {
        console.error("Erro ao carregar alguns livros:", error);
      });
  }, 100);
});

/*=============== SCROLL REVEAL ANIMATION ===============*/
if (typeof ScrollReveal !== "undefined") {
  const sr = ScrollReveal({
    origin: "top",
    distance: "60px",
    duration: 2500,
    delay: 400,
  });

  sr.reveal(".home__data, .featured__container, .new__container, .footer");
  sr.reveal(".home__images", { delay: 600 });
  sr.reveal(".services__card", { interval: 100 });
  sr.reveal(".discount__data", { origin: "left" });
  sr.reveal(".discount__images", { origin: "right" });
}

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

/*   parte carrinho e favoritos */

class CartModal {
  constructor() {
    this.cart = [];
    this.cartModal = document.getElementById("cart-modal");
    this.cartItemsContainer = document.getElementById("cart-items");
    this.cartTotalElement = document.getElementById("cart-total");

    this.initEventListeners();
    this.loadCartFromLocalStorage();
  }

  initEventListeners() {
    // Open cart
    document
      .getElementById("carrinho")
      .addEventListener("click", () => this.toggleCart());

    // Close cart
    document
      .querySelector(".cart-modal-close")
      .addEventListener("click", () => this.toggleCart());

    // Add to cart buttons on book cards
    document.querySelectorAll(".featured__card .button").forEach((button) => {
      button.addEventListener("click", (e) =>
        this.addToCart(e.target.closest(".featured__card"))
      );
    });
  }

  toggleCart() {
    this.cartModal.classList.toggle("show");
    this.renderCartItems();
  }

  addToCart(bookCard) {
    // Log para debugar o caminho da imagem
    const imagePath = bookCard.querySelector(".featured__img").src;
    console.log("Caminho da imagem:", imagePath);

    const book = {
      id: Date.now(), // Gerar um ID único
      title: bookCard.querySelector(".featured__title").textContent,
      price: parseFloat(
        bookCard
          .querySelector(".featured__discount")
          .textContent.replace("$", "")
      ),
      image: imagePath, // Usar o caminho completo da imagem
      quantity: 1,
    };

    const existingItem = this.cart.find((item) => item.title === book.title);

    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.cart.push(book);
    }

    this.saveCartToLocalStorage();
    this.renderCartItems();
  }

  renderCartItems() {
    this.cartItemsContainer.innerHTML = "";
    let total = 0;

    this.cart.forEach((item, index) => {
      // Log adicional para verificar detalhes do item
      console.log("Detalhes do item:", item);

      // Verificação de segurança para imagem
      if (!item.image) {
        console.warn(`Imagem não encontrada para o livro: ${item.title}`);
        item.image = "caminho/para/imagem/padrao.jpg"; // Imagem de fallback
      }

      const itemTotal = item.price * item.quantity;
      total += itemTotal;

      const cartItemElement = document.createElement("div");
      cartItemElement.classList.add("cart-item");
      cartItemElement.innerHTML = `
                <img src="${item.image}" alt="${
        item.title
      }" class="cart-item-image" style="width: 80px; height: 120px; object-fit: cover;">
                <div class="cart-item-details">
                    <h3>${item.title}</h3>
                    <div class="cart-item-quantity">
                        <button onclick="cartModal.decreaseQuantity(${index})">-</button>
                        <input type="text" value="${item.quantity}" readonly>
                        <button onclick="cartModal.increaseQuantity(${index})">+</button>
                    </div>
                    <span class="cart-item-price">€ ${item.price.toFixed(
                      2
                    )}</span>
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
    localStorage.setItem("universoLivrosCart", JSON.stringify(this.cart));
  }

  loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem("universoLivrosCart");
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
    this.favoritesModal = document.getElementById("favorites-modal");
    this.favoritesItemsContainer = document.getElementById("favorites-items");

    this.initEventListeners();
    this.loadFavoritesFromLocalStorage();
  }

  initEventListeners() {
    // Open favorites
    const favoritosButton = document.getElementById("favoritos");
    if (favoritosButton) {
      favoritosButton.addEventListener("click", () => this.toggleFavorites());
    } else {
      console.error("Favorites button not found");
    }

    // Close favorites
    const closeButton = document.querySelector(".favorites-modal-close");
    if (closeButton) {
      closeButton.addEventListener("click", () => this.toggleFavorites());
    } else {
      console.error("Favorites close button not found");
    }

    // Add event listeners to favorite buttons
    this.addFavoriteButtonListeners();
  }

  addFavoriteButtonListeners() {
    const favoriteButtons = document.querySelectorAll(
      ".featured__actions button:nth-child(2)"
    );

    if (favoriteButtons.length === 0) {
      console.warn("No favorite buttons found");
    }

    favoriteButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        const bookCard = e.target.closest(".featured__card");

        if (bookCard) {
          this.addToFavorites(bookCard);
        } else {
          console.error("No book card found for favorite button");
        }
      });
    });
  }

  addToFavorites(bookCard) {
    const imgEl = bookCard.querySelector(".featured__img");
    const titleEl = bookCard.querySelector(".featured__title");
    const priceEl = bookCard.querySelector(".featured__discount");

    if (!imgEl || !titleEl || !priceEl) {
      console.error("Missing elements in book card", {
        img: !!imgEl,
        title: !!titleEl,
        price: !!priceEl,
      });
      return;
    }

    const book = {
      id: imgEl.src,
      title: titleEl.textContent.trim(),
      price: priceEl.textContent,
      bookCard: bookCard, // Store reference to the original book card
    };

    const existingItem = this.favorites.find((item) => item.id === book.id);

    if (!existingItem) {
      this.favorites.push(book);
      this.saveFavoritesToLocalStorage();
      this.renderFavoriteItems();

      // Visual feedback for favorite button
      const heartIcon = bookCard.querySelector(
        ".featured__actions button:nth-child(2) i"
      );
      if (heartIcon) {
        heartIcon.classList.add("ri-heart-fill");
        heartIcon.classList.remove("ri-heart-line");
      }
    }
  }

  toggleFavorites() {
    this.favoritesModal.classList.toggle("show");
    this.renderFavoriteItems();
  }

  renderFavoriteItems() {
    this.favoritesItemsContainer.innerHTML = "";

    if (this.favorites.length === 0) {
      const emptyMessage = document.createElement("div");
      emptyMessage.classList.add("favorites-empty-message");
      emptyMessage.textContent = "Nenhum livro nos favoritos";
      this.favoritesItemsContainer.appendChild(emptyMessage);
      return;
    }

    this.favorites.forEach((item, index) => {
      const favoriteItemElement = document.createElement("div");
      favoriteItemElement.classList.add("favorites-item");
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
    const cartButton = item.bookCard.querySelector(".button");
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
    const bookCards = document.querySelectorAll(".featured__card");
    bookCards.forEach((card) => {
      const img = card.querySelector(".featured__img");
      if (img && img.src === removedItem.id) {
        const heartIcon = card.querySelector(
          ".featured__actions button:nth-child(2) i"
        );
        if (heartIcon) {
          heartIcon.classList.remove("ri-heart-fill");
          heartIcon.classList.add("ri-heart-line");
        }
      }
    });
  }

  saveFavoritesToLocalStorage() {
    localStorage.setItem(
      "universoLivrosFavorites",
      JSON.stringify(this.favorites)
    );
  }

  loadFavoritesFromLocalStorage() {
    const savedFavorites = localStorage.getItem("universoLivrosFavorites");
    if (savedFavorites) {
      this.favorites = JSON.parse(savedFavorites);
      this.renderFavoriteItems();
    }
  }
}

// Initialize the favorites modal
const favoritesModal = new FavoritesModal();
