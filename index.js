var express = require('express')
var app = express();

app.use(express.static(__dirname + '/client'));

var server = app.listen(8080, function () {
	var port = server.address().port;
	console.log('Server running at port %s', port);
});

var io = require('socket.io') (server);

io.on('connection', function(client) {
	console.log('User connected');
	client.on('joinGame', function(snake) {
		console.log(snake.id + ' joined the game');
	});
});

/*var INTERVAL = 50;

setInterval (function() {
	g.mainLoop();
}, INTERVAL);*/
