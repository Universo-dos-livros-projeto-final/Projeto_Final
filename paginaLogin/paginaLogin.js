const container = document.querySelector(".container");
const bntSignIn = document.getElementById("bnt-sign-in");
const bntSignUp = document.getElementById("bnt-sign-up");

bntSignIn.addEventListener("click", ()=>{
    container.classList.remove("toggle");
}); 

bntSignUp.addEventListener("click", ()=>{
    container.classList.add("toggle");
});


// sign up code by: Namorado da Nayra
function handleSubmitSignUp(e) {
    e.preventDefault();

    fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstname, lastname, email, username, password })
    })
    .then((response) => {
        console.log(response);
        return response.json();
    })
    .then((data) => {
        console.log(data);
        if (data.message === 'User created sucessfully') {
            navigate('/login');
        }
    })
    .catch((error) => {
        console.error(error);
    });

    setfirstname('');
    setlastname('');
    setEmail('');
    setUsername('');
    setPassword('');
    setIsDisabled(true);
}

// Sign In code by: Namorado da Nayra
function handleSubmitLogin(e) {
    e.preventDefault();

    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
    })
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
        if (data.message === 'User logged in successfully') {
            const token = data.token;
            const cookies = new Cookies();
            // Store token in cookies
            cookies.set('token', token, { path: '/' });
            navigate('/home');
        }
    })
    .catch((error) => console.error(error));

    setUsername('');
    setPassword('');
    setIsDisabled(true);
}

/*=============== DARK LIGHT THEME ===============*/
const themeButtons = document.querySelectorAll('.theme-button');
const darkTheme = 'dark-theme';
const iconTheme = 'ri-sun-line';

// Obter o tema e ícone previamente selecionados
const selectedTheme = localStorage.getItem('selected-theme');
const selectedIcon = localStorage.getItem('selected-icon');

// Validar o tema atual
const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light';
const getCurrentIcon = () => themeButtons[0].classList.contains(iconTheme) ? 'ri-moon-line' : 'ri-sun-line';

// Aplicar o tema anteriormente selecionado (se existir)
if (selectedTheme) {
    document.body.classList.toggle(darkTheme, selectedTheme === 'dark');
    themeButtons.forEach(button => {
        button.classList.toggle(iconTheme, selectedIcon === 'ri-sun-line');
    });
}

// Alternar tema ao clicar no botão
themeButtons.forEach(button => {
    button.addEventListener('click', () => {
        document.body.classList.toggle(darkTheme);
        themeButtons.forEach(button => {
            button.classList.toggle(iconTheme);
        });

        // Salvar o tema e ícone escolhidos no localStorage
        localStorage.setItem('selected-theme', getCurrentTheme());
        localStorage.setItem('selected-icon', getCurrentIcon());
    });
});