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
document.addEventListener("DOMContentLoaded", () => {
  const bodyEl = document.body;
  const modeBtn = document.querySelector(".mode-toggle");
  const icon = modeBtn?.querySelector("i");

  const DARK_CLASS_1 = "dark-theme";
  const DARK_CLASS_2 = "dark";
  const ICON_SUN = "ri-sun-line";
  const ICON_MOON = "ri-moon-line";

  const savedTheme = localStorage.getItem("selected-theme");
  const savedIcon = localStorage.getItem("selected-icon");

  const isSavedDark = savedTheme === "dark";
  bodyEl.classList.toggle(DARK_CLASS_1, isSavedDark);
  bodyEl.classList.toggle(DARK_CLASS_2, isSavedDark);

  if (icon) {
    icon.classList.remove(ICON_SUN, ICON_MOON);
    icon.classList.add(savedIcon || ICON_MOON);
  }

  modeBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    const willBeDark = !bodyEl.classList.contains(DARK_CLASS_1);
    bodyEl.classList.toggle(DARK_CLASS_1, willBeDark);
    bodyEl.classList.toggle(DARK_CLASS_2, willBeDark);

    if (icon) {
      icon.classList.toggle(ICON_SUN, willBeDark);
      icon.classList.toggle(ICON_MOON, !willBeDark);
    }

    localStorage.setItem("selected-theme", willBeDark ? "dark" : "light");
    localStorage.setItem("selected-icon", willBeDark ? ICON_SUN : ICON_MOON);
  });

  /* ========= SIDEBAR ========= */

  const sidebar = document.querySelector('nav'); 
  const sidebarToggle = document.querySelector('.sidebar-toggle');

  if (sidebar && sidebarToggle) {
    const savedStatus = localStorage.getItem('status'); 
    sidebar.classList.toggle('close', savedStatus === 'close');

    sidebarToggle.addEventListener("click", () => {
      const isClosed = sidebar.classList.toggle("close");
      localStorage.setItem("status", isClosed ? "close" : "open");
    });
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

  // Carrega dados do backend ao abrir a página
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

  // Abrir modal
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

  //  Salvar dados no backend
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
      displaySenha.innerText = "••••••••"; 

      modalOverlay.classList.add("hidden");
      inputSenha.value = ""; 
      alert("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar perfil");
    }
  });

  //  Fechar clicando fora do modal
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
      enderecos = data.addresses || [];
      renderizarEnderecos();
    } catch (error) {
      console.error("Erro ao carregar endereços:", error);
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

  const selecionado = JSON.parse(localStorage.getItem("enderecoSelecionado"));

  enderecos.forEach((end) => {
    const div = document.createElement("div");
    div.className =
      "endereco-card group bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 mb-4";

      div.innerHTML = `
      <div class="flex justify-between items-start mb-4">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
            <i class="uil uil-map-marker text-blue-600 text-lg"></i>
          </div>
          <div>
            <h3 class="font-semibold text-gray-800 text-lg">Endereço</h3>
            <p class="text-sm text-gray-500">${end.parish || ""} ${
        end.county ? "• " + end.county : ""
      }</p>
          </div>
        </div>
        <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button class="btnEditar p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-110" title="Editar">
            <i class="uil uil-edit text-lg"></i>
          </button>
          <button class="btnExcluir p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110" title="Excluir">
            <i class="uil uil-trash-alt text-lg"></i>
          </button>
        </div>
      </div>
      
      <div class="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-4"></div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
        <div class="space-y-2">
          <p><strong>Endereço:</strong> ${end.street || ""}</p>
          <p><strong>Número:</strong> ${end.number || ""}</p>
          <p><strong>Código Postal:</strong> ${end.zipcode || ""}</p>
          <p><strong>Freguesia:</strong> ${end.parish || ""}</p>
        </div>
        <div class="space-y-2">
          <p><strong>Concelho:</strong> ${end.county || ""}</p>
          <p><strong>Estado:</strong> ${end.state || ""}</p>
          <p><strong>País:</strong> ${end.country || ""}</p>
        </div>
      </div>

      <!-- Botão Usar no Pagamento -->
      <button class="btnUsarPagamento px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transform hover:scale-105 transition duration-200 shadow-md">
        <i class="uil uil-check-circle mr-2"></i> Usar no Pagamento
      </button>
    `;



      // === Editar ===
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

      // === Excluir ===
      div.querySelector(".btnExcluir").addEventListener("click", async () => {
        if (confirm("Deseja excluir este endereço?")) {
          try {
            await excluirEndereco(end.id);

            const enderecoSalvo = JSON.parse(
              localStorage.getItem("enderecoSelecionado")
            );
            if (enderecoSalvo && enderecoSalvo.id === end.id) {
              localStorage.removeItem("enderecoSelecionado");
            }

            await loadEnderecos();
            alert("Endereço excluído com sucesso!");
          } catch (error) {
            alert("Erro ao excluir endereço");
          }
        }
      });
    // === Usar no Pagamento ===
    div.querySelector(".btnUsarPagamento").addEventListener("click", (e) => {
  // Salva o endereço selecionado no localStorage
  localStorage.setItem("enderecoSelecionado", JSON.stringify(end));

  // Primeiro, reseta todos os botões "Usar no Pagamento"
  document.querySelectorAll(".btnUsarPagamento").forEach((btn) => {
    btn.innerHTML = `<i class="uil uil-check-circle mr-2"></i> Usar no Pagamento`;
    btn.disabled = false;
    btn.classList.remove("bg-green-500", "cursor-not-allowed");
    btn.classList.add("bg-green-600", "hover:bg-green-700");
  });

  //estiliza apenas o botão clicado
  const btn = e.currentTarget;
  btn.innerHTML = `<i class="uil uil-check-circle mr-2"></i> Endereço Selecionado`;
  btn.disabled = true;
  btn.classList.remove("bg-green-600", "hover:bg-green-700");
  btn.classList.add("bg-green-500", "cursor-not-allowed");
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
      } else {
        await salvarEndereco(novoEndereco);
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
        const res = await fetch("http://localhost:3000/user/photo-url", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ photoUrl: url }),
        });

        if (!res.ok) throw new Error("Erro ao atualizar foto");

        const data = await res.json();

        // Atualiza as imagens e evita cache antigo
        const newUrl = `${data.profilephoto}?t=${Date.now()}`;
        if (profileImageHeader) profileImageHeader.src = newUrl;
        if (profileImageMain) profileImageMain.src = newUrl;

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

  // logout

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
