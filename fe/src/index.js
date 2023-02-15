import io from 'socket.io-client';
import { Sprite, Fighter } from './js/classes'
import { images, imageCurrent, attackBoxPosition, statHeros, resultBanner, playerHealth, enemyHealth, counter, } from './js/utils';
// import { decreaseTimer } from
import * as dotenv from 'dotenv'
dotenv.config()
console.log(process.env.BACKEND_URL);
const socket = io(process.env.BACKEND_URL);

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

let time = 5
let timerID = 0
function determineWinner(player, enemy) {
	clearTimeout(timerID)
	resultBanner.style.display = 'block'
	if (player.calculationHealthPercent() === enemy.calculationHealthPercent()) {
		resultBanner.innerHTML = 'Tie'
	}
	if (player.calculationHealthPercent() > enemy.calculationHealthPercent()) {
		resultBanner.innerHTML = 'Player 1 win'
	}
	if (player.calculationHealthPercent() < enemy.calculationHealthPercent()) {
		resultBanner.innerHTML = 'Player 2 win'
	}
	// if(player.health < 0) {
	// 	player.switchSprite('death')
	// }
}
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

const key = {
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
}

function animate() {
	window.requestAnimationFrame(animate)
	background.update()
	shop.update()
	player.update()
	enemy.update()
	player.velocity.x = 0
	enemy.velocity.x = 0

	// c.fillRect(player.position.x, player.position.y, player.width, player.height)
	// c.fillRect(player.attackBox.position.x, player.attackBox.position.y, player.attackBox.width, player.attackBox.height)
	// c.fillRect(enemy.position.x, enemy.position.y, enemy.width, enemy.height)
	// c.fillRect(enemy.attackBox.position.x, enemy.attackBox.position.y, enemy.attackBox.width, enemy.attackBox.height)


	// player movement
	if (key.d.pressed && player.lastKey === 'd') {
		player.velocity.x = 3
		player.switchSprite('run')
	} else if (key.a.pressed && player.lastKey === 'a') {
		player.velocity.x = -3
		player.switchSprite('run')
	} else if (key.w.pressed && player.position.y >= 180) {
		player.velocity.y = -10
	} else {
		player.switchSprite('idle')
	}

	if (player.velocity.y < 0) {
		player.switchSprite('jump')
	} else if (player.velocity.y > 0) {
		player.switchSprite('fall')
	}

	// enemy movement
	if (key.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
		enemy.velocity.x = 3
		enemy.switchSprite('run')

	} else if (key.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
		enemy.velocity.x = -3
		enemy.switchSprite('run')

	} else if (key.ArrowUp.pressed && enemy.position.y >= 180) {
		enemy.velocity.y = -10
	} else {
		enemy.switchSprite('idle')

	}

	if (enemy.velocity.y < 0) {
		enemy.switchSprite('jump')
	} else if (enemy.velocity.y > 0) {
		enemy.switchSprite('fall')
	}

	// detect for collision
	if (rectangularCollision({ rectangle_1: player, rectangle_2: enemy }) && player.isAttacking && player.frameIndexCurrent === 4) {
		player.isAttacking = false
		enemy.takeHit(player.currentDamage, time)
		enemyHealth.style.width = enemy.calculationHealth()
	}

	if (player.isAttacking && player.frameIndexCurrent === 4) {
		player.isAttacking = false
	}

	if (rectangularCollision({ rectangle_1: enemy, rectangle_2: player }) && enemy.isAttacking && enemy.frameIndexCurrent === 2) {
		enemy.isAttacking = false
		player.takeHit(enemy.currentDamage, time)
		playerHealth.style.width = player.calculationHealth()
	}

	if (enemy.isAttacking && enemy.frameIndexCurrent === 4) {
		enemy.isAttacking = false
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
animate()

window.addEventListener('keydown', handleEventKeydown)
window.addEventListener('keyup', handleEventKeyup)

function handleEventKeydown(e) {
	// control player
	if (!player.death) {
		switch (e.key) {
			case 'd':
				key.d.pressed = true
				player.lastKey = 'd'
				break
			case 'a':
				key.a.pressed = true
				player.lastKey = 'a'
				break
			case 'w':
				key.w.pressed = true
				break
			case 's':
				player.bow = true
				break
			case ' ':
				player.attack()
				break
			default:
				break
		}
	}

	// control enemy
	if (!enemy.death) {
		switch (e.key) {
			case 'ArrowRight':
				key.ArrowRight.pressed = true
				enemy.lastKey = 'ArrowRight'
				break
			case 'ArrowLeft':
				key.ArrowLeft.pressed = true
				enemy.lastKey = 'ArrowLeft'
				break
			case 'ArrowUp':
				key.ArrowUp.pressed = true
				break
			case 'ArrowDown':
				enemy.bow = false
				break
			case '0':
				enemy.attack()
				break
			default:
				break
		}
	}
}

function handleEventKeyup(e) {
	switch (e.key) {
		case 'd':
			key.d.pressed = false
			break
		case 'a':
			key.a.pressed = false
			break
		case 'w':
			key.w.pressed = false
			break
		case 's':
			player.bow = false
			break
		default:
			break
	}
	switch (e.key) {
		case 'ArrowRight':
			key.ArrowRight.pressed = false
			break
		case 'ArrowLeft':
			key.ArrowLeft.pressed = false
			break
		case 'ArrowUp':
			key.ArrowUp.pressed = false
			break
		case 'ArrowDown':
			enemy.bow = false
			break
		default:
			break
	}
}

function rectangularCollision({ rectangle_1, rectangle_2 }) {
	return (
		rectangle_1.attackBox.position.x + rectangle_1.attackBox.width >= rectangle_2.position.x &&
		rectangle_1.attackBox.position.x <= rectangle_2.position.x + rectangle_2.width &&
		rectangle_1.attackBox.position.y <= rectangle_2.position.y + rectangle_2.height && rectangle_1.isAttacking
	)
}
let actors = undefined
socket.emit('new-user');
socket.on('user-info', (data) => {
	actors = data
	console.log(actors);
})