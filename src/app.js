import { io } from 'socket.io-client';
import { Sprite, Fighter } from './js/classes'
import { images, imageCurrent, attackBoxPosition, statHeros, $, handleEventKeydown, handleEventKeyup, key, rectangularCollision, changeScreen } from './js/utils';

const app = {
	time: 60,
	timerID: 0,
	control: {
		'a': {
			pressed: false
		},
		'd': {
			pressed: false
		},
		'w': {
			pressed: false
		},
		's': {
			pressed: false
		},
		'ArrowRight': {
			pressed: false
		},
		'ArrowLeft': {
			pressed: false
		},
		'ArrowUp': {
			pressed: false
		},
		'ArrowDown': {
			pressed: false
		},
	},
	handleEventKeydownOffline: function (e) {
		// control player
		if (!this.player.death) {
			switch (e.key) {
				case 'd':
					this.control.d.pressed = true
					this.player.lastKey = 'd'
					break
				case 'a':
					this.control.a.pressed = true
					this.player.lastKey = 'a'
					break
				case 'w':
					this.control.w.pressed = true
					break
				case 's':
					this.player.bow = true
					break
				case ' ':
					this.player.attack()
					break
				default:
					break
			}
		}

		// control enemy
		if (!this.enemy.death) {
			// control enemy
			switch (e.key) {
				case 'ArrowRight':
					this.control.ArrowRight.pressed = true
					this.enemy.lastKey = 'ArrowRight'
					break
				case 'ArrowLeft':
					this.control.ArrowLeft.pressed = true
					this.enemy.lastKey = 'ArrowLeft'
					break
				case 'ArrowUp':
					this.control.ArrowUp.pressed = true
					break
				case 'ArrowDown':
					this.enemy.bow = false
					break
				case '0':
					this.enemy.attack()
					break
				default:
					break
			}
		}
	},
	handleEventKeyupOffline: function (e) {
		switch (e.key) {
			case 'd':
				this.control.d.pressed = false
				break
			case 'a':
				this.control.a.pressed = false
				break
			case 'w':
				this.control.w.pressed = false
				break
			case 's':
				this.player.bow = false
				break
			default:
				break
		}
		switch (e.key) {
			case 'ArrowRight':
				this.control.ArrowRight.pressed = false
				break
			case 'ArrowLeft':
				this.control.ArrowLeft.pressed = false
				break
			case 'ArrowUp':
				this.control.ArrowUp.pressed = false
				break
			case 'ArrowDown':
				this.enemy.bow = false
				break
			default:
				break
		}
	},
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
		const resultBanner = $("#text_result")
		resultBanner.style.display = 'block'
		if (player.healthCurrent === enemy.healthCurrent) {
			resultBanner.innerHTML = 'Tie'
		}
		if (player.healthCurrent > enemy.healthCurrent) {
			resultBanner.innerHTML = 'Player 1 win'
		}
		if (player.healthCurrent < enemy.healthCurrent) {
			resultBanner.innerHTML = 'Player 2 win'
		}
	},
	// let separate to another file util
	decreaseTimer: function () {
		if(!this.counter) {
			this.counter = $("#counter")
		}
		clearTimeout(this.timerID)
		if (this.time > 0) {
			this.timerID = setInterval(() => { this.decreaseTimer() }, 1000)
			this.time -= 1
			this.counter.innerHTML = this.time + 's'
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
	 * switch flip images character
	 */
	handleFlipCharacter: function () {
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
			this.handleFlipCharacter()
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
			if (!this.counter) {
				this.counter = $("#counter")
			}
			this.counter.innerHTML = time + 's'
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
	offlineAnimate: function () {
		window.requestAnimationFrame(this.offlineAnimate.bind(this))
		this.player.update()
		this.enemy.update()
		this.player.velocity.x = 0
		this.enemy.velocity.x = 0

		// player movement
		if (this.control.d.pressed && this.player.lastKey === 'd') {
			this.player.velocity.x = 3
			this.player.switchSprite('run')
		} else if (this.control.a.pressed && this.player.lastKey === 'a') {
			this.player.velocity.x = -3
			this.player.switchSprite('run')
		} else if (this.control.w.pressed && this.player.position.y >= 180) {
			this.player.velocity.y = -10
		} else {
			this.player.switchSprite('idle')
		}

		if (this.player.velocity.y < 0) {
			this.player.switchSprite('jump')
		} else if (this.player.velocity.y > 0) {
			this.player.switchSprite('fall')
		}

		// enemy movement
		if (this.control.ArrowRight.pressed && this.enemy.lastKey === 'ArrowRight') {
			this.enemy.velocity.x = 3
			this.enemy.switchSprite('run')

		} else if (this.control.ArrowLeft.pressed && this.enemy.lastKey === 'ArrowLeft') {
			this.enemy.velocity.x = -3
			this.enemy.switchSprite('run')

		} else if (this.control.ArrowUp.pressed && this.enemy.position.y >= 180) {
			this.enemy.velocity.y = -10
		} else {
			this.enemy.switchSprite('idle')

		}

		if (this.enemy.velocity.y < 0) {
			this.enemy.switchSprite('jump')
		} else if (this.enemy.velocity.y > 0) {
			this.enemy.switchSprite('fall')
		}

		// detect for collision
		if (rectangularCollision({ rectangle_1: this.player, rectangle_2: this.enemy }) && this.player.isAttacking && this.player.frameIndexCurrent === 4) {
			const enemyHealth = $("#enemy_health")
			this.player.isAttacking = false
			this.enemy.takeHit(this.player.currentDamage)
			enemyHealth.style.width = this.enemy.calculationHealth()
		}
		if (this.player.isAttacking && this.player.frameIndexCurrent === 4) {
			this.player.isAttacking = false
		}

		if (rectangularCollision({ rectangle_1: this.enemy, rectangle_2: this.player }) && this.enemy.isAttacking && this.enemy.frameIndexCurrent === 2) {
			const playerHealth = $("#player_health")
			this.enemy.isAttacking = false
			this.player.takeHit(this.enemy.currentDamage)
			playerHealth.style.width = this.player.calculationHealth()
		}

		if (this.enemy.isAttacking && this.enemy.frameIndexCurrent === 4) {
			this.enemy.isAttacking = false
		}

		// end game base on health
		if (this.enemy.healthCurrent <= 0 || this.player.healthCurrent <= 0) {
			this.determineWinner(this.player, this.enemy)
		}

		this.handleFlipCharacter()
	},
	offline: function () {
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
		window.addEventListener('keydown', this.handleEventKeydownOffline.bind(this))
		window.addEventListener('keyup', this.handleEventKeyupOffline.bind(this))
		this.offlineAnimate()
		this.decreaseTimer()
	},
	online: function () {
		const socket = io("ws://localhost:8080");
		this.handleSocket(socket)
	},
	start: function () {
		this.backgroundAnimate()
		changeScreen('select')
	}
}
app.start()

export { app }