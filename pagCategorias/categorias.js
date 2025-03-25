/*=============== SEARCH ===============*/

const searchButton = document.getElementById('search-button'),
      searchClose = document.getElementById('search-close'),
      searchContent = document.getElementById('search-content');

//===== MENU SHOW =====//
/* Validate if constant exists */
if(searchButton){
    searchButton.addEventListener('click', () =>{
        searchContent.classList.add('show-search');
    });
}

//===== MENU HIDDEN =====//
/* Validate if constant exists */
if(searchClose){
    searchClose.addEventListener('click', () =>{
        searchContent.classList.remove('show-search');
    });
}


/*=============== LOGIN ===============*/


/*=============== ADD SHADOW HEADER ===============*/
const shadowHeader = () => {
    const header = document.getElementById('header');
    // When the scroll is greater than 50 viewport height, add class 's-header'
    this.scrollY >= 50 ? header.classList.add('shadow-header')
                       : header.classList.remove('shadow-header');
}

window.addEventListener('scroll', shadowHeader)

/*=============== HOME SWIPER ===============*/
let swiperHome = new Swiper('.home__swiper', {
    loop: true,
    spaceBetween: -24,
    grabCursor: true,
    slidesPerView: 'auto',
    centeredSlides: 'auto',

    autoplay:{
        delay:3000,
        disableOnInteraction:false,
    },

    breakpoints:{
        1220:{
            spaceBetween: -32,
        }
    }
})
    
/*=============== FEATURED SWIPER ===============*/
let swiperFeatured = new Swiper('.featured__swiper', {
    loop: true,
    spaceBetween: 16,
    grabCursor: true,
    slidesPerView: 'auto',
    centeredSlides: 'auto',

    navigation:{
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },

    breakpoints:{
        1150:{
            slidesPerView:4,
            centeredSlides:false,
        }
    }
})
   

/*=============== nao lembro pra que serve isso ===============*/

$(".wish-icon i").click(function(){
    $(this).toggleClass("fa-heart fa-heart-o");
});
	
/*=============== NEW SWIPER ===============*/
let swiperNew = new Swiper('.new__swiper', {
    loop: true,
    spaceBetween: 16,
    slidesPerView: 'auto',

    breakpoints:{
        1150:{
            slidesPerView:3,
           
        }
    }
})

/*=============== TESTIMONIAL SWIPER ===============*/


/*=============== SHOW SCROLL UP ===============*/ 


/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/


/*=============== DARK LIGHT THEME ===============*/ 
const themeButton = document.getElementById('theme-button')
const darkTheme ='dark-theme'
const iconTheme = 'ri-sun-line'

const selectedTheme = localStorage.getItem('selected-theme')
const selectedIcon = localStorage.getItem('selected-icon')

// Obtemos o tema atual que a interface tem validando a classe dark-theme
const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light';
const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'ri-moon-line' : 'ri-sun-line';

// Validamos se o usuário já escolheu um tema anteriormente
if (selectedTheme) {
    // Se a validação for preenchida, adiciona ou remove o tema baseado na escolha anterior
    document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme);
    themeButton.classList[selectedIcon === 'ri-moon-line' ? 'add' : 'remove'](iconTheme);
}

// Ativa ou desativa o tema manualmente com o botão
themeButton.addEventListener('click', () => {
    // Alterna entre dark/light e os ícones
    document.body.classList.toggle(darkTheme);
    themeButton.classList.toggle(iconTheme);
    
    // Salvamos o tema e o ícone atual escolhido pelo usuário
    localStorage.setItem('selected-theme', getCurrentTheme());
    localStorage.setItem('selected-icon', getCurrentIcon());
});










const filtros = {
    genero: [],
    preco: null,
    autor: null,
};

// Função para filtrar produtos
function filtrarProdutos() {
    const produtos = document.querySelectorAll('.produto');
    let produtosVisiveis = 0;

    produtos.forEach((produto) => {
        const genero = produto.dataset.genero;
        const preco = parseFloat(produto.dataset.preco);
        const autor = produto.dataset.autor;

        const generoValido = filtros.genero.length === 0 || filtros.genero.includes(genero);
        const precoValido = !filtros.preco || verificarPreco(preco, filtros.preco);
        const autorValido = !filtros.autor || filtros.autor === autor;

        if (generoValido && precoValido && autorValido) {
            produto.style.display = 'block';
            produtosVisiveis++;
        } else {
            produto.style.display = 'none';
        }
    });

    // Mostrar mensagem se não houver resultados
    const semResultados = document.querySelector('.sem-resultados');
    if (produtosVisiveis === 0) {
        semResultados.style.display = 'block';
    } else {
        semResultados.style.display = 'none';
    }

    // Atualizar resumo de filtros
    atualizarFiltrosAplicados();
}

// Função para verificar faixa de preço
function verificarPreco(preco, faixaPreco) {
    if (faixaPreco === '0-20') {
        return preco >= 0 && preco <= 20;
    } else if (faixaPreco === '20-50') {
        return preco > 20 && preco <= 50;
    } else if (faixaPreco === '50+') {
        return preco > 50;
    } else if (faixaPreco === '0-50+'){
        return preco >= 0 ;
    }
    return true;
}

// Função para atualizar resumo de filtros aplicados
function atualizarFiltrosAplicados() {
    const filtrosAtivos = document.getElementById('filtros-ativos');
    const filtrosAplicados = document.querySelector('.filtros-aplicados');
    
    // Limpar filtros atuais
    filtrosAtivos.innerHTML = '';
    
    // Adicionar gêneros selecionados
    if (filtros.genero.length > 0) {
        const generosList = document.createElement('p');
        generosList.innerHTML = `<strong>Gêneros:</strong> ${filtros.genero.join(', ')}`;
        filtrosAtivos.appendChild(generosList);
    }
    
    // Adicionar preço selecionado
    if (filtros.preco) {
        const precoInfo = document.createElement('p');
        let textoPreco = '';
        if (filtros.preco === '0-20') {
            textoPreco = '€ 0 - € 20';
        } else if (filtros.preco === '20-50') {
            textoPreco = '€ 20 - € 50';
        } else if (filtros.preco === '50+') {
            textoPreco = '€ 50+';
        }
        precoInfo.innerHTML = `<strong>Preço:</strong> ${textoPreco}`;
        filtrosAtivos.appendChild(precoInfo);
    }
    
    // Adicionar autor selecionado
    if (filtros.autor) {
        const autorInfo = document.createElement('p');
        autorInfo.innerHTML = `<strong>Autor:</strong> ${filtros.autor}`;
        filtrosAtivos.appendChild(autorInfo);
    }
    
    // Mostrar ou esconder resumo de filtros
    if (filtros.genero.length > 0 || filtros.preco || filtros.autor) {
        filtrosAplicados.style.display = 'block';
    } else {
        filtrosAplicados.style.display = 'none';
    }
}

// Event listeners para filtros de gênero
document.querySelectorAll('.filtro input[type="checkbox"]').forEach((checkbox) => {
    checkbox.addEventListener('change', (e) => {
        const genero = e.target.value;
        if (e.target.checked) {
            filtros.genero.push(genero);
        } else {
            const index = filtros.genero.indexOf(genero);
            if (index > -1) {
                filtros.genero.splice(index, 1);
            }
        }
        filtrarProdutos();
    });
});

// Event listeners para filtros de preço
document.querySelectorAll('.filtro input[type="radio"]').forEach((radio) => {
    radio.addEventListener('change', (e) => {
        filtros.preco = e.target.value;
        filtrarProdutos();
    });
});

// Event listener para filtro de autor
document.getElementById('autor').addEventListener('change', (e) => {
    filtros.autor = e.target.value;
    filtrarProdutos();
});

// Event listener para ordenação
document.getElementById('ordenar').addEventListener('change', (e) => {
    ordenarProdutos(e.target.value);
});

// Função para ordenar produtos
function ordenarProdutos(ordem) {
    const produtos = Array.from(document.querySelectorAll('.produto'));
    const produtosContainer = document.querySelector('.produtos');
    
    produtos.sort((a, b) => {
        if (ordem === 'titulo-asc' || ordem === 'titulo-desc') {
            const tituloA = a.querySelector('h2').textContent.toLowerCase();
            const tituloB = b.querySelector('h2').textContent.toLowerCase();
            
            return ordem === 'titulo-asc' 
                ? tituloA.localeCompare(tituloB) 
                : tituloB.localeCompare(tituloA);
        } else {
            const precoA = parseFloat(a.dataset.preco);
            const precoB = parseFloat(b.dataset.preco);
            
            return ordem === 'preco-asc' 
                ? precoA - precoB 
                : precoB - precoA;
        }
    });
    
    // Reordenar produtos no DOM
    const semResultados = document.querySelector('.sem-resultados');
    produtosContainer.appendChild(semResultados);
    produtos.forEach((produto) => produtosContainer.appendChild(produto));
}

// Limpar todos os filtros
document.getElementById('limpar-filtros').addEventListener('click', () => {
    // Limpar checkboxes
    document.querySelectorAll('.filtro input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Limpar radios
    document.querySelectorAll('.filtro input[type="radio"]').forEach(radio => {
        radio.checked = false;
    });
    
    // Resetar selects
    document.getElementById('autor').value = '';
    document.getElementById('ordenar').value = 'titulo-asc';
    
    // Limpar objeto de filtros
    filtros.genero = [];
    filtros.preco = null;
    filtros.autor = null;
    
    // Reordenar e filtrar
    ordenarProdutos('titulo-asc');
    filtrarProdutos();
});

// Adicionar funcionalidade aos botões de carrinho
document.querySelectorAll('.adicionar-carrinho').forEach(button => {
    button.addEventListener('click', function() {
        const produto = this.closest('.produto');
        const titulo = produto.querySelector('h2').textContent;
        alert(`"${titulo}" adicionado ao carrinho!`);
        this.textContent = "Adicionado ✓";
        this.style.backgroundColor = "#27ae60";
        
        // Resetar botão após 2 segundos
        setTimeout(() => {
            this.textContent = "Adicionar ao Carrinho";
            this.style.backgroundColor = "";
        }, 2000);
    });
});

// Inicializar ordenação
ordenarProdutos('titulo-asc');