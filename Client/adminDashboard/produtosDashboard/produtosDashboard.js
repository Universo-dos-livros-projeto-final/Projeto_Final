// Modo escuro / claro com armazenamento local
const body = document.querySelector("body"),
  modeToggle = body.querySelector(".mode-toggle"),
  sidebar = body.querySelector("nav"),
  sidebarToggle = body.querySelector(".sidebar-toggle");

// Recupera modo escuro salvo
let getMode = localStorage.getItem("mode");
if (getMode && getMode === "dark") {
  body.classList.add("dark");
}

// Recupera status da sidebar salvo
let getStatus = localStorage.getItem("status");
if (getStatus && getStatus === "close") {
  sidebar.classList.add("close");
}

// Toggle modo escuro
modeToggle.addEventListener("click", () => {
  body.classList.toggle("dark");
  localStorage.setItem(
    "mode",
    body.classList.contains("dark") ? "dark" : "light"
  );
});

// Toggle sidebar aberta/fechada
sidebarToggle.addEventListener("click", () => {
  sidebar.classList.toggle("close");
  localStorage.setItem(
    "status",
    sidebar.classList.contains("close") ? "close" : "open"
  );
});

// Abrir modal para adicionar novo livro (limpa campos)
function abrirModal() {
  const modal = document.getElementById("modal");
  modal.style.display = "flex";
  modal.dataset.editingId = ""; // limpa id de edição

  document.getElementById("modalTitulo").textContent = "Adicionar Livro";

  document.getElementById("imagemLivro").value = "";
  document.getElementById("nomeLivro").value = "";
  document.getElementById("autorLivro").value = "";
  document.getElementById("anoLivro").value = "";
  document.getElementById("genre").value = "";
  document.getElementById("isbn").value = "";
  document.getElementById("precoLivro").value = "";
  document.getElementById("descricaoLivro").value = "";
}

// Fechar modal
function fecharModal() {
  document.getElementById("modal").style.display = "none";
}

// Abrir modal para edição, preenchendo dados do livro
function abrirModalParaEditar(livro) {
  abrirModal();

  const modal = document.getElementById("modal");
  modal.dataset.editingId = livro.id;
  document.getElementById("modalTitulo").textContent = "Editar Livro";

  document.getElementById("imagemLivro").value = livro.bookphoto || "";
  document.getElementById("nomeLivro").value = livro.title;
  document.getElementById("autorLivro").value = livro.author;
  document.getElementById("anoLivro").value = livro.publicationYear || "";
  document.getElementById("genre").value = livro.genre || "";
  document.getElementById("isbn").value = livro.isbn || "";
  document.getElementById("precoLivro").value = livro.price;
  document.getElementById("descricaoLivro").value = livro.description || "";
}

// Salvar livro - cria ou atualiza dependendo do estado do modal
async function salvarLivro() {
  const token = Cookies.get("token");
  if (!token) {
    alert("Você precisa estar logado como administrador.");
    return;
  }

  const modal = document.getElementById("modal");
  const editingId = modal.dataset.editingId;

  const bookData = {
    title: document.getElementById("nomeLivro").value.trim(),
    author: document.getElementById("autorLivro").value.trim(),
    publicationYear: parseInt(document.getElementById("anoLivro").value.trim()),
    genre: document.getElementById("genre").value.trim(),
    isbn: document.getElementById("isbn").value.trim(),
    price: parseFloat(document.getElementById("precoLivro").value.trim()),
    description: document.getElementById("descricaoLivro").value.trim(),
    bookphoto: document.getElementById("imagemLivro").value.trim(),
  };

  if (
    !bookData.title ||
    !bookData.author ||
    !bookData.publicationYear ||
    !bookData.price ||
    !bookData.isbn
  ) {
    alert("Preencha todos os campos obrigatórios.");
    return;
  }

  try {
    let response;
    if (editingId) {
      // Atualizar livro
      response = await fetch(`http://localhost:3000/admin/book/${editingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookData),
      });
    } else {
      // Criar livro novo
      response = await fetch("http://localhost:3000/admin/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookData),
      });
    }

    const data = await response.json();

    if (response.ok) {
      alert(
        editingId
          ? "Livro atualizado com sucesso!"
          : "Livro adicionado com sucesso!"
      );
      fecharModal();
      delete modal.dataset.editingId;
      carregarLivros();
    } else {
      alert(`Erro: ${data.message || "Falha ao salvar livro."}`);
    }
  } catch (error) {
    console.error("Erro ao conectar com backend:", error);
    alert("Erro ao conectar com o servidor.");
  }
}

// Deletar livro pelo id
async function deletarLivro(id) {
  if (!confirm("Tem certeza que deseja deletar este livro?")) return;

  const token = Cookies.get("token");
  if (!token) {
    alert("Você precisa estar logado como administrador.");
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/admin/book/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      alert("Livro deletado com sucesso!");
      carregarLivros();
    } else {
      alert(`Erro: ${data.message || "Falha ao deletar livro."}`);
    }
  } catch (error) {
    console.error("Erro ao conectar com backend:", error);
    alert("Erro ao conectar com o servidor.");
  }
}

// Carregar lista de livros e renderizar cards dinamicamente
async function carregarLivros() {
  try {
    const res = await fetch("http://localhost:3000/books");
    const data = await res.json();

    const lista = document.getElementById("books-list");
    const template = document.getElementById("livro-template");

    lista.innerHTML = "";

    data.books.forEach((livro) => {
      const clone = template.content.cloneNode(true);

      const card = clone.querySelector(".swiper-slide.box");
      card.dataset.id = livro.id;

      clone.querySelector("img").src = livro.bookphoto || "/default.jpg";
      clone.querySelector("img").alt = livro.title;
      clone.querySelector(".livro-titulo").textContent = livro.title;
      clone.querySelector(".livro-autor").textContent = livro.author;
      clone.querySelector(".price").textContent = `€ ${livro.price.toFixed(2)}`;

      // Botões editar e deletar
      clone
        .querySelector(".btn-editar")
        .addEventListener("click", () => abrirModalParaEditar(livro));
      clone
        .querySelector(".btn-deletar")
        .addEventListener("click", () => deletarLivro(livro.id));

      lista.appendChild(clone);
    });
  } catch (error) {
    console.error("Erro ao carregar livros:", error);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  carregarLivros();
});
