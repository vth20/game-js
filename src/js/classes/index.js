import { c } from '../utils'
const gravity = 0.7

class Sprite {
	constructor({ position, imageSrc, scale = 1, frames = 1 }) {
		this.position = position
		this.width = 50
		this.height = 150
		this.image = new Image()
		this.image.src = imageSrc
		this.scale = scale
		this.frames = frames
	}
	draw() {
		c.drawImage(
			this.image,
			0,
			0,
			this.image.width / this.frames,
			this.image.height,
			this.position.x,
			this.position.y,
			(this.image.width / this.frames) * this.scale,
			this.image.height * this.scale
		)
	}
	update() {
		this.draw()
	}
}


class Fighter {
	constructor({ position, velocity, color = 'red', offset }) {
		this.position = position
		this.velocity = velocity
		this.width = 50
		this.height = 150
		this.lastKey = ''
		this.attackBox = {
			position: {
				x: this.position.x,
				y: this.position.y
			},
			offset,
			width: 100,
			height: 50,
		}
		this.color = color
		this.isAttacking = false
		this.health = 100
		this.bow = false
	}
	draw() {
		c.fillStyle = this.color
		c.fillRect(this.position.x, this.position.y, this.width, this.height)
		if (this.isAttacking) {
			c.fillStyle = 'green'
			c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)
		}
	}
	update() {
		this.draw()
		this.handleBow()
		this.position.x += this.velocity.x
		this.position.y += this.velocity.y
		this.attackBox.position.x = this.position.x + this.attackBox.offset.x
		this.attackBox.position.y = this.position.y
		if (this.position.y + this.height + this.velocity.y >= canvas.height - 97) {
			this.velocity.y = 0
		} else {
			this.velocity.y += gravity
		}
	}
	attack() {
		this.isAttacking = true
		setTimeout(() => {
			this.isAttacking = false
		}, 100)
	}
	handleBow() {
		if (this.bow) {
			this.height = 100
		} else {
			this.height = 150
		}
	}
}

export { Sprite, Fighter }
// export default class {Fighter}