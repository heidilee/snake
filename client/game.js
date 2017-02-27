const display = document.getElementById("canvas");
const context = display.getContext("2d");
const socket = io();

const colors = [["#E53935", "#F44336"], ["#D81B60", "#E91E63"], ["#8E24AA", "#9C27B0"], ["#5E35B1", "#673AB7"],
    ["#3949AB", "#3F51B5"], ["#1E88E5", "#2196F3"], ["#039BE5", "#03A9F4"], ["#00ACC1", "#00BCD4"],
    ["#00897B", "#009688"], ["#43A047", "#4CAF50"], ["#C0CA33", "#CDDC39"], ["#FDD835", "#FFEB3B"],
    ["#FFB300", "#FFC107"], ["#FB8C00", "#FF9800"], ["#F4511E", "#FF5722"], ["#546E7A", "#607D8B"]];
const gridSize = 40;

let displaySize = display.width = display.height = Math.min(window.innerWidth, window.innerHeight) * 2;
let blockSize = displaySize / gridSize;

display.style.width = (displaySize / 2) + "px";
display.style.height = (displaySize / 2) + "px";

let apple = {};
let snakes = {};

socket.on("update", function (data) {
    apple = data.apple;
    snakes = data.snakes;
    requestAnimationFrame(frame);
});

let player = {
    color: parseInt(Math.random() * colors.length),
    direction: 0,
    directionRequest: 0,
    keyCodes: [37, 38, 39, 40],
    nodes: [{x: parseInt(Math.random() * gridSize), y: parseInt(Math.random() * gridSize)}],
    score: 0,
};

socket.emit("joinGame", player);

document.onkeydown = function (event) {
    event = event || window.event;
    if (event.keyCode === player.keyCodes[0])
        player.directionRequest = 1;
    if (event.keyCode === player.keyCodes[1])
        player.directionRequest = 2;
    if (event.keyCode === player.keyCodes[2])
        player.directionRequest = 3;
    if (event.keyCode === player.keyCodes[3])
        player.directionRequest = 4;
    socket.emit("keyPress", player.directionRequest);
};

window.onresize = function () {
    displaySize = display.width = display.height = Math.min(window.innerWidth, window.innerHeight) * 2;
    blockSize = displaySize / gridSize;
    display.style.width = (displaySize / 2) + "px";
    display.style.height = (displaySize / 2) + "px";
};

function frame() {
    context.clearRect(0, 0, displaySize, displaySize);
    context.fillStyle = "#8BC34A";
    context.beginPath();
    context.rect(apple.x * blockSize, apple.y * blockSize, blockSize, blockSize);
    context.fill();
    for (let key in snakes)
        drawSnake(snakes[key]);
}

function drawSnake(snake) {
    for (let i = snake.nodes.length - 1; i >= 0; i--) {
        if (i === 0)
            context.fillStyle = "#FFFFFF";
        else if (snake.nodes[i].x % 2 === snake.nodes[i].y % 2)
            context.fillStyle = colors[snake.color][1];
        else
            context.fillStyle = colors[snake.color][0];
        context.beginPath();
        context.rect(snake.nodes[i].x * blockSize, snake.nodes[i].y * blockSize, blockSize, blockSize);
        context.fill();
    }
}
