//---------------------------------------------------------------------------------------------------- SHEET
function sheet(maxRows, maxSectionsPerRow, maxElementsPerSection) {
    this.rows = []
    this.selectedRow = 0;

    //adiciona linha
    this.addRow = function() {
        if (this.rows.count < maxRows)
            this.rows.push(new row(this, this.rows.count, maxSectionsPerRow, maxElementsPerSection))
    }

    //adiciona elemento (classe de alto nivel, simplesmente chama isso aqui que eu me encarrego de adicionar o lugar correto)
    this.addElement = function(typeName, shapeName) {
        if (this.rows.count > 0) {
            this.rows[this.selectedRow].addElement(typeName, shapeName)
        } else {
            console.log("Adicione pelo menos uma linha antes de tentar adicionar um elemento, sua anta!");
        }
    }

    //seleciona a proxima linha
    this.changeToNextRow = function() {
        if (this.selectedRow < this.rows.count - 1)
            this.selectedRow++
    }

    //desenho
    this.draw = function() {
        this.rows.forEach(function(row) {
            row.draw();
        }, this);
    }
}

//---------------------------------------------------------------------------------------------------- ROW
function row(parentSheet, index, maxSections, maxElementsPerSection) {
    this.sections = []
    this.index = index
    this.parentSheet = parentSheet

    //adiciona as linhas
    this.lineElements = []
    for (let i = 0; i < 5; i++) {
        this.lineElements.push(new shapeSheetline())
    }

    //adiciona seção
    this.addSection = function() {
        this.push(new section(this, this.sections.count, maxElementsPerSection))
    }

    //desenho
    this.draw = function() {
        //desenhas as linhas da linha atual


        //desenha as divisões
        this.sections.forEach(function(section) {
            section.draw();
        }, this);
    }
}

//---------------------------------------------------------------------------------------------------- SECTION
function section(parentRow, index, maxElements) {
    this.elements = []
    this.index = index
    this.parentRow = parentRow

    this.addElement = function(typeName, shapeName, x, y) {
        this.push(new element(typeName, shapeName, x, y))
    }

    this.draw = function() {
        this.elements.forEach(function(element) {
            element.draw();
        }, this);
    }
}

//---------------------------------------------------------------------------------------------------- ELEMENT
function element(typeName, shapeName, x, y, rotation) {
    this.x = x
    this.y = y
    this.shapes = []
    this.transform = { origin: 0, rotate: 0, scale: 0 }

    if (rotation)
        this.transform.rotate = rotation

    this.draw = function() {
        this.shapes.forEach((shape) => {
            drawObject(shape, this.x, this.y, this.transform)
        })
    }

    //Cria o elemento de acordo com o tipo e nome
    switch (typeName) {
        case "sheet":
            switch (shapeName) {
                case "line":
                    this.shapes.push(new shapeSheetline())
                    break
                case "separator":
                    this.shapes.push(new shapeSheetSeparator())
                    break
            }

            break
        case "note":
            switch (shapeName) {
                case "semibreve":
                    this.shapes.push(new shapeNoteHead("semibreve"))
                    break

                case "minim":
                    this.shapes.push(new shapeNoteHead("minim"))
                    break

                case "seminim":
                    this.shapes.push(new shapeNoteHead("minim"))
                    this.shapes.push(new shapeNoteStem())
                    break

                case "colcheia":
                    this.shapes.push(new shapeNoteHead())
                    this.shapes.push(new shapeNoteStem())
                    this.shapes.push(new shapeNoteHook(false, true))
                    break

                case "semicolcheia":
                    this.shapes.push(new shapeNoteHead())
                    this.shapes.push(new shapeNoteStem())
                    this.shapes.push(new shapeNoteHook(true, true))
                    break
            }
            break
        case "pause":
            switch (shapeName) {
                case "semibreve":
                    this.shapes.push(new shapePauseSemibreve())
                    break

                case "minim":
                    this.shapes.push(new shapePauseMnimin())
                    break

                case "seminim":
                    this.shapes.push(new shapePauseSeminim())
                    break

                case "colcheia":
                    this.shapes.push(new shapePauseColcheia(false))
                    break

                case "semicolcheia":
                    this.shapes.push(new shapePauseColcheia(true))
                    break
            }

            break
        case "accident":
            switch (shapeName) {
                case "sharp":
                    this.shapes.push(new shapeAccidentSharp())
                    break
                case "flat":
                    this.shapes.push(new shapeAccidentFlat())
                    break
                case "natural":
                    this.shapes.push(new shapeAccidentNatural())
                    break
            }

            break
        case "clef":
            switch (shapeName) {
                case "treble":
                    this.shapes.push(new shapeClefTreble())
                    break
                case "bass":
                    this.shapes.push("WTF ARE YOU DOING? YOU FOOL!")
                    break
            }

            break
    }

}


//---------------------------------------------------------------------------------------------------- SHAPES
//linha
function shapeSheetline() {
    this.simpleShapes = [{
        shape: "rect",
        fill: { r: 20, g: 20, b: 20 },
        transform: {
            origin: { x: 0, y: 0 },
            rotate: 0,
            scale: { x: 70, y: 0.1 }
        }
    }, {
        shape: "rect",
        fill: { r: 20, g: 20, b: 20 },
        transform: {
            origin: { x: 0, y: 1 },
            rotate: 0,
            scale: { x: 70, y: 0.1 }
        }
    }, {
        shape: "rect",
        fill: { r: 20, g: 20, b: 20 },
        transform: {
            origin: { x: 0, y: 2 },
            rotate: 0,
            scale: { x: 70, y: 0.1 }
        }
    }, {
        shape: "rect",
        fill: { r: 20, g: 20, b: 20 },
        transform: {
            origin: { x: 0, y: 3 },
            rotate: 0,
            scale: { x: 70, y: 0.1 }
        }
    }, {
        shape: "rect",
        fill: { r: 20, g: 20, b: 20 },
        transform: {
            origin: { x: 0, y: 4 },
            rotate: 0,
            scale: { x: 70, y: 0.1 }
        }
    }]
}
//Separador
function shapeSheetSeparator() {
    this.simpleShapes = [{
        shape: "rect",
        fill: { r: 20, g: 20, b: 20 },
        transform: {
            origin: { x: 0, y: 0 },
            rotate: 0,
            scale: { x: 0.1, y: -4 }
        }
    }]
}

//Cabeça da nota
function shapeNoteHead(type) {
    this.size = { w: 1, h: 1 }
    switch (type) {
        case "semibreve": //semibreve
            this.simpleShapes = [{
                    shape: "ellipse",
                    fill: { r: 20, g: 20, b: 20 },
                    transform: {
                        origin: { x: 0.5, y: 0 },
                        rotate: 0,
                        scale: { x: 1.1, y: 0.9 }
                    },
                },
                {
                    shape: "ellipse",
                    fill: backColor,
                    transform: {
                        origin: { x: 0.5, y: 0 },
                        rotate: 0,
                        scale: { x: 0.6, y: 0.7 }
                    }

                }
            ]
            break

        case "minima": //Minima
            this.simpleShapes = [{
                shape: "ellipse",
                fill: { r: 20, g: 20, b: 20 },
                transform: {
                    origin: { x: 0.5, y: 0 },
                    rotate: -20,
                    scale: { x: 1.1, y: 0.9 }
                },
            }, {
                shape: "ellipse",
                fill: backColor,
                transform: {
                    origin: { x: 0.5, y: 0 },
                    rotate: -20,
                    scale: { x: 0.9, y: 0.4 }
                }

            }]
            break

        default: //Seminima, Colcheia, Semicolcheia 
            this.simpleShapes = [{
                shape: "ellipse",
                fill: { r: 20, g: 20, b: 20 },
                transform: {
                    origin: { x: 0.6, y: 0 },
                    rotate: -20,
                    scale: { x: 1.2, y: 0.9 }
                },
            }]
            break
    }
}



//"linha" da nota
function shapeNoteStem() {
    this.simpleShapes = [{
        shape: "rect",
        fill: { r: 20, g: 20, b: 20 },
        transform: {
            origin: { x: 0.15, y: -3 },
            rotate: 0,
            scale: { x: 0.15, y: 3 }
        },
    }]
}

//"enfeite" da nota
/**
 * 
 * 
 * @param {boolean} double false: draws a single hook on the stem, true: draw two hooks on the stem
 * @param {boolean} inverted draw the hook upside down (the stem also should be upside down)
 */
function shapeNoteHook(double, inverted) {
    this.complexShapes = [{
        fill: { r: 20, g: 20, b: 20 },
        transform: {
            origin: { x: 0.05, y: -3 },
            scale: { x: 2.2, y: 2.4 }
        },
        shape: [
            { "vectorType": "vertex", "x": 0, "y": 0.2710843373493976 },
            { "vectorType": "bezier", "cx1": 0.0015060240963855422, "cy1": 0.19879518072289157, "cx2": 0.00013689966086881706, "cy2": 0.10090361445783133, "x": 0.00013689966086881706, "y": 0 },
            { "vectorType": "bezier", "cx1": 0.04189483947064503, "cy1": 0.1280120481927711, "cx2": 0.13567906833556762, "cy2": 0.19578313253012047, "x": 0.22905256231147123, "y": 0.2575301204819277 },
            { "vectorType": "bezier", "cx1": 0.36158268279339895, "cy1": 0.3569277108433735, "cx2": 0.3826670201427965, "cy2": 0.45331325301204817, "x": 0.39471521291388084, "y": 0.5858433734939759 },
            { "vectorType": "bezier", "cx1": 0.4067634056849652, "cy1": 0.7183734939759037, "cx2": 0.28025738158857966, "cy2": 0.9021084337349398, "x": 0.18236581532351942, "y": 1 },
            { "vectorType": "bezier", "cx1": 0.28778750207050735, "cy1": 0.8463855421686747, "cx2": 0.31941400809460374, "cy2": 0.7319277108433735, "x": 0.31790798399821824, "y": 0.6234939759036144 },
            { "vectorType": "bezier", "cx1": 0.3164019599018327, "cy1": 0.5150602409638554, "cx2": 0.24712485146809773, "cy2": 0.34186746987951805, "x": 0, "y": 0.2710843373493976 }
        ]
    }]
    if (double) {
        this.complexShapes.push({
            fill: { r: 20, g: 20, b: 20 },
            transform: {
                origin: { x: 0.05, y: -2.3 },
                scale: { x: 1.8, y: 1.8 }
            },
            shape: this.complexShapes[0].shape
        })
    }
}


//claves
function shapeClefTreble() {
    this.complexShapes = [{
        fill: { r: 20, g: 20, b: 20 },
        transform: {
            origin: { x: 1.4, y: -4.4 },
            scale: { x: 7, y: 7 }
        },
        shape: [
            { "vectorType": "vertex", "x": 0.0999173749990904, "y": 0.613149140914515 },
            { "vectorType": "bezier", "cx1": 0.09848998392767482, "cy1": 0.5469270916785518, "cx2": 0.14702128035580445, "cy2": 0.47165318531885775, "x": 0.22980996249790792, "y": 0.4687946811654101 },
            { "vectorType": "bezier", "cx1": 0.3125986446400114, "cy1": 0.46593617701196244, "cx2": 0.3868229803536214, "cy2": 0.5254883105276947, "x": 0.3868229803536214, "y": 0.6241067038216377 },
            { "vectorType": "bezier", "cx1": 0.3868229803536214, "cy1": 0.7227250971155808, "cx2": 0.3125986446400114, "cy2": 0.781324432261257, "x": 0.1941251857125185, "y": 0.7798951801845332 },
            { "vectorType": "bezier", "cx1": 0.07565172678502559, "cy1": 0.7784659281078093, "cx2": 0, "cy2": 0.6669842661233519, "x": 0, "y": 0.584087645673371 },
            { "vectorType": "bezier", "cx1": 0, "cy1": 0.5011910252233899, "cx2": 0.06137781607086982, "cy2": 0.4159123543266291, "x": 0.1256104142845708, "y": 0.3515960108740576 },
            { "vectorType": "bezier", "cx1": 0.18984301249827176, "cy1": 0.2872796674214861, "cx2": 0.25978517499763504, "cy2": 0.2529776175801146, "x": 0.26549473928329737, "y": 0.17151024920685737 },
            { "vectorType": "bezier", "cx1": 0.27120430356895964, "cy1": 0.09004288083360011, "cx2": 0.2569303928548039, "cy2": 0.08003811629653342, "x": 0.23123735356932348, "y": 0.08003811629653342 },
            { "vectorType": "bezier", "cx1": 0.2055443142838431, "cy1": 0.08003811629653342, "cx2": 0.1627225821413758, "cy2": 0.18580276997409545, "x": 0.175569101784116, "y": 0.2644116341939051 },
            { "vectorType": "bezier", "cx1": 0.18841562142685617, "cy1": 0.34302049841371474, "cx2": 0.286905605354531, "cy2": 0.8227727424862474, "x": 0.2926151696401933, "y": 0.8756550693250285 },
            { "vectorType": "bezier", "cx1": 0.2983247339258556, "cy1": 0.9285373961638095, "cx2": 0.29689734285444, "cy2": 0.9642686980819046, "x": 0.2426564821406481, "y": 1 },
            { "vectorType": "bezier", "cx1": 0.18841562142685617, "cy1": 1.0357313019180954, "cx2": 0.09135302857059693, "cy2": 0.9980944032598883, "x": 0.09135302857059693, "y": 0.9275845977937536 },
            { "vectorType": "bezier", "cx1": 0.09135302857059693, "cy1": 0.857074792327619, "cx2": 0.15415823571288234, "cy2": 0.8532634898041153, "x": 0.15415823571288234, "y": 0.8532634898041153 },
            { "vectorType": "bezier", "cx1": 0.15415823571288234, "cy1": 0.8532634898041153, "cx2": 0.21696344285516772, "cy2": 0.8546927418808391, "x": 0.21981822499799888, "y": 0.9147213291032392 },
            { "vectorType": "bezier", "cx1": 0.22267300714083002, "cy1": 0.9747499163256393, "cx2": 0.15844040892712907, "cy2": 0.9790376725558108, "x": 0.15844040892712907, "y": 0.9790376725558108 },
            { "vectorType": "bezier", "cx1": 0.15844040892712907, "cy1": 0.9790376725558108, "cx2": 0.1869882303554406, "cy2": 1.0133397223971823, "x": 0.2369469178549858, "y": 0.9799904709258667 },
            { "vectorType": "bezier", "cx1": 0.286905605354531, "cy1": 0.946641219454551, "cx2": 0.2811960410688687, "cy2": 0.9199618837034665, "x": 0.27263169464037523, "y": 0.8627918006345141 },
            { "vectorType": "bezier", "cx1": 0.26406734821188177, "cy1": 0.8056217175655617, "cx2": 0.17699649285553157, "cy2": 0.38018105240853384, "x": 0.14844867142722, "y": 0.23439734058270506 },
            { "vectorType": "bezier", "cx1": 0.11990084999890847, "cy1": 0.08861362875687626, "cx2": 0.20126214106959636, "cy2": 0.00142925207672382, "x": 0.22838257142649235, "y": 0 },
            { "vectorType": "bezier", "cx1": 0.2555030017833883, "cy1": -0.00142925207672382, "cx2": 0.2997521249972712, "cy2": 0.0628870913758477, "x": 0.2983247339258556, "y": 0.18151501374392404 },
            { "vectorType": "bezier", "cx1": 0.29689734285444, "cy1": 0.3001429361120004, "cx2": 0.22838257142649235, "cy2": 0.3644592795645719, "x": 0.17128692856986927, "y": 0.4173416064033529 },
            { "vectorType": "bezier", "cx1": 0.11419128571324617, "cy1": 0.4702239332421339, "cx2": 0.05424086071379193, "cy2": 0.5426393354483805, "x": 0.05424086071379193, "y": 0.6083849309776758 },
            { "vectorType": "bezier", "cx1": 0.05424086071379193, "cy1": 0.6741305265069711, "cx2": 0.11704606785607732, "cy2": 0.7555978948802282, "x": 0.1998347499981808, "y": 0.7584563990336759 },
            { "vectorType": "bezier", "cx1": 0.2826234321402843, "cy1": 0.7613149031871236, "cx2": 0.34542863928256967, "cy2": 0.6912815514276568, "x": 0.34542863928256967, "y": 0.6355407204354282 },
            { "vectorType": "bezier", "cx1": 0.34542863928256967, "cy1": 0.5797998894431995, "cx2": 0.2797686499974531, "cy2": 0.5345402766947054, "x": 0.23409213571215465, "y": 0.5345402766947054 },
            { "vectorType": "bezier", "cx1": 0.18841562142685617, "cy1": 0.5345402766947054, "cx2": 0.1313199785702331, "cy2": 0.5717008306895246, "x": 0.1313199785702331, "y": 0.6231539054515818 },
            { "vectorType": "bezier", "cx1": 0.1313199785702331, "cy1": 0.674606980213639, "cx2": 0.1741417107127004, "cy2": 0.7131967862851819, "x": 0.21981822499799888, "y": 0.7317770632825914 },
            { "vectorType": "bezier", "cx1": 0.17128692856986927, "cy1": 0.7332063153593152, "cx2": 0.10134476607050598, "cy2": 0.6793711901504782, "x": 0.0999173749990904, "y": 0.613149140914515 }
        ]
    }]
}

//acidentes
function shapeAccidentFlat() {
    this.complexShapes = [{
        fill: { r: 20, g: 20, b: 20 },
        transform: {
            origin: { x: 0.7, y: 2 },
            scale: { x: 2.5, y: 2.5 }
        },
        shape: [
            { "vectorType": "vertex", "x": 0, "y": 0 },
            { "vectorType": "bezier", "cx1": 0, "cy1": 0, "cx2": 0.03974706413730804, "cy2": 0, "x": 0.03974706413730804, "y": 0 },
            { "vectorType": "bezier", "cx1": 0.03974706413730804, "cy1": 0, "cx2": 0.04336043360433604, "cy2": 0.8925022583559169, "x": 0.04336043360433604, "y": 0.8925022583559169 },
            { "vectorType": "bezier", "cx1": 0.04336043360433604, "cy1": 0.8925022583559169, "cx2": 0.1951219512195122, "cy2": 0.7732610659439928, "x": 0.20596205962059622, "y": 0.6467931345980127 },
            { "vectorType": "bezier", "cx1": 0.21680216802168023, "cy1": 0.5203252032520326, "cx2": 0.03974706413730804, "cy2": 0.6214995483288166, "x": 0.03974706413730804, "y": 0.6214995483288166 },
            { "vectorType": "bezier", "cx1": 0.03974706413730804, "cy1": 0.6214995483288166, "cx2": 0.036133694670280034, "cy2": 0.5709123757904245, "x": 0.036133694670280034, "y": 0.5709123757904245 },
            { "vectorType": "bezier", "cx1": 0.036133694670280034, "cy1": 0.5709123757904245, "cx2": 0.2240289069557362, "cy2": 0.46612466124661245, "x": 0.28906955736224027, "y": 0.5564588979223125 },
            { "vectorType": "bezier", "cx1": 0.35411020776874436, "cy1": 0.6467931345980127, "cx2": 0.2881662149954833, "cy2": 0.7795844625112918, "x": 0.2023486901535682, "y": 0.8346883468834688 },
            { "vectorType": "bezier", "cx1": 0.11653116531165311, "cy1": 0.8897922312556459, "cx2": 0.0027100271002710027, "cy2": 1, "x": 0.0027100271002710027, "y": 1 },
            { "vectorType": "bezier", "cx1": 0.0027100271002710027, "cy1": 1, "cx2": 0, "cy2": 0, "x": 0, "y": 0 }
        ]
    }]
}

function shapeAccidentSharp() {
    this.complexShapes = [{
        fill: { r: 20, g: 20, b: 20 },
        transform: {
            origin: { x: 0.4, y: -1.25 },
            scale: { x: 2.5, y: 2.5 }
        },
        shape: [
            { "vectorType": "vertex", "x": 0.05050505147808829, "y": 0.28787879342510325 },
            { "vectorType": "bezier", "cx1": 0.05050505147808829, "cy1": 0.28787879342510325, "cx2": 0.000007174231927548648, "cy2": 0.3100766328383288, "x": 0.000007174231927548648, "y": 0.3100766328383288 },
            { "vectorType": "bezier", "cx1": 0.000007174231927548648, "cy1": 0.3100766328383288, "cx2": 0.0025252525739044144, "cy2": 0.4671717454384649, "x": 0.0025252525739044144, "y": 0.4671717454384649 },
            { "vectorType": "bezier", "cx1": 0.0025252525739044144, "cy1": 0.4671717454384649, "cx2": 0.04797979890418388, "cy2": 0.4469697248472296, "x": 0.04797979890418388, "y": 0.4469697248472296 },
            { "vectorType": "bezier", "cx1": 0.04797979890418388, "cy1": 0.4469697248472296, "cx2": 0.05303030405199271, "cy2": 0.6641414076707128, "x": 0.05303030405199271, "y": 0.6641414076707128 },
            { "vectorType": "bezier", "cx1": 0.05303030405199271, "cy1": 0.6641414076707128, "cx2": 0, "cy2": 0.689393933409757, "x": 0, "y": 0.689393933409757 },
            { "vectorType": "bezier", "cx1": 0, "cy1": 0.689393933409757, "cx2": 0, "cy2": 0.835858582696213, "x": 0, "y": 0.835858582696213 },
            { "vectorType": "bezier", "cx1": 0, "cy1": 0.835858582696213, "cx2": 0.05050505147808829, "cy2": 0.8131313095310733, "x": 0.05050505147808829, "y": 0.8131313095310733 },
            { "vectorType": "bezier", "cx1": 0.05050505147808829, "cy1": 0.8131313095310733, "cx2": 0.05051222571001584, "cy2": 0.9994705855142341, "x": 0.05051222571001584, "y": 0.9994705855142341 },
            { "vectorType": "bezier", "cx1": 0.05051222571001584, "cy1": 0.9994705855142341, "cx2": 0.10101010295617659, "cy2": 1, "x": 0.10101010295617659, "y": 1 },
            { "vectorType": "bezier", "cx1": 0.10101010295617659, "cy1": 1, "cx2": 0.10101010295617659, "cy2": 0.792929288939838, "x": 0.10101010295617659, "y": 0.792929288939838 },
            { "vectorType": "bezier", "cx1": 0.10101010295617659, "cy1": 0.792929288939838, "cx2": 0.18181818532111785, "cy2": 0.7575757529051762, "x": 0.18181818532111785, "y": 0.7575757529051762 },
            { "vectorType": "bezier", "cx1": 0.18181818532111785, "cy1": 0.7575757529051762, "cx2": 0.18181818532111785, "cy2": 0.39393942079523686, "x": 0.18181818532111785, "y": 0.39393942079523686 },
            { "vectorType": "bezier", "cx1": 0.18181818532111785, "cy1": 0.39393942079523686, "cx2": 0.1818253595530454, "cy2": 0.6055311839851454, "x": 0.1818253595530454, "y": 0.6055311839851454 },
            { "vectorType": "bezier", "cx1": 0.1818253595530454, "cy1": 0.6055311839851454, "cx2": 0.10101010295617659, "cy2": 0.6414141730378695, "x": 0.10101010295617659, "y": 0.6414141730378695 },
            { "vectorType": "bezier", "cx1": 0.10101010295617659, "cy1": 0.6414141730378695, "cx2": 0.10101010295617659, "cy2": 0.42676770425599425, "x": 0.10101010295617659, "y": 0.42676770425599425 },
            { "vectorType": "bezier", "cx1": 0.10101010295617659, "cy1": 0.42676770425599425, "cx2": 0.1818253595530454, "cy2": 0.3934099677771745, "x": 0.1818253595530454, "y": 0.3934099677771745 },
            { "vectorType": "bezier", "cx1": 0.1818253595530454, "cy1": 0.3934099677771745, "cx2": 0.18181818532111785, "cy2": 0.9747474742609559, "x": 0.18181818532111785, "y": 0.9747474742609559 },
            { "vectorType": "bezier", "cx1": 0.18181818532111785, "cy1": 0.9747474742609559, "cx2": 0.23232323679920613, "cy2": 0.9747474742609559, "x": 0.23232323679920613, "y": 0.9747474742609559 },
            { "vectorType": "bezier", "cx1": 0.23232323679920613, "cy1": 0.9747474742609559, "cx2": 0.23484848937311056, "cy2": 0.7373737323139409, "x": 0.23484848937311056, "y": 0.7373737323139409 },
            { "vectorType": "bezier", "cx1": 0.23484848937311056, "cy1": 0.7373737323139409, "cx2": 0.2929292985729121, "cy2": 0.7095959540009923, "x": 0.2929292985729121, "y": 0.7095959540009923 },
            { "vectorType": "bezier", "cx1": 0.2929292985729121, "cy1": 0.7095959540009923, "cx2": 0.2929292985729121, "cy2": 0.5606060521406319, "x": 0.2929292985729121, "y": 0.5606060521406319 },
            { "vectorType": "bezier", "cx1": 0.2929292985729121, "cy1": 0.5606060521406319, "cx2": 0.23232323679920613, "cy2": 0.5858586164119723, "x": 0.23232323679920613, "y": 0.5858586164119723 },
            { "vectorType": "bezier", "cx1": 0.23232323679920613, "cy1": 0.5858586164119723, "cx2": 0.2323304110311337, "cy2": 0.3732079471859392, "x": 0.2323304110311337, "y": 0.3732079471859392 },
            { "vectorType": "bezier", "cx1": 0.2323304110311337, "cy1": 0.3732079471859392, "cx2": 0.2929292985729121, "cy2": 0.34595962189105295, "x": 0.2929292985729121, "y": 0.34595962189105295 },
            { "vectorType": "bezier", "cx1": 0.2929292985729121, "cy1": 0.34595962189105295, "cx2": 0.2929292985729121, "cy2": 0.1944444481906399, "x": 0.2929292985729121, "y": 0.1944444481906399 },
            { "vectorType": "bezier", "cx1": 0.2929292985729121, "cy1": 0.1944444481906399, "cx2": 0.23232323679920613, "cy2": 0.21969697392968407, "x": 0.23232323679920613, "y": 0.21969697392968407 },
            { "vectorType": "bezier", "cx1": 0.23232323679920613, "cy1": 0.21969697392968407, "cx2": 0.23232323679920613, "cy2": 0, "x": 0.23232323679920613, "y": 0 },
            { "vectorType": "bezier", "cx1": 0.23232323679920613, "cy1": 0, "cx2": 0.18181818532111785, "cy2": 0, "x": 0.18181818532111785, "y": 0 },
            { "vectorType": "bezier", "cx1": 0.18181818532111785, "cy1": 0, "cx2": 0.18181818532111785, "cy2": 0.23737374194701497, "x": 0.18181818532111785, "y": 0.23737374194701497 },
            { "vectorType": "bezier", "cx1": 0.18181818532111785, "cy1": 0.23737374194701497, "cx2": 0.10101010295617659, "cy2": 0.2702020254077724, "x": 0.10101010295617659, "y": 0.2702020254077724 },
            { "vectorType": "bezier", "cx1": 0.10101010295617659, "cy1": 0.2702020254077724, "cx2": 0.10101010295617659, "cy2": 0.05555555662589712, "x": 0.10101010295617659, "y": 0.05555555662589712 },
            { "vectorType": "bezier", "cx1": 0.10101010295617659, "cy1": 0.05555555662589712, "cx2": 0.05050505147808829, "cy2": 0.05555555662589712, "x": 0.05050505147808829, "y": 0.05555555662589712 },
            { "vectorType": "bezier", "cx1": 0.05050505147808829, "cy1": 0.05555555662589712, "cx2": 0.05050505147808829, "cy2": 0.28787879342510325, "x": 0.05050505147808829, "y": 0.28787879342510325 }
        ]
    }]
}
//natural
function shapeAccidentNatural() {
    this.complexShapes = [{
        fill: { r: 20, g: 20, b: 20 },
        transform: {
            origin: { x: 0.4, y: -1.25 },
            scale: { x: 2.5, y: 2.5 }
        },
        shape: [
            { "vectorType": "vertex", "x": 0, "y": 0.44459645975478046 },
            { "vectorType": "bezier", "cx1": 0, "cy1": 0.44459645975478046, "cx2": 0.20519836001936312, "cy2": 0.39329686974993966, "x": 0.20519836001936312, "y": 0.39329686974993966 },
            { "vectorType": "bezier", "cx1": 0.20519836001936312, "cy1": 0.39329686974993966, "cx2": 0.20588234411583267, "cy2": 0.5581395418618997, "x": 0.20588234411583267, "y": 0.5581395418618997 },
            { "vectorType": "bezier", "cx1": 0.20588234411583267, "cy1": 0.5581395418618997, "cx2": 0.05198357410131035, "cy2": 0.595759241198783, "x": 0.05198357410131035, "y": 0.595759241198783 },
            { "vectorType": "bezier", "cx1": 0.05198357410131035, "cy1": 0.595759241198783, "cx2": 0.05198357410131035, "cy2": 0.36114914755409605, "x": 0.05198357410131035, "y": 0.36114914755409605 },
            { "vectorType": "bezier", "cx1": 0.05198357410131035, "cy1": 0.36114914755409605, "cx2": 0, "cy2": 0.3590971430800458, "x": 0, "y": 0.3590971430800458 },
            { "vectorType": "bezier", "cx1": 0, "cy1": 0.3590971430800458, "cx2": 0, "cy2": 0.7537619679767643, "x": 0, "y": 0.7537619679767643 },
            { "vectorType": "bezier", "cx1": 0, "cy1": 0.7537619679767643, "cx2": 0.20725033840109258, "cy2": 0.70947333237618, "x": 0.20725033840109258, "y": 0.70947333237618 },
            { "vectorType": "bezier", "cx1": 0.20725033840109258, "cy1": 0.70947333237618, "cx2": 0.20725033840109258, "cy2": 0.9967510364032884, "x": 0.20725033840109258, "y": 0.9967510364032884 },
            { "vectorType": "bezier", "cx1": 0.20725033840109258, "cy1": 0.9967510364032884, "cx2": 0.2599179226911933, "cy2": 1, "x": 0.2599179226911933, "y": 1 },
            { "vectorType": "bezier", "cx1": 0.2599179226911933, "cy1": 1, "cx2": 0.2599179226911933, "cy2": 0.23255815440143857, "x": 0.2599179226911933, "y": 0.23255815440143857 },
            { "vectorType": "bezier", "cx1": 0.2599179226911933, "cy1": 0.23255815440143857, "cx2": 0.04993159571958087, "cy2": 0.28248975012101946, "x": 0.04993159571958087, "y": 0.28248975012101946 },
            { "vectorType": "bezier", "cx1": 0.04993159571958087, "cy1": 0.28248975012101946, "cx2": 0.05129959000484078, "cy2": 0, "x": 0.05129959000484078, "y": 0 },
            { "vectorType": "bezier", "cx1": 0.05129959000484078, "cy1": 0, "cx2": 0, "cy2": 0, "x": 0, "y": 0 },
            { "vectorType": "bezier", "cx1": 0, "cy1": 0, "cx2": 0, "cy2": 0.44459645975478046, "x": 0, "y": 0.44459645975478046 }
        ]
    }]
}


//PAUSAS

// Pausa Semibreve (4 tempo)
function shapePauseSemibreve() {
    this.simpleShapes = [{
        shape: "rect",
        fill: { r: 20, g: 20, b: 20 },
        transform: {
            origin: { x: 0.5, y: -0.5 },
            rotate: 0,
            scale: { x: 1, y: 0.5 }
        },
    }]
}

// Pausa Minima (2 tempo)
function shapePauseMinim() {
    this.simpleShapes = [{
        shape: "rect",
        fill: { r: 20, g: 20, b: 20 },
        transform: {
            origin: { x: 0.5, y: 0 },
            rotate: 0,
            scale: { x: 1, y: 0.5 }
        },
    }]
}

// Pausa Seminima (1 tempo)
function shapePauseSeminim() {
    this.complexShapes = [{
        fill: { r: 20, g: 20, b: 20 },
        transform: {
            origin: { x: 0.5, y: -1.5 },
            scale: { x: 3, y: 3 }
        },
        shape: [
            { "vectorType": "vertex", "x": 0.17647058434611324, "y": 0.6288515481280338 },
            { "vectorType": "bezier", "cx1": 0.17647058434611324, "cy1": 0.6288515481280338, "cx2": 0.037815125217024265, "cy2": 0.6008403449314106, "x": 0, "y": 0.7436974846401688 },
            { "vectorType": "bezier", "cx1": -0.037815125217024265, "cy1": 0.8865546243489272, "cx2": 0.15966386202743577, "cy2": 1, "x": 0.15966386202743577, "y": 1 },
            { "vectorType": "bezier", "cx1": 0.15966386202743577, "cy1": 1, "cx2": 0.025210083478016176, "cy2": 0.8809523829081956, "x": 0.11764705623074215, "y": 0.7689075681181851 },
            { "vectorType": "bezier", "cx1": 0.21008402898346812, "cy1": 0.6568627533281746, "cx2": 0.3109243628955328, "cy2": 0.7549019655181147, "x": 0.3109243628955328, "y": 0.7549019655181147 },
            { "vectorType": "bezier", "cx1": 0.3109243628955328, "cy1": 0.7549019655181147, "cx2": 0.11764705623074215, "cy2": 0.4523809637819206, "x": 0.11764705623074215, "y": 0.4523809637819206 },
            { "vectorType": "bezier", "cx1": 0.11764705623074215, "cy1": 0.4523809637819206, "cx2": 0.2563025153598311, "cy2": 0.19327732870348238, "x": 0.2563025153598311, "y": 0.19327732870348238 },
            { "vectorType": "bezier", "cx1": 0.2563025153598311, "cy1": 0.19327732870348238, "cx2": 0.2156862699233204, "cy2": 0.13865545912908897, "x": 0.09663865333239534, "y": 0 },
            { "vectorType": "bezier", "cx1": 0.18487394550545194, "cy1": 0.18907564812381303, "cx2": -0.004201680579669363, "cy2": 0.3389355881308478, "x": 0, "y": 0.38655463536827306 },
            { "vectorType": "bezier", "cx1": 0.004201680579669363, "cy1": 0.43417368260569833, "cx2": 0.17647058434611324, "cy2": 0.6288515481280338, "x": 0.17647058434611324, "y": 0.6288515481280338 }
        ]
    }]
}

// Pausa Colcheia, semi-colcheia  (1/2 tempo e 1/4 tempo)
function shapePauseColcheia(semicolcheia) {
    this.complexShapes = [{
        fill: { r: 20, g: 20, b: 20 },
        transform: {
            origin: { x: 1, y: -0.5 },
            scale: { x: 2, y: 2 }
        },
        shape: [
            { "vectorType": "vertex", "x": 0.27927927927927926, "y": 1 },
            { "vectorType": "bezier", "cx1": 0.27927927927927926, "cy1": 1, "cx2": 0.6036036036036037, "cy2": 0, "x": 0.6036036036036037, "y": 0 },
            { "vectorType": "bezier", "cx1": 0.6036036036036037, "cy1": 0, "cx2": 0.3963963963963964, "cy2": 0.18918917200586818, "x": 0.27927927927927926, "y": 0.17117115398785016 },
            { "vectorType": "bezier", "cx1": 0.3783783783783784, "cy1": -0.05405407123737507, "cx2": 0.036036036036036036, "cy2": -0.10810812099559887, "x": 0, "y": 0.11711710208171122 },
            { "vectorType": "bezier", "cx1": -0.036036036036036036, "cy1": 0.3423423251590213, "cx2": 0.22522522522522523, "cy2": 0.3513513341680303, "x": 0.45045045045045046, "y": 0.2162161990328952 },
            { "vectorType": "bezier", "cx1": 0.3783783783783784, "cy1": 0.4324324152491114, "cx2": 0.17117117117117117, "cy2": 0.9729729557896519, "x": 0.17117117117117117, "y": 0.9729729557896519 },
            { "vectorType": "bezier", "cx1": 0.17117117117117117, "cy1": 0.9729729557896519, "cx2": 0.27927927927927926, "cy2": 1, "x": 0.27927927927927926, "y": 1 }
        ]
    }]
    if (semicolcheia) this.complexShapes.push({
        fill: { r: 20, g: 20, b: 20 },
        transform: {
            origin: { x: 1.35, y: 0.5 },
            scale: { x: 2, y: 2 }
        },
        shape: this.complexShapes[0].shape
    })
}

//---------------------------------------------------------------------------------------------------- DRAW

function drawObject(obj, posX, posY, transform) {
    //Posiciona a transformação do desenho no local que especificamos
    applyTransform(posX, posY, transform)

    //Se o objeto for composto de geometria simples
    if (obj.simpleShapes) {
        //cada objeto pode ser composto de varias formas simples, iteramos por cada uma
        for (let i = 0; i < obj.simpleShapes.length; i++) {

            let shape = obj.simpleShapes[i].shape;
            let shapeTransform = obj.simpleShapes[i].transform;
            let shapeFill = obj.simpleShapes[i].fill;
            let shapeStroke = obj.simpleShapes[i].stroke;

            //transformação
            if (shapeTransform) applyTransform(0, 0, shapeTransform)

            //alteramos o preenchimento e a borda
            shapeFill ? fill(shapeFill.r, shapeFill.g, shapeFill.b) : noFill();
            shapeStroke ? stroke(shapeStroke.r, shapeStroke.g, shapeStroke.b) : noStroke();

            //escolhemos a forma simples especifica e desenhamos (o tamanho é controlado pela transformação que realizamos anteriormente)
            switch (shape) {
                case "ellipse":
                    ellipse(0, 0, 1)
                    break;
                case "rect":
                    rect(0, 0, 1, 1)
                    break;
            }

            //finalizamos a transformação, isso prepara o canvas para a transformação da prox geometria simples
            if (shapeTransform) pop();
        }

        //senao, o objeto é composto por geometria complexa (vertices)
    } else {
        //para cada geometria no objeto
        for (let s = 0; s < obj.complexShapes.length; s++) {

            let shape = obj.complexShapes[s].shape;
            let shapeTransform = obj.complexShapes[s].transform;
            let shapeFill = obj.complexShapes[s].fill;
            let shapeStroke = obj.complexShapes[s].Stroke;

            if (shapeTransform) applyTransform(0, 0, shapeTransform)

            //Inciamos a geometria
            beginShape();

            //a geometria complexa é feita de varios vertices e curvas, iteramos por cada uma
            for (let i = 0; i < shape.length; i++) {
                let shapePoint = shape[i];

                shapeFill ? fill(shapeFill.r, shapeFill.g, shapeFill.b) : noFill();
                shapeStroke ? stroke(shapeStroke.r, shapeStroke.g, shapeStroke.b) : noStroke();

                //escolhemos o tipo do ponto (vertice ou curva) e desenhamos
                switch (shapePoint.vectorType) {
                    case "vertex":
                        vertex(shapePoint.x, shapePoint.y);
                        break;
                    case "bezier":
                        bezierVertex(shapePoint.cx1, shapePoint.cy1, shapePoint.cx2, shapePoint.cy2, shapePoint.x, shapePoint.y);
                        break;
                }
            }
            //Finalizamos a geometria
            endShape();

            if (shapeTransform) pop();
        }
    }
    //Se queremos debugar as origens, desenhamos aqui.
    if (debugObjectOrigin) {
        stroke(255, 0, 0)
        ellipse(0, 0, 4);
    }

    //finalizamos a transformação de posição
    pop()
}

function applyTransform(posX, posY, transform) {
    //aplicamos a transformação que passamos por parametro, se nao passarmos a transformação, simplesmente não executo ela
    //inicia a transformação
    push();
    if (posX && posY) translate(posX, posY); // posição
    if (transform) {
        if (transform.origin) translate(-transform.origin.x * scaleFactor, transform.origin.y * scaleFactor); //origem
        if (transform.rotate) rotate(transform.rotate); //rotação
        if (transform.scale) scale(scaleFactor * transform.scale.x, scaleFactor * transform.scale.y); //escala
    }
}