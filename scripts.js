
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
    for(let i=0;i<lista.length;i++){
        lista[i].children[1].classList.add("escondido");
    }
    membro.children[1].classList.remove("escondido");
}