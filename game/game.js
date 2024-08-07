import { Canvas } from './canvas.js';
import { Paddle } from './paddle.js'
import { Ball } from './ball.js'
import { Key } from './key.js';

let Game = class {
	constructor() {
		this.interval = 0;
		this.canvas = new Canvas("myCanvas");
		this.key = new Key();
		this.paddleL = new Paddle(0, (this.canvas.height - 50) / 2, 10, 50, 10);
		this.paddleR = new Paddle(this.canvas.width - 10, (this.canvas.height - 50) / 2, 10, 50, 10);
		this.ball = new Ball((this.canvas.width - 7) / 2, (this.canvas.height - 7) / 2, 7, 7);
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

	}
	start = () => {
		this.interval = setInterval(this.render, 10);
	}
	stop = () => {
		alert("GAME OVER");
		document.location.reload();
		clearInterval(interval);
	}
}

export {Game};