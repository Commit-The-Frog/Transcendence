import { Canvas } from './canvas.js';
import { Paddle } from './paddle.js'
import { Ball } from './ball.js'
import { Key } from './key.js';
import { UserInterface } from './userInterface.js';

const ballSpeed = 10;
const lPaddleSpeed = 5;
const rPaddleSpeed = 5;
const paddleWidth = 10;
const paddleHeight = 150;
const ballRadius = 15;
const maxScore = 5;
const scoreFontSize = 48;
let timer = 0;

let Game = class {
	constructor() {
		this.scoreL = 0;
		this.scoreR = 0;
		this.interval = 0;
		this.canvas = new Canvas("myCanvas");
		this.ui = new UserInterface(this.canvas);
		this.key = new Key(this.canvas);
		this.paddleL = new Paddle(50, (this.canvas.height - paddleHeight) / 2, paddleWidth, paddleHeight, lPaddleSpeed);
		this.paddleR = new Paddle(this.canvas.width - 50 - paddleWidth, (this.canvas.height - paddleHeight) / 2, paddleWidth, paddleHeight, rPaddleSpeed);
		this.ball = new Ball((this.canvas.width - ballRadius) / 2, (this.canvas.height - ballRadius) / 2, ballRadius, ballSpeed);
	}
	renderGame = () => {
		console.log('rendering..');
		this.canvas.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		this.drawHalfLine();
		this.drawScore();
		this.paddleL.draw(this.canvas.ctx);
		this.paddleR.draw(this.canvas.ctx);
		this.ball.draw(this.canvas.ctx);
		
		if (this.key.WPressed)		this.paddleL.moveUp();
		if (this.key.SPressed)		this.paddleL.moveDown(this.canvas.height);
		if (this.key.upPressed)		this.paddleR.moveUp();
		if (this.key.downPressed)	this.paddleR.moveDown(this.canvas.height);

		if (this.scoreL === maxScore)
			this.end('LEFT');
		else if (this.scoreR === maxScore)
			this.end('RIGHT');
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
	renderHome = () => {
		this.ui.drawHomeScreen();
		if (this.key.isSomethingPressed)	this.start();
	}
	renderGameOver = (winner) => {
		timer++;
		this.ui.drawGameOverScreen(timer % 360, winner);
		if (this.key.RPressed)
			window.location.reload();
	}


	init = () => {
		clearInterval(this.interval);
		this.interval = setInterval(this.renderHome, 10);
	}
	start = () => {
		clearInterval(this.interval);
		this.interval = setInterval(this.renderGame, 7);
	}
	restart = (dir) => {
		clearInterval(this.interval);
		this.ball.reset((this.canvas.width - 7) / 2, (this.canvas.height - 7) / 2, dir);
		this.start();
	}
	end = (winner) => {
		clearInterval(this.interval);
		timer = 0;
		this.interval = setInterval(() => {
			this.renderGameOver(winner);
		}, 10);
	}
	checkBallOut = () => {
		if (this.ball.x < -50)
			return 1;
		if (this.ball.x > this.canvas.width + 50)
			return 2;
		return 0;
	}
	drawHalfLine = () => {
		this.canvas.ctx.beginPath();
		this.canvas.ctx.moveTo(this.canvas.width / 2, 10);
		this.canvas.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
		this.canvas.ctx.setLineDash([20]);
		this.canvas.ctx.stroke();
	}
	drawScore = () => {
		this.canvas.ctx.font = `${scoreFontSize}px sans-serif`;
		this.canvas.ctx.fillText(this.scoreL, this.canvas.width / 4 + 20, 100, 100);
		this.canvas.ctx.fillText(this.scoreR, this.canvas.width * 3 / 4 - scoreFontSize, 100, 100);
	}
}

export {Game};