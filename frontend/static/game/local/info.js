import { Ball } from './ball.js'
import { Paddle } from './paddle.js'
import { Player } from './player.js'

let Info = class {
	constructor(canvasWidth, canvasHeight, maxScore) {
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
	resetGame = () => {
		this.playerL.score = 0;
		this.playerR.score = 0;
		this.paddleL.x = 50;
		this.paddleL.y = (this.canvasHeight - this.paddleL.height) / 2;
		this.paddleR.x = this.canvasWidth - 50 - this.paddleR.width;
		this.paddleR.y = (this.canvasHeight - this.paddleR.height) / 2;
		this.ball.reset((this.canvasWidth - 7) / 2, (this.canvasHeight - 7) / 2);
	}
	resetRound = (dir) => {
		this.paddleL.x = 50;
		this.paddleL.y = (this.canvasHeight - this.paddleL.height) / 2;
		this.paddleR.x = this.canvasWidth - 50 - this.paddleR.width;
		this.paddleR.y = (this.canvasHeight - this.paddleR.height) / 2;
		this.ball.reset((this.canvasWidth - 7) / 2, (this.canvasHeight - 7) / 2, dir);
	}
}

export { Info };