const display = document.getElementById("canvas");
const context = display.getContext("2d");

const displaySize = display.width = display.height = Math.min(window.innerWidth, window.innerHeight) * 2;
display.style.width = (displaySize / 2) + "px";
display.style.height = (displaySize / 2) + "px";

let blockSize = displaySize / 50;

let apple = {x: Math.random() * 50, y: Math.random() * 50};
let snakeP1 = [];
let snakeP2 = [];

let direction = 0;

snakeP1.push({x: 5, y: 5});
snakeP2.push({x: 44, y: 44});

document.onkeydown = (event) => {
    event = event || window.event;
    if (event.keyCode == 38 && direction != 3)
        direction = 1;
    if (event.keyCode == 39 && direction != 4)
        direction = 2;
    if (event.keyCode == 40 && direction != 1)
        direction = 3;
    if (event.keyCode == 37 && direction != 2)
        direction = 4;
};

requestAnimationFrame(frame);

function update() {

}

function frame() {
    requestAnimationFrame(frame);
    context.clearRect(0, 0, displaySize, displaySize);
    context.fillStyle = "#8BC34A";
    context.beginPath();
    context.rect(apple.x * blockSize, apple.y * blockSize, blockSize, blockSize);
    context.fill();
    context.fillStyle = "#03A9F4";
    context.beginPath();
    for (let i = 0; i < snakeP1.length; i++)
        context.rect(snakeP1[i].x * blockSize, snakeP1[i].y * blockSize, blockSize, blockSize);
    context.fill();
    context.fillStyle = "#f44336";
    context.beginPath();
    for (let i = 0; i < snakeP2.length; i++)
        context.rect(snakeP2[i].x * blockSize, snakeP2[i].y * blockSize, blockSize, blockSize);
    context.fill();
}