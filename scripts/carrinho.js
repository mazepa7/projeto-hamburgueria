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

// ========================================
// VIAS DO PEDIDO
// ========================================

const pedidoConcluido = document.getElementById("pedidoConcluido");
const identificacaoPedido = document.getElementById("identificacaoPedido");

const baixarTxt = document.getElementById("baixarTxt");
const baixarCsv = document.getElementById("baixarCsv");

let ultimoPedido = JSON.parse(
    localStorage.getItem("ultimoPedido")
) || null;


// Trabalha com centavos para calcular os valores
function calcularSubtotalCentavos(produto) {
    return Math.round(produto.preco * 100) * produto.quantidade;
}


// Exibe os botões do pedido salvo
function mostrarPedidoConcluido() {
    if (!ultimoPedido) {
        return;
    }

    identificacaoPedido.textContent =
        `Pedido ${ultimoPedido.id} — ` +
        new Date(ultimoPedido.data).toLocaleString("pt-BR");

    pedidoConcluido.hidden = false;
}


// Cria um arquivo e inicia seu download
function baixarArquivo(nome, conteudo, tipo) {
    const arquivo = new Blob([conteudo], {
        type: tipo
    });

    const url = URL.createObjectURL(arquivo);
    const link = document.createElement("a");

    link.href = url;
    link.download = nome;

    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => {
        URL.revokeObjectURL(url);
    }, 1000);
}


// ========================================
// GERAR TXT
// ========================================

function gerarTxt(pedido) {
    const linhas = [
        "BURGER HOUSE - VIA DO PEDIDO",
        "Comprovante sem valor fiscal",
        "",
        `Pedido: ${pedido.id}`,
        `Data: ${new Date(pedido.data).toLocaleString("pt-BR")}`,
        "",
        "ITENS DO PEDIDO",
        ""
    ];

    pedido.itens.forEach(produto => {
        const subtotal = calcularSubtotalCentavos(produto) / 100;

        linhas.push(
            `${produto.quantidade}x ${produto.nome}`,
            `Unitário: ${formatarPreco(produto.preco)}`,
            `Subtotal: ${formatarPreco(subtotal)}`,
            ""
        );
    });

    linhas.push(
        `Taxa: ${formatarPreco(pedido.taxaCentavos / 100)}`,
        `TOTAL: ${formatarPreco(pedido.totalCentavos / 100)}`,
        "",
        "Obrigado pelo pedido!"
    );

    return linhas.join("\r\n");
}


// ========================================
// GERAR CSV
// ========================================

// Protege os campos e trata aspas dentro do texto
function escaparCampoCsv(valor) {
    let texto = String(valor);

    // Evita que textos sejam interpretados como fórmulas
    if (/^\s*[=+\-@]/.test(texto)) {
        texto = "'" + texto;
    }

    return '"' + texto.replace(/"/g, '""') + '"';
}


function gerarCsv(pedido) {
    const data = new Date(pedido.data).toLocaleString("pt-BR");

    const linhas = [
        [
            "Pedido",
            "Data",
            "Produto",
            "Quantidade",
            "Preco_unitario",
            "Subtotal"
        ]
    ];

    pedido.itens.forEach(produto => {
        linhas.push([
            pedido.id,
            data,
            produto.nome,
            produto.quantidade,
            produto.preco.toFixed(2).replace(".", ","),
            (calcularSubtotalCentavos(produto) / 100)
                .toFixed(2)
                .replace(".", ",")
        ]);
    });

    linhas.push([
        pedido.id,
        data,
        "Taxa",
        "",
        "",
        (pedido.taxaCentavos / 100).toFixed(2).replace(".", ",")
    ]);

    linhas.push([
        pedido.id,
        data,
        "TOTAL DO PEDIDO",
        "",
        "",
        (pedido.totalCentavos / 100).toFixed(2).replace(".", ",")
    ]);

    const conteudo = linhas
        .map(linha => linha.map(escaparCampoCsv).join(";"))
        .join("\r\n");

    // BOM ajuda o Excel a reconhecer os acentos
    return "\uFEFF" + conteudo;
}


// ========================================
// BOTÕES DE DOWNLOAD
// ========================================

baixarTxt.addEventListener("click", function() {
    if (!ultimoPedido) {
        return;
    }

    baixarArquivo(
        `pedido-${ultimoPedido.id}.txt`,
        gerarTxt(ultimoPedido),
        "text/plain;charset=utf-8"
    );
});


baixarCsv.addEventListener("click", function() {
    if (!ultimoPedido) {
        return;
    }

    baixarArquivo(
        `pedido-${ultimoPedido.id}.csv`,
        gerarCsv(ultimoPedido),
        "text/csv;charset=utf-8"
    );
});


// ========================================
// FINALIZAR PEDIDO
// ========================================

finalizarPedido.addEventListener("click", function() {
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    const taxaCentavos = 0;

    const subtotalCentavos = carrinho.reduce(
        (soma, produto) =>
            soma + calcularSubtotalCentavos(produto),
        0
    );

    // Copia os itens antes de limpar o carrinho
    const pedido = {
        id: `BH-${Date.now()}`,
        data: new Date().toISOString(),
        itens: carrinho.map(produto => ({ ...produto })),
        taxaCentavos: taxaCentavos,
        totalCentavos: subtotalCentavos + taxaCentavos
    };

    // Só limpa o carrinho se conseguir salvar o pedido
    try {
        localStorage.setItem(
            "ultimoPedido",
            JSON.stringify(pedido)
        );
    } catch (erro) {
        alert("Não foi possível salvar o pedido. Tente novamente.");
        return;
    }

    ultimoPedido = pedido;

    carrinho = [];
    salvarCarrinho();
    mostrarCarrinho();

    mostrarPedidoConcluido();
});


// Recupera a via do último pedido ao abrir a página
mostrarPedidoConcluido();


// ========================================
// INICIAR CARRINHO
// ========================================

mostrarCarrinho();