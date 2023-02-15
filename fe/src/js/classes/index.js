import { c } from '../utils'
const gravity = 0.7

class Sprite {
	constructor({ position, imageSrc, scale = 1, frames = 1, offset = { x: 0, y: 0 } }) {
		this.position = position
		this.width = 50
		this.height = 150
		this.image = new Image()
		this.image.src = imageSrc
		this.scale = scale
		this.frames = frames
		this.frameIndexCurrent = 0
		this.frameElapsed = 0
		this.frameHold = 5
		this.offset = offset
	}
	draw() {
		c.drawImage(
			this.image,
			this.frameIndexCurrent * (this.image.width / this.frames),
			0,
			this.image.width / this.frames,
			this.image.height,
			this.position.x - this.offset.x,
			this.position.y - this.offset.y,
			(this.image.width / this.frames) * this.scale,
			this.image.height * this.scale
		)
	}
	update() {
		this.draw()
		this.animateFrames()
	}
	animateFrames() {
		this.frameElapsed++
		if (this.frameElapsed % this.frameHold === 0) {
			if (this.frameIndexCurrent < this.frames - 1) {
				this.frameIndexCurrent++
			} else {
				this.frameIndexCurrent = 0
			}
		}
	}
}


class Fighter extends Sprite {
	constructor({
		position,
		velocity,
		offset = { x: 0, y: 0 },
		imageSrc, scale = 1,
		frames = 1,
		sprites,
		attackBox = { offset: {}, width: undefined, height: undefined },
		health,
		damage
	}) {
		super({
			position,
			imageSrc,
			scale,
			frames,
			offset,
		})
		// this.position = position
		this.velocity = velocity
		this.width = 50
		this.height = 150
		this.lastKey = ''
		this.attackBox = {
			position: {
				x: this.position.x,
				y: this.position.y
			},
			offset: attackBox.offset,
			width: attackBox.width,
			height: attackBox.height,
		}
		this.isAttacking = false
		this.healthMax = health
		this.healthCurrent = health
		this.bow = false
		this.frameIndexCurrent = 0
		this.frameElapsed = 0
		this.frameHold = 5
		this.SetImageSprites(sprites)
		this.flip = false
		this.death = false
		this.damage = damage
		this.currentDamage = 0
	}
	addImageToSprites() {
		for (const sprite in this.sprites) {
			this.sprites[sprite].image = new Image()
			this.sprites[sprite].image.src = this.sprites[sprite].imageSrc
		}
	}
	SetImageSprites(spriteSrc) {
		this.sprites = spriteSrc
		this.addImageToSprites()
	}
	setAttackBox(newOffset) {
		this.attackBox.offset = newOffset
	}
	update() {
		this.draw()
		if (!this.death) {
			this.animateFrames()
		}
		this.randomDamage()
		// this.handleBow()
		this.position.x += this.velocity.x
		this.position.y += this.velocity.y

		// attack boxes
		this.attackBox.position.x = this.position.x + this.attackBox.offset.x
		this.attackBox.position.y = this.position.y + this.attackBox.offset.y

		// gravity function
		if (this.position.y + this.height + this.velocity.y >= canvas.height - 97) {
			this.velocity.y = 0
			this.position.y = 329.7
		} else {
			this.velocity.y += gravity
		}
	}
	attack() {
		this.switchSprite('attack_1')
		this.isAttacking = true
		setTimeout(() => {
			this.isAttacking = false
		}, 400)
	}
	randomDamage() {
		this.currentDamage = Math.random() * (this.damage.max - this.damage.min) + this.damage.min;
	}
	switchSprite(sprite) {
		// overriding all other animations with the attack animation
		if (this.image === this.sprites.attack_1.image &&
			this.frameIndexCurrent < this.sprites.attack_1.frames - 1)
			return

		if (this.image === this.sprites.takeHit.image &&
			this.frameIndexCurrent < this.sprites.takeHit.frames - 1)
			return

		if (this.image === this.sprites.death.image) {
			if (this.frameIndexCurrent === this.sprites.death.frames - 1) {
				this.death = true
			}
			return
		}
		// if(this.image.)
		switch (sprite) {
			case 'idle':
				if (this.image !== this.sprites.idle.image) {
					this.image = this.sprites.idle.image
					this.frames = this.sprites.idle.frames
					this.frameIndexCurrent = 0
				}
				break;
			case 'run':
				if (this.image !== this.sprites.run.image) {
					this.image = this.sprites.run.image
					this.frames = this.sprites.run.frames
					this.frameIndexCurrent = 0
				}
				break;
			case 'jump':
				if (this.image !== this.sprites.jump.image) {
					this.image = this.sprites.jump.image
					this.frames = this.sprites.jump.frames
					this.frameIndexCurrent = 0
				}
				break;
			case 'fall':
				if (this.image !== this.sprites.fall.image) {
					this.image = this.sprites.fall.image
					this.frames = this.sprites.fall.frames
					this.frameIndexCurrent = 0
				}
				break;
			case 'attack_1':
				if (this.image !== this.sprites.attack_1.image) {
					this.image = this.sprites.attack_1.image
					this.frames = this.sprites.attack_1.frames
					this.frameIndexCurrent = 0
				}
				break;
			case 'death':
				if (this.image !== this.sprites.death.image) {
					this.image = this.sprites.death.image
					this.frames = this.sprites.death.frames
					this.frameIndexCurrent = 0
				}
				break;
			case 'takeHit':
				if (this.image !== this.sprites.takeHit.image) {
					this.image = this.sprites.takeHit.image
					this.frames = this.sprites.takeHit.frames
					this.frameIndexCurrent = 0
				}
				break;
			default:
				break;
		}
	}
	handleFlip() {
		// this.image.
	}
	takeHit(damage, time) {
		if (time === 0) {
			this.healthCurrent += 0
		} else if (this.healthCurrent <= 0) {
			this.healthCurrent = 0
			this.switchSprite('death')
		} else {
			this.healthCurrent -= damage
			this.switchSprite('takeHit')
		}
	}
	calculationHealth() {
		if (this.calculationHealthPercent() <= 0) {
			return '0%'
		} else {
			return (this.calculationHealthPercent()) + '%'
		}
	}
	calculationHealthPercent() {
		return this.healthCurrent * 100 / this.healthMax
	}
}

export { Sprite, Fighter }
// export default class {Fighter}