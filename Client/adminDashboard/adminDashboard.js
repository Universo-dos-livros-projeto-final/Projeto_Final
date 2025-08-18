const body = document.querySelector("body"),
  modeToggle = body.querySelector(".mode-toggle"),
  sidebar = body.querySelector("nav"),
  sidebarToggle = body.querySelector(".sidebar-toggle");

// Dark Mode
let getMode = localStorage.getItem("mode");
if (getMode && getMode === "dark") {
  body.classList.add("dark");
}

// Sidebar toggle
let getStatus = localStorage.getItem("status");
if (getStatus && getStatus === "close") {
  sidebar.classList.add("close");
}

modeToggle.addEventListener("click", () => {
  body.classList.toggle("dark");
  if (body.classList.contains("dark")) {
    localStorage.setItem("mode", "dark");
  } else {
    localStorage.setItem("mode", "light");
  }
});

sidebarToggle.addEventListener("click", () => {
  sidebar.classList.toggle("close");
  if (sidebar.classList.contains("close")) {
    localStorage.setItem("status", "close");
  } else {
    localStorage.setItem("status", "open");
  }
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

// --- Função para carregar dados do backend ---

document.addEventListener("DOMContentLoaded", async () => {
  const token = Cookies.get("token");
  if (!token) {
    alert("Você precisa estar logado para acessar o dashboard.");
    window.location.href = "/Client/login.html"; 
    return;
  }

  try {
    
    const resInfo = await fetch("http://localhost:3000/admin/dashboard/info", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!resInfo.ok) throw new Error("Erro ao buscar estatísticas");

    const info = await resInfo.json();

    document.getElementById("favCount").textContent =
      info.favorites.toLocaleString();
    document.getElementById("clientCount").textContent =
      info.clients.toLocaleString();
    document.getElementById("soldCount").textContent =
      info.totalVendidos.toLocaleString();

    
    const resRecent = await fetch(
      "http://localhost:3000/admin/dashboard/recent",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!resRecent.ok) throw new Error("Erro ao buscar atividades recentes");

    const { atividadesRecentes } = await resRecent.json();

    const namesDiv = document.querySelector(".names");
    const emailsDiv = document.querySelector(".email");
    const joinedDiv = document.querySelector(".joined");
    const typeDiv = document.querySelector(".type");
    const statusDiv = document.querySelector(".status");

    
    namesDiv.innerHTML = '<span class="data-title">Nome</span>';
    emailsDiv.innerHTML = '<span class="data-title">Email</span>';
    joinedDiv.innerHTML = '<span class="data-title">Inscreveu-se</span>';
    typeDiv.innerHTML = '<span class="data-title">Tipo</span>';
    statusDiv.innerHTML = '<span class="data-title">Status</span>';

    atividadesRecentes.forEach((user) => {
      namesDiv.innerHTML += `<span class="data-list">${user.firstname} ${user.lastname}</span>`;
      emailsDiv.innerHTML += `<span class="data-list">${user.email}</span>`;
      joinedDiv.innerHTML += `<span class="data-list">${
        user.createdAt.split("T")[0]
      }</span>`;
      typeDiv.innerHTML += `<span class="data-list">Novo</span>`;
      statusDiv.innerHTML += `<span class="data-list">${
        user.isBlocked ? "Bloqueado" : "Ativo"
      }</span>`;
    });
  } catch (error) {
    console.error(error);
    alert("Erro ao carregar dados do dashboard. Veja console para detalhes.");
  }
});
