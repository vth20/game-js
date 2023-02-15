function rectangularCollision({ rectangle_1, rectangle_2 }) {
	return (
		rectangle_1.attackBox.position.x + rectangle_1.attackBox.width >= rectangle_2.position.x &&
		rectangle_1.attackBox.position.x <= rectangle_2.position.x + rectangle_2.width &&
		rectangle_1.attackBox.position.y <= rectangle_2.position.y + rectangle_2.height && rectangle_1.isAttacking
	)
}

export { rectangularCollision }
