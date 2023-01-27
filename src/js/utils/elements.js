const $ = document.querySelector.bind(document)
const canvas = $("#canvas")
const c = canvas.getContext("2d")
const resultBanner = $("#text_result")
const playerHealth = $("#player_health")
const enemyHealth = $("#enemy_health")
const counter = $("#counter")

canvas.width = 1024
canvas.height = 576
export { c, resultBanner, playerHealth, enemyHealth, counter }