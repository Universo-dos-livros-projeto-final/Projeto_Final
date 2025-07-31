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




 // Script para os botões de bloquear/desbloquear
 document.querySelectorAll('.action-btn').forEach(button => {
    button.addEventListener('click', function() {
        const row = this.closest('tr');
        const statusCell = row.querySelector('.status-badge');
        
        if (this.classList.contains('btn-block')) {
            // Bloquear usuário
            statusCell.textContent = 'Bloqueado';
            statusCell.classList.remove('status-active');
            statusCell.classList.add('status-blocked');
            this.textContent = 'Desbloquear';
            this.classList.remove('btn-block');
            this.classList.add('btn-unblock');
        } else {
            // Desbloquear usuário
            statusCell.textContent = 'Ativo';
            statusCell.classList.remove('status-blocked');
            statusCell.classList.add('status-active');
            this.textContent = 'Bloquear';
            this.classList.remove('btn-unblock');
            this.classList.add('btn-block');
        }
    });
});

// Selecionar todos os checkboxes
document.getElementById('selectAll').addEventListener('change', function() {
    const checkboxes = document.querySelectorAll('tbody input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = this.checked;
    });
});























































