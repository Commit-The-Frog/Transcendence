import { Canvas } from './canvas.js';
import { UserInterface } from './userInterface.js';
import { calculate } from './calculate.js';
import { Key } from './key.js';
import { Info } from './info.js';

/*
	토너먼트와 1대1
	- 각각 4, 2명의 플레이어 닉네임을 보내준다.
	- 토너먼트는 대진표를 먼저 보여준다.(필수는 아님)
	- 현재 대전상대를 보여주고, 아무 버튼을 누르면 시작한다.
	- 1대1은 게임이 종료되면 종료 화면이 나오고, 누르면 홈으로 이동한다.
	- 토너먼트는 1게임이 종료되면 2게임이 시작된다....4게임까지 진행함
	- 토너먼트는 모든 게임이 종료되면 종료 화면이 나오고, 누르면 홈으로 이동한다.
*/

const ballSpeed = 10;
const ballSpeedMax = 10;
const paddleLWidth = 10;
const paddleLHeight = 100;
const paddleRWidth = 10;
const paddleRHeight = 100;
const ballRadius = 15;
const maxScore = 5;
const em = 0.03;
const cof = 2;
const accelInit = 4;
const accel = 0.15;
let timer = 0;

let Game = class {
	constructor(type, nickname) {
		this.tourRound = 1;
		this.winners = [];
		this.nickname = nickname;
		this.interval = 0;
		this.canvas = new Canvas("ping pong");
		this.ui = new UserInterface(this.canvas);
		this.key = new Key();
		this.info = new Info(this.canvas.width, this.canvas.height, maxScore, type);
		this.info.initBall(ballRadius, ballSpeed, ballSpeedMax);
		this.info.initPaddleL(paddleLWidth, paddleLHeight, accel, accelInit, em, cof);
		this.info.initPaddleR(paddleRWidth, paddleRHeight, accel, accelInit, em, cof);
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
		this.ui.drawGameOverScreen(this.info.type, timer % 360, winner);
		this.info.gameover = false;
		if (this.key.HPressed) {
			if (this.info.type == 1)		this.home();
			else if (this.info.type == 2) {
				if (this.tourRound <= 2) {
					this.init();
				} 
				else if (this.tourRound == 3)
					this.init();
				else
					this.home();
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