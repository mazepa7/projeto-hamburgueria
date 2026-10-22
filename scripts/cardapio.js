// ========================================
// CARRINHO - BURGUER HOUSE
// ========================================

// Pega o carrinho salvo no navegador
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];


// ========================================
// ADICIONAR PRODUTO AO CARRINHO
// ========================================

function adicionarAoCarrinho(nome, preco, imagem) {

    // Procura se o produto já existe no carrinho
    const produtoExistente = carrinho.find(
        produto => produto.nome === nome
    );

    if (produtoExistente) {

        // Se já existe, aumenta a quantidade
        produtoExistente.quantidade++;

    } else {

        // Se não existe, adiciona um novo produto
        carrinho.push({
            nome: nome,
            preco: preco,
            imagem: imagem,
            quantidade: 1
        });

    }

    // Salva o carrinho novamente
    localStorage.setItem(
        "carrinho",
        JSON.stringify(carrinho)
    );

    alert(nome + " foi adicionado ao carrinho!");
}


// ========================================
// PEGAR TODOS OS PRODUTOS
// ========================================

const botoes = document.querySelectorAll(
    ".card-produto button"
);


// ========================================
// CONFIGURAR OS BOTÕES
// ========================================

botoes.forEach((botao) => {

    botao.addEventListener("click", function () {

        // Encontra o card onde o botão está
        const card = this.closest(".card-produto");

        // Pega as informações do produto
        const nome = card.querySelector("h3").textContent;

        const precoTexto = card
            .querySelector(".preco")
            .textContent
            .replace("R$", "")
            .replace(",", ".")
            .trim();

        const preco = parseFloat(precoTexto);

        const imagem = card
            .querySelector("img")
            .getAttribute("src");


        // Adiciona ao carrinho
        adicionarAoCarrinho(
            nome,
            preco,
            imagem
        );

    });

});