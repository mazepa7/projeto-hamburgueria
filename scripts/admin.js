const arquivoInput = document.getElementById("arquivo");
const mensagem = document.getElementById("mensagem");
const resultado = document.getElementById("resultado");
const nomeArquivo = document.getElementById("nomeArquivo");

const visualizacaoCsv = document.getElementById("visualizacaoCsv");
const visualizacaoTxt = document.getElementById("visualizacaoTxt");

const cabecalho = document.getElementById("cabecalho");
const corpoTabela = document.getElementById("corpoTabela");

let leituraAtual = 0;

arquivoInput.addEventListener("change", async function () {
    const numeroLeitura = ++leituraAtual;
    const arquivo = arquivoInput.files[0];

    limparVisualizacao();

    if (!arquivo) {
        mensagem.textContent = "Nenhum arquivo selecionado.";
        return;
    }

    const extensao = arquivo.name.split(".").pop().toLowerCase();

    if (extensao !== "csv" && extensao !== "txt") {
        mensagem.textContent = "Selecione um arquivo CSV ou TXT.";
        return;
    }

    if (arquivo.size > 2 * 1024 * 1024) {
        mensagem.textContent = "Selecione um arquivo de até 2 MB.";
        return;
    }

    mensagem.textContent = "Lendo arquivo...";

    try {
        // Lê o arquivo como texto e remove o BOM, se existir.
        const texto = (await arquivo.text()).replace(/^\uFEFF/, "");

        // Ignora uma leitura anterior se outro arquivo foi selecionado.
        if (numeroLeitura !== leituraAtual) {
            return;
        }

        if (!texto.trim()) {
            throw new Error("O arquivo está vazio.");
        }

        if (extensao === "csv") {
            mostrarCsv(texto);
        } else {
            visualizacaoTxt.textContent = texto;
            visualizacaoTxt.hidden = false;

            mensagem.textContent = "Arquivo TXT carregado com sucesso.";
        }

        nomeArquivo.textContent = arquivo.name;
        resultado.hidden = false;
    } catch (erro) {
        if (numeroLeitura !== leituraAtual) {
            return;
        }

        limparVisualizacao();
        mensagem.textContent = `Não foi possível importar: ${erro.message}`;
    }
});

function limparVisualizacao() {
    resultado.hidden = true;
    visualizacaoCsv.hidden = true;
    visualizacaoTxt.hidden = true;

    nomeArquivo.textContent = "";
    cabecalho.replaceChildren();
    corpoTabela.replaceChildren();
    visualizacaoTxt.textContent = "";
}

function mostrarCsv(texto) {
    // Testa os dois separadores e escolhe o que produzir
    // mais colunas no primeiro registro.
    const candidatos = [];

    for (const separador of [";", ","]) {
        try {
            candidatos.push(lerCsv(texto, separador));
        } catch {
            // A outra opção ainda pode ser válida.
        }
    }

    candidatos.sort((a, b) => b[0].length - a[0].length);

    if (candidatos.length === 0) {
        throw new Error("CSV inválido. Confira as aspas dos campos.");
    }

    const [colunas, ...registros] = candidatos[0];

    if (
        colunas.length < 2 ||
        colunas.some(coluna => !coluna.trim())
    ) {
        throw new Error("O CSV precisa de um cabeçalho com colunas.");
    }

    if (registros.some(linha => linha.length !== colunas.length)) {
        throw new Error(
            "Existem linhas com uma quantidade diferente de colunas."
        );
    }

    const linhaCabecalho = document.createElement("tr");

    colunas.forEach(coluna => {
        const th = document.createElement("th");
        th.scope = "col";
        th.textContent = coluna;
        linhaCabecalho.appendChild(th);
    });

    cabecalho.appendChild(linhaCabecalho);

    const fragmento = document.createDocumentFragment();

    registros.forEach(registro => {
        const tr = document.createElement("tr");

        registro.forEach(valor => {
            const td = document.createElement("td");
            td.textContent = valor;
            tr.appendChild(td);
        });

        fragmento.appendChild(tr);
    });

    corpoTabela.appendChild(fragmento);
    visualizacaoCsv.hidden = false;

    mensagem.textContent =
        `CSV carregado: ${registros.length} registro(s) ` +
        `e ${colunas.length} coluna(s).`;
}

// Lê campos separados por delimitadores, respeitando aspas,
// aspas duplicadas e quebras de linha dentro dos campos.
function lerCsv(texto, separador) {
    const linhas = [];

    let linha = [];
    let campo = "";
    let entreAspas = false;

    function terminarLinha() {
        linha.push(campo);

        if (linha.some(valor => valor.trim() !== "")) {
            linhas.push(linha);
        }

        linha = [];
        campo = "";
    }

    for (let i = 0; i < texto.length; i++) {
        const caractere = texto[i];

        if (caractere === '"') {
            if (entreAspas && texto[i + 1] === '"') {
                campo += '"';
                i++;
            } else {
                entreAspas = !entreAspas;
            }
        } else if (caractere === separador && !entreAspas) {
            linha.push(campo);
            campo = "";
        } else if (
            (caractere === "\n" || caractere === "\r") &&
            !entreAspas
        ) {
            if (caractere === "\r" && texto[i + 1] === "\n") {
                i++;
            }

            terminarLinha();
        } else {
            campo += caractere;
        }
    }

    if (entreAspas) {
        throw new Error("Existe um campo com aspas não fechadas.");
    }

    terminarLinha();

    if (linhas.length === 0) {
        throw new Error("O CSV está vazio.");
    }

    return linhas;
}