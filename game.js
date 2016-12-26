const display = document.getElementById("canvas");
const displaySize = display.width = display.height = Math.min(window.innerWidth, window.innerHeight) * 2;

const blockSize = displaySize / 40;
const context = display.getContext("2d");

display.style.width = (displaySize / 2) + "px";
display.style.height = (displaySize / 2) + "px";

let apple = {x: parseInt(Math.random() * 40), y: parseInt(Math.random() * 40)};
let snakeP1 = [];
let snakeP2 = [];

let directionRequestP1 = 0;
let directionRequestP2 = 0;
let directionP1 = 0;
let directionP2 = 0;

snakeP1.push({x: 5, y: 5});
snakeP2.push({x: 34, y: 34});

document.onkeydown = (event) => {
    event = event || window.event;
    if (event.keyCode == 87)
        directionRequestP1 = 1;
    if (event.keyCode == 68)
        directionRequestP1 = 2;
    if (event.keyCode == 83)
        directionRequestP1 = 3;
    if (event.keyCode == 65)
        directionRequestP1 = 4;
    if (event.keyCode == 38)
        directionRequestP2 = 1;
    if (event.keyCode == 39)
        directionRequestP2 = 2;
    if (event.keyCode == 40)
        directionRequestP2 = 3;
    if (event.keyCode == 37)
        directionRequestP2 = 4;
};

requestAnimationFrame(frame);

function update(snake, directionRequest) {
    let x = snake[0].x;
    let y = snake[0].y;
    if (x === apple.x && y == apple.y) {
        apple = {x: parseInt(Math.random() * 40), y: parseInt(Math.random() * 40)};
        snake.unshift({x: x, y: y});
        snake.unshift({x: x, y: y});
        snake.unshift({x: x, y: y});
        snake.unshift({x: x, y: y});
    }
    switch (directionRequest) {
        case 1:
            snake.unshift({x: x, y: y - 1});
            snake.pop();
            break;
        case 2:
            snake.unshift({x: x + 1, y: y});
            snake.pop();
            break;
        case 3:
            snake.unshift({x: x, y: y + 1});
            snake.pop();
            break;
        case 4:
            snake.unshift({x: x - 1, y: y});
            snake.pop();
            break;
    }
    snake[0].x = ((snake[0].x % 40) + 40) % 40;
    snake[0].y = ((snake[0].y % 40) + 40) % 40;
}

function frame() {
    setTimeout(function () {
        requestAnimationFrame(frame);
    }, 40);
    if ((directionP1 % 2 !== directionRequestP1 % 2) || directionP1 === 0) {
        directionP1 = directionRequestP1;
    }
    update(snakeP1, directionP1);
    if ((directionP2 % 2 !== directionRequestP2 % 2) || directionP2 === 0) {
        directionP2 = directionRequestP2;
    }
    update(snakeP2, directionP2);
    context.clearRect(0, 0, displaySize, displaySize);
    context.fillStyle = "#8BC34A";
    context.beginPath();
    context.rect(apple.x * blockSize, apple.y * blockSize, blockSize, blockSize);
    context.fill();
    for (let i = snakeP1.length - 1; i >= 0; i--) {
        if (i === 0)
            context.fillStyle = "#FFFFFF";
        else if (snakeP1[i].x % 2 === snakeP1[i].y % 2)
            context.fillStyle = "#2196F3";
        else
            context.fillStyle = "#1E88E5";
        context.beginPath();
        context.rect(snakeP1[i].x * blockSize, snakeP1[i].y * blockSize, blockSize, blockSize);
        context.fill();
    }
    for (let i = snakeP2.length - 1; i >= 0; i--) {
        if (i === 0)
            context.fillStyle = "#FFFFFF";
        else if (snakeP2[i].x % 2 === snakeP2[i].y % 2)
            context.fillStyle = "#f44336";
        else
            context.fillStyle = "#e53935";
        context.beginPath();
        context.rect(snakeP2[i].x * blockSize, snakeP2[i].y * blockSize, blockSize, blockSize);
        context.fill();
    }
}
