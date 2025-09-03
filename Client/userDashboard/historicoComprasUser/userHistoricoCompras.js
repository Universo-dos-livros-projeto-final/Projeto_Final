const body = document.querySelector("body");
const modeToggle = body.querySelector(".mode-toggle");
const sidebar = body.querySelector("nav");
const sidebarToggle = body.querySelector(".sidebar-toggle");

const token = Cookies.get("token");

// Verifica se o usuário está logado
if (!token) {
  alert("Você precisa estar logado.");
  window.location.href = "/paginaLogin/paginaLogin.html";
}
/* ========= DARK MODE ========= */
document.addEventListener('DOMContentLoaded', () => {
  const bodyEl = document.body;
  const modeBtn = document.querySelector('.mode-toggle');
  const icon = modeBtn?.querySelector('i');

  const DARK_CLASS_1 = 'dark-theme';
  const DARK_CLASS_2 = 'dark';
  const ICON_SUN  = 'ri-sun-line';
  const ICON_MOON = 'ri-moon-line';

  const savedTheme = localStorage.getItem('selected-theme');
  const savedIcon  = localStorage.getItem('selected-icon');

  const isSavedDark = savedTheme === 'dark';
  bodyEl.classList.toggle(DARK_CLASS_1, isSavedDark);
  bodyEl.classList.toggle(DARK_CLASS_2, isSavedDark);

  if (icon) {
    icon.classList.remove(ICON_SUN, ICON_MOON);
    icon.classList.add(savedIcon || ICON_MOON);
  }

  modeBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    const willBeDark = !bodyEl.classList.contains(DARK_CLASS_1);
    bodyEl.classList.toggle(DARK_CLASS_1, willBeDark);
    bodyEl.classList.toggle(DARK_CLASS_2, willBeDark);

    if (icon) {
      icon.classList.toggle(ICON_SUN, willBeDark);
      icon.classList.toggle(ICON_MOON, !willBeDark);
    }

    localStorage.setItem('selected-theme', willBeDark ? 'dark' : 'light');
    localStorage.setItem('selected-icon', willBeDark ? ICON_SUN : ICON_MOON);
  });

  /* ========= SIDEBAR ========= */
  const sidebar = document.querySelector('nav'); // <-- voltou para nav normal
  const sidebarToggle = document.querySelector('.sidebar-toggle');

  if (sidebar && sidebarToggle) {
    const savedStatus = localStorage.getItem('status'); // "open" | "close"
    sidebar.classList.toggle('close', savedStatus === 'close');

    sidebarToggle.addEventListener('click', () => {
      const isClosed = sidebar.classList.toggle('close');
      localStorage.setItem('status', isClosed ? 'close' : 'open');
    });
  }
});


// ===================== PERFIL DO USUÁRIO =====================
async function carregarPerfilUsuario() {
  const token = Cookies.get("token");

  const profileImageHeader = document.getElementById("profileImageHeader");
  const profileImageMain = document.getElementById("profileImageMain");

  try {
    const response = await fetch("http://localhost:3000/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Erro ao buscar usuário");

    const user = await response.json();

    if (user.profilephoto) {
      if (profileImageHeader) profileImageHeader.src = user.profilephoto;
      if (profileImageMain) profileImageMain.src = user.profilephoto;
    }
  } catch (err) {
    console.error("Erro ao carregar dados do usuário:", err);
  }
}

// ===================== HISTÓRICO DE COMPRAS =====================
function renderCards(data) {
  const grid = document.getElementById("historyGrid");
  grid.innerHTML = "";

  data.forEach((sale) => {
    const card = document.createElement("div");
    card.classList.add("history-card");
    card.innerHTML = `
      <div class="image-wrapper">
        <img src="${sale.photo}" alt="${sale.title}">
      </div>
      <div class="content">
        <div class="top-line">
          <h3>${sale.title}</h3>
          <div class="info-right">
            <span class="price">Preço: € ${sale.price.toFixed(2)}</span>
            <span class="date">${new Date(sale.soldAt).toLocaleDateString(
              "pt-BR",
              {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              }
            )}</span>
          </div>
        </div>
        <p class="author">Autor: ${sale.author}</p>
      </div>
    `;
    grid.appendChild(card);
  });
}

async function fetchAndRenderUserPurchases() {
  const token = Cookies.get("token");

  try {
    const response = await fetch("http://localhost:3000/user/purchases", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Erro ao buscar histórico");

    const data = await response.json();

    const formattedData = data.map((purchase) => ({
      id: purchase.id,
      title: purchase.book.title,
      author: purchase.book.author,
      price: purchase.book.price,
      soldAt: purchase.date,
      photo: purchase.book.bookphoto || "../imagens/imagem-padrao.jpg",
    }));

    formattedData.sort((a, b) => new Date(b.soldAt) - new Date(a.soldAt));

    window.salesHistory = formattedData;

    renderCards(formattedData);
  } catch (error) {
    console.error(error);
    alert("Erro ao carregar histórico de compras.");
  }
}

// ===================== FILTRO DE DATAS =====================
function filterByDate() {
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;

  const filtered = window.salesHistory.filter((sale) => {
    const saleDate = new Date(sale.soldAt);
    if (startDate && saleDate < new Date(startDate)) return false;
    if (endDate && saleDate > new Date(endDate)) return false;
    return true;
  });

  renderCards(filtered);
}

document.getElementById("filterBtn").addEventListener("click", filterByDate);
document.getElementById("resetBtn").addEventListener("click", () => {
  document.getElementById("startDate").value = "";
  document.getElementById("endDate").value = "";
  renderCards(window.salesHistory);
});

// ===================== LOGOUT =====================
document.getElementById("logoutBtn").addEventListener("click", async (e) => {
  e.preventDefault();

  const token = Cookies.get("token");

  if (!token) {
    alert("Você já está desconectado.");
    window.location.href = "/Client/paginaInicial/index.html";
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Erro ao fazer logout");
    }

    Cookies.remove("token");

    window.location.href = "/Client/paginaInicial/index.html";
  } catch (error) {
    console.error("Erro no logout:", error);
    alert("Falha ao sair da conta. Tente novamente.");
  }
});

// ===================== CARREGAMENTO INICIAL =====================
carregarPerfilUsuario();
fetchAndRenderUserPurchases();


