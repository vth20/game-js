const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const socketIO = require('socket.io');
var cors = require('cors');
const { arch } = require('os');
// enable cors
app.use(cors({ origin: 'http://localhost:1234' }));

app.get('/', (req, res) => {
	res.send("abc");
});
const io = socketIO(server, {
	cors: {
		origin: '*',
		methods: ['GET', 'POST'],
		credentials: true,
		secure: true,
		transports: ['websocket', 'polling'],
	},
	allowEIO4: true,
});

let actors = {}
io.on('connection', (socket) => {
	console.log(socket.id);
	socket.join("room");
	socket.on('new-user', () => {
		if (!actors.player) {
			actors.player = socket.id
		} else if (!actors.enemy) {
			actors.enemy = socket.id
		}
		console.log(actors);
		io.emit('user-info', actors);
	});
	socket.on('player-action', (player) => {
		console.log(player);
	})
});

server.listen(3000, () => {
	console.log('listening on: 3000');
});