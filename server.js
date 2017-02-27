const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
const server = require("http").createServer(app);
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
    console.log("Client " + client.id + " has connected.");
    client.isConnected = true;
    client.isPlaying = false;
    clients[client.id] = client;
    client.on("joinGame", function (snake) {
        console.log("Client " + client.id + " has joined the game.");
        snake.direction = 0;
        snake.directionRequest = 0;
        snake.opacity = 1.0;
        snake.nodes = [{x: parseInt(Math.random() * gridSize), y: parseInt(Math.random() * gridSize)}, {}];
        snake.score = 0;
        snakes[client.id] = snake;
        client.isPlaying = true;
    });
    client.on("keyPress", function (direction) {
        if (client.isPlaying)
            snakes[client.id].directionRequest = direction;
    });
    client.on("disconnect", function () {
        console.log("Client " + client.id + " has disconnected.");
        client.isConnected = false;
        if (client.isPlaying) {
            console.log("Client " + client.id + " has left the game.");
            client.isPlaying = false;
        }
    });
});

setInterval(function () {
    for (let key in snakes)
        updateSnake(key, snakes[key]);
    for (let key in clients)
        clients[key].emit("update", {apple: apple, snakes: snakes});
}, 40);

let updateSnake = function (key, snake) {
    if (clients[key].isPlaying) {
        if (snake.direction === 0 || snake.direction % 2 !== snake.directionRequest % 2)
            snake.direction = snake.directionRequest;
        let x = snake.nodes[0].x;
        let y = snake.nodes[0].y;
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
        x = snake.nodes[0].x = ((snake.nodes[0].x % gridSize) + gridSize) % gridSize;
        y = snake.nodes[0].y = ((snake.nodes[0].y % gridSize) + gridSize) % gridSize;
        for (let i = 1; i < snake.nodes.length; i++)
            if (x === snake.nodes[i].x && y === snake.nodes[i].y) {
                console.log("Client " + key + " has left the game.");
                clients[key].isPlaying = false;
            }
        if (x === apple.x && y === apple.y) {
            apple = {
                x: parseInt(Math.random() * gridSize),
                y: parseInt(Math.random() * gridSize),
            };
            snake.score++;
            snake.nodes.push({});
            snake.nodes.push({});
        }
    } else
        snake.opacity -= 0.1;
    if (snake.opacity < 0) {
        delete snakes[key];
        if (clients[key].isConnected)
            clients[key].emit("collision", snake.score);
        else
            delete clients[key];
    }
};