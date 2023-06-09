// these constructors will throw errors if the browser tries to use them
const button = nullCheck(document.querySelector('#start-button'), '');
const canvas: HTMLCanvasElement = nullCheck(document.querySelector('#canvas'), '');
const context = nullCheck(canvas.getContext('2d'), '');
const displayWidth = canvas.width;
const displayHeight = canvas.height;
const gridWidth = 24;
const gridHeight = 24;
const cellWidth = displayWidth / gridWidth;
const cellHeight = displayHeight / gridHeight;
const appleImage = new Image(cellWidth, cellHeight);
appleImage.src = './images/apple.png';
let highScore = 0;

function nullCheck<T>(arg: T | null, err: string): T{
    if(arg === null) throw err;
    return arg;
}

const state: any = {};

// drawing helpers

function clear(){
    context.fillStyle = 'black';
    context.fillRect(0, 0, displayWidth, displayHeight);
}

function drawCell(x: number, y: number){
    context.fillRect(x * cellWidth + 2.5, y * cellHeight + 2.5, cellWidth - 5, cellHeight - 5);
}

function drawDiamond(x: number, y: number){
    const vertices = [[1, 0.5], [0.5, 0], [0, 0.5], [0.5, 1]];
    const coords = [];
    for (const [vx, vy] of vertices) {
        coords.push([(x + vx) * cellWidth, (y + vy) * cellHeight]);
    }
    context.beginPath();
    context.moveTo(coords[0][0],coords[0][1]);
    for (const [cx, cy] of coords) {
        context.lineTo(cx, cy);
    }
    context.fill();
}

function drawImage(image: HTMLImageElement, x: number, y: number){
    x *= cellWidth;
    y *= cellHeight;
    context.drawImage(image, x, y, cellWidth, cellHeight);
}

// coord helpers

function coordToKey(x: number, y: number){
    return `${x},${y}`;
}

function keyToCoord(key: string){
    return key.split(',').map(Number);
}

// game logic helpers

function resetState(){
    state.x = 11;
    state.y = 11;
    state.dx = 1;
    state.dy = 0;
    state.delay = 160; // start at about 6 updates/second
    state.tail = [];
    state.length = 3;
    state.score = 0;
    placeFruit();
}

function placeFruit(){
    const coords = [];
    for(let x = 0; x < gridWidth; x++){
        for(let y = 0; y < gridHeight; y++){
            const key = coordToKey(x, y);
            if(state.tail.includes(key)) continue;
            coords.push([x, y]);
        }
    }
    const idx = Math.floor(Math.random() * coords.length);
    const [fx, fy] = coords[idx];
    state.fx = fx; state.fy = fy;
}

function scoreUpdate(){
    if(state.score > highScore) highScore = state.score;
    const score = document.querySelector('#score');
    if(!score) throw '';
    score.innerHTML = `Score: ${state.score} High Score: ${highScore}`;
}

function draw(){
    clear();
    context.fillStyle = 'white';
    drawDiamond(state.x, state.y);
    for (const key of state.tail) {
        const [x, y] = keyToCoord(key);
        drawCell(x, y);
    }
    drawImage(appleImage, state.fx, state.fy);
    // drawDisplay();
}

function drawDisplay(){
    context.font = "32px serif";
    context.fillText(`Score: ${state.score}`, 0, 32);
    const hs = `High Score: ${highScore}`;
    const hsWidth = context.measureText(hs).width;
    context.fillText(hs, displayWidth - hsWidth, 32);
}

function loop(){
    // simulate
    const key = coordToKey(state.x, state.y);
    state.tail.unshift(key);
    state.tail = state.tail.slice(0, state.length - 1);
    state.x += state.dx;
    state.y += state.dy;
    if(state.x === state.fx && state.y === state.fy){
        state.length++;
        state.delay *= 0.95;
        state.score++;
        scoreUpdate();
        placeFruit();
    }
    // check for lose conditions
    button.innerHTML = 'Game Over! Try again?';
    if(state.x < 0 || state.x >= gridWidth) return;
    else if(state.y < 0 || state.y >= gridHeight)return;
    else if(state.tail.includes(coordToKey(state.x, state.y)))return;
    button.innerHTML = 'Reset';
    // draw
    draw();
    // setup next loop
    setTimeout(loop, state.delay);
}

function keyDown(event: KeyboardEvent){
    const {key} = event;
    
    let dx = 0;
    let dy = 0;
    if(key === 'd'){dx = 1;}
    else if(key === 'a'){dx = -1;}
    else if(key === 'w'){dy = -1;}
    else if(key === 's'){dy = 1;}
    if(dx === state.dx || dy === state.dy){
        // either pressed in same direction or reverse
        // either way ignore
    }
    else{
        state.dx = dx;
        state.dy = dy;
    }
}

function main(){
    button.addEventListener('click', e => {
        button.innerHTML = "Reset";
        resetState();
        loop();
    });
    window.addEventListener('keydown', keyDown);
    clear();
    // resetState();
    // draw();
}

appleImage.onload = main;