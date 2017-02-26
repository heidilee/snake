const display = document.getElementById("canvas");
const context = display.getContext("2d");
const gridSize = 40;
const socket = io();

let displaySize = display.width = display.height = Math.min(window.innerWidth, window.innerHeight) * 2;
let blockSize = displaySize / gridSize;

display.style.width = (displaySize / 2) + "px";
display.style.height = (displaySize / 2) + "px";

let apple = {x: 0, y: 0};
let snakes = {};

socket.on("update", function (data) {
	apple = data.apple;
	snakes = data.snakes;
	requestAnimationFrame(frame);
});

let player = {
	direction: 0,
	directionRequest: 0,
	colorLight: "#2196F3",
	colorDark: "#1E88E5",
	keyCodes: [87, 68, 83, 65],
	nodes: [{x: 5, y: 5}],
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
			context.fillStyle = snake.colorLight;
		else
			context.fillStyle = snake.colorDark;
		context.beginPath();
		context.rect(snake.nodes[i].x * blockSize, snake.nodes[i].y * blockSize, blockSize, blockSize);
		context.fill();
	}
}
