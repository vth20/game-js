import { app } from "../../app"
const $ = document.querySelector.bind(document)
const canvas = $("#canvas")
const c = canvas.getContext("2d")

const root = $("#root")
canvas.width = 1024
canvas.height = 576

function htmlToElement(html) {
	const template = document.createElement('template');
	html = html.trim(); // Never return a text node of whitespace as the result
	template.innerHTML = html;
	return template.content.firstChild;
}

const sContainerHeathTime = `<div id="container"><div class="health"><div id="player_health" class="health_column"></div></div><div id="timer"><span id="counter">60s</span></div>
        <div class="health" style="display: flex; justify-content: flex-end"><div id="enemy_health" class="health_column"></div></div></div>`
const sResult = `<div id="result"><span id="text_result"></span></div>`
const sSelectContainer = `<div id="select-container"><span id="offline-btn" class='start-btn'>OFFLINE</span><span id="online-btn" class='start-btn'>ONLINE</span><div id="setting"><span class='config-button'>A</span><span class='config-button'>B</span></div>`
const sModePlay = `<div id="select-container"><span id="random-btn" class='start-btn' title="Start with random match">RANDOM</span><input id="input-room" type="text" placeholder="Enter room..."><span id="start-btn" class='start-btn' title="Start with the room">START</span><div id="setting"><span id="cancel-btn" class='config-button'>A</span><span class='config-button'>B</span></div></div>`
const sExitBtn = `<span class='config-button' id="exit-btn">ESC</span>`
const eContainerHeathTime = htmlToElement(sContainerHeathTime)
const eResult = htmlToElement(sResult)
const eSelectContainer = htmlToElement(sSelectContainer)
const eModePlay = htmlToElement(sModePlay)
const eExitBtn = htmlToElement(sExitBtn)

function clearAllNodeInParent(eParent) {
	while (eParent.hasChildNodes())
		eParent.firstChild.remove()
}

function screenSelectMode() {
	root.appendChild(eSelectContainer)
	const onlineBtn = $("#online-btn")
	const offlineBtn = $("#offline-btn")
	offlineBtn.addEventListener("click", () => changeScreen('playOffline'))
	onlineBtn.addEventListener("click", () => changeScreen('online'))
}
function screenSelectOnline() {
	root.appendChild(eModePlay)
	const randomBtn = $("#random-btn")
	const roomBtn = $("#start-btn")
	const cancelBtn = $("#cancel-btn")
	randomBtn.addEventListener("click", () => changeScreen('matching'))
	roomBtn.addEventListener("click", () => changeScreen('playOnline'))
	cancelBtn.addEventListener("click", () => changeScreen('select'))
}

function screenPlay() {
	root.appendChild(eContainerHeathTime)
	root.appendChild(eResult)
	root.appendChild(eExitBtn)
	eExitBtn.addEventListener("click", () => changeScreen('select'))
}

function changeScreen(screenID) {
	clearAllNodeInParent(root)
	switch (screenID) {
		case 'select':
			screenSelectMode()
			break;
		case 'online':
			screenSelectOnline()
			break
		case 'playOnline':
			screenPlay()
			app.online()
			break
		case 'playOffline':
			screenPlay()
			app.offline()
			break
		default:
			break
	}
}
export { c, $, changeScreen }