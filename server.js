const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
const server = require('http').createServer(app);
const io = require("socket.io")(server);

app.use(express.static(__dirname + "/client"));
app.all("*", function (req, res) {
    res.redirect("/");
});

server.listen(port, function () {
    console.log("Server running at port %s", port);
});

const gridSize = 40;

let apple = {x: parseInt(Math.random() * gridSize), y: parseInt(Math.random() * gridSize)};
let clients = {};
let snakes = {};

io.on("connection", function (client) {
    client.id = randomString(32);
    client.isPlaying = false;
    clients[client.id] = client;
    client.on("joinGame", function (snake) {
        snakes[client.id] = snake;
        client.isPlaying = true;
    });
    client.on("keyPress", function (direction) {
        if (client.isPlaying)
            snakes[client.id].directionRequest = direction;
    });
    client.on("disconnect", function () {
        delete clients[client.id];
        delete snakes[client.id];
    });
});

setInterval(function () {
    for (let key in snakes) {
        updateSnake(snakes[key]);
    }
    for (let key in clients) {
        clients[key].emit('update', {apple: apple, snakes: snakes});
    }
}, 40);

let updateSnake = function (snake) {
    if (snake.direction === 0 || snake.direction % 2 !== snake.directionRequest % 2)
        snake.direction = snake.directionRequest;
    let x = snake.nodes[0].x;
    let y = snake.nodes[0].y;
    for (let i = 1; i < snake.nodes.length; i++)
        if (x === snake.nodes[i].x && y === snake.nodes[i].y)
            ; // do nothing
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
            snake.nodes.unshift({x: x - 1, y: y});
            snake.nodes.pop();
            break;
        case 2:
            snake.nodes.unshift({x: x, y: y - 1});
            snake.nodes.pop();
            break;
        case 3:
            snake.nodes.unshift({x: x + 1, y: y});
            snake.nodes.pop();
            break;
        case 4:
            snake.nodes.unshift({x: x, y: y + 1});
            snake.nodes.pop();
            break;
    }
    snake.nodes[0].x = ((snake.nodes[0].x % gridSize) + gridSize) % gridSize;
    snake.nodes[0].y = ((snake.nodes[0].y % gridSize) + gridSize) % gridSize;
};

let randomString = function (length) {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < length; i++) {
        text += possible.charAt(parseInt(Math.random() * possible.length));
    }
    return text;
};
