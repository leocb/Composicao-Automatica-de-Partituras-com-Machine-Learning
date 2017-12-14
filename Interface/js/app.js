/*
Clave de sol                      G4
posição do G4 no vetor:           \/
0000000000000000000000000000000000100000000000000000000000000000000000000000000000000000
pos 35, index 34

C   C#  D   D#  E   F   F#  G   G#  A   A#  B

C4 - index 27
B4 - index 38
C5 - index 39
B5 - index 50

Para multiplas instancias do p5, leia:
https://github.com/processing/p5.js/wiki/Global-and-instance-mode
*/

//================================== VexFlow
// Usamos uma classe salvadora de vidas para renderizar as coisas na tela a partir de um objeto JSON

function render_vexflow(data, render_options) {
    let element = document.getElementById("display")
    let json = new Vex.Flow.JSON(data)
    json.render(element, render_options)
}

/* EXEMPLO: */
let sampleData = {
    clef: "treble",
    notes: [{
            duration: "16",
            keys: ["C"]
        },
        {
            duration: "4r",
            keys: ["b"]
        },
        {
            duration: "8",
            keys: ["Cb"]
        },
        {
            duration: "8",
            keys: ["Cb"]
        },
        {
            duration: "4",
            keys: ["C/5"]
        },
        {
            duration: "2",
            keys: ["Cn"]
        },
        {
            duration: "1",
            keys: ["C"]
        },
        {
            duration: "1",
            keys: ["C"]
        }
    ]
}
//render_vexflow(sampleData)


//Variaveis globais
//Armazenamento das notas pelas quais ja passamos (ou notas "fixadas")
let fixedNotes = {
    clef: "treble",
    notes: []
}
//Armazenamento da nota atualmente sendo tocada
let curProcessNote = {
    "duration": undefined,
    "keys": undefined
}

let remainingDuration = 0


//Init
updateVexFlow()

// Aqui lemos os dados da rede neural e processamos a saida para que
// o VexFlow desenhe corretamente, usamos um modelo de correção de tempo
// favorecendo notas mais longas ao ficar entre um tempo e outro
function readArrayFromServer(curNotes, newNotes) {

    //Primeiro, verifica se temos que ignorar por ainda estarmos dentro do tempo de outra nota
    if (remainingDuration > 0) {
        remainingDuration--
        return
    }

    // convertemos a string do server em array
    // usamos apenas o indice 27 a 50 (nota c4 a b5 - 2 oitavas)
    curNotes = curNotes.splice(27, 24)
    newNotes = newNotes.splice(27, 24)


    // Processamento das notas que recebemos, em relação as notas aramazenadas
    let curNoteAt = -1
    let newNoteAt = -1

    let emptyArray = true

    //Verificamos as notas que recebemos
    let threshold = 0.7
    for (let i = 0; i < curNotes.length; i++) {
        let curNoteValue = curNotes[i]
        let newNoteValue = newNotes[i]

        if (curNoteValue >= threshold || newNoteValue >= threshold) {
            emptyArray = false
        }

        //detectamos a nota atual
        if (curNoteValue >= threshold) {
            curNoteAt = i
        }
        //detectamos a nota nova
        if (newNoteValue >= threshold) {
            newNoteAt = i
        }
    }

    //Verificação necessária na primeira vez que executamos o codigo
    if (curProcessNote.keys === undefined || curProcessNote.duration === undefined) {
        curProcessNote.keys = [curNoteAt]
        curProcessNote.duration = 1
    }

    // Damos prioridade para curNoteAt diferente,
    // newNoteAt é somente utilizada para detectar mesma nota seguida dela mesma

    //Mesma nota
    if (curNoteAt === curProcessNote.keys[0] && (curNoteAt !== newNoteAt || emptyArray)) {
        curProcessNote.duration += 1
        if (curProcessNote.duration <= 16)
            return
    }

    //mesma nota tocada novamente ou nota diferente
    fixNewNote()

    //Reseta o valor da nota sendo processada
    curProcessNote.keys[0] = curNoteAt
    curProcessNote.duration = 1


    //Atualiza o display
    updateVexFlow()


}

function updateVexFlow() {
    let element = document.getElementById("display")
    element.setAttribute("width", fixedNotes.notes.length * 40 + 60)
    render_vexflow(fixedNotes)
}


// Notas que ja processamos sao convertidas em valores uteis para o VexFlow
// e entao salvas em um vetor
function fixNewNote() {
    //Calculos referentes a duração das notas
    remainingDuration = timeToIgnore(curProcessNote.duration)
    curProcessNote.duration = durationToVexFlowDuration(curProcessNote.duration)

    //Pausas
    if (curProcessNote.keys[0] === -1) {

        //Trata pausas com duração > 8 (vexFlow | nosso codigo é <= 2)
        if (curProcessNote.duration >= 8) {
            return
        }
        curProcessNote.duration += "r" //pausa
    }

    //Notas normais
    pushNote()

}

function pushNote() {
    //Calcula valores
    curProcessNote.keys[0] = convertIntToNote(curProcessNote.keys[0])

    //grava na array usada para exibir
    fixedNotes.notes.push({
        duration: curProcessNote.duration,
        keys: [curProcessNote.keys[0]]
    })

}


// Especifico para o TCC, recebemos o valor da nota como um int entre 0 e 23, representando semitons
// ou seja, uma oitava esta entre os indices 0 e 11 inclusive e a outra oitava entre 12 e 23 inclusive
// em anotação musical, seiram a 4 e a 5 oitava
function convertIntToNote(noteInt) {
    if (noteInt === -1) {
        return "B/4" //posição correta das pausas
    }
    //calculamos a oitava
    let octave = Math.floor(noteInt / 12) + 4

    //calculamos a nota
    let note

    switch (noteInt % 12) {
        case 0:
            note = "C"
            break
        case 1:
            note = "C#"
            break
        case 2:
            note = "D"
            break
        case 3:
            note = "C#"
            break
        case 4:
            note = "E"
            break
        case 5:
            note = "F"
            break
        case 6:
            note = "F#"
            break
        case 7:
            note = "G"
            break
        case 8:
            note = "G#"
            break
        case 9:
            note = "A"
            break
        case 10:
            note = "A#"
            break
        case 11:
            note = "B"
            break
    }
    return note + "/" + octave
}


// Corrigimos o timming do tempo para a nota mais longa
// Aqui tambem fazemos a conversao do tempo, o vexFlow usa 1/[tempo]
// Enquanto que nosso algoritimo usa [duração total]
// A duranção mais curta do nosso algoritimo é 1 - ou 16 no vexflow
function durationToVexFlowDuration(duration) {
    //conversao
    VFDuration = Math.floor(16 / duration)

    //arrumamos a duração para a nota mais longa, ja que nao exibimos tempo quebrado
    // 16 / [1]
    if (VFDuration == 16) {
        return "16"
    }
    // 16 / [2]
    if (VFDuration == 8) {
        return "8"
    }
    // 16 / [3-4]
    if (VFDuration >= 4 && VFDuration < 8) {
        return "4"
    }
    // 16 / [5-8]
    if (VFDuration >= 2 && VFDuration < 4) {
        return "2"
    }
    // 16 / [9-*]
    if (VFDuration < 2) {
        return "1"
    }
}

// Verificamos quanto tempo temos que ignorar a entrada, por causa da "extensao"
// de tempo da função acima, nao "devemos" efetuar nenhuma leitura durante o
// tempo teorico calculado de cada nota; Notas com duração 1 e 2 nao tem reajuste.
function timeToIgnore(duration) {
    if (duration >= 3 && duration <= 4) {
        return 4 - duration
    }
    if (duration >= 5 && duration <= 8) {
        return 8 - duration
    }
    if (duration > 8) {
        return Math.max(16 - duration, 0) //minimo de espera é 0, se for negativo, retornamos 0
    }
}




//================================== OLD P5 custom implementation
/*
let debugObjectOrigin = false
let scaleFactor = 20 // fator de escala, controla o tamanho de todo o resto, determinado como sendo a distancia entre linhas da partitura
let backColor = {
    r: 232,
    g: 227,
    b: 221
}


elements = []

let mainSheet

function setup() {
    createCanvas(1600, 400).parent('display')
    angleMode(DEGREES)
    mainSheet = new sheet(4, 4, 4)
    initElements()
    refreshScreen()
}

function draw() {

}

function initElements() {
    elements = []
    elements.push(new element("sheet", "line", 20, 80))
    elements.push(new element("clef", "treble", 60, 140))
}

function refreshScreen() {
    initElements()
    createNoteElements()

    background(backColor.r, backColor.g, backColor.b)
    elements.forEach(function(element) {
        element.draw()
    }, this)
}


// Controle de notas, usamos essas array para controlar toda exibição
let newNotesSheet = []
let curNotesSheet = []
let linesInSheet = 0
let notesPerLine = 24

function readNoteArray(curNotes, newNotes) { //vetor de 88 posições com todas as notas, da primeira a oitava oitava
    // usamos apenas o indice 27 a 50 (nota C4 a B5 - 2 oitavas)
    newNotesSheet.push(newNotes.splice(27, 24))
    curNotesSheet.push(curNotes.splice(27, 24))
    linesInSheet = curNotesSheet.length
}

function createNoteElements() {
    // penis S2
    // para cada seção de tempo (linha)
    for (let Li = 0; Li < linesInSheet.length; Li++) {
        const curNotesLine = curNotesSheet[Li]
        const newNotesLine = newNotesSheet[Li]

        // para cada nota na linha
        for (let Ni = 0; Ni < notesPerLine.length; Ni++) {
            const curNote = curNotesLine[Ni]
            const newNote = newNotesLine[Ni]


            // Temos que olhar os valores à frente para ver qual a duração da nota (fuck)
            // cada indice Li é 1/4 de um tempo, a duração máxima de uma nota é 4 tempos,
            // entao fazemos um while até:
            // - encontrar uma nota nova
            // - acabar a nota
            // - preencher os 4 tempos

        }
    }
}
*/





//*************** "Classes" ***************/
//Referencia para desenho dos vetores:
//  https://p5js.org/reference/#/p5/vertex
//  https://p5js.org/reference/#/p5/beginShape
//  https://p5js.org/reference/#/p5/bezierVertex
//  https://p5js.org/reference/#/p5/quadraticVertex