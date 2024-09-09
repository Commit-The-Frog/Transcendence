import { Canvas } from './canvas.js';
import { UserInterface } from './userInterface.js';
import { calculate } from './calculate.js';
import { Key } from './key.js';
import { Info } from './info.js';

const ballSpeed = 5;
const ballSpeedMax = 10;
const paddleLWidth = 10;
const paddleLHeight = 100;
const paddleRWidth = 10;
const paddleRHeight = 100;
const ballRadius = 15;
const maxScore = 5;
const em = 0.03;
const cof = 0.3;
const accelInit = 4;
const accel = 0.15;
let timer = 0;

let Game = class {
	constructor(type, nickname, itemList) {
		console.log(itemList)
		this.tourRound = 1;
		this.winners = [];
		this.nickname = nickname;
		this.itemList = itemList;
		this.interval = 0;
		this.canvas = new Canvas("localPingpong");
		this.ui = new UserInterface(this.canvas);
		this.key = new Key();
		this.info = new Info(this.canvas.width, this.canvas.height, maxScore, type);
		this.info.initBall(ballRadius, ballSpeed, ballSpeedMax);
		this.info.initPaddleL(paddleLWidth, paddleLHeight, accel, accelInit, em, cof, itemList[0]);
		this.info.initPaddleR(paddleRWidth, paddleRHeight, accel, accelInit, em, cof, itemList[1]);
		this.info.initPlayer(this.nickname[0], this.nickname[1]);
	}

	// ### rendering ###
	renderGame = () => {
		this.canvas.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		// 화면 렌더링
		this.ui.drawHalfLine();
		this.ui.drawScoreAndNickname(this.info.playerL, this.info.playerR);
		this.info.draw(this.canvas.ctx);

		// 계산
		calculate(this.info, this.key);

		// 게임종료처리
		if (this.info.gameover) {
			this.info.resetGame();
			this.end(this.info.winner);
		}
	}
	renderStart = () => {
		this.ui.drawGameStartScreen(this.info.playerL, this.info.playerR);
		if (this.key.isSomethingPressed)
			this.start();
	}
	renderGameOver = (winner) => {
		timer++;
		this.ui.drawGameOverScreen(this.info.type, this.tourRound, timer % 360, winner);
		this.info.gameover = false;
		// if (this.info.type == 1)		this.init();
		if (this.key.SpacePressed) {
			if (this.info.type == 2) {
				if (this.tourRound <= 2)
					this.init();
				else if (this.tourRound == 3)
					this.init();
			}
		}
	}

	// ### control ###
	init = () => {
		clearInterval(this.interval);
		this.interval = setInterval(this.renderStart, 10);
	}
	start = () => {
		clearInterval(this.interval);
		if (this.info.type == 2) {
			if (this.tourRound == 1)
				this.info.initPlayer(this.nickname[0], this.nickname[1]);
			else if (this.tourRound == 2) {
				this.winners.push(this.info.winner);
				this.info.initPlayer(this.nickname[2], this.nickname[3]);
			}
			else {
				this.winners.push(this.info.winner);
				this.info.initPlayer(this.winners[0].nickname, this.winners[1].nickname);
			}
		}
		this.tourRound++;
		this.interval = setInterval(this.renderGame, 7);
	}
	end = (winner) => {
		clearInterval(this.interval);
		this.interval = setInterval(() => {
			this.renderGameOver(winner.nickname);
		}, 10);
	}
	home = () => {
		clearInterval(this.interval);
		window.location.href = `index.html`;
	}
}

export {Game};