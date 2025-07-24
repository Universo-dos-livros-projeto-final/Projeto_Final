// ======= DARK MODE e SIDEBAR =======

// Seleciona elementos principais do layout
const body = document.querySelector("body"),
  modeToggle = body.querySelector(".mode-toggle"),
  sidebar = body.querySelector("nav"),
  sidebarToggle = body.querySelector(".sidebar-toggle");

// Aplica o modo escuro salvo no localStorage
let getMode = localStorage.getItem("mode");
if (getMode === "dark") {
  body.classList.add("dark");
}

// Aplica o status da sidebar salvo no localStorage
let getStatus = localStorage.getItem("status");
if (getStatus === "close") {
  sidebar.classList.add("close");
}

// Alterna o modo claro/escuro e salva no localStorage
modeToggle.addEventListener("click", () => {
  body.classList.toggle("dark");
  localStorage.setItem(
    "mode",
    body.classList.contains("dark") ? "dark" : "light"
  );
});

// Alterna o estado da sidebar (aberta/fechada) e salva
sidebarToggle.addEventListener("click", () => {
  sidebar.classList.toggle("close");
  localStorage.setItem(
    "status",
    sidebar.classList.contains("close") ? "close" : "open"
  );
});

// ======= CRUD FORNECEDORES  =======

let fornecedores = [];
let editandoFornecedorId = null;
document.addEventListener("DOMContentLoaded", buscarFornecedores);

// Abre modal e preenche campos se for edição
function abrirModalFornecedor(
  nome = "",
  endereco = "",
  telefone = "",
  id = null
) {
  document.getElementById("modal").style.display = "flex";
  document.getElementById("nomeFornecedor").value = nome;
  document.getElementById("enderecoFornecedor").value = endereco;
  document.getElementById("telefoneFornecedor").value = telefone;
  document.getElementById("modalTitulo").innerText = id
    ? "Editar Fornecedor"
    : "Adicionar Fornecedor";
  editandoFornecedorId = id;
}

// Fecha modal e limpa estados
function fecharModalFornecedor() {
  document.getElementById("modal").style.display = "none";
  document.getElementById("nomeFornecedor").value = "";
  document.getElementById("enderecoFornecedor").value = "";
  document.getElementById("telefoneFornecedor").value = "";
  editandoFornecedorId = null;
}

// Busca fornecedores no backend
async function buscarFornecedores() {
  const token = Cookies.get("token");
  try {
    const res = await fetch("http://localhost:3000/admin/suppliers", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Erro ao buscar fornecedores");
    const data = await res.json();
    fornecedores = data.suppliers;
    renderizarFornecedores();
  } catch (err) {
    console.error("Buscar fornecedores:", err);
  }
}

// Salva  ou atualiza fornecedor
async function salvarFornecedor() {
  const nome = document.getElementById("nomeFornecedor").value.trim();
  const endereco = document.getElementById("enderecoFornecedor").value.trim();
  const telefone = document.getElementById("telefoneFornecedor").value.trim();
  if (!nome || !endereco || !telefone) {
    alert("Preencha todos os campos obrigatórios.");
    return;
  }

  const payload = { name: nome, address: endereco, phone: telefone };
  const token = Cookies.get("token");
  const url = editandoFornecedorId
    ? `http://localhost:3000/admin/supplier/${editandoFornecedorId}`
    : "http://localhost:3000/admin/supplier";
  const method = editandoFornecedorId ? "PATCH" : "POST";

  try {
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Falha ao salvar fornecedor");
    fecharModalFornecedor();
    buscarFornecedores();
  } catch (err) {
    console.error("Salvar fornecedor:", err);
  }
}

// Solicita exclusão ao backend
async function excluirFornecedor(id) {
  if (!confirm("Deseja realmente excluir este fornecedor?")) return;
  const token = Cookies.get("token");
  try {
    const res = await fetch(`http://localhost:3000/admin/supplier/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Falha ao excluir fornecedor");
    buscarFornecedores();
  } catch (err) {
    console.error("Excluir fornecedor:", err);
  }
}

// Abre modal para edição
function editarFornecedor(id) {
  const f = fornecedores.find((s) => s.id === id);
  if (!f) return;
  abrirModalFornecedor(f.name, f.address, f.phone, f.id);
}

// Renderiza cards de fornecedores na tela
function renderizarFornecedores() {
  const lista = document.getElementById("supplierList");
  lista.innerHTML = "";

  fornecedores.forEach((f) => {
    const card = document.createElement("div");
    card.className = "supplier-card";
    card.innerHTML = `
    
    <div class="supplier-icon">
      <i class="uil uil-store"></i>
    </div>
    
    <h3 class="supplier-name">${f.name}</h3>
    
    <div class="supplier-info">
      <div class="info-item">
        <i class="uil uil-location-point"></i>
        <span>${f.address}</span>
      </div>
      <div class="info-item">
        <i class="uil uil-phone"></i>
        <span>${f.phone}</span>
      </div>
    </div>
    
    <div class="supplier-buttons">
      <button class="edit-btn" onclick="editarFornecedor('${f.id}')">
        <i class="uil uil-edit"></i>
        Editar
      </button>
      <button class="delete-btn" onclick="excluirFornecedor('${f.id}')">
        <i class="uil uil-trash"></i>
        Excluir
      </button>
    </div>
  `;
    lista.appendChild(card);
  });
}
