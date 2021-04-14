let usuario = {name: ""};
let mensagemEnviada = {
    from: "",
    to: "Todos",
    text: "",
    type: "message"
}
const inputUsuario = document.querySelector(".usuario input");

inputUsuario.addEventListener("keyup",entrarUsuario);
descer();

function entrarUsuario(event){
    if(event.keyCode === 13){
        perguntarUsuario();
    }
}

function perguntarUsuario (){
    usuario.name = document.querySelector(".tela-entrada input").value;
    const telaCarregamento = document.querySelector(".carregando");
    telaCarregamento.classList.remove("escondido");
    inputUsuario.parentNode.classList.add("escondido");
    const promessa = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants",usuario);
    promessa.then(carregarPagina);
    promessa.catch(usuarioErrado);
}

function carregarPagina(){
    document.querySelector(".tela-entrada").classList.add("escondido");
    mensagemEnviada.from = usuario.name;
    setInterval(statusOnline,5000);
}

function statusOnline (){
    const promessa = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/status",usuario);
    promessa.catch(recarregarPagina);
}

function recarregarPagina(){
    window.location.reload();
}

function usuarioErrado(){
    alert("esse usuario ja esta em uso, tente outro");
    const telaCarregamento = document.querySelector(".carregando");
    telaCarregamento.classList.add("escondido");
    inputUsuario.parentNode.classList.remove("escondido");
}

function descer(){
    const tamanhoPagina = document.body.scrollHeight;
    window.scroll(0,tamanhoPagina);
}

function mostrarOuEsconderTela(tela){
    document.querySelector(`.${tela}`).classList.toggle("escondido");
}

function selecionarMembros(membro){
    const lista = membro.parentNode.children;
    let tipo = "Público";
    if(membro.parentNode.classList.value === "membros"){
        mensagemEnviada.to = membro.children[0].innerText;
    }
    else{
        tipo = membro.children[0].innerText;
        if(tipo === "Reservadamente"){
            mensagemEnviada.type = "private_message"
        }
        else{
            mensagemEnviada.type = "message"
        }  
    }
    for(let i=0;i<lista.length;i++){
        lista[i].children[1].classList.add("escondido");
    }
    membro.children[1].classList.remove("escondido");
    const fraseinformativa = document.querySelector(".mensagem .esquerda span");
    fraseinformativa.innerHTML = `Enviando para ${mensagemEnviada.to} 
    (${tipo})
    `
}