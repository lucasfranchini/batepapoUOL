function mostrar(itemescondido){
 document.querySelector(`.${itemescondido}`).classList.remove("escondido");
}
function esconder(tela){
    tela.parentNode.classList.add("escondido");
}