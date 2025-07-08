// Elementos DOM
const profileImage = document.getElementById("profileImage");
const uploadInput = document.getElementById("upload");

const firstnameInput = document.getElementById("firstnameInput");
const lastnameInput = document.getElementById("lastnameInput");
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const saveProfileBtn = document.getElementById("saveProfileBtn");
const nameDisplay = document.getElementById("nameDisplay");

const body = document.querySelector("body"),
  modeToggle = body.querySelector(".mode-toggle");
sidebar = body.querySelector("nav");
sidebarToggle = body.querySelector(".sidebar-toggle");

const token = Cookies.get("token");

// Carrega dados do usuário ao abrir a página
async function loadUserProfile() {
  if (!token) {
    alert("Você precisa estar logado.");
    window.location.href = "/paginaLogin/paginaLogin.html";
    return;
  }
  try {
    const res = await fetch("http://localhost:3000/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Erro ao carregar dados");

    const user = await res.json();

    profileImage.src = user.profilephoto || "user.jpg";
    firstnameInput.value = user.firstname || "";
    lastnameInput.value = user.lastname || "";
    emailInput.value = user.email || "";
    passwordInput.value = "";
    nameDisplay.textContent =
      `${user.firstname || ""} ${user.lastname || ""}`.trim() || "Usuário";
  } catch (error) {
    console.error(error);
    alert("Erro ao carregar perfil");
    nameDisplay.textContent = "Erro ao carregar";
  }
}

// Envia a foto atualizada para backend
async function uploadProfilePhoto(file) {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch("http://localhost:3000/user/photo", {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!res.ok) throw new Error("Erro ao atualizar foto");

    const data = await res.json();
    profileImage.src = data.profilephoto;
    alert("Foto atualizada com sucesso!");
  } catch (error) {
    console.error(error);
    alert("Erro ao atualizar foto");
  }
}

// Evento para trocar foto (abre seletor e envia)
uploadInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file && file.type.startsWith("image/")) {
    uploadProfilePhoto(file);
  } else {
    alert("Por favor, selecione uma imagem válida.");
  }
});

// Quando clicar na imagem, abre seletor de arquivo
profileImage.addEventListener("click", () => {
  uploadInput.click();
});

// Evento para salvar os dados do perfil (nome, email, senha)
saveProfileBtn.addEventListener("click", async () => {
  const dataToSend = {
    firstname: firstnameInput.value.trim(),
    lastname: lastnameInput.value.trim(),
    email: emailInput.value.trim(),
  };
  if (passwordInput.value.trim() !== "") {
    dataToSend.password = passwordInput.value.trim();
  }

  try {
    const res = await fetch("http://localhost:3000/user", {
      // rota correta
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dataToSend),
    });

    if (!res.ok) throw new Error("Erro ao salvar dados");

    alert("Perfil atualizado com sucesso!");
    passwordInput.value = "";

    nameDisplay.textContent =
      `${dataToSend.firstname} ${dataToSend.lastname}`.trim();
  } catch (error) {
    console.error(error);
    alert("Erro ao salvar perfil");
  }
});

//darkmode

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

// Inicializa ao carregar a página
document.addEventListener("DOMContentLoaded", loadUserProfile);
