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
  const openBtn = document.getElementById('openModalBtn');
  const closeBtn = document.getElementById('closeModalBtn');
  const modalOverlay = document.getElementById('modalOverlay');
  const form = document.getElementById('formEditar');

  const displayNome = document.getElementById('displayNome');
  const displaySobrenome = document.getElementById('displaySobrenome');
  const displayEmail = document.getElementById('displayEmail');
  const displayTelefone = document.getElementById('displayTelefone');

  const inputNome = document.getElementById('inputNome');
  const inputSobrenome = document.getElementById('inputSobrenome');
  const inputEmail = document.getElementById('inputEmail');
  const inputTelefone = document.getElementById('inputTelefone');

  // 🚀 1) Carrega do localStorage ao abrir a página
  displayNome.innerText = localStorage.getItem('nome') || '';
  displaySobrenome.innerText = localStorage.getItem('sobrenome') || '';
  displayEmail.innerText = localStorage.getItem('email') || '';
  displayTelefone.innerText = localStorage.getItem('telefone') || '';

  // 🗂️ Abrir modal
  openBtn.addEventListener('click', () => {
    inputNome.value = displayNome.innerText;
    inputSobrenome.value = displaySobrenome.innerText;
    inputEmail.value = displayEmail.innerText;
    inputTelefone.value = displayTelefone.innerText;

    modalOverlay.classList.remove('hidden');
  });

  //  Fechar modal
  closeBtn.addEventListener('click', () => {
    modalOverlay.classList.add('hidden');
  });

  //  Salvar dados + localStorage
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    displayNome.innerText = inputNome.value;
    displaySobrenome.innerText = inputSobrenome.value;
    displayEmail.innerText = inputEmail.value;
    displayTelefone.innerText = inputTelefone.value;

    // Salva no localStorage 
    localStorage.setItem('nome', inputNome.value);
    localStorage.setItem('sobrenome', inputSobrenome.value);
    localStorage.setItem('email', inputEmail.value);
    localStorage.setItem('telefone', inputTelefone.value);

    modalOverlay.classList.add('hidden');

    // Aqui você pode chamar sua API com fetch se quiser salvar no banco depois!
  });

  // 🖱️ Fechar clicando fora do modal
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.classList.add('hidden');
    }
  });
});


document.addEventListener('DOMContentLoaded', () => {
  let enderecos = JSON.parse(localStorage.getItem('enderecos')) || [];
  let editandoId = null;

  const modal = document.getElementById('modalEnderecoOverlay');
  const btnNovo = document.getElementById('btnNovoEndereco');
  const btnFechar = document.getElementById('closeModalEnderecoBtn');
  const form = document.getElementById('formEndereco');
  const container = document.getElementById('enderecosContainer');
  const modalTitulo = document.getElementById('modalEnderecoTitulo');

  function salvarEnderecos() {
    localStorage.setItem('enderecos', JSON.stringify(enderecos));
  }

  function abrirModal() {
    modal.classList.remove('hidden');
  }
  function fecharModal() {
    modal.classList.add('hidden');
    form.reset();
    editandoId = null;
  }

  btnNovo.addEventListener('click', () => {
    modalTitulo.textContent = 'Novo Endereço';
    abrirModal();
  });
  btnFechar.addEventListener('click', fecharModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) fecharModal();
  });

  function renderizarEnderecos() {
    container.innerHTML = '';
    enderecos.forEach((end, index) => {
      const div = document.createElement('div');
      div.className = 'border p-2 rounded shadow flex justify-between items-start';
      div.innerHTML = `
        <div>
          <p><strong>Endereço:</strong> ${end.endereco1}</p>
          <p><strong>Número:</strong> ${end.numero}</p>
          <p><strong>Código Postal:</strong> ${end.codigoPostal}</p>
          <p><strong>Freguesia:</strong> ${end.freguesia}</p>
          <p><strong>Concelho:</strong> ${end.concelho}</p>
          <p><strong>Estado:</strong> ${end.estado}</p>
          <p><strong>País:</strong> ${end.pais}</p>
        </div>
        <div class="space-y-2">
          <button class="btnEditar px-3 py-1 bg-yellow-500 text-white rounded">Editar</button>
          <button class="btnExcluir px-3 py-1 bg-red-600 text-white rounded">Excluir</button>
        </div>
      `;

      div.querySelector('.btnEditar').addEventListener('click', () => {
        modalTitulo.textContent = 'Editar Endereço';
        editandoId = index;
        document.getElementById('inputEndereco1').value = end.endereco1;
        document.getElementById('inputNumero').value = end.numero;
        document.getElementById('inputCodigoPostal').value = end.codigoPostal;
        document.getElementById('inputFreguesia').value = end.freguesia;
        document.getElementById('inputConcelho').value = end.concelho;
        document.getElementById('inputEstado').value = end.estado;
        document.getElementById('inputPais').value = end.pais;
        abrirModal();
      });

      div.querySelector('.btnExcluir').addEventListener('click', () => {
        if (confirm('Deseja excluir este endereço?')) {
          enderecos.splice(index, 1);
          salvarEnderecos();
          renderizarEnderecos();
        }
      });

      container.appendChild(div);
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const novoEndereco = {
      endereco1: document.getElementById('inputEndereco1').value,
      numero: document.getElementById('inputNumero').value,
      codigoPostal: document.getElementById('inputCodigoPostal').value,
      freguesia: document.getElementById('inputFreguesia').value,
      concelho: document.getElementById('inputConcelho').value,
      estado: document.getElementById('inputEstado').value,
      pais: document.getElementById('inputPais').value,
    };

    if (editandoId !== null) {
      enderecos[editandoId] = novoEndereco;
    } else {
      enderecos.push(novoEndereco);
    }

    salvarEnderecos();
    renderizarEnderecos();
    fecharModal();
  });

  renderizarEnderecos();
});


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
