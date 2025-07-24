// Botão diminuir quantidade
quantityDecrease.addEventListener("click", async () => {
  let value = parseInt(quantityInput.value);
  if (value > 1) {
    const newValue = value - 1;
    quantityInput.value = newValue;

    const token = Cookies.get("token");
    if (token) {
      try {
        await cartModal.addToCart(bookId, -1); 
      } catch (error) {
        console.error("Erro ao remover 1 do carrinho:", error);
        quantityInput.value = value;
      }
    }
  }
});

// Botão aumentar quantidade
quantityIncrease.addEventListener("click", async () => {
  let value = parseInt(quantityInput.value);
  const newValue = value + 1;
  quantityInput.value = newValue;

  const token = Cookies.get("token");
  if (token) {
    try {
      await cartModal.addToCart(bookId, 1); 
    } catch (error) {
      console.error("Erro ao adicionar 1 ao carrinho:", error);
      quantityInput.value = value; // Reverter no erro
    }
  }
});