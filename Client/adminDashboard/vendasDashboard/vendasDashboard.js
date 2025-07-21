// Seleciona elementos principais
const body = document.querySelector("body"),
  modeToggle = body.querySelector(".mode-toggle"),
  sidebar = body.querySelector("nav"),
  sidebarToggle = body.querySelector(".sidebar-toggle");

// Aplica modo salvo (claro/escuro)
let getMode = localStorage.getItem("mode");
if (getMode && getMode === "dark") body.classList.add("dark");

// Aplica status da sidebar salva (aberta/fechada)
let getStatus = localStorage.getItem("status");
if (getStatus && getStatus === "close") sidebar.classList.add("close");

// Alterna modo claro/escuro e salva preferência
modeToggle?.addEventListener("click", () => {
  body.classList.toggle("dark");
  localStorage.setItem(
    "mode",
    body.classList.contains("dark") ? "dark" : "light"
  );
});

// Alterna abrir/fechar sidebar e salva estado
sidebarToggle?.addEventListener("click", () => {
  sidebar.classList.toggle("close");
  localStorage.setItem(
    "status",
    sidebar.classList.contains("close") ? "close" : "open"
  );
});

// Corrige resolução do canvas para dispositivos com alta densidade de pixels
function fixCanvasResolution(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);
  return ctx;
}

// Variável global para armazenar os dados de vendas
let purchases = [];

const tableBody = document.getElementById("salesTableBody"),
  loadMoreBtn = document.getElementById("loadMoreBtn"),
  loadLessBtn = document.getElementById("loadLessBtn");

let currentIndex = 0;
const itemsPerPage = 3;

// Formata valores em Euro
function formatEuro(value) {
  return value.toLocaleString("pt-PT", { style: "currency", currency: "EUR" });
}

// Renderiza linhas na tabela
function renderTableRows(start, end) {
  tableBody.innerHTML = "";
  const slice = purchases.slice(start, end);
  slice.forEach((p) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${p.id}</td>
      <td>${p.user.name}</td>
      <td>${p.book.title}</td>
      <td>${formatEuro(p.price)}</td>
      <td>${p.quantity}</td>
      <td>${new Date(p.date).toLocaleDateString()}</td>
      <td>${formatEuro(p.price * p.quantity)}</td>
    `;
    tableBody.appendChild(row);
  });
}

// Carrega mais linhas
function loadTableRows() {
  currentIndex += itemsPerPage;
  renderTableRows(0, currentIndex);
  if (currentIndex >= purchases.length) loadMoreBtn.style.display = "none";
  if (currentIndex > itemsPerPage) loadLessBtn.style.display = "inline-block";
}

// Reduz para visualização inicial
function loadLessRows() {
  currentIndex = itemsPerPage;
  renderTableRows(0, currentIndex);
  loadMoreBtn.style.display = "inline-block";
  loadLessBtn.style.display = "none";
}

// Função para buscar dados do backend
async function fetchSalesData() {
  try {
    // Importante: pegar token do cookie (usa js-cookie)
    const token = Cookies.get("token");
    if (!token) {
      alert("Token não encontrado. Faça login novamente.");
      return [];
    }

    const response = await fetch(
      "http://localhost:3000/admin/dashboard/sales",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok)
      throw new Error("Falha ao carregar dados de vendas do backend.");

    const data = await response.json();

    // Mapeia dados para o formato esperado pelo frontend
    return data.map((p) => ({
      id: p.id,
      user: { name: p.customer || p.user?.name || "N/A" }, // ajuste conforme resposta do backend
      book: { title: p.book || p.bookTitle || "N/A" },
      price: p.price,
      quantity: p.quantity,
      date: p.date,
    }));
  } catch (error) {
    console.error(error);
    alert("Erro ao buscar dados do backend.");
    return [];
  }
}

// Renderiza gráfico de barras diário
function renderDailyChart() {
  if (purchases.length === 0) return;

  // Função para zerar horas da data
  function stripTime(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  // Função para formatar data dd/mm/yyyy fixo
  const formatter = new Intl.DateTimeFormat("pt-PT");

  // Pega menor e maior data zeradas
  const dates = purchases.map((p) => stripTime(new Date(p.date)));
  const minDate = new Date(Math.min(...dates));
  const maxDate = new Date(Math.max(...dates));

  // Gera array de datas zeradas do intervalo
  const allDates = [];
  for (let d = new Date(minDate); d <= maxDate; d.setDate(d.getDate() + 1)) {
    allDates.push(new Date(d));
  }

  // Inicializa o objeto daily com todas as datas zeradas
  const daily = {};
  allDates.forEach((d) => {
    const key = formatter.format(d);
    daily[key] = { quantity: 0, total: 0 };
  });

  // Soma vendas para cada data formatada
  purchases.forEach((p) => {
    const key = formatter.format(stripTime(new Date(p.date)));
    if (daily[key]) {
      daily[key].quantity += p.quantity;
      daily[key].total += p.price * p.quantity;
    }
  });

  // Prepara arrays para gráfico
  const chartLabels = Object.keys(daily);
  const chartQuantities = chartLabels.map((date) => daily[date].quantity);
  const chartTotals = chartLabels.map((date) => daily[date].total);

  // Renderiza gráfico
  const ctx1 = fixCanvasResolution(document.getElementById("salesChart"));
  new Chart(ctx1, {
    type: "bar",
    data: {
      labels: chartLabels,
      datasets: [
        {
          label: "Quantidade Diária Vendida",
          data: chartQuantities,
          backgroundColor: "#6b85e6",
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true, ticks: { color: "#000" } },
        x: {
          ticks: {
            color: "#000",
            maxRotation: 45,
            minRotation: 45,
            autoSkip: true,
            maxTicksLimit: 10,
          },
        },
      },
      plugins: {
        legend: { labels: { color: "#000" } },
        tooltip: {
          callbacks: {
            label: function (context) {
              const idx = context.dataIndex;
              return `Qtd: ${chartQuantities[idx]} | Total: € ${chartTotals[
                idx
              ].toFixed(2)}`;
            },
          },
        },
      },
    },
  });
}

// Renderiza gráfico doughnut mensal
function renderMonthlyChart() {
  const meses = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];
  const vendasMensais = {};
  meses.forEach((m) => (vendasMensais[m] = { quantity: 0, total: 0 }));

  purchases.forEach((p) => {
    const mes = meses[new Date(p.date).getMonth()];
    vendasMensais[mes].quantity += p.quantity;
    vendasMensais[mes].total += p.price * p.quantity;
  });

  const mesLabels = Object.keys(vendasMensais);
  const mesQuantities = mesLabels.map((m) => vendasMensais[m].quantity);
  const mesTotals = mesLabels.map((m) => vendasMensais[m].total);

  const ctx2 = fixCanvasResolution(
    document.getElementById("monthlySalesChart")
  );
  new Chart(ctx2, {
    type: "doughnut",
    data: {
      labels: mesLabels,
      datasets: [
        {
          label: "Vendas Mensais",
          data: mesQuantities,
          backgroundColor: [
            "#6387ffff",
            "#36A2EB",
            "#2945a0ff",
            "#4454adff",
            "#221d72ff",
            "#126cf3ff",
            "#6a3ce7ff",
            "#6b7280",
            "#9ca3af",
            "#e5e7eb",
            "#facc15",
            "#fb923c",
          ],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom" },
        tooltip: {
          callbacks: {
            label: function (context) {
              const idx = context.dataIndex;
              return `Qtd: ${mesQuantities[idx]} | Total: € ${mesTotals[
                idx
              ].toFixed(2)}`;
            },
          },
        },
      },
    },
  });
}

// Função inicial para carregar dados e renderizar tudo
async function initDashboard() {
  purchases = await fetchSalesData();
  if (purchases.length === 0) return;

  currentIndex = itemsPerPage;
  renderTableRows(0, currentIndex);

  // Remove event listeners anteriores para evitar duplicações
  loadMoreBtn.replaceWith(loadMoreBtn.cloneNode(true));
  loadLessBtn.replaceWith(loadLessBtn.cloneNode(true));

  // Seleciona novamente os botões após substituição
  const newLoadMoreBtn = document.getElementById("loadMoreBtn");
  const newLoadLessBtn = document.getElementById("loadLessBtn");

  newLoadMoreBtn.addEventListener("click", loadTableRows);
  newLoadLessBtn.addEventListener("click", loadLessRows);

  renderDailyChart();
  renderMonthlyChart();
}

// Inicializa dashboard
initDashboard();
