let usuario = { name: "" };
let mensagemEnviada = {
    from: "",
    to: "Todos",
    text: "",
    type: "message"
}
let tipo = "Público";
const inputUsuario = document.querySelector(".usuario input");
const inputMensagem = document.querySelector(".mensagem input");
let mensagemFinal = "";
inputUsuario.addEventListener("keyup", entrarUsuario);
inputMensagem.addEventListener("keyup", entrarMensagem);

carregarMensagens();

function entrarUsuario(event) {
    if (event.keyCode === 13) {
        perguntarUsuario();
    }
}

function entrarMensagem(event) {
    if (event.keyCode === 13) {
        enviarMensagem();
    }
}

function perguntarUsuario() {
    usuario.name = document.querySelector(".tela-entrada input").value;
    const telaCarregamento = document.querySelector(".carregando");
    telaCarregamento.classList.remove("escondido");
    inputUsuario.parentNode.classList.add("escondido");
    const promessa = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants", usuario);
    promessa.then(carregarPagina);
    promessa.catch(usuarioErrado);
}

function usuarioErrado() {
    alert("esse usuario ja esta em uso, tente outro");
    const telaCarregamento = document.querySelector(".carregando");
    telaCarregamento.classList.add("escondido");
    inputUsuario.parentNode.classList.remove("escondido");
}

function carregarPagina() {
    document.querySelector(".tela-entrada").classList.add("escondido");
    mensagemEnviada.from = usuario.name;
    obterParticipantes();
    setInterval(statusOnline, 5000);
    setInterval(carregarMensagens, 3000);
    setInterval(obterParticipantes, 10000);
}

function carregarMensagens() {
    const promessa = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/messages");
    promessa.then(popularMensagens);
    promessa.catch(recarregarPagina);
}

function popularMensagens(resposta) {
    let mensagensPostadas = [];
    for (let i = 0; i < resposta.data.length; i++) {
        if (resposta.data[i].from === usuario.name || resposta.data[i].to === "Todos" || resposta.data[i].to === usuario.name || resposta.data[i].type === "message" || resposta.data[i].type === "status") {
            mensagensPostadas.push(resposta.data[i]);
        }
    }
    separarMensagens(mensagensPostadas);
}

function separarMensagens(mensagens) {
    const campoMensagens = document.querySelector(".campo-textos")
    campoMensagens.innerHTML = "";
    for (let i = 0; i < mensagens.length; i++) {
        if (mensagens[i].type === "status") {
            campoMensagens.innerHTML += `
        <li class="status">
            <span><span class="horario">(${mensagens[i].time})</span> <strong>${mensagens[i].from} </strong>${mensagens[i].text}</span>
        </li>`;
        }
        else if (mensagens[i].type === "private_message") {
            campoMensagens.innerHTML += `
        <li class="private_message">
            <span><span class="horario">(${mensagens[i].time})</span>  <strong>${mensagens[i].from}</strong> reservadamente para <strong>${mensagens[i].to}</strong>: ${mensagens[i].text}</span>
        </li>`;
        }
        else {
            campoMensagens.innerHTML += `
        <li class="message">
            <span><span class="horario">(${mensagens[i].time})</span>  <strong>${mensagens[i].from}</strong> para <strong>${mensagens[i].to}</strong>: ${mensagens[i].text}</span>
        </li>`;
        }
    }
    if (mensagemFinal != mensagens[mensagens.length - 1].text) {
        descer();
        mensagemFinal = mensagens[mensagens.length - 1].text;
    }
}

function statusOnline() {
    const promessa = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/status", usuario);
    promessa.catch(recarregarPagina);
}

function recarregarPagina() {
    alert("Ops! você foi desconectado");
    window.location.reload();
}

function descer() {
    const tamanhoPagina = document.body.scrollHeight;
    window.scroll(0, tamanhoPagina);
}

function enviarMensagem() {
    mensagemEnviada.text = inputMensagem.value;
    inputMensagem.value = "";
    const promessa = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/messages", mensagemEnviada);
    promessa.then(carregarMensagens);
    promessa.catch(recarregarPagina);
}

function mostrarOuEsconderTela(tela) {
    document.querySelector(`.${tela}`).classList.toggle("escondido");
}

function obterParticipantes() {
    const promessa = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants");
    promessa.then(popularParticipantes);
    promessa.catch(recarregarPagina);
}

function popularParticipantes(resposta) {
    const participantes = resposta.data;
    const membrosOnline = document.querySelector(".membros")
    let PessoasNaoSelecionadas =0;
    membrosOnline.innerHTML = `
    <li onclick="selecionarMembros(this)">
        <div class="esquerda">
            <ion-icon name="people"></ion-icon>
            Todos
        </div>
        <ion-icon name="checkmark-sharp" class="selecionado"></ion-icon>
    </li>`;
    for (let i = 0; i < participantes.length; i++) {
        membrosOnline.innerHTML += `
    <li onclick="selecionarMembros(this)">
        <div class="esquerda">
            <ion-icon name="person-circle"></ion-icon>
            ${participantes[i].name}
        </div>
        <ion-icon name="checkmark-sharp" class="selecionado escondido"></ion-icon>
    </li>`;
        if (mensagemEnviada.to === participantes[i].name) {
            let membroSelecionado = membrosOnline.querySelectorAll("li");
            membroSelecionado[membroSelecionado.length - 1].children[1].classList.remove("escondido");
            membroSelecionado[0].children[1].classList.add("escondido");
        }
        else{
            PessoasNaoSelecionadas++;
        }
    }
    if(PessoasNaoSelecionadas === participantes.length){
        mensagemEnviada.to = "Todos";
    }
}

function selecionarMembros(membro) {
    const lista = membro.parentNode.children;
    mensagemEnviada.to = membro.children[0].innerText;

    for (let i = 0; i < lista.length; i++) {
        lista[i].children[1].classList.add("escondido");
    }
    membro.children[1].classList.remove("escondido");
    criarFraseInformativa();
}

function selecionarVisibilidade(membro) {
    const lista = membro.parentNode.children;
    tipo = membro.children[0].innerText;
    if (tipo === "Reservadamente") {
        mensagemEnviada.type = "private_message";
    }
    else {
        mensagemEnviada.type = "message";
    }
    for (let i = 0; i < lista.length; i++) {
        lista[i].children[1].classList.add("escondido");
    }
    membro.children[1].classList.remove("escondido");
    criarFraseInformativa();
    
}

function criarFraseInformativa(){
    const fraseinformativa = document.querySelector(".mensagem .esquerda span");
    fraseinformativa.innerHTML = `Enviando para ${mensagemEnviada.to} 
    (${tipo})`;
}