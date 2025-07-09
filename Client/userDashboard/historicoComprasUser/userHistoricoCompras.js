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



document.addEventListener('DOMContentLoaded', () => {
  const btnUsarUrl = document.getElementById('btnUsarUrl');
  const modalOverlay = document.getElementById('modalUrlOverlay');
  const closeModalBtn = document.getElementById('closeModalUrlBtn');
  const btnSalvarUrl = document.getElementById('btnSalvarUrl');
  const inputUrl = document.getElementById('inputUrlImage');

  const profileImageHeader = document.getElementById('profileImageHeader');
  const profileImageMain = document.getElementById('profileImageMain');

  // Ao carregar a página, verifica se há imagem salva
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

  // Fechar modal clicando fora
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

      // Salva localmente
      localStorage.setItem('fotoPerfilUsuario', url);

      // Fechar modal
      modalOverlay.classList.add('hidden');
      inputUrl.value = '';
    } else {
      alert('Por favor, insira um link válido.');
    }
  });
});
