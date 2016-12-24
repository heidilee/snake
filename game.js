const display = document.getElementById("canvas");
const context = display.getContext("2d");

const displaySize = display.width = display.height = Math.min(window.innerWidth, window.innerHeight) * 2;
display.style.width = (displaySize / 2) + "px";
display.style.height = (displaySize / 2) + "px";

let blockSize = displaySize / 40;

let apple = {x: parseInt(Math.random() * 40), y: parseInt(Math.random() * 40)};
let snakeP1 = [];
let snakeP2 = [];

let directionP1 = 0;
let directionP2 = 0;

snakeP1.push({x: 5, y: 5});
snakeP2.push({x: 34, y: 34});

document.onkeydown = (event) => {
    event = event || window.event;
    if (event.keyCode == 87)
        directionP1 = 1;
    if (event.keyCode == 68)
        directionP1 = 2;
    if (event.keyCode == 83)
        directionP1 = 3;
    if (event.keyCode == 65)
        directionP1 = 4;
    if (event.keyCode == 38)
        directionP2 = 1;
    if (event.keyCode == 39)
        directionP2 = 2;
    if (event.keyCode == 40)
        directionP2 = 3;
    if (event.keyCode == 37)
        directionP2 = 4;
};

requestAnimationFrame(frame);

function update(snake, direction) {
    if (snake[0].x === apple.x && snake[0].y === apple.y) {
        snake.push({x: apple.x, y: apple.y});
        snake.push({x: apple.x, y: apple.y});
        snake.push({x: apple.x, y: apple.y});
        snake.push({x: apple.x, y: apple.y});
        apple.x = parseInt(Math.random() * 40);
        apple.y = parseInt(Math.random() * 40);
    }
    if (direction === 1) {
        snake.unshift({x: snake[0].x, y: snake[0].y - 1});
        snake.pop();
        if (snake[0].y < 0)
            snake[0].y = 39;
    }
    if (direction === 2) {
        snake.unshift({x: snake[0].x + 1, y: snake[0].y});
        snake.pop();
        if (snake[0].x > 39)
            snake[0].x = 0;
    }
    if (direction === 3) {
        snake.unshift({x: snake[0].x, y: snake[0].y + 1});
        snake.pop();
        if (snake[0].y > 39)
            snake[0].y = 0;
    }
    if (direction === 4) {
        snake.unshift({x: snake[0].x - 1, y: snake[0].y});
        snake.pop();
        if (snake[0].x < 0)
            snake[0].x = 39;
    }
}

function frame() {
    setTimeout(function () {
        requestAnimationFrame(frame);
    }, 40);
    update(snakeP1, directionP1);
    update(snakeP2, directionP2);
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