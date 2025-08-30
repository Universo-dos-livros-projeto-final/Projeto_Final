/*=============== SEARCH ===============*/
// Mostrar o campo de busca ao clicar no ícone
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
// Controla o clique no ícone do usuário para validar token e redirecionar
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
// Adiciona sombra no header quando a página é rolada para baixo
const shadowHeader = () => {
  const header = document.getElementById("header");
  window.scrollY >= 50
    ? header.classList.add("shadow-header")
    : header.classList.remove("shadow-header");
};

window.addEventListener("scroll", shadowHeader);

/*=============== DARK LIGHT THEME ===============*/
// Alterna entre tema claro e escuro, guardando preferência no localStorage
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
// Anima elementos na tela ao dar scroll
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

/*=============== BOOKS FETCH & RENDER ===============*/
document.addEventListener("DOMContentLoaded", async () => {
  /* ======= variáveis globais ======= */
  let books = [];
  let currentSearch = "";

  // ler ?search=... da URL (se veio de outra página)
  const urlParams = new URLSearchParams(window.location.search);
  const urlSearchRaw = urlParams.get("search");
  if (urlSearchRaw) {
    // guarda em lowercase para as comparações
    currentSearch = decodeURIComponent(urlSearchRaw).trim().toLowerCase();
    console.log("Pesquisa da URL detectada:", currentSearch);
  }

  const categoryListEl = document.getElementById("categoryList");
  const authorFilterEl = document.getElementById("authorFilter");
  const priceFilterEl = document.getElementById("priceFilter");
  const priceValueEl = document.getElementById("priceValue");
  const bookGridEl = document.getElementById("bookGrid");
  const loadMoreCategoriesBtn = document.getElementById("loadMoreCategories");
  const filterBtn = document.getElementById("filterBtn");
  const filterPanel = document.getElementById("filterPanel");
  const clearFiltersBtn = document.getElementById("clearFilters");
  const searchInput = document.querySelector(".search__input");

  // Preencher o campo de pesquisa com o valor da URL
  if (searchInput && urlSearchRaw) {
    searchInput.value = decodeURIComponent(urlSearchRaw);
    console.log("Campo de pesquisa preenchido com:", searchInput.value);
  }

  // Event listener para pesquisa local (dentro desta página)
  if (searchInput) {
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        currentSearch = searchInput.value.trim().toLowerCase();
        console.log("Nova pesquisa local:", currentSearch);
        applyFilters();

        const searchContent = document.getElementById("search-content");
        if (searchContent) searchContent.classList.remove("show-search");
      }
    });
  }

  /* ======= helpers ======= */
  const normalize = (s) =>
    s === undefined || s === null ? "" : String(s).trim().toLowerCase();
  const toNumber = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  /* ======= fetch livros ======= */
  async function fetchBooks() {
    try {
      const token = Cookies.get("token");
      const headers = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch("http://localhost:3000/books", { headers });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();

      if (Array.isArray(json)) return json;
      if (Array.isArray(json.books)) return json.books;
      if (Array.isArray(json.data)) return json.data;
      console.error("Formato inválido vindo do backend:", json);
      return [];
    } catch (err) {
      console.error("Erro ao buscar livros:", err);
      return [];
    }
  }

  /* ======= render card ======= */
  async function renderBooks(filteredBooks) {
    bookGridEl.innerHTML = "";
    if (!filteredBooks || filteredBooks.length === 0) {
      bookGridEl.innerHTML = `
        <div class="no-results">
          <p>Nenhum livro encontrado.</p>
          ${currentSearch ? `<p>Pesquisa: "${decodeURIComponent(urlSearchRaw || currentSearch)}"</p>` : ''}
        </div>
      `;
      return;
    }

    console.log(`Renderizando ${filteredBooks.length} livros filtrados`);
    const slice = filteredBooks.slice(0, 20);

    // Busca os favoritos do backend
    let backendFavorites = [];
    const token = Cookies.get("token");
    if (token) {
      try {
        const res = await fetch("http://localhost:3000/favorites", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          backendFavorites = data.map((f) => f.bookId.toString());
        }
      } catch (err) {
        console.error("Erro ao buscar favoritos:", err);
      }
    }

    for (const book of slice) {
      const imgUrl =
        book.bookphoto || book.image || "../imagens/imagem-padrao.jpg";
      const price = toNumber(book.price);

      const card = document.createElement("div");
      card.className =
        "relative group bg-white shadow p-3 rounded w-full sm:w-[220px] flex-shrink-0 cursor-pointer transition-transform hover:-translate-y-1";

      card.dataset.bookId = book.id;

      const isFavorite = backendFavorites.includes(book.id.toString());

      card.innerHTML = `
        <div class="relative">
          <img src="${imgUrl}" alt="${
        book.title || "Livro"
      }" class="w-full h-72 object-cover rounded mb-2" />
          <div class="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button class="bg-white p-1 rounded-full shadow favorite-btn" title="Favoritar">
              <i class="${
                isFavorite
                  ? "ri-heart-fill text-xl text-red-500"
                  : "ri-heart-line text-xl"
              }"></i>
            </button>
            <button class="bg-white p-1 rounded-full shadow cart-btn hover:text-green-600" title="Adicionar ao carrinho">
              <i class="ri-shopping-cart-line text-xl"></i>
            </button>
          </div>
        </div>
        <h3 class="font-semibold text-black">${book.title || ""}</h3>
        <p class="text-sm text-gray-600">${book.author || ""}</p>
        <p class="text-indigo-600 font-bold">${price.toFixed(2)}€</p>
      `;

      // === evento carrinho ===
      card.querySelector(".cart-btn").addEventListener("click", (e) => {
        e.preventDefault();
        cartModal.addToCart(card);
      });

      // === evento favoritos ===
      card
        .querySelector(".favorite-btn")
        .addEventListener("click", async (e) => {
          e.preventDefault();
          const icon = e.currentTarget.querySelector("i");
          const bookId = card.dataset.bookId.toString();

          if (!token) {
            alert("Você precisa estar logado para favoritar.");
            window.location.href = "/Client/PaginaLogin/paginaLogin.html";
            return;
          }

          try {
            if (backendFavorites.includes(bookId)) {
              // Remover favorito
              const res = await fetch(
                `http://localhost:3000/favorites/${bookId}`,
                {
                  method: "DELETE",
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              if (!res.ok) throw new Error("Erro ao remover favorito");

              icon.classList.replace("ri-heart-fill", "ri-heart-line");
              icon.classList.remove("text-red-500");
              backendFavorites = backendFavorites.filter((id) => id !== bookId);
            } else {
              // Adicionar favorito
              const res = await fetch(`http://localhost:3000/favorites`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ bookId }),
              });
              if (!res.ok) throw new Error("Erro ao adicionar favorito");

              icon.classList.replace("ri-heart-line", "ri-heart-fill");
              icon.classList.add("text-red-500");
              backendFavorites.push(bookId);
            }
          } catch (err) {
            console.error(err);
            alert("Não foi possível atualizar favorito. Tente novamente.");
          }
        });

      bookGridEl.appendChild(card);
    }
  }

  /* ======= filtros ======= */
  function applyFilters() {
    const selectedAuthor = normalize(authorFilterEl.value);
    const selectedPrice = toNumber(priceFilterEl.value);

    const selectedCategories = Array.from(
      document.querySelectorAll('#categoryList input[type="checkbox"]:checked')
    ).map((cb) => normalize(cb.value));

    console.log("Aplicando filtros:", {
      search: currentSearch,
      author: selectedAuthor,
      price: selectedPrice,
      categories: selectedCategories
    });

    const filtered = books.filter((book) => {
      const bookAuthor = normalize(book.author);
      const bookCategory = normalize(book.category || book.genre || "");
      const bookPrice = toNumber(book.price);
      const bookTitle = normalize(book.title);

      const matchAuthor =
        selectedAuthor === "" || bookAuthor === selectedAuthor;
      const matchPrice = bookPrice <= selectedPrice;
      const matchCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(bookCategory);

      const matchSearch =
        currentSearch === "" ||
        bookTitle.includes(currentSearch) ||
        bookAuthor.includes(currentSearch);

      return matchAuthor && matchPrice && matchCategory && matchSearch;
    });

    console.log(`Filtrado: ${filtered.length} de ${books.length} livros`);
    renderBooks(filtered);
  }

  /* ======= popular autores ======= */
  function populateAuthors() {
    const authors = [
      ...new Set(books.map((b) => normalize(b.author)).filter(Boolean)),
    ];
    // limpa e insere
    authorFilterEl.innerHTML = '<option value="">Todos</option>';
    authors.forEach((authNorm) => {
      // guardar o valor original exibido mantendo normalização para comparação
      // buscamos o primeiro livro com esse autor para pegar o nome original
      const original =
        books.find((b) => normalize(b.author) === authNorm)?.author || authNorm;
      const opt = document.createElement("option");
      opt.value = original; // value usado é o original (será normalizado na comparação)
      opt.textContent = original;
      authorFilterEl.appendChild(opt);
    });
  }

  /* ======= categorias ======= */
  const allCategories = [
    "Romance",
    "Fantasia",
    "Terror",
    "Ficção Científica",
    "Suspense",
    "Drama",
    "Comédia",
    "Autoajuda",
    "Aventura",
    "Biografia",
    "Infantil",
    "História",
    "Educação",
    "Religião",
    "Negócios",
  ];

  let shownCategories = 0;
  const categoriesPerLoad = 5;

  function renderCategories() {
    const slice = allCategories.slice(
      shownCategories,
      shownCategories + categoriesPerLoad
    );
    for (const cat of slice) {
      const li = document.createElement("li");
      li.innerHTML = `
          <label class="inline-flex items-center gap-2 text-sm" style="color: gray;">
            <input type="checkbox" class="form-checkbox" value="${cat}" />
            ${cat}
          </label>`;
      categoryListEl.appendChild(li);
      const checkbox = li.querySelector('input[type="checkbox"]');
      checkbox.addEventListener("change", applyFilters);
    }
    shownCategories += categoriesPerLoad;
    if (loadMoreCategoriesBtn) {
      loadMoreCategoriesBtn.classList.toggle(
        "hidden",
        shownCategories >= allCategories.length
      );
    }
  }

  /* ======= eventos UI ======= */
  authorFilterEl.addEventListener("change", applyFilters);
  priceFilterEl.addEventListener("input", (e) => {
    priceValueEl.textContent = e.target.value;
    applyFilters();
  });
  clearFiltersBtn.addEventListener("click", () => {
    authorFilterEl.value = "";
    priceFilterEl.value = priceFilterEl.max || 100;
    priceValueEl.textContent = priceFilterEl.value;
    document
      .querySelectorAll('#categoryList input[type="checkbox"]')
      .forEach((cb) => (cb.checked = false));

    // Limpar também a pesquisa atual e o campo de input
    currentSearch = "";
    if (searchInput) searchInput.value = "";

    // Limpar a URL também
    const newUrl = window.location.pathname;
    window.history.replaceState({}, '', newUrl);

    applyFilters();
  });

  if (filterBtn)
    filterBtn.addEventListener("click", () =>
      filterPanel.classList.toggle("hidden")
    );
  if (loadMoreCategoriesBtn)
    loadMoreCategoriesBtn.addEventListener("click", renderCategories);

  /* ======= inicialização real ======= */
  // 1) renderiza as primeiras categorias
  renderCategories();

  // 2) busca os livros e preenche o array global
  console.log("Carregando livros...");
  books = await fetchBooks();
  console.log(`${books.length} livros carregados`);

  // 3) popula autores
  populateAuthors();

  // 4) Processar parâmetros da URL para categorias
  const urlCategory = urlParams.get("category");
  if (urlCategory) {
    const categoriesFromUrl = decodeURIComponent(urlCategory)
      .split(",")
      .map((c) => c.trim());
    
    categoriesFromUrl.forEach((catValue) => {
      // Procurar checkbox correspondente (case-insensitive)
      const catCheckbox = Array.from(
        document.querySelectorAll('#categoryList input[type="checkbox"]')
      ).find(cb => normalize(cb.value) === normalize(catValue));
      
      if (catCheckbox) {
        catCheckbox.checked = true;
        console.log("Categoria da URL selecionada:", catValue);
      }
    });
  }

  // 5) Aplicar todos os filtros (incluindo pesquisa da URL)
  console.log("Aplicando filtros iniciais...");
  applyFilters();
});

// Função para pesquisa de outras páginas (adicione esta função no final)
function handleSearchFromOtherPages() {
  const searchInputs = document.querySelectorAll(".search__input");
  
  searchInputs.forEach(input => {
    if (input.closest('.search__form')) { // Para inputs em outras páginas
      input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          const query = encodeURIComponent(input.value.trim());
          if (query) {
            // Verifica se já estamos na página de categorias
            if (window.location.pathname.includes('categorias.html')) {
              // Se já estiver na página, apenas atualiza a pesquisa local
              currentSearch = input.value.trim().toLowerCase();
              applyFilters();
            } else {
              // Se estiver em outra página, redireciona
              window.location.href = `/Client/pagCategorias/categorias.html?search=${query}`;
            }
          }
        }
      });
    }
  });
}

// Chama a função quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", handleSearchFromOtherPages);
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
      console.warn(
        "Não foi possível confirmar com o servidor, mas o item foi adicionado localmente."
      );
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

document.addEventListener("DOMContentLoaded", async () => {
  // 1) buscar livros
  books = await fetchBooks();

  // 2) popular autores
  populateAuthors();

  // 3) renderizar categorias
  renderCategories();

  // 4) marcar categorias da URL
  const urlParams = new URLSearchParams(window.location.search);
  const urlSearch = urlParams.get("search");
  if (urlSearch) {
    currentSearch = decodeURIComponent(urlSearch).trim().toLowerCase();
    if (searchInput) searchInput.value = decodeURIComponent(urlSearch);
  }
  const urlCategory = urlParams.get("category");
  if (urlCategory) {
    const categoriesFromUrl = decodeURIComponent(urlCategory)
      .split(",")
      .map((c) => c.trim().toLowerCase());
    categoriesFromUrl.forEach((catValue) => {
      const catCheckbox = document.querySelector(
        `#categoryList input[value="${catValue}"]`
      );
      if (catCheckbox) catCheckbox.checked = true;
    });
  }

  // 5) **renderizar livros já filtrados**
  applyFilters(); // Isso vai chamar renderBooks internamente

  // 6) atualizar favoritos e carrinho
  favoritesModal.updateFavoriteIcons();
  checkLoginStatus();

  // 7) verificar login periodicamente
  setInterval(checkLoginStatus, 30000);
});
