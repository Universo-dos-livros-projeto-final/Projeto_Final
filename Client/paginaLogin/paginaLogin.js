const container = document.querySelector(".container");
const bntSignIn = document.getElementById("bnt-sign-in");
const bntSignUp = document.getElementById("bnt-sign-up");

bntSignIn.addEventListener("click", () => {
  container.classList.remove("toggle");
});

bntSignUp.addEventListener("click", () => {
  container.classList.add("toggle");
});

// SIGN UP
function handleSubmitSignUp(e) {
  e.preventDefault();

  const firstname = document.getElementById("firstname").value.trim();
  const lastname = document.getElementById("lastname").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;
  const feedback = document.getElementById("signup-feedback");

  if (password !== confirmPassword) {
    feedback.textContent = "As senhas não coincidem.";
    return;
  }

  fetch("http://localhost:3000/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ firstname, lastname, email, password }),
  })
    .then((res) => res.json())
    .then((data) => {
      feedback.textContent = data.message;
      if (data.message === "User created successfully") {
        container.classList.remove("toggle"); // Volta pro login
      }
    })
    .catch((error) => {
      console.error(error);
      feedback.textContent = "Erro ao conectar com o servidor.";
    });

  document.getElementById("firstname").value = "";
  document.getElementById("lastname").value = "";
  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
  document.getElementById("confirm-password").value = "";
}

// LOGIN
function handleSubmitLogin(e) {
  e.preventDefault();

  const email = document.getElementById("user-email").value.trim();
  const password = document.getElementById("user-password").value;
  const isAdmin = document.getElementById("admin-check").checked;
  const feedback = document.getElementById("login-feedback");

  const url = isAdmin
    ? "http://localhost:3000/admin/login"
    : "http://localhost:3000/login";

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })
    .then(async (res) => {
      const data = await res.json();

      if (res.ok && data.token) {
        Cookies.set("token", data.token, { path: "/", sameSite: "Lax" });

        if (isAdmin) {
          window.location.href = "/adminDashboard/adminDashboard.html";
        } else {
          window.location.href = "/Client/paginaInicial/index.html";
        }
      } else {
        feedback.textContent = data.message || "Email ou senha inválidos.";
      }
    })
    .catch((error) => {
      console.error("Erro no login:", error);
      feedback.textContent = "Erro na conexão com o servidor.";
    });

  document.getElementById("user-email").value = "";
  document.getElementById("user-password").value = "";
  document.getElementById("admin-check").checked = false;
}

// DARK/LIGHT THEME
const themeButtons = document.querySelectorAll(".theme-button");
const darkTheme = "dark-theme";
const iconTheme = "ri-sun-line";
const selectedTheme = localStorage.getItem("selected-theme");
const selectedIcon = localStorage.getItem("selected-icon");

const getCurrentTheme = () =>
  document.body.classList.contains(darkTheme) ? "dark" : "light";
const getCurrentIcon = () =>
  themeButtons[0].classList.contains(iconTheme)
    ? "ri-moon-line"
    : "ri-sun-line";

if (selectedTheme) {
  document.body.classList.toggle(darkTheme, selectedTheme === "dark");
  themeButtons.forEach((button) => {
    button.classList.toggle(iconTheme, selectedIcon === "ri-sun-line");
  });
}

themeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    document.body.classList.toggle(darkTheme);
    themeButtons.forEach((button) => {
      button.classList.toggle(iconTheme);
    });

    localStorage.setItem("selected-theme", getCurrentTheme());
    localStorage.setItem("selected-icon", getCurrentIcon());
  });
});

// ✅ Proteção para páginas privadas (usar isso nos outros arquivos .html protegidos):
// if (!Cookies.get("token")) {
//   window.location.href = "/paginaLogin.html";
// }
