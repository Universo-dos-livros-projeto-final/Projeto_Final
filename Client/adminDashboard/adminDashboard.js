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

// --- Função para carregar dados do backend ---

document.addEventListener("DOMContentLoaded", async () => {
  const token = Cookies.get("token");
  if (!token) {
    alert("Você precisa estar logado para acessar o dashboard.");
    window.location.href = "/Client/login.html"; // ajuste seu caminho de login
    return;
  }

  try {
    // 1) Buscar estatísticas principais
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

    // 2) Buscar atividades recentes
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

    // Limpa dados antigos (exceto o título)
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
