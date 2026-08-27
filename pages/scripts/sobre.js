const numeros = document.querySelectorAll(".numero");

numeros.forEach(numero => {

    const final = Number(numero.dataset.final);
    let atual = 0;

    const incremento = Math.ceil(final / 100);

    const contador = setInterval(() => {

        atual += incremento;

        if(atual >= final){
            atual = final;
            clearInterval(contador);
        }

        numero.textContent = atual.toLocaleString("pt-BR");

    },20);

});