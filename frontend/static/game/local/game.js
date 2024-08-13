import { Canvas } from './canvas.js';
import { UserInterface } from './userInterface.js';
import { calculate } from './calculate.js';
import { Key } from './key.js';
import { Info } from './info.js'

const ballSpeed = 4;
const ballSpeedMax = 6;
const paddleLWidth = 10;
const paddleLHeight = 100;
const paddleRWidth = 10;
const paddleRHeight = 100;
const playerLNickname = 'LEFT';
const playerRNickname = 'RIGHT';
const ballRadius = 15;
const maxScore = 5;
const scoreFontSize = 48;
const em = 0.03;
const cof = 0.3;
const accelInit = 4;
const accel = 0.1;
let timer = 0;

let Game = class {
	constructor() {
		this.interval = 0;
		this.canvas = new Canvas("ping pong");
		this.ui = new UserInterface(this.canvas);
		this.key = new Key();
		this.info = new Info(this.canvas.width, this.canvas.height);
		this.info.initBall(ballRadius, ballSpeed, ballSpeedMax);
		this.info.initPaddleL(paddleLWidth, paddleLHeight, accel, accelInit, em, cof);
		this.info.initPaddleR(paddleRWidth, paddleRHeight, accel, accelInit, em, cof);
		this.info.initPlayer(playerLNickname, playerRNickname);
	}
	renderGame = () => {
		// console.log('rendering.. ps : ' + this.paddleL.dy + ',' + this.paddleR.dy);
		this.canvas.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		// 화면 렌더링
		this.drawHalfLine();
		this.drawScore();
		this.info.draw(this.canvas.ctx);

		// 계산
		calculate(this.info, this.key);

		// 5점 득점시 게임 종료처리
		if (this.info.playerL.score === maxScore)
			this.end('L');
		else if (this.info.playerR.score === maxScore)
			this.end('R');

		// 득실 판정 및 처리
		let loser = this.checkBallOut();
		if (loser === 1) {
			++this.info.playerL.score;
			this.nextRound('R');
			this.drawScore();
		} else if (loser === 2) {
			++this.info.playerR.score;
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
		this.info.ball.reset((this.canvas.width - 7) / 2, (this.canvas.height - 7) / 2, dir);
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
		if (this.info.ball.x < -50)
			return 1;
		if (this.info.ball.x > this.canvas.width + 50)
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
		this.canvas.ctx.fillText(this.info.playerL.score, this.canvas.width / 4 + 20, 100, 100);
		this.canvas.ctx.fillText(this.info.playerR.score, this.canvas.width * 3 / 4 - scoreFontSize, 100, 100);
	}
}

export {Game};