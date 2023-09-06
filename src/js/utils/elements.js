const $ = document.querySelector.bind(document)
const canvas = $("#canvas")
const c = canvas.getContext("2d")
const resultBanner = $("#text_result")
const playerHealth = $("#player_health")
const enemyHealth = $("#enemy_health")
const counter = $("#counter")
function htmlToElement(html) {
	var template = document.createElement('template');
	html = html.trim(); // Never return a text node of whitespace as the result
	template.innerHTML = html;
	return template.content.firstChild;
}
canvas.width = 1024
canvas.height = 576
export { c, resultBanner, playerHealth, enemyHealth, counter }