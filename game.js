const display = document.getElementById("canvas");
const context = display.getContext("2d");

const displaySize = display.width = display.height = Math.min(window.innerWidth, window.innerHeight) * 2;
display.style.width = (displaySize / 2) + "px";
display.style.height = (displaySize / 2) + "px";

let blockSize = displaySize / 40;

let apple = {x: parseInt(Math.random() * 40), y: parseInt(Math.random() * 40)};
let snakeP1 = [];
let snakeP2 = [];

let direction = 0;

snakeP1.push({x: 5, y: 5});
snakeP2.push({x: 34, y: 34});

document.onkeydown = (event) => {
    event = event || window.event;
    if (event.keyCode == 38)
        direction = 1;
    if (event.keyCode == 39)
        direction = 2;
    if (event.keyCode == 40)
        direction = 3;
    if (event.keyCode == 37)
        direction = 4;
};

requestAnimationFrame(frame);

function update() {
    if (direction === 1) {
        snakeP2.unshift({x: snakeP2[0].x, y: snakeP2[0].y - 1});
        snakeP2.pop();
        if (snakeP2[0].y < 0)
            snakeP2[0].y = 39;
    }
    if (direction === 2) {
        snakeP2.unshift({x: snakeP2[0].x + 1, y: snakeP2[0].y});
        snakeP2.pop();
        if (snakeP2[0].x > 39)
            snakeP2[0].x = 0;
    }
    if (direction === 3) {
        snakeP2.unshift({x: snakeP2[0].x, y: snakeP2[0].y + 1});
        snakeP2.pop();
        if (snakeP2[0].y > 39)
            snakeP2[0].y = 0;
    }
    if (direction === 4) {
        snakeP2.unshift({x: snakeP2[0].x - 1, y: snakeP2[0].y});
        snakeP2.pop();
        if (snakeP2[0].x < 0)
            snakeP2[0].x = 39;
    }
}

function frame() {
    setTimeout(function () {
        requestAnimationFrame(frame);
    }, 40);
    update();
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