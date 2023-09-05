import { io } from 'socket.io-client';
import { Sprite, Fighter } from './js/classes'
import { images, imageCurrent, attackBoxPosition, statHeros, resultBanner, playerHealth, enemyHealth, counter, handleEventKeydown, handleEventKeyup, key, rectangularCollision } from './js/utils';

const app = {
	time: 60,
	timerID: 0,
	requestFrames: { first: [], second: [] },
	createPlayer: function (role, position, offset) {
		return new Fighter({
			role: role,
			position: { ...position },
			velocity: { x: 0, y: 0 },
			imageSrc: imageCurrent[role].idle.imageSrc,
			frames: imageCurrent[role].idle.frames,
			scale: 2.5,
			offset: { ...offset },
			sprites: imageCurrent[role],
			attackBox: role === 'player' ? attackBoxPosition.ninja : attackBoxPosition.hei,
			health: role === 'player' ? statHeros.ninja.health : statHeros.ninja.health,
			damage: role === 'player' ? statHeros.ninja.damage : statHeros.ninja.damage
		})
	},
	createBackground: function () {
		return new Sprite({
			position: { x: 0, y: 0 },
			imageSrc: images.background.imageSrc
		})
	},
	createShop: function () {
		return new Sprite({
			position: { x: 590, y: 125 },
			imageSrc: images.shop.imageSrc,
			scale: 2.75,
			frames: images.shop.frames
		})
	},
	determineWinner: function (player, enemy) {
		clearTimeout(this.timerID)
		resultBanner.style.display = 'block'
		if (player.health === enemy.health) {
			resultBanner.innerHTML = 'Tie'
		}
		if (player.health > enemy.health) {
			resultBanner.innerHTML = 'Player 1 win'
		}
		if (player.health < enemy.health) {
			resultBanner.innerHTML = 'Player 2 win'
		}
	},
	// let separate to another file util
	decreaseTimer: function () {
		clearTimeout(this.timerID)
		if (this.time > 0) {
			this.timerID = setInterval(() => { this.decreaseTimer() }, 1000)
			this.time -= 1
			counter.innerHTML = this.time + 's'
		}
		if (this.time === 0) {
			this.determineWinner(this.player, this.enemy)
		}
	},
	/**
	* background animate
	*/
	backgroundAnimate: function () {
		window.requestAnimationFrame(this.backgroundAnimate.bind(this))
		if (!this.background) {
			this.background = this.createBackground()
		}
		if (!this.shop) {
			this.shop = this.createShop()
		}
		this.background.update()
		this.shop.update()
	},

	/**
	 * player animate
	 */
	userAnimate: function (player) {
		window.requestAnimationFrame(() => { this.userAnimate(player); })
		player.update()
		this.userAction(player)
	},
	/**
	 * handle move character
	 */
	userAction: function (user) {
		user.velocity.x = 0
		// user movement
		if (key.ArrowRight.pressed && user.lastKey === 'ArrowRight') {
			user.velocity.x = 3
			user.switchSprite('run')
		} else if (key.ArrowLeft.pressed && user.lastKey === 'ArrowLeft') {
			user.velocity.x = -3
			user.switchSprite('run')
		} else if (key.ArrowUp.pressed && user.position.y >= 180) {
			user.velocity.y = -10
		} else if (user.moving) {
			// ONLINE - ANIMATE
			debugger
			switch (user.lastKey) {
				case 'ArrowRight':
					user.velocity.x = 3
					user.switchSprite('run')
					break;
				case 'ArrowLeft':
					user.velocity.x = -3
					user.switchSprite('run')
					break;
				case 'ArrowUp':
					if (user.position.y >= 180) {
						user.velocity.y = -10
					}
					user.switchSprite('jump')
					break;
				case '':
					user.switchSprite('idle')
					break;
				case ' ':
					user.attack()
					break;
				default:
					break;
			}
		} else {
			user.switchSprite('idle')
		}

		if (user.velocity.y < 0) {
			user.switchSprite('jump')
		} else if (user.velocity.y > 0) {
			user.switchSprite('fall')
		}

		if (this.player && this.enemy) {
			// switch flip images
			if (this.player.position.x > this.enemy.position.x && !this.player.flip) {
				this.player.flip = true
				this.enemy.flip = false
				if (!this.player.death) {
					this.player.SetImageSprites(images.ninja_flip)
					this.player.setAttackBox(attackBoxPosition.ninja_flip.offset)
				}
				if (!this.enemy.death) {
					this.enemy.SetImageSprites(images.hei)
					this.enemy.setAttackBox(attackBoxPosition.hei.offset)
				}
			} else if (this.player.position.x < this.enemy.position.x && !this.enemy.flip) {
				this.player.flip = false
				this.enemy.flip = true
				if (!this.player.death) {
					this.player.SetImageSprites(images.ninja)
					this.player.setAttackBox(attackBoxPosition.ninja.offset)
				}
				if (!this.enemy.death) {
					this.enemy.SetImageSprites(images.hei_flip)
					this.enemy.setAttackBox(attackBoxPosition.hei_flip.offset)
				}
			}
		}
	},
	/**
	 * socket handler
	 */
	handleSocket: function (socket) {
		// save role
		socket.on('getRole', (role) => {
			console.log(role);
			this.role = role
		})
		// start count time game if 2 player
		socket.on('decreaseTime', (time) => {
			counter.innerHTML = time + 's'
			if (time === 0) {
				determineWinner(this.player, this.enemy)
			}
		})
		// draw first player when have connect
		socket.on('drawFirstPlayer', ({ role, position, offset }) => {
			if (!this[role]) {
				this[role] = this.createPlayer(role, position, offset)
				this.userAnimate(this[role])
			}
		})
		socket.on('drawSecondPlayer', ({ role, position, offset }) => {
			if (!this[role]) {
				this[role] = this.createPlayer(role, position, offset)
				this.userAnimate(this[role])
			}
		})

		window.addEventListener('keydown', (e) => {
			const self = this[this.role]
			socket.emit('keydown', { id: socket.id, key: e.key, self, role: this.role, event: 'keydown' })
			handleEventKeydown(e, self)
		})

		window.addEventListener('keyup', (e) => {
			const self = this[this.role]
			socket.emit('keyup', { id: socket.id, key: e.key, self, role: this.role, event: 'keyup' })
			handleEventKeyup(e, self)
		})

		socket.on("moving", function (data) {
			console.log(data);
			switch (data.event) {
				case 'keydown':
					console.log(data.role, 'moving');
					this[data.role].moving = true
					this[data.role].lastKey = data.key
					this[data.role].position = { ...data.self.position }
					this[data.role].offset = { ...data.self.offset }
					// this.userAction(this[data.role])
					break
				case 'keyup':
					console.log(data.role, 'stop');
					this[data.role].moving = false
					break
			}
		}.bind(this));

		socket.on("clientDisconnect", (data) => {
			// handle send notification to broadcast
			console.log(data.id, ' has left the game');
		})
	},
	offline: function() {
		this.player = new Fighter({
			position: { x: 0, y: 0 },
			velocity: { x: 0, y: 0 },
			imageSrc: imageCurrent.player.idle.imageSrc,
			frames: imageCurrent.player.idle.frames,
			scale: 2.5,
			offset: { x: 215, y: 155 },
			sprites: imageCurrent.player,
			attackBox: attackBoxPosition.ninja,
			health: statHeros.ninja.health,
			damage: statHeros.ninja.damage
		})
		this.enemy = new Fighter({
			position: { x: 400, y: 100 },
			velocity: { x: 0, y: 0 },
			imageSrc: imageCurrent.enemy.idle.imageSrc,
			frames: imageCurrent.enemy.idle.frames,
			scale: 2.5,
			offset: { x: 215, y: 169 },
			sprites: imageCurrent.enemy,
			attackBox: attackBoxPosition.hei,
			health: statHeros.hei.health,
			damage: statHeros.hei.damage
		})
		determineWinner(this.player, this.enemy)
		decreaseTimer()

	},
	online: function() {

	},
	start: function () {
		const socket = io("ws://localhost:8080");
		this.backgroundAnimate()
		this.handleSocket(socket)
	}
}

app.start()