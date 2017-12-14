var fft

var bins = 1024

var connectedToWS = false

var bpm
var intervaloAnalise

var msProxAnalise
var msAtual

var delay

var arrayFFT = []

//Inicializa
function setup() {

    //fundo preto
    createCanvas(1200, 200)
    background(0)
    colorMode(HSB)

    //Init FFT
    var mic = new p5.AudioIn()
    mic.start()

    fft = new p5.FFT(0.00000000001, bins)
    fft.setInput(mic)

    //Taxa de ataulização do canvas
    frameRate(120)

    //intervalo entre envios para a rede neural
    intervaloAnalise = 125; //ms - calculado por 15000 / 120
    msProxAnalise = millis() + intervaloAnalise

}

function draw() {

    if (connectedToWS) {

        //acumula o fft na array

        msAtual = millis()
        arrayFFT.push(fft.analyze(4096))

        //se deu o tempo para enviar os dados para a rede
        if (msAtual >= msProxAnalise) {

            //calcula o intervalo até a proxima analise, calcula a media do fft e entao zera o vetor que armazena os fft's no tempo
            msProxAnalise = msAtual + intervaloAnalise
            let mediaSpectrum = calculaMediaAmostras(arrayFFT)
            arrayFFT = []

            //Exibe na tela
            noStroke()
            for (var i = 0; i < mediaSpectrum.length; i++) {
                var valor = mediaSpectrum[i]

                fill(map(valor, 0, 255, 255, 0), 255, 127)
                rect(i * 1, 50, 1, 20)
            }

            //Envia para a rede neural
            enviar(mediaSpectrum.toString())
            delay = millis()

        }
    }
}

//atualiza o intervalo entre as analises
function updateBPM(bpm) {
    intervaloAnalise = 15000 / bpm
}

function calculaMediaAmostras(arrayDeAmostras) {
    let arrayMedia = []
    let soma

    for (let i = 0; i < bins; i++) {
        soma = 0

        for (let j = 0; j < arrayDeAmostras.length; j++) {
            soma += arrayDeAmostras[j][i]
        }

        arrayMedia.push(soma / arrayDeAmostras.length)
    }

    return arrayMedia
}

//Exibe os dados da rede neural na tela
function showServerResponse(notas) {
    notas = notas.split(",")

    //Exibe na tela
    fill(0)
    rect(0, 0, 200, 50)
    fill(255)
    text(Math.round(millis() - delay, 2), 0, 0, 100, 50)
    stroke(0)

    fill(0)
    for (var i = 0; i < notas.length; i++) {
        var valor = notas[i]
        fill(127, 255, 15 + valor * 240)
        rect(i * 12, 70, 12, 20)
    }

}

// =====================================================================
// ============================= WebSocket =============================
// =====================================================================

if (!("WebSocket" in window)) {
    alert("Your browser does not support web sockets")
}


var txt = document.getElementById("data")

//Tenta abrir uma conexão com o websocket logo que a pagina carrega
var host = "ws://localhost:9091/ws"
var socket
socket = new WebSocket(host)
setupSocket(socket)

//Ao clicar no botao "Conectar"
function configurar() {
    socket.close()
    var host = document.getElementById("hostip").value
    socket = new WebSocket(host)
    setupSocket(socket)

}

// event handlers for UI
function enviar(text) {
    if (text == "") {
        return
    }
    socket.send(text)
    txt.value = ""
}

// event handlers for websocket
function setupSocket(socket) {

    socket.onopen = function() {
        connectedToWS = true
    }

    socket.onmessage = function(msg) {
        showServerResponse(msg.data)
    }

    socket.onclose = function() {
        connectedToWS = false
    }
}