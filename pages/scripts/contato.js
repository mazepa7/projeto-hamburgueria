const form = document.getElementById("formContato");

form.addEventListener("submit", function(event){

    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const mensagem = document.getElementById("mensagem").value.trim();

    const resultado = document.getElementById("resultado");

    if(nome === "" || email === "" || mensagem === ""){

        resultado.style.color = "red";
        resultado.textContent = "Preencha todos os campos.";

        return;

    }

    const contato = {
        nome,
        email,
        mensagem
    };

    localStorage.setItem("contato", JSON.stringify(contato));

    resultado.style.color = "green";
    resultado.textContent = "Mensagem enviada com sucesso!";

    form.reset();

    let contatos = JSON.parse(localStorage.getItem("contatos")) || [];

contatos.push(contato);

localStorage.setItem("contatos", JSON.stringify(contatos));
});