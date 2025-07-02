const body = document.querySelector("body"),
    modeToggle = body.querySelector(".mode-toggle");
    sidebar = body.querySelector("nav");
    sidebarToggle = body.querySelector(".sidebar-toggle");

let getMode = localStorage.getItem("mode");
if(getMode && getMode ==="dark"){
    body.classList.toggle("dark");
}

let getStatus = localStorage.getItem("status");
if(getStatus && getStatus ==="close"){
    sidebar.classList.toggle("close");
}

modeToggle.addEventListener("click", () => {
    body.classList.toggle("dark");
    if(body.classList.contains("dark")){
        localStorage.setItem("mode", "dark");
    }else{
        localStorage.setItem("mode", "light");
    }

});


sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("close");
    if(sidebar.classList.contains("close")){
        localStorage.setItem("status", "close");
    }else{
        localStorage.setItem("status", "open");
    }
})


// CRUD Fornecedores

let fornecedores = [];
let editandoFornecedorIndex = null;

function abrirModalFornecedor(nome = '', endereco = '', telefone = '', index = null) {
  document.getElementById('modal').style.display = 'flex';
  document.getElementById('nomeFornecedor').value = nome;
  document.getElementById('enderecoFornecedor').value = endereco;
  document.getElementById('telefoneFornecedor').value = telefone;
  document.getElementById('modalTitulo').innerText = index !== null ? 'Editar Fornecedor' : 'Adicionar Fornecedor';
  editandoFornecedorIndex = index;
}

function fecharModalFornecedor() {
  document.getElementById('modal').style.display = 'none';
  document.getElementById('nomeFornecedor').value = '';
  document.getElementById('enderecoFornecedor').value = '';
  document.getElementById('telefoneFornecedor').value = '';
  editandoFornecedorIndex = null;
}

function salvarFornecedor() {
  const nome = document.getElementById('nomeFornecedor').value.trim();
  const endereco = document.getElementById('enderecoFornecedor').value.trim();
  const telefone = document.getElementById('telefoneFornecedor').value.trim();

  if (!nome || !endereco || !telefone) {
    alert("Preencha todos os campos obrigatórios.");
    return;
  }

  const fornecedor = { nome, endereco, telefone };

  if (editandoFornecedorIndex !== null) {
    fornecedores[editandoFornecedorIndex] = fornecedor;
  } else {
    fornecedores.push(fornecedor);
  }

  fecharModalFornecedor();
  renderizarFornecedores();
}

function excluirFornecedor(index) {
  if (confirm("Deseja realmente excluir este fornecedor?")) {
    fornecedores.splice(index, 1);
    renderizarFornecedores();
  }
}

function editarFornecedor(index) {
  const fornecedor = fornecedores[index];
  abrirModalFornecedor(fornecedor.nome, fornecedor.endereco, fornecedor.telefone, index);
}

function renderizarFornecedores() {
  const lista = document.getElementById('supplierList');
  lista.innerHTML = '';

  fornecedores.forEach((fornecedor, index) => {
    const card = document.createElement('div');
    card.className = 'book-card';

    card.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 5px;">
        <div class="book-title">${fornecedor.nome}</div>
        <div>Endereço: ${fornecedor.endereco}</div>
        <div>Telefone: ${fornecedor.telefone}</div>
      </div>
      <div class="buttons">
        <button class="edit-btn" onclick="editarFornecedor(${index})">Editar</button>
        <button class="delete-btn" onclick="excluirFornecedor(${index})">Excluir</button>
      </div>
    `;

    lista.appendChild(card);
  });
}
