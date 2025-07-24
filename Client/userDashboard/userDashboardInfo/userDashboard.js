const body = document.querySelector("body"),
  modeToggle = body.querySelector(".mode-toggle");
sidebar = body.querySelector("nav");
sidebarToggle = body.querySelector(".sidebar-toggle");

const token = Cookies.get("token");

// Verifica se o usuário está logado
if (!token) {
  alert("Você precisa estar logado.");
  window.location.href = "/paginaLogin/paginaLogin.html";
}

// Dark mode e sidebar (mantém localStorage para preferências da UI)
let getMode = localStorage.getItem("mode");
if (getMode && getMode === "dark") {
  body.classList.toggle("dark");
}

let getStatus = localStorage.getItem("status");
if (getStatus && getStatus === "close") {
  sidebar.classList.toggle("close");
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

// ======= PERFIL DO USUÁRIO =======
document.addEventListener("DOMContentLoaded", async () => {
  const openBtn = document.getElementById("openModalBtn");
  const closeBtn = document.getElementById("closeModalBtn");
  const modalOverlay = document.getElementById("modalOverlay");
  const form = document.getElementById("formEditar");

  const displayNome = document.getElementById("displayNome");
  const displaySobrenome = document.getElementById("displaySobrenome");
  const displayEmail = document.getElementById("displayEmail");
  const displaySenha = document.getElementById("displaySenha");

  const inputNome = document.getElementById("inputNome");
  const inputSobrenome = document.getElementById("inputSobrenome");
  const inputEmail = document.getElementById("inputEmail");
  const inputSenha = document.getElementById("inputSenha");

  // 🚀 Carrega dados do backend ao abrir a página
  await loadUserProfile();

  async function loadUserProfile() {
    try {
      const res = await fetch("http://localhost:3000/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Erro ao carregar dados");

      const user = await res.json();

      displayNome.innerText = user.firstname || "";
      displaySobrenome.innerText = user.lastname || "";
      displayEmail.innerText = user.email || "";
      displaySenha.innerText = "••••••••";
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar perfil");
    }
  }

  // 🗂️ Abrir modal
  openBtn.addEventListener("click", () => {
    inputNome.value = displayNome.innerText;
    inputSobrenome.value = displaySobrenome.innerText;
    inputEmail.value = displayEmail.innerText;
    inputSenha.value = ""; // Sempre vazio para segurança

    modalOverlay.classList.remove("hidden");
  });

  // Fechar modal
  closeBtn.addEventListener("click", () => {
    modalOverlay.classList.add("hidden");
  });

  // 💾 Salvar dados no backend
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const dataToSend = {
      firstname: inputNome.value.trim(),
      lastname: inputSobrenome.value.trim(),
      email: inputEmail.value.trim(),
    };

    // Só envia senha se foi preenchida
    if (inputSenha.value.trim() !== "") {
      dataToSend.password = inputSenha.value.trim();
    }

    try {
      const res = await fetch("http://localhost:3000/user", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      if (!res.ok) throw new Error("Erro ao salvar dados");

      // Atualiza a exibição
      displayNome.innerText = dataToSend.firstname;
      displaySobrenome.innerText = dataToSend.lastname;
      displayEmail.innerText = dataToSend.email;
      displaySenha.innerText = "••••••••"; // Mantém os pontos

      modalOverlay.classList.add("hidden");
      inputSenha.value = ""; // Limpa o campo senha
      alert("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar perfil");
    }
  });

  // 🖱️ Fechar clicando fora do modal
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.classList.add("hidden");
    }
  });
});

// ======= ENDEREÇOS =======
document.addEventListener("DOMContentLoaded", async () => {
  let enderecos = [];
  let editandoId = null;

  const modal = document.getElementById("modalEnderecoOverlay");
  const btnNovo = document.getElementById("btnNovoEndereco");
  const btnFechar = document.getElementById("closeModalEnderecoBtn");
  const form = document.getElementById("formEndereco");
  const container = document.getElementById("enderecosContainer");
  const modalTitulo = document.getElementById("modalEnderecoTitulo");

  // Carrega os endereços do backend
  await loadEnderecos();

  async function loadEnderecos() {
    try {
      const res = await fetch("http://localhost:3000/user/addresses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Erro ao carregar endereços");

      const data = await res.json();
      // O backend retorna { addresses: [...] }
      enderecos = data.addresses || [];
      renderizarEnderecos();
    } catch (error) {
      console.error("Erro ao carregar endereços:", error);
      alert("Erro ao carregar endereços");
    }
  }

  async function salvarEndereco(endereco) {
    try {
      const res = await fetch("http://localhost:3000/user/address", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(endereco),
      });

      if (!res.ok) throw new Error("Erro ao salvar endereço");

      return await res.json();
    } catch (error) {
      console.error("Erro ao salvar endereço:", error);
      throw error;
    }
  }

  async function atualizarEndereco(id, endereco) {
    try {
      const res = await fetch(`http://localhost:3000/user/address/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(endereco),
      });

      if (!res.ok) throw new Error("Erro ao atualizar endereço");

      return await res.json();
    } catch (error) {
      console.error("Erro ao atualizar endereço:", error);
      throw error;
    }
  }

  async function excluirEndereco(id) {
    try {
      const res = await fetch(`http://localhost:3000/user/address/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Erro ao excluir endereço");

      return true;
    } catch (error) {
      console.error("Erro ao excluir endereço:", error);
      throw error;
    }
  }

  function abrirModal() {
    modal.classList.remove("hidden");
  }

  function fecharModal() {
    modal.classList.add("hidden");
    form.reset();
    editandoId = null;
  }

  btnNovo.addEventListener("click", () => {
    modalTitulo.textContent = "Novo Endereço";
    abrirModal();
  });

  btnFechar.addEventListener("click", fecharModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) fecharModal();
  });

  function renderizarEnderecos() {
    container.innerHTML = "";
    enderecos.forEach((end) => {
      const div = document.createElement("div");
      div.className =
        "border p-2 rounded shadow flex justify-between items-start";
      div.innerHTML = `
        <div>
          <p><strong>Endereço:</strong> ${end.street || ""}</p>
          <p><strong>Número:</strong> ${end.number || ""}</p>
          <p><strong>Código Postal:</strong> ${end.zipcode || ""}</p>
          <p><strong>Freguesia:</strong> ${end.parish || ""}</p>
          <p><strong>Concelho:</strong> ${end.county || ""}</p>
          <p><strong>Estado:</strong> ${end.state || ""}</p>
          <p><strong>País:</strong> ${end.country || ""}</p>
        </div>
        <div class="space-y-2">
          <button class="btnEditar px-3 py-1 bg-yellow-500 text-white rounded">Editar</button>
          <button class="btnExcluir px-3 py-1 bg-red-600 text-white rounded">Excluir</button>
        </div>
      `;

      div.querySelector(".btnEditar").addEventListener("click", () => {
        modalTitulo.textContent = "Editar Endereço";
        editandoId = end.id;
        document.getElementById("inputEndereco1").value = end.street || "";
        document.getElementById("inputNumero").value = end.number || "";
        document.getElementById("inputCodigoPostal").value = end.zipcode || "";
        document.getElementById("inputFreguesia").value = end.parish || "";
        document.getElementById("inputConcelho").value = end.county || "";
        document.getElementById("inputEstado").value = end.state || "";
        document.getElementById("inputPais").value = end.country || "";
        abrirModal();
      });

      div.querySelector(".btnExcluir").addEventListener("click", async () => {
        if (confirm("Deseja excluir este endereço?")) {
          try {
            await excluirEndereco(end.id);
            await loadEnderecos();
            alert("Endereço excluído com sucesso!");
          } catch (error) {
            alert("Erro ao excluir endereço");
          }
        }
      });

      container.appendChild(div);
    });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const novoEndereco = {
      street: document.getElementById("inputEndereco1").value.trim(),
      number: document.getElementById("inputNumero").value.trim(),
      zipcode: document.getElementById("inputCodigoPostal").value.trim(),
      parish: document.getElementById("inputFreguesia").value.trim(),
      county: document.getElementById("inputConcelho").value.trim(),
      state: document.getElementById("inputEstado").value.trim(),
      country: document.getElementById("inputPais").value.trim(),
    };

    try {
      if (editandoId !== null) {
        await atualizarEndereco(editandoId, novoEndereco);
        alert("Endereço atualizado com sucesso!");
      } else {
        await salvarEndereco(novoEndereco);
        alert("Endereço salvo com sucesso!");
      }

      await loadEnderecos();
      fecharModal();
    } catch (error) {
      alert("Erro ao salvar endereço");
    }
  });
});

// ======= FOTO DO PERFIL =======
document.addEventListener("DOMContentLoaded", async () => {
  const btnUsarUrl = document.getElementById("btnUsarUrl");
  const modalOverlay = document.getElementById("modalUrlOverlay");
  const closeModalBtn = document.getElementById("closeModalUrlBtn");
  const btnSalvarUrl = document.getElementById("btnSalvarUrl");
  const inputUrl = document.getElementById("inputUrlImage");

  const profileImageHeader = document.getElementById("profileImageHeader");
  const profileImageMain = document.getElementById("profileImageMain");

  // Carrega a imagem do perfil do backend
  await loadProfileImage();

  async function loadProfileImage() {
    try {
      const res = await fetch("http://localhost:3000/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Erro ao carregar dados");

      const user = await res.json();

      if (user.profilephoto) {
        if (profileImageHeader) profileImageHeader.src = user.profilephoto;
        if (profileImageMain) profileImageMain.src = user.profilephoto;
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Abrir modal
  btnUsarUrl.addEventListener("click", () => {
    modalOverlay.classList.remove("hidden");
  });

  // Fechar modal
  closeModalBtn.addEventListener("click", () => {
    modalOverlay.classList.add("hidden");
    inputUrl.value = "";
  });

  // Fechar modal clicando fora
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.classList.add("hidden");
      inputUrl.value = "";
    }
  });

  // Salvar novo link e enviar para o backend
  btnSalvarUrl.addEventListener("click", async () => {
    const url = inputUrl.value.trim();
    if (url) {
      try {
        const res = await fetch("http://localhost:3000/user", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ profilephoto: url }),
        });

        if (!res.ok) throw new Error("Erro ao atualizar foto");

        // Atualiza as imagens
        if (profileImageHeader) profileImageHeader.src = url;
        if (profileImageMain) profileImageMain.src = url;

        // Fechar modal
        modalOverlay.classList.add("hidden");
        inputUrl.value = "";
        alert("Foto atualizada com sucesso!");
      } catch (error) {
        console.error(error);
        alert("Erro ao atualizar foto");
      }
    } else {
      alert("Por favor, insira um link válido.");
    }
  });

  document.getElementById("logoutBtn").addEventListener("click", async (e) => {
    e.preventDefault();

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

      alert("Logout realizado com sucesso!");
      window.location.href = "/Client/paginaInicial/index.html";
    } catch (error) {
      console.error(error);
      alert("Falha ao sair da conta. Tente novamente.");
    }
  });
});
