import { Canvas } from './canvas.js';
import { Paddle } from './paddle.js'
import { Ball } from './ball.js'
import { Key } from './key.js';

let ballSpeed = 3;
let lPaddleSpeed = 5;
let rPaddleSpeed = 5;

let Game = class {
	constructor() {
		this.interval = 0;
		this.canvas = new Canvas("myCanvas");
		this.key = new Key();
		this.paddleL = new Paddle(0, (this.canvas.height - 150) / 2, 10, 150, lPaddleSpeed);
		this.paddleR = new Paddle(this.canvas.width - 10, (this.canvas.height - 150) / 2, 10, 150, rPaddleSpeed);
		this.ball = new Ball((this.canvas.width - 7) / 2, (this.canvas.height - 7) / 2, 10, ballSpeed);
		// this.ball = new Ball(0, 0, 20, 3);

		console.log(this.ball.speed)
	}
	render = () => {
		console.log('rendering..');
		this.canvas.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		this.paddleL.draw(this.canvas.ctx);
		this.paddleR.draw(this.canvas.ctx);
		this.ball.draw(this.canvas.ctx);
		
		if (this.key.WPressed)		this.paddleL.moveUp();
		if (this.key.SPressed)		this.paddleL.moveDown(this.canvas.height);
		if (this.key.upPressed)		this.paddleR.moveUp();
		if (this.key.downPressed)	this.paddleR.moveDown(this.canvas.height);

		if (!this.ball.move(this.canvas.width, this.canvas.height, this.paddleL, this.paddleR))
			this.stop();
	}
	start = () => {
		this.interval = setInterval(this.render, 7);
	}
	stop = () => {
		clearInterval(this.interval);
		alert("GAME OVER");
		document.location.reload();
	}
}

export {Game};