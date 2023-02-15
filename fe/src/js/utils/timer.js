import { resultBanner } from "./elements"
let time = 60
let timerID = 0
import { player, enemy } from "./character"

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

export { decreaseTimer, timerID, determineWinner }
