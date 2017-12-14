let connectedToWS = false
let bins = 1024

let nextReadInterval
let readInterval

let acummFFT = []

let networkDelay


let connectionSketch = new p5(function (sketch) {

    let mic = new p5.AudioIn()
    let fft = new p5.FFT(0.00000000001, bins)

    sketch.setup = function () {
        //fundo preto
        sketch.createCanvas(1100, 100)
        sketch.background(0)
        sketch.colorMode(sketch.HSB)

        //Init FFT
        mic.start()
        fft.setInput(mic)

        //Taxa de ataulização do canvas
        sketch.frameRate(120)

        //intervalo entre envios para a rede neural
        readInterval = 125; //ms - calculado por 15000 / 120 - mais detalhes sobre isso no artigo
        nextReadInterval = sketch.millis() + readInterval
    };

    sketch.draw = function () {
        if (connectedToWS) {

            //acumula o fft na array
            let currentTime = sketch.millis()
            acummFFT.push(fft.analyze(4096))

            //se deu o tempo para enviar os dados para a rede
            if (currentTime >= nextReadInterval) {

                //calcula o intervalo até a proxima analise, calcula a media do fft e entao zera o vetor que armazena os fft's no tempo
                nextReadInterval = currentTime + readInterval
                let averageFFT = averageArray(acummFFT)
                acummFFT = []

                //Exibe na tela
                sketch.noStroke()
                for (let i = 0; i < averageFFT.length; i++) {
                    let value = averageFFT[i]

                    sketch.fill(sketch.map(value, 0, 255, 255, 0), 255, 127)
                    sketch.rect(i * 1 + 20, 25, 1, 20)
                }

                //Envia para a rede neural
                sendToWS(averageFFT.toString())
                networkDelay = sketch.millis()

            }
        }
    }

    //Exibe os dados da rede neural na tela
    sketch.showServerResponse = function (msgWithData) {
        if (!msgWithData.length > 100)
            return


        msgWithData = msgWithData.split("|")
        notasNovas = msgWithData[0].split(",")
        notasAtuais = msgWithData[1].split(",")

        readArrayFromServer(notasAtuais, notasNovas)

        /*
        //Exibe na tela
        //Texto
        sketch.fill(0)
        sketch.rect(0, 0, 200, 20)
        sketch.fill(255)
        sketch.text(Math.round(sketch.millis() - networkDelay, 2), 20, 4, 100, 20)
        sketch.stroke(0)


        //Notas Atuais
        sketch.fill(0)
        for (let i = 0; i < notasAtuais.length; i++) {
            let valor = notasAtuais[i]
            sketch.fill(127, 255, 15 + valor * 240)
            sketch.rect(i * 12 + 20, 50, 12, 20)
        }

        //Notas Novas
        sketch.fill(0)
        for (let i = 0; i < notasNovas.length; i++) {
            let valor = notasNovas[i]
            sketch.fill(127, 255, 15 + valor * 240)
            sketch.rect(i * 12 + 20, 75, 12, 20)
        }*/

    }

}, 'serverCom');

//calcula a media de valores para um array bi-dimensional
function averageArray(originalArray) {
    let averageArray = []
    let sum = 0

    //para cara valor até o maximo (global) de valores
    for (let i = 0; i < bins; i++) {
        sum = 0

        // acumula os valores de todas as dimensões para o bin atual
        for (let j = 0; j < originalArray.length; j++) {
            sum += originalArray[j][i]
        }

        //faz a media
        averageArray.push(sum / originalArray.length)
    }
    return averageArray
}

//atualiza o intervalo entre as analises
function updateBPM(bpm) {
    readInterval = 15000 / bpm
}



// =====================================================================
// ============================= WebSocket =============================
// =====================================================================

if (!("WebSocket" in window)) {
    alert("Your browser does not support web sockets")
}

let inputText = document.getElementById("data")

//Tenta abrir uma conexão com o websocket logo que a pagina carrega
let host = "ws://localhost:9091/ws"
let socket


//Descomente a linha abaixo para tentar iniciar o WS quando a pagina carrega
//setupSocket(socket)

//Ao clicar no botao "Conectar"
function configurar() {
    if (socket) {
        socket.close()
    }
    let host = document.getElementById("hostip").value
    socket = new WebSocket(host)
    setupSocket(socket)

}

// event handlers for UI
function sendToWS(dataString) {
    if (dataString == "") {
        return
    }
    socket.send(dataString)
    inputText.value = ""
}

// event handlers for websocket
function setupSocket(socket) {

    socket.onopen = function () {
        connectedToWS = true
    }

    socket.onmessage = function (msg) {
        connectionSketch.showServerResponse(msg.data)
    }

    socket.onclose = function () {
        connectedToWS = false
    }
}