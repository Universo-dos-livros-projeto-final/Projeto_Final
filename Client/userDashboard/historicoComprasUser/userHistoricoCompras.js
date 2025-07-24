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


//codigo que salva e ve se tem alguma imagem salva
document.addEventListener('DOMContentLoaded', () => {
  const btnUsarUrl = document.getElementById('btnUsarUrl');
  const modalOverlay = document.getElementById('modalUrlOverlay');
  const closeModalBtn = document.getElementById('closeModalUrlBtn');
  const btnSalvarUrl = document.getElementById('btnSalvarUrl');
  const inputUrl = document.getElementById('inputUrlImage');

  const profileImageHeader = document.getElementById('profileImageHeader');
  const profileImageMain = document.getElementById('profileImageMain');

  // verifica se tyem a imagem salva
  const savedUrl = localStorage.getItem('fotoPerfilUsuario');
  if (savedUrl) {
    if (profileImageHeader) profileImageHeader.src = savedUrl;
    if (profileImageMain) profileImageMain.src = savedUrl;
  }

  // Abrir modal
  btnUsarUrl.addEventListener('click', () => {
    modalOverlay.classList.remove('hidden');
  });

  // Fechar modal
  closeModalBtn.addEventListener('click', () => {
    modalOverlay.classList.add('hidden');
    inputUrl.value = '';
  });

  // Fechar modal 
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.classList.add('hidden');
      inputUrl.value = '';
    }
  });

  // Salvar novo link e atualizar ambas imagens
  btnSalvarUrl.addEventListener('click', () => {
    const url = inputUrl.value.trim();
    if (url) {
      // Atualiza imagens
      if (profileImageHeader) profileImageHeader.src = url;
      if (profileImageMain) profileImageMain.src = url;

      // Salva no local
      localStorage.setItem('fotoPerfilUsuario', url);

      // Fecha o modall
      modalOverlay.classList.add('hidden');
      inputUrl.value = '';
    } else {
      alert('Por favor, insira um link válido.');
    }
  });
});




  // Dados provisórios
  const salesHistory = [
    {
      id: "1",
      title: "O Senhor dos Anéis",
      author: "J.R.R. Tolkien",
      price: 120,
      soldAt: "2025-07-20",
      photo: "https://m.media-amazon.com/images/I/41RBd2DvmgL._SY445_SX342_ControlCacheEqualizer_.jpg"
    },
    {
      id: "2",
      title: "Dom Casmurro",
      author: "Machado de Assis",
      price: 45,
      soldAt: "2025-07-22",
      photo: "https://m.media-amazon.com/images/I/41AYWyc6qmL._SY445_SX342_ControlCacheEqualizer_.jpg"
    },
    {
      id: "3",
      title: "O Hobbit",
      author: "J.R.R. Tolkien",
      price: 80,
      soldAt: "2025-07-23",
      photo: "https://m.media-amazon.com/images/I/511+-lOOtsL._SY445_SX342_ControlCacheEqualizer_.jpg"
    },
     {
      id: "4",
      title: "Harry Potter e a Ordem da Fenix",
      author: "J.K Rowling",
      price: 45,
      soldAt: "2025-04-12",
      photo: "https://m.media-amazon.com/images/I/81nTLN-kz7L._SY425_.jpg"
    }
  ];

  // Ordenar por data (mais recente primeiro)
  salesHistory.sort((a, b) => new Date(b.soldAt) - new Date(a.soldAt));

  // Renderizar cards
 function renderCards(data) {
  const grid = document.getElementById('historyGrid');
  grid.innerHTML = "";

  data.forEach(sale => {
    const card = document.createElement('div');
    card.classList.add('history-card');
    card.innerHTML = `
      <div class="image-wrapper">
        <img src="${sale.photo}" alt="${sale.title}">
      </div>
      <h3>${sale.title}</h3>
      <p class="author">Autor: ${sale.author}</p>
      <p class="price">Preço: € ${sale.price.toFixed(2)}</p>
      <p class="date">Vendido em: ${new Date(sale.soldAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
    `;
    grid.appendChild(card);
  });
}

  // Filtrar por intervalo
  function filterByDate() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    const filtered = salesHistory.filter(sale => {
      const saleDate = new Date(sale.soldAt);
      if (startDate && saleDate < new Date(startDate)) return false;
      if (endDate && saleDate > new Date(endDate)) return false;
      return true;
    });

    renderCards(filtered);
  }

  // Eventos
  document.getElementById('filterBtn').addEventListener('click', filterByDate);
  document.getElementById('resetBtn').addEventListener('click', () => {
    document.getElementById('startDate').value = "";
    document.getElementById('endDate').value = "";
    renderCards(salesHistory);
  });

  // Inicial
  renderCards(salesHistory);