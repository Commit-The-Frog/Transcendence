import { Canvas } from './canvas.js';
import { Paddle } from './paddle.js'
import { Ball } from './ball.js'
import { Key } from './key.js';
import { UserInterface } from './userInterface.js';

const ballSpeed = 3;
const lPaddleSpeed = 5;
const rPaddleSpeed = 5;
const paddleWidth = 10;
const paddleHeight = 150;
const ballRadius = 15;
const maxScore = 5;

let Game = class {
	constructor() {
		this.scoreL = 0;
		this.scoreR = 0;
		this.interval = 0;
		this.canvas = new Canvas("myCanvas");
		this.key = new Key();
		this.paddleL = new Paddle(50, (this.canvas.height - paddleHeight) / 2, paddleWidth, paddleHeight, lPaddleSpeed);
		this.paddleR = new Paddle(this.canvas.width - 50 - paddleWidth, (this.canvas.height - paddleHeight) / 2, paddleWidth, paddleHeight, rPaddleSpeed);
		this.ball = new Ball((this.canvas.width - ballRadius) / 2, (this.canvas.height - ballRadius) / 2, ballRadius, ballSpeed);
		this.ui = new UserInterface(this.canvas.ctx, this.canvas.width, this.canvas.height);
	}
	render = async () => {
		console.log('rendering..');
		this.canvas.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		this.ui.drawHalfLine();
		this.ui.drawScore(this.scoreL, this.scoreR);
		this.paddleL.draw(this.canvas.ctx);
		this.paddleR.draw(this.canvas.ctx);
		this.ball.draw(this.canvas.ctx);
		
		if (this.key.WPressed)		this.paddleL.moveUp();
		if (this.key.SPressed)		this.paddleL.moveDown(this.canvas.height);
		if (this.key.upPressed)		this.paddleR.moveUp();
		if (this.key.downPressed)	this.paddleR.moveDown(this.canvas.height);

		if (this.scoreL === maxScore || this.scoreR === maxScore)
			this.end();
		this.ball.move(this.canvas.height, this.paddleL, this.paddleR)
		let loser = this.checkBallOut();
		if (loser === 1) {
			this.scoreR++;
			this.restart('R');
		} else if (loser === 2) {
			this.scoreL++;
			this.restart('L');
		}
	}
	start = () => {
		this.interval = setInterval(this.render, 7);
	}
	restart = (dir) => {
		clearInterval(this.interval);
		this.ball.reset((this.canvas.width - 7) / 2, (this.canvas.height - 7) / 2, dir);
		this.start();
	}
	end = () => {
		clearInterval(this.interval);
		alert("GAME OVER");
		document.location.reload();
	}
	checkBallOut = () => {
		if (this.ball.x < -50)
			return 1;
		if (this.ball.x > this.canvas.width + 50)
			return 2;
		return 0;
	}
}

export {Game};