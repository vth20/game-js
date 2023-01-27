import { images } from "./sprites";

const imageCurrent = {
	player: images.ninja,
	enemy: images.hei_flip
}

function switchFlipImage(positionX_player, positionX_enemy) {
	if (positionX_player > positionX_enemy) {
		imageCurrent.player = images.ninja_flip
		imageCurrent.enemy = images.hei
	} else if (positionX_player < positionX_enemy) {
		imageCurrent.player = images.ninja
		imageCurrent.enemy = images.hei_flip
	}
}

export { imageCurrent, switchFlipImage }