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


// parte adicionar produtos 

let livros = [];
    let editandoIndex = null;

function abrirModal(nome = '', autor = '', ano = '', imagem = '', preco = '', descricao = '', index = null) {
  document.getElementById('modal').style.display = 'flex';
  document.getElementById('nomeLivro').value = nome;
  document.getElementById('autorLivro').value = autor;
  document.getElementById('anoLivro').value = ano;
  document.getElementById('imagemLivro').value = imagem;
  document.getElementById('precoLivro').value = preco;
  document.getElementById('descricaoLivro').value = descricao;
  document.getElementById('modalTitulo').innerText = index !== null ? 'Editar Livro' : 'Adicionar Livro';
  editandoIndex = index;
}



function fecharModal() {
  document.getElementById('modal').style.display = 'none';
  document.getElementById('nomeLivro').value = '';
  document.getElementById('autorLivro').value = '';
  document.getElementById('anoLivro').value = '';
  document.getElementById('imagemLivro').value = '';
  document.getElementById('precoLivro').value = '';
  document.getElementById('descricaoLivro').value = '';
  editandoIndex = null;
}



function salvarLivro() {
  const nome = document.getElementById('nomeLivro').value.trim();
  const autor = document.getElementById('autorLivro').value.trim();
  const ano = document.getElementById('anoLivro').value.trim();
  const imagem = document.getElementById('imagemLivro').value.trim();
  const preco = document.getElementById('precoLivro').value.trim();
  const descricao = document.getElementById('descricaoLivro').value.trim();

  if (!nome || !autor || !ano || !preco) {
    alert("Preencha todos os campos obrigatórios.");
    return;
  }

  const livro = { nome, autor, ano, imagem, preco, descricao };

  if (editandoIndex !== null) {
    livros[editandoIndex] = livro;
  } else {
    livros.push(livro);
  }

  fecharModal();
  renderizarLivros();
}


    function excluirLivro(index) {
      if (confirm("Deseja realmente excluir este livro?")) {
        livros.splice(index, 1);
        renderizarLivros();
      }
    }

function editarLivro(index) {
  const livro = livros[index];
  abrirModal(livro.nome, livro.autor, livro.ano, livro.imagem, livro.preco, livro.descricao, index);
}


function renderizarLivros() {
  const lista = document.getElementById('bookList');
  lista.innerHTML = '';

  livros.forEach((livro, index) => {
    const card = document.createElement('div');
    card.className = 'book-card';

    card.innerHTML = `
      <div style="display: flex; gap: 15px; align-items: flex-start;">
        ${livro.imagem ? `<img src="${livro.imagem}" alt="Capa do livro" style="width: 60px; height: 90px; object-fit: cover; border-radius: 4px;">` : ''}
        <div>
          <div class="book-title">${livro.nome}</div>
          <div>Autor: ${livro.autor}</div>
          <div>Ano: ${livro.ano}</div>
          <div>Preço: €${parseFloat(livro.preco).toFixed(2)}</div>
          ${livro.descricao ? `<div style="margin-top: 5px; font-size: 0.9em; color: #555;">${livro.descricao}</div>` : ''}
        </div>
      </div>
      <div class="buttons">
        <button class="edit-btn" onclick="editarLivro(${index})">Editar</button>
        <button class="delete-btn" onclick="excluirLivro(${index})">Excluir</button>
      </div>
    `;

    lista.appendChild(card);
  });
}
