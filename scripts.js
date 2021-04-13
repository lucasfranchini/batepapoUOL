let enviarMensagem = {
    remetente: "Lucas",
    destinatario: "Todos",
    visibilidade: "Público"
}

descer();

function descer(){
    const tamanhoPagina = document.body.scrollHeight;
    window.scroll(0,tamanhoPagina);
    
}

function mostrarOuEsconderTela(tela){
    document.querySelector(`.${tela}`).classList.toggle("escondido");
}

function selecionarMembros(membro){
    const lista = membro.parentNode.children;
    if(membro.parentNode.classList.value === "membros"){
        enviarMensagem.destinatario = membro.children[0].innerText;
    }
    else{
        enviarMensagem.visibilidade = membro.children[0].innerText;
    }
    for(let i=0;i<lista.length;i++){
        lista[i].children[1].classList.add("escondido");
    }
    membro.children[1].classList.remove("escondido");
    const fraseinformativa = document.querySelector(".mensagem .esquerda span");
    fraseinformativa.innerHTML = `Enviando para ${enviarMensagem.destinatario} 
    (${enviarMensagem.visibilidade})
    `
}