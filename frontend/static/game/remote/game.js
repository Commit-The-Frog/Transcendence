import { Canvas } from './canvas.js';
import { UserInterface } from './userInterface.js';
import { Key } from './key.js';

let timer = 0;

let Game = class {
	constructor(matchName) {
		this.interval = 0;
		this.canvas = new Canvas("ping pong");
		this.ui = new UserInterface(this.canvas);
		this.key = new Key();
		this.info = null;
		this.ws = null;
		this.wsUrl = `ws://10.18.226.23:8000/ws/game/match/${matchName}/`;
		this.status = 'ready';
		this.count = 0;
	}

	// ### rendering ###
	renderGame = () => {
		// 계산(웹소켓으로 정보 받아옴)
		this.ws.onmessage = (event) => {
			this.count++;
			clearInterval(this.interval);
			this.info = JSON.parse(event.data);
			if (this.info) {
				this.canvas.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
				// 화면 렌더링
				this.ui.drawHalfLine();
				// this.ui.drawScoreAndNickname(this.info.playerL, this.info.playerR);
				this.ui.drawInfo(this.info);
			}
		};

		// 게임종료처리
		// if (this.info.gameover) {
		// 	this.info.resetGame();
		// 	this.end(this.info.winner);
		// }
	}
	renderStart = () => {
		this.ui.drawGameStartScreen('playerL', 'playerR');
		if (this.key.nowPressed) { // 준비완료 버튼(아무버튼이나)
			if (!this.ws || this.ws.readyState === WebSocket.CLOSED) {
				this.ws = new WebSocket(this.wsUrl);
	
				this.ws.onopen = () => {
					console.log("WebSocket is open now");
					const eventData = JSON.stringify({ type: 'ready' });
					this.ws.send(eventData); // 웹소켓으로 준비완료 정보 전송
					this.key.initWs(this.ws);
				};
				this.renderGame();
			}
		}
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
		setInterval(()=> {
			console.log(this.count);
			this.count = 0;
		}, 1000);
	}
	start = () => {
		clearInterval(this.interval);
		this.renderGame();
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