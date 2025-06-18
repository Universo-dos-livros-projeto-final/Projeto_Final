const container = document.querySelector(".container");
const bntSignIn = document.getElementById("bnt-sign-in");
const bntSignUp = document.getElementById("bnt-sign-up");

bntSignIn.addEventListener("click", () => {
  container.classList.remove("toggle");
});

bntSignUp.addEventListener("click", () => {
  container.classList.add("toggle");
});

// sign up code -> REGISTRO
function handleSubmitSignUp(e) {
  e.preventDefault();

  const firstname = document.getElementById("firstname").value.trim();
  const lastname = document.getElementById("lastname").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  if (password !== confirmPassword) {
    alert("As senhas não coincidem.");
    return;
  }

  fetch("http://localhost:3000/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ firstname, lastname, email, password }),
  })
    .then((response) => {
      console.log(response);
      return response.json();
    })
    .then((data) => {
      console.log(data);
      if (data.message === "User created successfully") {
        navigate("/login");
      }
    })
    .catch((error) => {
      console.error(error);
    });

  document.getElementById("firstname").value = "";
  document.getElementById("lastname").value = "";
  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
  document.getElementById("confirm-password").value = "";
}

// Sign In code -> LOGIN
function handleSubmitLogin(e) {
  e.preventDefault();

  const email = document.getElementById("user-email").value.trim();
  const password = document.getElementById("user-password").value;

  fetch("http://localhost:3000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })
    .then(async (res) => {
      const data = await res.json();

      if (res.ok && data.token && data.user && data.user.categoria) {
        Cookies.set("token", data.token, { path: "/" });

        if (data.user.categoria === "admin") {
          window.location.href = "/admin/dashboard.html";
        } else {
          window.location.href = "/home.html";
        }
      } else {
        alert(data.message || "Email ou senha inválidos.");
      }
    })
    .catch((error) => console.error("Erro no login:", error));

  document.getElementById("user-email").value = "";
  document.getElementById("user-password").value = "";
}

/*=============== DARK LIGHT THEME ===============*/
const themeButtons = document.querySelectorAll(".theme-button");
const darkTheme = "dark-theme";
const iconTheme = "ri-sun-line";

// Obter o tema e ícone previamente selecionados
const selectedTheme = localStorage.getItem("selected-theme");
const selectedIcon = localStorage.getItem("selected-icon");

// Validar o tema atual
const getCurrentTheme = () =>
  document.body.classList.contains(darkTheme) ? "dark" : "light";
const getCurrentIcon = () =>
  themeButtons[0].classList.contains(iconTheme)
    ? "ri-moon-line"
    : "ri-sun-line";

// Aplicar o tema anteriormente selecionado (se existir)
if (selectedTheme) {
  document.body.classList.toggle(darkTheme, selectedTheme === "dark");
  themeButtons.forEach((button) => {
    button.classList.toggle(iconTheme, selectedIcon === "ri-sun-line");
  });
}

// Alternar tema ao clicar no botão
themeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    document.body.classList.toggle(darkTheme);
    themeButtons.forEach((button) => {
      button.classList.toggle(iconTheme);
    });

    // Salvar o tema e ícone escolhidos no localStorage
    localStorage.setItem("selected-theme", getCurrentTheme());
    localStorage.setItem("selected-icon", getCurrentIcon());
  });
});
