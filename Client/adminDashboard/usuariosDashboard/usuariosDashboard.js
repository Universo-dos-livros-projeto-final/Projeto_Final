const body = document.querySelector("body"),
  modeToggle = body.querySelector(".mode-toggle"),
  sidebar = body.querySelector("nav"),
  sidebarToggle = body.querySelector(".sidebar-toggle");

// Aplica modo salvo (claro/escuro)
let getMode = localStorage.getItem("mode");
if (getMode && getMode === "dark") {
  body.classList.add("dark");
}

// Aplica status da sidebar salva (aberta/fechada)
let getStatus = localStorage.getItem("status");
if (getStatus && getStatus === "close") {
  sidebar.classList.add("close");
}

// Alterna modo claro/escuro e salva preferência
modeToggle?.addEventListener("click", () => {
  body.classList.toggle("dark");
  localStorage.setItem(
    "mode",
    body.classList.contains("dark") ? "dark" : "light"
  );
});

// Alterna abrir/fechar sidebar e salva estado
sidebarToggle?.addEventListener("click", () => {
  sidebar.classList.toggle("close");
  localStorage.setItem(
    "status",
    sidebar.classList.contains("close") ? "close" : "open"
  );
});

// Obtém token JWT
const token = Cookies?.get("token");

// Referência ao tbody da tabela de usuários
const userTableBody = document.getElementById("userTableBody");

// Função para carregar usuários do backend e preencher tabela
async function loadUsers() {
  if (!token) {
    alert("Token não encontrado. Faça login novamente.");
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Erro ao carregar usuários");

    const users = await res.json();

    // Limpa tabela
    userTableBody.innerHTML = "";

    // Preenche tabela com usuários
    users.forEach((user, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><input type="checkbox" class="user-checkbox" data-userid="${
          user.id
        }"></td>
        <td>${index + 1}</td>
        <td class="user-id">${user.id}</td>
        <td>${user.firstname}</td>
        <td>${user.email}</td>
        <td><span class="status-badge ${
          user.isBlocked ? "status-blocked" : "status-active"
        }">${user.isBlocked ? "Bloqueado" : "Ativo"}</span></td>
        <td>
          <button class="action-btn ${
            user.isBlocked ? "btn-unblock" : "btn-block"
          }">${user.isBlocked ? "Desbloquear" : "Bloquear"}</button>
          <button class="action-btn btn-delete">Deletar</button>
        </td>
      `;
      userTableBody.appendChild(tr);
    });

    attachActionButtonsEvents();
  } catch (error) {
    alert(error.message);
  }
}

// Função para adicionar eventos aos botões de ação (bloquear, desbloquear, deletar)
function attachActionButtonsEvents() {
  document.querySelectorAll(".action-btn").forEach((button) => {
    button.onclick = async function () {
      const row = this.closest("tr");
      const statusCell = row.querySelector(".status-badge");
      const userId = row.querySelector('input[type="checkbox"]').dataset.userid;

      if (this.classList.contains("btn-block")) {
        // Bloquear usuário
        statusCell.textContent = "Bloqueado";
        statusCell.classList.replace("status-active", "status-blocked");
        this.textContent = "Desbloquear";
        this.classList.replace("btn-block", "btn-unblock");
      } else if (this.classList.contains("btn-unblock")) {
        // Desbloquear usuário
        statusCell.textContent = "Ativo";
        statusCell.classList.replace("status-blocked", "status-active");
        this.textContent = "Bloquear";
        this.classList.replace("btn-unblock", "btn-block");
      } else if (this.classList.contains("btn-delete")) {
        // Deletar usuário via backend
        if (!confirm("Deseja realmente deletar este usuário?")) return;
        try {
          const res = await fetch(
            `http://localhost:3000/admin/user/${userId}`,
            {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (!res.ok) {
            const data = await res.json();
            alert("Erro ao deletar usuário: " + (data.message || ""));
            return;
          }
          row.remove();
          alert("Usuário deletado com sucesso!");
        } catch {
          alert("Erro ao deletar usuário.");
        }
      }
    };
  });
}

// Checkbox "Selecionar Todos"
document.getElementById("selectAll")?.addEventListener("change", function () {
  const checkboxes = document.querySelectorAll(".user-checkbox");
  checkboxes.forEach((cb) => (cb.checked = this.checked));
});

// Botão Buscar Usuário por ID
document.getElementById("searchBtn")?.addEventListener("click", async () => {
  const searchInput = document.getElementById("searchInput")?.value.trim();
  if (!searchInput) {
    alert("Digite um ID para buscar.");
    return;
  }
  if (!token) {
    alert("Token não encontrado.");
    return;
  }
  try {
    const res = await fetch(`http://localhost:3000/admin/user/${searchInput}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Usuário não encontrado.");
    const user = await res.json();
    alert(`Usuário encontrado:\nNome: ${user.name}\nEmail: ${user.email}`);
  } catch (error) {
    alert(error.message);
  }
});

// Botão Deletar Selecionados
document
  .getElementById("deleteSelectedBtn")
  ?.addEventListener("click", async () => {
    const checkboxes = document.querySelectorAll(".user-checkbox:checked");
    if (checkboxes.length === 0) {
      alert("Selecione ao menos um usuário.");
      return;
    }
    if (!confirm(`Deseja deletar ${checkboxes.length} usuário(s)?`)) return;

    for (const cb of checkboxes) {
      const userId = cb.dataset.userid;
      try {
        const res = await fetch(`http://localhost:3000/admin/user/${userId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const data = await res.json();
          alert(`Erro ao deletar usuário ${userId}: ${data.message}`);
          continue;
        }
        cb.closest("tr").remove();
      } catch {
        alert(`Erro ao deletar usuário ${userId}`);
      }
    }
  });

// Carrega usuários ao abrir a página
window.addEventListener("load", () => {
  loadUsers();
});
