import { Ball } from './ball.js'
import { Paddle } from './paddle.js'
import { Player } from './player.js'
import { Key } from './key.js'

let Info = class {
	constructor(canvasWidth, canvasHeight) {
		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;
		this.ball = null;
		this.paddleL = null;
		this.paddleR = null;
		this.playerL = null;
		this.playerR = null;
		this.status = 'gameover';
	}
	initBall = (radius, speed, speedMax) => {
		this.ball = new Ball((this.canvasWidth - radius) / 2, (this.canvasHeight - radius) / 2, radius, speed, speedMax);
	}
	initPaddleL = (width, height, accel, em, cof) => {
		this.paddleL = new Paddle(50, (this.canvasHeight - height) / 2, width, height, accel, em, cof);
	}
	initPaddleR = (width, height, accel, em, cof) => {
		this.paddleR = new Paddle(this.canvasWidth - 50 - width, (this.canvasHeight - height) / 2, width, height, accel, em, cof);
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
}

export { Info };