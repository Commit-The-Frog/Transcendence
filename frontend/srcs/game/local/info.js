import { Ball } from './ball.js'
import { Paddle } from './paddle.js'
import { Player } from './player.js'

let Info = class {
	constructor(canvasWidth, canvasHeight, maxScore, type) {
		this.type = type;
		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;
		this.ball = null;
		this.paddleL = null;
		this.paddleR = null;
		this.playerL = null;
		this.playerR = null;
		this.gameover = false;
		this.maxScore = maxScore;
		this.winner = null;
	}
	initBall = (radius, speed, speedMax) => {
		this.ball = new Ball((this.canvasWidth - radius) / 2, (this.canvasHeight - radius) / 2, radius, speed, speedMax);
	}
	initPaddleL = (width, height, accel, accelInit, em, cof, item) => {
		let paddlex = 50;
		if (item == 2)	paddlex += 100;
		this.paddleL = new Paddle(paddlex, (this.canvasHeight - height) / 2, width, height, accel, accelInit, em, cof, item);
	}
	initPaddleR = (width, height, accel, accelInit, em, cof, item) => {
		let paddlex = 50;
		if (item == 2)	paddlex += 100;
		this.paddleR = new Paddle(this.canvasWidth - paddlex - width, (this.canvasHeight - height) / 2, width, height, accel, accelInit, em, cof, item);
	}
	initPlayer = (nicknameL, nicknameR) => {
		this.playerL = new Player(nicknameL);
		this.playerR = new Player(nicknameR);
	}
	draw = (ctx) => {
		this.paddleL.draw(ctx);
		this.paddleR.draw(ctx);
		this.ball.draw(ctx);
	}
	resetGame = () => {
		this.playerL.score = 0;
		this.playerR.score = 0;
		this.paddleL.y = (this.canvasHeight - this.paddleL.height) / 2;
		this.paddleR.y = (this.canvasHeight - this.paddleR.height) / 2;
		this.ball.reset((this.canvasWidth - 7) / 2, (this.canvasHeight - 7) / 2);
	}
	resetRound = (dir) => {
		this.paddleL.y = (this.canvasHeight - this.paddleL.height) / 2;
		this.paddleR.y = (this.canvasHeight - this.paddleR.height) / 2;
		this.ball.reset((this.canvasWidth - 7) / 2, (this.canvasHeight - 7) / 2, dir);
	}
}

export { Info };