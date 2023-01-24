
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

export { handleEventKeydown, handleEventKeyup, key }
