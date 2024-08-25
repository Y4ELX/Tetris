// Inicializar canvas
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const width = 10
const height = 20
const blockS = 30

let puntaje = 0

document.body.appendChild(canvas);

canvas.width = width * blockS;
canvas.height = height * blockS;

context.scale(blockS, blockS);

const tablero = [
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0]
]

const pieza = {
    position: { x: Math.floor(Math.random() * width / 2 + 1), y: 0},
    shape: [
        [1, 1],
        [1, 1]
    ]
}

let piezas = {
    shape: [
        [
            [1, 1],
            [1, 1]
        ],
        [
            [1, 1, 1, 1]
        ],
        [
            [1, 1, 1],
            [0, 1, 0]
        ],
        [
            [1, 1, 1],
            [1, 0, 0]
        ],
        [
            [1, 1, 1],
            [0, 0, 1]
        ],
        [
            [1, 1, 0],
            [0, 1, 1]
        ],
        [
            [0, 1, 1],
            [1, 1, 0]
        ]
    ]
}
function getRandomForma() {
    const randomIndex = Math.floor(Math.random() * formas.length);
    return formas[randomIndex];
}

function update() {
    draw();
    window.requestAnimationFrame(update);

}

function draw() {
    context.fillStyle = '#000000';
    context.fillRect(0, 0, canvas.width, canvas.height);

    tablero.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value === 1) {
                context.fillStyle = '#1cda16';
                context.fillRect(x, y, 1, 1);
            }
        });
    });

    pieza.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value === 1) {
                context.fillStyle = '#1cda16';
                context.fillRect(pieza.position.x + x, pieza.position.y + y, 1, 1);
            }
        });
    });
}

document.addEventListener('keydown', event => {
    if (event.key === 'A' || event.key === 'a') {
        pieza.position.x--;
        if (checarColision()) {
            pieza.position.x++;
        }
    }
    if (event.key === 'D' || event.key === 'd') {
        pieza.position.x++;
        if (checarColision()) {
            pieza.position.x--;
        }
    }
    if (event.key === 'R' || event.key === 'r') {
        window.location.reload();
    }
    if (event.key === 'S' || event.key === 's') {
        pieza.position.y++;
        if (checarColision()) {
            pieza.position.y--;
            solidificar();
            checarLineaCompleta();
            piezaRandom();  
        }
    }

    if (event.key === 'E' || event.key === 'e') {
        const piezaSR = pieza.shape
        const rotated = []

        for(let i=0; i < pieza.shape[0].length; i++){
            const row = []

            for(let j = pieza.shape.length-1; j >= 0; j--){
                row.push(pieza.shape[j][i])
            }

            rotated.push(row)
        }
        pieza.shape = rotated

        if (checarColision()) {
            pieza.shape = piezaSR
        }
    }
});


function checarColision() {
    const shape = pieza.shape;
    const pos = pieza.position;

    for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
            if (shape[y][x] && (tablero[y + pos.y] && tablero[y + pos.y][x + pos.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

function solidificar(){
    pieza.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value === 1) {
                tablero[y + pieza.position.y][x + pieza.position.x] = 1;
            }
        });
    });

    pieza.position.y = 0;
    pieza.position.x = Math.floor(Math.random() * width/2 +1);
}


function checarLineaCompleta(){
    const rowsToRemove = [];

    tablero.forEach((row, y) => {
        if (row.every(value => value !== 0)) {
            rowsToRemove.push(y);
        }
    });

    rowsToRemove.forEach(y => {
        tablero.splice(y, 1);

        const newRow = Array(width).fill(0);
        tablero.unshift(newRow);

        puntaje += 10;
        document.getElementById("puntaje").innerHTML = "Puntaje: <br>"+ puntaje;
    });
}

function piezaRandom(){
    pieza.shape = piezas.shape[Math.floor(Math.random() * piezas.shape.length)];
}

setInterval(() => {
    pieza.position.y++;
    if (checarColision()) {
        pieza.position.y--;
        solidificar();
        checarLineaCompleta();
        piezaRandom();  
    }
}, 500);

update();