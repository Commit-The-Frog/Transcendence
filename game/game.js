import { Canvas } from './canvas.js';
import { Paddle } from './paddle.js'
import { Ball } from './ball.js'
import { Key } from './key.js';
import { UserInterface } from './userInterface.js';

const ballSpeed = 4;
const rPaddleSpeed = 5;
const paddleWidth = 10;
const paddleHeight = 100;
const ballRadius = 15;
const maxScore = 5;
const scoreFontSize = 48;
const em = 0.03;
const cof = 0.42;
const accelInit = 4;
const accel = 0.1;
let timer = 0;

let Game = class {
	constructor() {
		this.scoreL = 0;
		this.scoreR = 0;
		this.interval = 0;
		this.canvas = new Canvas("myCanvas");
		this.ui = new UserInterface(this.canvas);
		this.key = new Key(this.canvas);
		this.paddleL = new Paddle(50, (this.canvas.height - paddleHeight) / 2, paddleWidth, paddleHeight, accel, em, cof);
		this.paddleR = new Paddle(this.canvas.width - 50 - paddleWidth, (this.canvas.height - paddleHeight) / 2, paddleWidth, paddleHeight, rPaddleSpeed, em, cof);
		this.ball = new Ball((this.canvas.width - ballRadius) / 2, (this.canvas.height - ballRadius) / 2, ballRadius, ballSpeed);
	}
	renderGame = () => {
		// console.log('rendering.. ballspeed : ' + this.ball.dy);
		this.canvas.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		this.drawHalfLine();
		this.drawScore();
		this.paddleL.draw(this.canvas.ctx);
		this.paddleR.draw(this.canvas.ctx);
		this.ball.draw(this.canvas.ctx);
		
		// 패들 가속도 처리
		if (this.key.WPressed)
			this.paddleL.dy = Math.min(-accelInit, this.paddleL.dy - accel)
		else if (this.key.SPressed)
			this.paddleL.dy = Math.max(accelInit, this.paddleL.dy + accel)
		else
			this.paddleL.dy = 0;
		this.paddleL.move(this.canvas.height);
		if (this.key.upPressed)
			this.paddleR.dy = Math.min(-accelInit, this.paddleR.dy - accel)
		else if (this.key.downPressed)
			this.paddleR.dy = Math.max(accelInit, this.paddleR.dy + accel)
		else
			this.paddleR.dy = 0;
		this.paddleR.move(this.canvas.height);

		if (this.scoreL === maxScore)
			this.end('L');
		else if (this.scoreR === maxScore)
			this.end('R');
		this.ball.move(this.canvas.height, this.paddleL, this.paddleR)
		let loser = this.checkBallOut();
		if (loser === 1) {
			++this.scoreR;
			this.nextRound('R');
			this.drawScore();
		} else if (loser === 2) {
			++this.scoreL;
			this.drawScore();
			this.nextRound('L');
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
			this.init();
	}


	init = () => {
		clearInterval(this.interval);
		this.interval = setInterval(this.renderHome, 10);
	}
	start = () => {
		clearInterval(this.interval);
		this.interval = setInterval(this.renderGame, 7);
	}
	nextRound = (dir) => {
		clearInterval(this.interval);
		this.ball.reset((this.canvas.width - 7) / 2, (this.canvas.height - 7) / 2, dir);
		this.start();
	}
	end = (winner) => {
		clearInterval(this.interval);
		this.scoreL = 0;
		this.scoreR = 0;
		timer = 0;
		this.paddleL.x = 50;
		this.paddleL.y = (this.canvas.height - paddleHeight) / 2;
		this.paddleR.x = this.canvas.width - 50 - paddleWidth;
		this.paddleR.y = (this.canvas.height - paddleHeight) / 2;
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