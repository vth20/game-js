// ONLINE VERSION

const key = {
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

function handleEventKeydown(e, self) {
	// control character
	switch (e.key) {
		case 'ArrowRight':
			key.ArrowRight.pressed = true
			self.lastKey = 'ArrowRight'
			break
		case 'ArrowLeft':
			key.ArrowLeft.pressed = true
			self.lastKey = 'ArrowLeft'
			break
		case 'ArrowUp':
			key.ArrowUp.pressed = true
			break
		case 'ArrowDown':
			self.bow = false
			break
		case ' ':
			self.attack()
			break
		default:
			break
	}
}

function handleEventKeyup(e, self) {
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
			self.bow = false
			break
		default:
			break
	}
}

export { handleEventKeydown, handleEventKeyup, key }
