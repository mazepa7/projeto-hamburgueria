// ========================================
// CARRINHO - BURGERHOUSE
// ========================================


// ========================================
// ELEMENTOS DO HTML
// ========================================

const listaCarrinho = document.getElementById("listaCarrinho");
const carrinhoVazio = document.getElementById("carrinhoVazio");
const resumoPedido = document.getElementById("resumoPedido");

const subtotalElemento = document.getElementById("subtotal");
const totalElemento = document.getElementById("totalCarrinho");

const contadorCarrinho = document.getElementById("contadorCarrinho");
const finalizarPedido = document.getElementById("finalizarPedido");


// ========================================
// PEGAR CARRINHO DO LOCALSTORAGE
// ========================================

let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];


// ========================================
// FORMATAR PREÇO
// ========================================

function formatarPreco(valor) {

    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

}


// ========================================
// SALVAR CARRINHO
// ========================================

function salvarCarrinho() {

    localStorage.setItem(
        "carrinho",
        JSON.stringify(carrinho)
    );

}


// ========================================
// ATUALIZAR CONTADOR
// ========================================

function atualizarContador() {

    let quantidadeTotal = 0;

    carrinho.forEach(produto => {

        quantidadeTotal += produto.quantidade;

    });

    contadorCarrinho.textContent = quantidadeTotal;

}


// ========================================
// MOSTRAR CARRINHO
// ========================================

function mostrarCarrinho() {

    // Limpa a lista antes de renderizar
    listaCarrinho.innerHTML = "";


    // Verifica se o carrinho está vazio
    if (carrinho.length === 0) {

        carrinhoVazio.style.display = "block";

        listaCarrinho.style.display = "none";

        resumoPedido.style.display = "none";

        atualizarContador();

        return;
    }


    // Se tiver produtos
    carrinhoVazio.style.display = "none";

    listaCarrinho.style.display = "flex";

    resumoPedido.style.display = "block";


    // Percorre os produtos
    carrinho.forEach((produto, index) => {

        // Cria o elemento do produto
        const item = document.createElement("div");

        item.classList.add("item-carrinho");


        // Calcula subtotal do produto
        const subtotalProduto =
            produto.preco * produto.quantidade;


        // HTML do produto
        item.innerHTML = `

            <img 
                src="${produto.imagem}" 
                alt="${produto.nome}"
            >

            <div class="info-produto">

                <h3>
                    ${produto.nome}
                </h3>

                <p>
                    ${formatarPreco(produto.preco)}
                </p>

            </div>


            <div class="quantidade">

                <button 
                    class="diminuir"
                    data-index="${index}"
                >
                    -
                </button>

                <span>
                    ${produto.quantidade}
                </span>

                <button 
                    class="aumentar"
                    data-index="${index}"
                >
                    +
                </button>

            </div>


            <strong>
                ${formatarPreco(subtotalProduto)}
            </strong>


            <button 
                class="remover"
                data-index="${index}"
                title="Remover produto"
            >
                🗑️
            </button>

        `;


        // Adiciona o item na lista
        listaCarrinho.appendChild(item);

    });


    // Atualiza os valores
    atualizarResumo();

    atualizarContador();

}


// ========================================
// ATUALIZAR RESUMO
// ========================================

function atualizarResumo() {

    let subtotal = 0;


    carrinho.forEach(produto => {

        subtotal +=
            produto.preco * produto.quantidade;

    });


    // Taxa atualmente é R$ 0,00
    const taxa = 0;

    const total = subtotal + taxa;


    // Atualiza HTML
    subtotalElemento.textContent =
        formatarPreco(subtotal);

    totalElemento.textContent =
        formatarPreco(total);

}


// ========================================
// AUMENTAR QUANTIDADE
// ========================================

function aumentarQuantidade(index) {

    carrinho[index].quantidade++;

    salvarCarrinho();

    mostrarCarrinho();

}


// ========================================
// DIMINUIR QUANTIDADE
// ========================================

function diminuirQuantidade(index) {

    // Diminui a quantidade
    carrinho[index].quantidade--;


    // Se chegar a zero, remove o produto
    if (carrinho[index].quantidade <= 0) {

        carrinho.splice(index, 1);

    }


    salvarCarrinho();

    mostrarCarrinho();

}


// ========================================
// REMOVER PRODUTO
// ========================================

function removerProduto(index) {

    const produto = carrinho[index];


    const confirmar = confirm(
        `Deseja remover "${produto.nome}" do carrinho?`
    );


    if (!confirmar) {
        return;
    }


    carrinho.splice(index, 1);

    salvarCarrinho();

    mostrarCarrinho();

}


// ========================================
// EVENTOS DOS BOTÕES
// ========================================

listaCarrinho.addEventListener("click", function(event) {

    const elemento = event.target;


    // Botão +
    if (elemento.classList.contains("aumentar")) {

        const index =
            Number(elemento.dataset.index);

        aumentarQuantidade(index);

    }


    // Botão -
    if (elemento.classList.contains("diminuir")) {

        const index =
            Number(elemento.dataset.index);

        diminuirQuantidade(index);

    }


    // Botão remover
    if (elemento.classList.contains("remover")) {

        const index =
            Number(elemento.dataset.index);

        removerProduto(index);

    }

});


// ========================================
// FINALIZAR PEDIDO
// ========================================

finalizarPedido.addEventListener("click", function() {

    if (carrinho.length === 0) {

        alert("Seu carrinho está vazio!");

        return;
    }


    let total = 0;

    carrinho.forEach(produto => {

        total +=
            produto.preco * produto.quantidade;

    });


    alert(
        "Pedido realizado com sucesso!\n\n" +
        "Total: " + formatarPreco(total)
    );


    // Limpa o carrinho
    carrinho = [];

    salvarCarrinho();

    mostrarCarrinho();

});


// ========================================
// INICIAR CARRINHO
// ========================================

mostrarCarrinho();