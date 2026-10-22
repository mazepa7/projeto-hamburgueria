const form = document.getElementById("formCadastro");

form.addEventListener("submit", function(event) {

    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();
    const confirmarSenha = document.getElementById("confirmarSenha").value.trim();

    const mensagem = document.getElementById("mensagem");


    // Limpa a mensagem anterior
    mensagem.textContent = "";


    // Verifica se todos os campos foram preenchidos
    if (
        nome === "" ||
        email === "" ||
        senha === "" ||
        confirmarSenha === ""
    ) {

        mensagem.style.color = "#D62828";
        mensagem.textContent = "Preencha todos os campos.";

        return;
    }


    // Verifica o tamanho do nome
    if (nome.length < 3) {

        mensagem.style.color = "#D62828";
        mensagem.textContent = "O nome deve ter pelo menos 3 caracteres.";

        return;
    }


    // Verifica o formato do email
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailValido.test(email)) {

        mensagem.style.color = "#D62828";
        mensagem.textContent = "Digite um email válido.";

        return;
    }


    // Verifica o tamanho da senha
    if (senha.length < 6) {

        mensagem.style.color = "#D62828";
        mensagem.textContent = "A senha deve ter pelo menos 6 caracteres.";

        return;
    }


    // Verifica se as senhas são iguais
    if (senha !== confirmarSenha) {

        mensagem.style.color = "#D62828";
        mensagem.textContent = "As senhas não coincidem.";

        return;
    }


    // Cadastro realizado
    mensagem.style.color = "#28a745";
    mensagem.textContent = "Cadastro realizado com sucesso!";


    // Limpa o formulário
    form.reset();

});