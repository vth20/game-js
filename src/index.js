import { Sprite, Fighter } from './js/classes'
// import { decreaseTimer } from
console.log(Fighter);
const $ = document.querySelector.bind(document)
const canvas = $("#canvas")
const c = canvas.getContext("2d")
const playerHealth = $("#player_health")
const enemyHealth = $("#enemy_health")
const counter = $("#counter")
const resultBanner = $("#text_result")

canvas.width = 1024
canvas.height = 576

const background = new Sprite({
	position: { x: 0, y: 0 },
	imageSrc: 'https://res.cloudinary.com/vth20/image/upload/v1674566735/g0jvck0zz3lknceaisnp.png'
})
const shop = new Sprite({
	// position: { x: 697, y: 125 },
	position: { x: 590, y: 125 },
	imageSrc: 'https://res.cloudinary.com/vth20/image/upload/v1674567079/neiejhk6pm9qqoewjpez.png',
	scale: 2.75,
	frames: 6
})

const player = new Fighter({
	position: { x: 0, y: 0 },
	velocity: { x: 0, y: 0 },
	color: 'blue',
	offset: { x: 0, y: 0 }
})
const enemy = new Fighter({
	position: { x: 400, y: 100 },
	velocity: { x: 0, y: 0 },
	offset: { x: -50, y: 0 }
})

let time = 10
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

c.fillRect(0, 0, canvas.width, canvas.height)

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
	c.clearRect(0, 0, canvas.width, canvas.height)
	background.update()
	shop.update()
	player.update()
	enemy.update()
	player.velocity.x = 0
	enemy.velocity.x = 0

	// player movement
	if (key.d.pressed && player.lastKey === 'd') {
		player.velocity.x = 3
	} else if (key.a.pressed && player.lastKey === 'a') {
		player.velocity.x = -3
	} else if (key.w.pressed && player.position.y >= 180) {
		player.velocity.y = -10
	}

	// enemy movement
	if (key.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
		enemy.velocity.x = 3
	} else if (key.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
		enemy.velocity.x = -3
	} else if (key.ArrowUp.pressed && enemy.position.y >= 180) {
		enemy.velocity.y = -10
	}

	// detect for collision
	if (rectangularCollision({ rectangle_1: player, rectangle_2: enemy })) {
		player.isAttacking = false
		enemy.health -= 10;
		enemyHealth.style.width = enemy.health + '%'
	}

	if (rectangularCollision({ rectangle_1: enemy, rectangle_2: player })) {
		enemy.isAttacking = false
		player.health -= 10;
		playerHealth.style.width = player.health + '%'
	}

	// end game base on health
	if (enemy.health <= 0 || player.health <= 0) { determineWinner(player, enemy) }
}

animate()

window.addEventListener('keydown', handleEventKeydown)
window.addEventListener('keyup', handleEventKeyup)

function handleEventKeydown(e) {
	// control player
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

	// control enemy
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