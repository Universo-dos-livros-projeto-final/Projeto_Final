document.addEventListener("DOMContentLoaded", function () {
    const favoritesToggle = document.querySelector('.favorites-toggle');
    const favoritesMenu = document.querySelector('.favorites-menu');
    const cartToggle = document.querySelector('.cart-toggle');
    const cartMenu = document.querySelector('.cart-menu');

    let favoriteItems = [];
    let cartItems = [];

    function toggleMenu(menu) {
        if (menu.classList.contains('show')) {
            menu.classList.remove('show');
        } else {
            closeAllMenus();
            menu.classList.add('show');
        }
    }

    function closeAllMenus() {
        favoritesMenu.classList.remove('show');
        cartMenu.classList.remove('show');
    }

    favoritesToggle.addEventListener('click', () => toggleMenu(favoritesMenu));
    cartToggle.addEventListener('click', () => toggleMenu(cartMenu));

    document.addEventListener('click', (e) => {
        if (!favoritesToggle.contains(e.target) && !favoritesMenu.contains(e.target) &&
            !cartToggle.contains(e.target) && !cartMenu.contains(e.target)) {
            closeAllMenus();
        }
    });

    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const addToFavoritesButtons = document.querySelectorAll('.add-to-favorites');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const product = button.closest('.product');
            const productName = product.querySelector('h3').textContent;
            const productImage = product.querySelector('img').src;
            const productPrice = parseFloat(product.querySelector('.price').textContent.replace('R$', '').replace(',', '.'));

            const existingProduct = cartItems.find(item => item.name === productName);
            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                cartItems.push({ name: productName, image: productImage, price: productPrice, quantity: 1 });
            }
            updateCartMenu();
            button.classList.add('added');
            setTimeout(() => {
                button.classList.remove('added');
            }, 500);
            alert(`${productName} foi adicionado ao carrinho!`);
        });
    });

    addToFavoritesButtons.forEach(button => {
        button.addEventListener('click', () => {
            const product = button.closest('.product');
            const productName = product.querySelector('h3').textContent;

            if (!favoriteItems.includes(productName)) {
                favoriteItems.push(productName);
                updateFavoritesMenu();
                button.classList.add('added');
                setTimeout(() => {
                    button.classList.remove('added');
                }, 500);
                alert(`${productName} foi adicionado aos favoritos!`);
            } else {
                alert(`${productName} já está nos favoritos.`);
            }
        });
    });

    function updateCartMenu() {
        cartMenu.innerHTML = '<h3>Carrinho</h3>';
        if (cartItems.length === 0) {
            cartMenu.innerHTML += '<p>Seu carrinho está vazio.</p>';
        } else {
            let total = 0;
            cartItems.forEach((item, index) => {
                cartMenu.innerHTML += `
                    <div class="cart-item" data-index="${index}">
                        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                        <div class="cart-item-details">
                            <p>${item.name}</p>
                            <p>R$${item.price.toFixed(2).replace('.', ',')}</p>
                            <div class="quantity-controls">
                                <button class="decrease-quantity">-</button>
                                <span>${item.quantity}</span>
                                <button class="increase-quantity">+</button>
                            </div>
                            <button class="remove-item"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>`;
                total += item.price * item.quantity;
            });
            cartMenu.innerHTML += `<p>Total: R$${total.toFixed(2).replace('.', ',')}</p>`;
            cartMenu.innerHTML += '<button class="checkout-button">Ir para Pagamento</button>';
        }
        cartToggle.setAttribute('data-count', cartItems.length);

        // Adicionar eventos aos novos botões de remover e ajustar quantidade
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.closest('.cart-item').dataset.index;
                cartItems.splice(index, 1);
                updateCartMenu();
            });
        });
        document.querySelectorAll('.decrease-quantity').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.closest('.cart-item').dataset.index;
                if (cartItems[index].quantity > 1) {
                    cartItems[index].quantity -= 1;
                } else {
                    cartItems.splice(index, 1);
                }
                updateCartMenu();
            });
        });
        document.querySelectorAll('.increase-quantity').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.closest('.cart-item').dataset.index;
                cartItems[index].quantity += 1;
                updateCartMenu();
            });
        });
    }

    function updateFavoritesMenu() {
        favoritesMenu.innerHTML = '<h3>Favoritos</h3>';
        if (favoriteItems.length === 0) {
            favoritesMenu.innerHTML += '<p>Você não tem itens favoritos.</p>';
        } else {
            favoriteItems.forEach(item => {
                favoritesMenu.innerHTML += `<a href="#">${item}</a>`;
            });
        }
    }

    document.querySelector('.cart-menu').addEventListener('click', function (e) {
        if (e.target.classList.contains('checkout-button')) {
            window.location.href = 'pagina_de_pagamento.html';
        }
    });
});
