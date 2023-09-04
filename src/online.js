import { io } from 'socket.io-client';
import { Sprite, Fighter } from './js/classes'
import { images, imageCurrent, attackBoxPosition, statHeros, resultBanner, playerHealth, enemyHealth, counter, handleEventKeydown, handleEventKeyup, key, rectangularCollision } from './js/utils';

const socket = io("ws://localhost:8080");

const background = new Sprite({
	position: { x: 0, y: 0 },
	imageSrc: images.background.imageSrc
})
const shop = new Sprite({
	position: { x: 590, y: 125 },
	imageSrc: images.shop.imageSrc,
	scale: 2.75,
	frames: images.shop.frames
})

const player = new Fighter({
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

const enemy = new Fighter({
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

// TIME
let time = 60
let timerID = 0
function determineWinner(player, enemy) {
	clearTimeout(timerID)
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
}
// let separate to another file util
function decreaseTimer() {
	clearTimeout(timerID)
	if (time > 0) {
		timerID = setInterval(decreaseTimer, 1000)
		time -= 1
		counter.innerHTML = time + 's'
	}
	if (time === 0) {
		determineWinner(player, enemy)
	}
}
decreaseTimer()

/**
 * background animate
 */
function bgAnimate() {
	window.requestAnimationFrame(bgAnimate)
	background.update()
	shop.update()
}

function userAnimate() {
	window.requestAnimationFrame(userAnimate)
	player.update()
	player.velocity.x = 0
	// player movement
	if (key.ArrowRight.pressed && player.lastKey === 'ArrowRight') {
		player.velocity.x = 3
		player.switchSprite('run')
	} else if (key.ArrowLeft.pressed && player.lastKey === 'ArrowLeft') {
		player.velocity.x = -3
		player.switchSprite('run')
	} else if (key.ArrowUp.pressed && player.position.y >= 180) {
		player.velocity.y = -10
	} else if (player.moving) {
		// ONLINE - ANIMATE
		switch (player.lastKey) {
			case 'ArrowRight':
				player.velocity.x = 3
				player.switchSprite('run')
				break;
			case 'ArrowLeft':
				player.velocity.x = -3
				player.switchSprite('run')
				break;
			case 'ArrowUp':
				if (player.position.y >= 180) {
					player.velocity.y = -10
				}
				player.switchSprite('jump')
				break;
			case '':
				player.switchSprite('idle')
				break;
			case ' ':
				player.attack()
				break;
			default:
				break;
		}
	} else {
		player.switchSprite('idle')
	}

	if (player.velocity.y < 0) {
		player.switchSprite('jump')
	} else if (player.velocity.y > 0) {
		player.switchSprite('fall')
	}

	if (enemy.velocity.y < 0) {
		enemy.switchSprite('jump')
	} else if (enemy.velocity.y > 0) {
		enemy.switchSprite('fall')
	}

	// detect for collision
	if (rectangularCollision({ rectangle_1: player, rectangle_2: enemy }) && player.isAttacking && player.frameIndexCurrent === 4) {
		player.isAttacking = false
		enemy.takeHit(player.currentDamage)
		enemyHealth.style.width = enemy.calculationHealth()
	}

	if (player.isAttacking && player.frameIndexCurrent === 4) {
		player.isAttacking = false
	}

	// end game base on health
	if (enemy.healthCurrent <= 0 || player.healthCurrent <= 0) {
		determineWinner(player, enemy)
	}

	// switch flip images
	if (player.position.x > enemy.position.x && !player.flip) {
		player.flip = true
		enemy.flip = false
		if (!player.death) {
			player.SetImageSprites(images.ninja_flip)
			player.setAttackBox(attackBoxPosition.ninja_flip.offset)
		}
		if (!enemy.death) {
			enemy.SetImageSprites(images.hei)
			enemy.setAttackBox(attackBoxPosition.hei.offset)
		}
	} else if (player.position.x < enemy.position.x && !enemy.flip) {
		player.flip = false
		enemy.flip = true
		if (!player.death) {
			player.SetImageSprites(images.ninja)
			player.setAttackBox(attackBoxPosition.ninja.offset)
		}
		if (!enemy.death) {
			enemy.SetImageSprites(images.hei_flip)
			enemy.setAttackBox(attackBoxPosition.hei_flip.offset)
		}
	}
}
bgAnimate()
userAnimate()
// ONLINE - SOCKET


socket.on("moving", function (data) {
	console.log(data);
	switch (data.event) {
		case 'keydown':
			if(data.role === 'player') {
				player.moving = true
				player.lastKey = data.key
				player.position = { ...data.player.position }
			} else {
				enemy.moving = true
				enemy.lastKey = data.key
				enemy.position = { ...data.enemy.position }
			}
			break
		case 'keyup':
			if (data.role === 'player') {
				player.moving = false
			} else {
				enemy.moving = false
			}
			break
	}
}.bind(this));
// ONLINE - SOCKET

socket.on("clientDisconnect", (data) => {
	console.log(data, ' has left the game');
})

window.addEventListener('keydown', (e) => {
	socket.emit('keydown', { id: socket.id, key: e.key, player, enemy, event: 'keydown' })
	handleEventKeydown(e, player)
})
window.addEventListener('keyup', (e) => {
	socket.emit('keyup', { id: socket.id, key: e.key, player, enemy, event: 'keyup' })
	handleEventKeyup(e, player)
})

