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

let actors = 0
io.on('connection', (socket) => {
	actors++;
	io.to(socket.id).emit('role', actors % 2 === 0 ? 'player' : 'enemy');
	socket.join("room");
	socket.on('keydown-left', (client_role) => {
		console.log(client_role);
		socket.broadcast.emit('update-position', { action: 'left-down', role: client_role })
	})
	socket.on('keyup-left', (client_role) => {
		socket.broadcast.emit('update-position', { action: 'left-up', role: client_role })
	})
	socket.on('keydown-right', (client_role) => {
		socket.broadcast.emit('update-position', { action: 'right-down', role: client_role })
	})
	socket.on('keyup-right', (client_role) => {
		socket.broadcast.emit('update-position', { action: 'left-up', role: client_role })
	})
	socket.on('keydown-up', (client_role) => {
		socket.broadcast.emit('update-position', { action: 'up-down', role: client_role })
	})
	socket.on('keyup-up', (client_role) => {
		socket.broadcast.emit('update-position', { action: 'up-up', role: client_role })
	})
	socket.on('attack', () => {
		socket.broadcast.emit('attack')
	})
});

server.listen(3000, () => {
	console.log('listening on: 3000');
});