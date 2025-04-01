const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");
const nameInput = document.getElementById("name-input");
const phoneInput = document.getElementById("phone-input");
const adjustmentsInput = document.getElementById("adjustments");
const orderConfirmation = document.getElementById("order-confirmation");

// Garante que o modal e confirmação começam ocultos
cartModal.style.display = "none";
orderConfirmation.classList.add("hidden");

let cart = [];

// Abre o carrinho
cartBtn.addEventListener("click", function () {
    updateCartModal();
    cartModal.style.display = "flex";
});

// Fecha o carrinho ao clicar fora
cartModal.addEventListener("click", function (event) {
    if (event.target === cartModal) {
        cartModal.style.display = "none";
    }
});

// Fecha o carrinho pelo botão
closeModalBtn.addEventListener("click", function () {
    cartModal.style.display = "none";
});

// Adiciona item ao carrinho
menu.addEventListener("click", function (event) {
    const parentButton = event.target.closest(".add-to-cart-btn");
    if (parentButton) {
        const name = parentButton.getAttribute("data-name");
        const price = parseFloat(parentButton.getAttribute("data-price"));
        addToCart(name, price);
    }
});

// Adiciona ao carrinho
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    updateCartModal();
}

// Atualiza carrinho
function updateCartModal() {
    cartItemContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col");
        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-medium">${item.name}</p>
                    <p>Qtd: ${item.quantity}</p>
                    <p class="font-medium mt-2">R$ ${item.price}</p>
                </div>
                <button class="remove-from-cart-btn cursor-pointer bg-orange-500 rounded text-white" data-name="${item.name}">
                    Remover
                </button>
            </div>
        `;
        total += item.price * item.quantity;
        cartItemContainer.appendChild(cartItemElement);
    });

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
    cartCounter.innerHTML = cart.length;
}

// Remover item do carrinho
cartItemContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-from-cart-btn")) {
        const name = event.target.getAttribute("data-name");
        removeItemCart(name);
    }
});

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);
    if (index !== -1) {
        const item = cart[index];
        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            cart.splice(index, 1);
        }
        updateCartModal();
    }
}

// Checkout
checkoutBtn.addEventListener("click", function () {
    if (cart.length === 0) return;

    if (nameInput.value === "" || phoneInput.value === "" || addressInput.value === "") {
        if (nameInput.value === "") nameWarn.classList.remove("hidden");
        if (phoneInput.value === "") phoneWarn.classList.remove("hidden");
        if (addressInput.value === "") addressWarn.classList.remove("hidden");
        return;
    }

    const name = nameInput.value;
    const phone = phoneInput.value;
    const address = addressInput.value;
    const adjustments = adjustmentsInput.value;


        const cartSummary = cart.map(item => {
        const quantity = item.quantity.toString().padStart(2, " ");
        const name = item.name.padEnd(25, " ");
        const price = `R$ ${(item.price * item.quantity).toFixed(2)}`.padStart(8, " ");
        return `${quantity}x ${name} ${price}`;
    }).join("\n");

const message =
`➡️Olá, você recebeu um novo pedido!➡️
---
🔴Nome do cliente: ${name}
🔴Contato: ${phone}
🔴Endereço: ${address}
🔴Alterações: ${adjustments || "Nenhuma"}
---
✔️Itens do pedido:
${cart.map(item =>
`${item.quantity.toString().padStart(2)}x ${item.name.padEnd(25)} R$ ${(item.price * item.quantity).toFixed(2)}`
).join("\n")}
---
✔️Total a pagar: ${cartTotal.textContent}

Obrigado por utilizar nosso serviço! 🚀`.trim();

    
    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = "5519971074263";
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodedMessage}`;
    
    window.location.href = whatsappUrl;
    

    // Esconde o carrinho, limpa os dados e exibe a mensagem de sucesso
    cartModal.style.display = "none";
    cart = [];
    updateCartModal();
    orderConfirmation.classList.remove("hidden");
    setTimeout(() => {
        orderConfirmation.classList.add("hidden");
    }, 3000);
});
