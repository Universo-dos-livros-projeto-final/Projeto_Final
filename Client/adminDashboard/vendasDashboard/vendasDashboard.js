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

    // Função para corrigir resolução dos canvas
    function fixCanvasResolution(canvas) {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    return ctx;
    }

    // Dados fictícios
    const purchases = [
    {
        id: 1,
        user: { name: 'Idilly Camily' },
        book: { title: 'Harry Potter e o Calice de Fogo' },
        price: 39.90,
        quantity: 2,
        date: new Date('2025-07-17')
    },
    {
        id: 2,
        user: { name: 'Iury Gelber' },
        book: { title: 'Dom Casmurro' },
        price: 29.90,
        quantity: 1,
        date: new Date('2025-07-19')
    },
    {
        id: 3,
        user: { name: 'Leidiane Rosario' },
        book: { title: 'Orgulho e Preconceito' },
        price: 29.90,
        quantity: 1,
        date: new Date('2025-07-18')
    },
    {
        id: 4,
        user: { name: 'Nayra Lima' },
        book: { title: 'Pegasus' },
        price: 29.90,
        quantity: 1,
        date: new Date('2025-07-20')
    },
    {
        id: 5,
        user: { name: 'Idilly Camily' },
        book: { title: 'Jogos Vorazes' },
        price: 29.90,
        quantity: 1,
        date: new Date('2025-07-16')
    },
    {
        id: 6,
        user: { name: 'Jose Alberto' },
        book: { title: '1984' },
        price: 49.90,
        quantity: 3,
        date: new Date('2025-07-15')
    }
    ];


    // Preencher tabela
    const tableBody = document.getElementById('salesTableBody');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const loadLessBtn = document.getElementById('loadLessBtn');

    let currentIndex = 0;
    const itemsPerPage = 3;

    function formatEuro(value) {
    return value.toLocaleString('pt-PT', {
        style: 'currency',
        currency: 'EUR'
    });
    }

    function renderTableRows(start, end) {
    // Limpa a tabela
    tableBody.innerHTML = '';

    // Adiciona linhas do intervalo especificado
    const slice = purchases.slice(start, end);
    slice.forEach(p => {
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${p.id}</td>
        <td>${p.user.name}</td>
        <td>${p.book.title}</td>
        <td>${formatEuro(p.price)}</td>
        <td>${p.quantity}</td>
        <td>${p.date.toLocaleDateString()}</td>
        <td>${formatEuro(p.price * p.quantity)}</td>
        `;
        tableBody.appendChild(row);
    });
    }

    function loadTableRows() {
    currentIndex += itemsPerPage;
    renderTableRows(0, currentIndex);

    if (currentIndex >= purchases.length) {
        loadMoreBtn.style.display = 'none';
    }
    if (currentIndex > itemsPerPage) {
        loadLessBtn.style.display = 'inline-block';
    }
    }

    function loadLessRows() {
    currentIndex = itemsPerPage;
    renderTableRows(0, currentIndex);
    loadMoreBtn.style.display = 'inline-block';
    loadLessBtn.style.display = 'none';
    }

    // Inicial
    currentIndex = itemsPerPage;
    renderTableRows(0, currentIndex);

    loadMoreBtn.addEventListener('click', loadTableRows);
    loadLessBtn.addEventListener('click', loadLessRows);


    // Gráfico de vendas diárias
    const daily = {};
    purchases.forEach(p => {
    const date = p.date.toLocaleDateString();
    if (!daily[date]) {
        daily[date] = { quantity: 0, total: 0 };
    }
    daily[date].quantity += p.quantity;
    daily[date].total += p.price * p.quantity;
    });

    const chartLabels = Object.keys(daily);
    const chartQuantities = chartLabels.map(date => daily[date].quantity);
    const chartTotals = chartLabels.map(date => daily[date].total);

    // Gráfico 1: Vendas por dia
    const canvas1 = document.getElementById('salesChart');
    const ctx1 = fixCanvasResolution(canvas1);
    new Chart(ctx1, {
    type: 'bar',
    data: {
        labels: chartLabels,
        datasets: [{
        label: 'Quantidade Diária Vendida',
        data: chartQuantities,
        backgroundColor: '#6b85e6'
        }]
    },
    options: {
        responsive: true,
        scales: {
        y: { beginAtZero: true, ticks: { color: '#000' }},
        x: { ticks: { color: '#000' }}
        },
        plugins: {
        legend: { labels: { color: '#000' }},
        tooltip: {
            callbacks: {
            label: function(context) {
                const idx = context.dataIndex;
                return `Qtd: ${chartQuantities[idx]} | Total: € ${chartTotals[idx].toFixed(2)}`;
            }
            }
        }
        }
    }
    });


    // Gráfico 2: Vendas por mês
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const vendasMensais = {};
    meses.forEach(m => vendasMensais[m] = { quantity: 0, total: 0 });

    purchases.forEach(p => {
    const mes = meses[p.date.getMonth()];
    vendasMensais[mes].quantity += p.quantity;
    vendasMensais[mes].total += p.price * p.quantity;
    });

    const mesLabels = Object.keys(vendasMensais);
    const mesQuantities = mesLabels.map(m => vendasMensais[m].quantity);
    const mesTotals = mesLabels.map(m => vendasMensais[m].total);

    const canvas2 = document.getElementById('monthlySalesChart');
    const ctx2 = fixCanvasResolution(canvas2);
    new Chart(ctx2, {
    type: 'doughnut',
    data: {
        labels: mesLabels,
        datasets: [{
        label: 'Vendas Mensais',
        data: mesQuantities,
        backgroundColor: [
            '#6387ffff', '#36A2EB', '#2945a0ff', '#4454adff',
            '#221d72ff', '#126cf3ff', '#6a3ce7ff', '#6b7280',
            '#9ca3af', '#e5e7eb', '#facc15', '#fb923c'
        ]
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
        legend: { position: 'bottom' },
        tooltip: {
            callbacks: {
            label: function(context) {
                const idx = context.dataIndex;
                return `Qtd: ${mesQuantities[idx]} | Total: € ${mesTotals[idx].toFixed(2)}`;
            }
            }
        }
        }
    }
    });

