import { Canvas } from './canvas.js';
import { UserInterface } from './userInterface.js';
import { calculate } from './calculate.js';
import { Key } from './key.js';
import { Info } from './info.js'

const ballSpeed = 4;
const ballSpeedMax = 10;
const paddleLWidth = 10;
const paddleLHeight = 100;
const paddleRWidth = 10;
const paddleRHeight = 100;
const playerLNickname = 'LEFT';
const playerRNickname = 'RIGHT';
const ballRadius = 15;
const maxScore = 5;
const em = 0.08;
const cof = 0.6;
const accelInit = 4;
const accel = 0.15;
let timer = 0;

let Game = class {
	constructor() {
		this.interval = 0;
		this.canvas = new Canvas("ping pong");
		this.ui = new UserInterface(this.canvas);
		this.key = new Key();
		this.info = new Info(this.canvas.width, this.canvas.height, maxScore);
		this.info.initBall(ballRadius, ballSpeed, ballSpeedMax);
		this.info.initPaddleL(paddleLWidth, paddleLHeight, accel, accelInit, em, cof);
		this.info.initPaddleR(paddleRWidth, paddleRHeight, accel, accelInit, em, cof);
		this.info.initPlayer(playerLNickname, playerRNickname);
	}

	// ### rendering ###
	renderGame = () => {
		this.canvas.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		// 화면 렌더링
		this.ui.drawHalfLine();
		this.ui.drawScore(this.info.playerL.score, this.info.playerR.score);
		this.info.draw(this.canvas.ctx);

		// 계산
		calculate(this.info, this.key);

		// 게임종료처리
		if (this.info.gameover) {
			this.info.resetGame();
			this.end(this.info.winner);
		}
	}
	renderHome = () => {
		this.ui.drawHomeScreen();
		if (this.key.isSomethingPressed)	this.start();
	}
	renderGameOver = (winner) => {
		timer++;
		this.ui.drawGameOverScreen(timer % 360, winner);
		this.info.gameover = false;
		if (this.key.RPressed)
			this.init();
	}


	// ### control ###
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
		this.interval = setInterval(() => {
			this.renderGameOver(winner);
		}, 10);
	}
}

export {Game};