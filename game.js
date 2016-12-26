const display = document.getElementById("canvas");
const displaySize = display.width = display.height = Math.min(window.innerWidth, window.innerHeight) * 2;
const gridSize = 40;

const blockSize = displaySize / gridSize;
const context = display.getContext("2d");

let apple = {x: parseInt(Math.random() * gridSize), y: parseInt(Math.random() * gridSize)};
let snakeP1 = {direction: 0, directionRequest: 0, colorLight: "#2196F3", colorDark: "#1E88E5", nodes: [{x: 5, y: 5}], score: 0};
let snakeP2 = {direction: 0, directionRequest: 0, colorLight: "#f44336", colorDark: "#e53935", nodes: [{x: 34, y: 34}], score: 0};

display.style.width = (displaySize / 2) + "px";
display.style.height = (displaySize / 2) + "px";

document.onkeydown = (event) => {
    event = event || window.event;
    if (event.keyCode === 87)
        snakeP1.directionRequest = 1;
    if (event.keyCode === 68)
        snakeP1.directionRequest = 2;
    if (event.keyCode === 83)
        snakeP1.directionRequest = 3;
    if (event.keyCode === 65)
        snakeP1.directionRequest = 4;
    if (event.keyCode === 38)
        snakeP2.directionRequest = 1;
    if (event.keyCode === 39)
        snakeP2.directionRequest = 2;
    if (event.keyCode === 40)
        snakeP2.directionRequest = 3;
    if (event.keyCode === 37)
        snakeP2.directionRequest = 4;
};

requestAnimationFrame(frame);

function frame() {
    setTimeout(function () {
        requestAnimationFrame(frame);
    }, 40);
    context.clearRect(0, 0, displaySize, displaySize);
    context.fillStyle = "#8BC34A";
    context.beginPath();
    context.rect(apple.x * blockSize, apple.y * blockSize, blockSize, blockSize);
    context.fill();
    updateSnake(snakeP1);
    updateSnake(snakeP2);
    drawSnake(snakeP1);
    drawSnake(snakeP2);
}

function updateSnake(snake) {
    if (snake.direction === 0 || snake.direction % 2 !== snake.directionRequest % 2)
        snake.direction = snake.directionRequest;
    let x = snake.nodes[0].x;
    let y = snake.nodes[0].y;
    if (x === apple.x && y === apple.y) {
        apple = {x: parseInt(Math.random() * gridSize), y: parseInt(Math.random() * gridSize)};
        snake.score++;
        let end = snake.nodes[snake.nodes.length - 1];
        snake.nodes.push({x: end.x, y: end.y});
        snake.nodes.push({x: end.x, y: end.y});
        snake.nodes.push({x: end.x, y: end.y});
    }
    switch (snake.direction) {
        case 1:
            snake.nodes.unshift({x: x, y: y - 1});
            snake.nodes.pop();
            break;
        case 2:
            snake.nodes.unshift({x: x + 1, y: y});
            snake.nodes.pop();
            break;
        case 3:
            snake.nodes.unshift({x: x, y: y + 1});
            snake.nodes.pop();
            break;
        case 4:
            snake.nodes.unshift({x: x - 1, y: y});
            snake.nodes.pop();
            break;
    }
    snake.nodes[0].x = ((snake.nodes[0].x % gridSize) + gridSize) % gridSize;
    snake.nodes[0].y = ((snake.nodes[0].y % gridSize) + gridSize) % gridSize;
}

function drawSnake(snake) {
    for (let i = snake.nodes.length - 1; i >= 0; i--) {
        if (i === 0)
            context.fillStyle = "#FFFFFF";
        else if (snake.nodes[i].x % 2 === snake.nodes[i].y % 2)
            context.fillStyle = snake.colorLight;
        else
            context.fillStyle = snake.colorDark;
        context.beginPath();
        context.rect(snake.nodes[i].x * blockSize, snake.nodes[i].y * blockSize, blockSize, blockSize);
        context.fill();
    }
}