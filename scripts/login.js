const form = document.getElementById("formLogin");

form.addEventListener("submit", function(event) {

    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();

    const mensagem = document.getElementById("mensagem");

    // Verifica se os campos estão vazios
    if (email === "" || senha === "") {

        mensagem.style.color = "red";
        mensagem.textContent = "Preencha todos os campos.";

        return;
    }

    // Login correto
    if (email === "abobrinha@gmail.com" && senha === "1234") {

        mensagem.style.color = "green";
        mensagem.textContent = "Login realizado com sucesso!";

        // Salva o email no navegador
        localStorage.setItem("email", email);

        // Redireciona para a página principal
        window.location.href = "index.html";

        return;
    }

    // Login incorreto
    mensagem.style.color = "red";
    mensagem.textContent = "Email ou senha incorretos.";

});