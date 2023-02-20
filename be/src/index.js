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
	socket.on('keydown-left', () => {
		socket.broadcast.emit('update-position', 'left-down')
	})
	socket.on('keyup-left', () => {
		socket.broadcast.emit('update-position', 'left-up')
	})
	socket.on('keydown-right', () => {
		socket.broadcast.emit('update-position', 'right-down')
	})
	socket.on('keyup-right', () => {
		socket.broadcast.emit('update-position', 'right-up')
	})
	socket.on('keydown-up', () => {
		socket.broadcast.emit('update-position', 'up-down')
	})
	socket.on('keyup-up', () => {
		socket.broadcast.emit('update-position', 'up-up')
	})
	socket.on('attack', () => {
		socket.broadcast.emit('attack')
	})
});

server.listen(3000, () => {
	console.log('listening on: 3000');
});