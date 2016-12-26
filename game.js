const display = document.getElementById("canvas");
const displaySize = display.width = display.height = Math.min(window.innerWidth, window.innerHeight) * 2;
const gridSize = 40;

const blockSize = displaySize / gridSize;
const context = display.getContext("2d");

let apple = {x: parseInt(Math.random() * gridSize), y: parseInt(Math.random() * gridSize)};
let snakes = [{
    direction: 0,
    directionRequest: 0,
    colorLight: "#2196F3",
    colorDark: "#1E88E5",
    keyCodes: [87, 68, 83, 65],
    nodes: [{x: 5, y: 5}],
    score: 0
}, {
    direction: 0,
    directionRequest: 0,
    colorLight: "#f44336",
    colorDark: "#e53935",
    keyCodes: [38, 39, 40, 37],
    nodes: [{x: gridSize - 6, y: gridSize - 6}],
    score: 0
}];

display.style.width = (displaySize / 2) + "px";
display.style.height = (displaySize / 2) + "px";

document.onkeydown = (event) => {
    event = event || window.event;
    snakes.forEach((snake) => {
        if (event.keyCode === snake.keyCodes[0])
            snake.directionRequest = 1;
        if (event.keyCode === snake.keyCodes[1])
            snake.directionRequest = 2;
        if (event.keyCode === snake.keyCodes[2])
            snake.directionRequest = 3;
        if (event.keyCode === snake.keyCodes[3])
            snake.directionRequest = 4;
    });
};

requestAnimationFrame(frame);

function frame() {
    setTimeout(() => {
        requestAnimationFrame(frame);
    }, 40);
    context.clearRect(0, 0, displaySize, displaySize);
    context.fillStyle = "#8BC34A";
    context.beginPath();
    context.rect(apple.x * blockSize, apple.y * blockSize, blockSize, blockSize);
    context.fill();
    snakes.forEach(updateSnake);
    snakes.forEach(drawSnake);
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