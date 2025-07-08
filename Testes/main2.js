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

/*=============== WISHLIST ICON ===============*/
$(document).ready(function () {
  $(".wish-icon i").click(function () {
    $(this).toggleClass("fa-heart fa-heart-o");
  });
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

/*=============== FUNÇÃO PARA FAZER REQUISIÇÕES ===============*/
async function fetchBooks() {
  try {
    const token = Cookies.get("token");
    const headers = {};

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch("http://localhost:3000/books", {
      headers: headers,
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const responseText = await response.text();
    console.log("Resposta do servidor:", responseText);

    let books;
    try {
      books = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Erro ao fazer parse do JSON:", parseError);
      throw new Error("Resposta não é um JSON válido");
    }

    // Verificar se books é um array ou tem uma propriedade que contém o array
    let booksArray;
    if (Array.isArray(books)) {
      booksArray = books;
    } else if (books && Array.isArray(books.data)) {
      booksArray = books.data;
    } else if (books && Array.isArray(books.books)) {
      booksArray = books.books;
    } else {
      console.error("Formato de resposta:", books);
      throw new Error(
        "Formato inválido de resposta - esperado array de livros"
      );
    }

    return booksArray;
  } catch (error) {
    console.error("Erro ao carregar livros do backend:", error);
    throw error;
  }
}

/*=============== CARREGAR LIVROS - SEÇÃO DESTAQUES ===============*/
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
      const bookCard = document.createElement("article");
      bookCard.classList.add("featured__card", "swiper-slide");
      bookCard.setAttribute("data-book-id", book.id);

      const bookPrice = book.price ? parseFloat(book.price) : 0;
      const bookTitle = book.title || "Título não disponível";
      const bookImage =
        book.bookphoto || book.image || "../imagens/imagem-padrao.jpg";

      bookCard.innerHTML = `
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
      `;

      container.appendChild(bookCard);
    });

    // Inicializar o Swiper após adicionar os livros
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

/*=============== CARREGAR LIVROS - SEÇÃO NEW ===============*/
async function loadNewBooks() {
  try {
    const booksArray = await fetchBooks();

    const container = document.querySelector(".new__swiper .swiper-wrapper");
    if (!container) {
      console.error("Container para novos livros não encontrado");
      return;
    }

    container.innerHTML = "";

    booksArray.forEach((book) => {
      const bookCard = document.createElement("article");
      bookCard.classList.add("new__card", "swiper-slide");
      bookCard.setAttribute("data-book-id", book.id);

      const bookPrice = book.price ? parseFloat(book.price) : 0;
      const bookTitle = book.title || "Título não disponível";
      const bookImage =
        book.bookphoto || book.image || "../imagens/imagem-padrao.jpg";

      bookCard.innerHTML = `
        <img src="${bookImage}" alt="${bookTitle}" class="new__img" />
        <h3 class="new__title">${bookTitle}</h3>
        <div class="new__prices">
          <span class="new__price">${bookPrice
            .toFixed(2)
            .replace(".", ",")}€</span>
        </div>
        <button class="button new__button">Adicionar ao Carrinho</button>
      `;
      container.appendChild(bookCard);
    });

    // Inicializar o Swiper para novos livros
    initializeNewSwiper();
  } catch (error) {
    console.error("Erro ao carregar novos livros:", error);
    const container = document.querySelector(".new__swiper .swiper-wrapper");
    if (container) {
      container.innerHTML = "<p>Erro ao carregar novos livros.</p>";
    }
  }
}

/*=============== CARREGAR LIVROS - SEÇÃO HOME ===============*/
async function loadHomeBooks() {
  try {
    const booksArray = await fetchBooks();

    const container = document.querySelector(".home__swiper .swiper-wrapper");
    if (!container) {
      console.error("Container para livros do home não encontrado");
      return;
    }

    container.innerHTML = "";

    booksArray.forEach((book) => {
      const bookCard = document.createElement("article");
      bookCard.classList.add("home__article", "swiper-slide");

      const bookTitle = book.title || "Título não disponível";
      const bookImage =
        book.bookphoto || book.image || "../imagens/imagem-padrao.jpg";

      bookCard.innerHTML = `
        <img src="${bookImage}" alt="${bookTitle}" class="home__img" />
      `;
      container.appendChild(bookCard);
    });

    // Atualizar o Swiper do home
    if (swiperHome) {
      swiperHome.update();
    }
  } catch (error) {
    console.error("Erro ao carregar livros do home:", error);
  }
}

/*=============== INICIALIZAR SWIPER DESTAQUES ===============*/
function initializeFeaturedSwiper() {
  // Destruir swiper existente se houver
  if (swiperFeatured) {
    swiperFeatured.destroy(true, true);
  }

  // Verificar se o container existe e tem slides
  const container = document.querySelector(".featured__swiper");
  const slides = document.querySelectorAll(".featured__card");

  if (container && slides.length > 0) {
    swiperFeatured = new Swiper(".featured__swiper", {
      loop: slides.length > 1,
      spaceBetween: 16,
      grabCursor: true,
      slidesPerView: "auto",
      centeredSlides: "auto",
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      breakpoints: {
        1150: {
          slidesPerView: Math.min(4, slides.length),
          centeredSlides: false,
        },
      },
    });
  }
}

/*=============== INICIALIZAR SWIPER NOVOS LIVROS ===============*/
function initializeNewSwiper() {
  // Destruir swiper existente se houver
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

  // Aguardar um pouco para garantir que todos os elementos estejam prontos
  setTimeout(() => {
    Promise.all([loadFeaturedBooks(), loadNewBooks(), loadHomeBooks()])
      .then(() => {
        console.log("Todos os livros foram carregados com sucesso!");
      })
      .catch((error) => {
        console.error("Erro ao carregar alguns livros:", error);
      });
  }, 100);
});

// Fallback para garantir que os livros sejam carregados
window.addEventListener("load", () => {
  if (!document.querySelector(".featured__card")) {
    console.log("Fallback: recarregando livros...");
    loadFeaturedBooks();
  }
});
