import { Game } from "./game.js";

let speed = 2;
let dx = speed;
let dy = -speed;
let r = 0, g = 0, b = 0;
let interval = 0;
let gameOver = false;

(async function run() {
	let game = new Game();

	game.start();
}());

// function endGame() {
// 	alert("GAME OVER");
// 	document.location.reload();
// 	clearInterval(interval);
// }

// function draw() {
// 	if (gameOver)
// 		endGame();
// 	ctx.clearRect(0, 0, canvas.width, canvas.height);
// 	drawBall();
// 	drawPaddle();
// 	if (leftPressed)
// 		paddleX = Math.max(paddleX - 5, 0);
// 	else if (rightPressed)
// 		paddleX = Math.min(paddleX + 5, canvas.width);
// 	x += dx;
// 	y += dy;
// 	r = (r + 3) % 255;
// 	g = (g + 2) % 255;
// 	b = (b + 1) % 255;
// 	if (y + dy < ballRadius)	dy = -dy;
// 	else if (y + dy > canvas.height - ballRadius) {
// 		if (x > paddleX && x < paddleX + paddelWidth)
// 			dy = -dy;
// 		else
// 			gameOver = true;
// 	}
// 	if (x + dx < ballRadius || x + dx > canvas.width - ballRadius)	dx = -dx;
// }

// export { paddelWidth, paddleHeight, paddleX, paddleY, ctx, r, g, b };