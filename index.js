// SERVER

let express = require("express")
let app = express();

app.use(express.static(__dirname + "/client"));

app.all("*", function(req, res) {
	res.redirect("/");
});

let server = app.listen(8080, function () {
	let port = server.address().port;
	console.log("Server running at port %s", port);
});

let clients = {};
let io = require("socket.io") (server);

// GAME

const gridSize = 40;

let apple = {x: parseInt(Math.random() * gridSize), y: parseInt(Math.random() * gridSize)};
let snakes = {};

io.sockets.on("connection", function(client) {
	console.log("User connected");
	client.on("joinGame", function(snake) {
		console.log(snake.id + " joined the game");
		clients[snake.id] = client;
		console.log("Added " + snake.id + " to the client list");
		console.log("There are " + Object.keys(clients).length + " clients total");
		snakes[snake.id] = snake;
	});
	client.on("keyPress", function(keyPress) {
		console.log(keyPress.id + " requested direction " + keyPress.direction);
		snakes[keyPress.id].directionRequest = keyPress.direction;
	});
});

setInterval(function () {
	for (let key in snakes) {
		updateSnake(snakes[key]);
	};
	for (let key in clients) {
		clients[key].emit('update', {apple: apple, snakes: snakes});
	};
}, 40);

function updateSnake(snake) {
	if (snake.direction === 0 || snake.direction % 2 !== snake.directionRequest % 2)
		snake.direction = snake.directionRequest;
	let x = snake.nodes[0].x;
	let y = snake.nodes[0].y;
	for (let i = 1; i < snake.nodes.length; i++)
		if (x === snake.nodes[i].x && y === snake.nodes[i].y)
			console.log(snake.id + " has collided");
	if (x === apple.x && y === apple.y) {
		apple = {
			x: parseInt(Math.random() * gridSize),
			y: parseInt(Math.random() * gridSize),
		};
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
