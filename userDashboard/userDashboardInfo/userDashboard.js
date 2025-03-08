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








const fileInput = document.getElementById("upload");
const profileImage = document.getElementById("profileImage");
const imageLabel = document.getElementById("imageLabel");

// Evento para o clique no label (aciona o input de arquivo)
imageLabel.addEventListener("click", () => {
    fileInput.click();
});

// Quando o usuário escolhe uma imagem
fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = function (e) {
            profileImage.src = e.target.result;
            profileImage.style.display = "block";
        };
        reader.readAsDataURL(file);
    } else {
        alert("Por favor, selecione um arquivo de imagem válido!");
    }
});



const nameDisplay = document.getElementById("nameDisplay");
const nameInput = document.getElementById("nameInput");
const editNameBtn = document.getElementById("editNameBtn");

// Verifica se há um nome salvo e carrega
document.addEventListener("DOMContentLoaded", () => {
    const savedName = localStorage.getItem("username");
    if (savedName) {
        nameDisplay.textContent = savedName;
    }
});

editNameBtn.addEventListener("click", () => {
    if (nameDisplay.classList.contains("hidden")) {
        // Salvar nome
        const newName = nameInput.value.trim();
        if (newName) {
            nameDisplay.textContent = newName;
            localStorage.setItem("username", newName);
        }

        // Alternar visibilidade
        nameInput.classList.add("hidden");
        nameDisplay.classList.remove("hidden");
        editNameBtn.textContent = "Editar Nome";
    } else {
        // Tornar editável
        nameInput.value = nameDisplay.textContent;
        nameInput.classList.remove("hidden");
        nameDisplay.classList.add("hidden");
        editNameBtn.textContent = "Salvar";
    }
});

