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

const token = Cookies?.get("token");
const userTableBody = document.getElementById("userTableBody");

// Carrega usuários bloqueados
async function loadUsers() {
  if (!token) {
    alert("Token não encontrado. Faça login novamente.");
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/admin/users/blocked", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const errMsg = await res.text();
      throw new Error(errMsg || "Erro ao carregar usuários bloqueados");
    }

    const users = await res.json();
    userTableBody.innerHTML = "";

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
        <td><span class="status-badge status-blocked">Bloqueado</span></td>
        <td>
          <button class="action-btn btn-unblock">Desbloquear</button>
          <button class="action-btn btn-delete">Deletar</button>
        </td>
      `;
      userTableBody.appendChild(tr);
    });

    attachActionButtonsEvents();
  } catch (error) {
    alert("Erro: " + error.message);
  }
}

// Eventos dos botões
function attachActionButtonsEvents() {
  document.querySelectorAll(".action-btn").forEach((button) => {
    button.onclick = async function () {
      const row = this.closest("tr");
      const userId = row.querySelector('input[type="checkbox"]').dataset.userid;

      if (this.classList.contains("btn-unblock")) {
        // Desbloquear usuário via PATCH /admin/user/:id/block com block: false
        try {
          const res = await fetch(
            `http://localhost:3000/admin/user/${userId}/block`,
            {
              method: "PATCH",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ block: false }),
            }
          );
          if (!res.ok) throw new Error("Erro ao desbloquear usuário");
          row.remove(); // remove da tabela
        } catch (err) {
          alert("Erro ao desbloquear usuário.");
        }
      } else if (this.classList.contains("btn-delete")) {
        // Deletar usuário
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

// Carregar na abertura da página
window.addEventListener("load", () => {
  loadUsers();
});
