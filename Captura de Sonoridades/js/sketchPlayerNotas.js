var mic;
var fft;

var bins = 1024;

var bpm;
var intervaloAnalise;

var msUltimaAnalise;
var msAtual

var arAnalise = [];
var mediaSpectrum = [];

var osc;
var count = 0;

var larguraCanvas;
var alturaCanvas;

var spectrunsGravacao;

var gravando = false;
var realmenteGravando = false;

function setup() {

    canvas = createCanvas(0, 0);

    mic = new p5.AudioIn();
    mic.start();

    fft = new p5.FFT(0.00000000001, bins);
    fft.setInput(mic);

    w = width / 256;
    frameRate(240);

    msUltimaAnalise = millis();

    bpm = 120;
    intervaloAnalise = 15000 / bpm;
}

function draw() {

    var spectrum = fft.analyze(4096);

    arAnalise.push(spectrum);

    msAtual = millis();

    if (msAtual - msUltimaAnalise > intervaloAnalise) {

        msUltimaAnalise = msAtual + (intervaloAnalise - (msAtual - msUltimaAnalise));

        mediaSpectrum = calculaMediaAmostras();

        //console.log("REC");

        if (realmenteGravando) {
            spectrunsGravacao.push(mediaSpectrum);
        }

        arAnalise = [];
    }
}

function calculaMediaAmostras() {
    var arAux = [];
    var soma;

    for (var i = 0; i < bins; i++) {
        soma = 0;

        for (var j = 0; j < arAnalise.length; j++) {
            soma += arAnalise[j][i];
        }

        arAux.push(soma / arAnalise.length);
    }

    return arAux;
}

function startRecord() {
    console.log("Start");
    gravando = true;

    setTimeout(function() {
        realmenteGravando = true
        console.log("Start Real");
        arAnalise = [];
        msAtual = millis();
        msUltimaAnalise = msAtual

        spectrunsGravacao = [];
    }, 175)
}

function stopRecord() {
    console.log("Stop");
    gravando = false;

    setTimeout(function() {
        realmenteGravando = false
        console.log("Stop Real");

        if (arAnalise.length > 0)
            spectrunsGravacao.push(calculaMediaAmostras())
        arAnalise = [];

        var text = "";
        var filename = "dadosFFT"

        for (var i = 0; i < spectrunsGravacao.length; i++)
            for (var j = 0; j < 1024; j++)
                spectrunsGravacao[i][j] = Math.round(spectrunsGravacao[i][j]);

        for (var i = 0; i < spectrunsGravacao.length; i++)
            if(i < spectrunsGravacao.length - 1)
                text += spectrunsGravacao[i].toString() + "\r\n";
            else
                text += spectrunsGravacao[i].toString();

        var blob = new Blob([text], { type: "text;charset=utf-8" });

        var aux = document.getElementsByName('input_nota')[0].value;

        saveAs(blob, aux + ".data");
    }, 175);
}