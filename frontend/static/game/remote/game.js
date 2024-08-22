import { Canvas } from './canvas.js';
import { UserInterface } from './userInterface.js';
import { Key } from './key.js';

let timer = 0;

let Game = class {
	constructor(matchName, nickname) {
		this.animationFrameId = null;
		this.canvas = new Canvas("ping pong");
		this.ui = new UserInterface(this.canvas);
		this.key = new Key();
		this.info = null;
		this.ws = null;
		this.wsUrl = `ws://${window.env.SERVER_IP}:${window.env.SERVER_PORT}/ws/game/match?match_name=${matchName}&id=${nickname}`;
		this.status = 'ready';
		this.count = 0;
	}

	// ### rendering ###
	renderGame = () => {
		// 계산(웹소켓으로 정보 받아옴)
		this.ws.onmessage = (event) => {
			this.count++;
			this.info = JSON.parse(event.data);
			if (this.info) {
				// requestAnimationFrame을 사용하여 렌더링
				this.animationFrameId = requestAnimationFrame(() => {
					this.canvas.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
					// 화면 렌더링
					this.ui.drawHalfLine();
					this.ui.drawInfo(this.info);
					this.ui.drawScoreAndNickname(playerL, playerR);
				});
			}
		};
	}

	renderStart = () => {
		this.ui.drawGameStartScreen(this.info.playerL, this.info.playerR);
		if (this.key.nowPressed) { // 준비완료 버튼(아무버튼이나)
			if (!this.ws || this.ws.readyState === WebSocket.CLOSED) {
				this.ws = new WebSocket(this.wsUrl);

				this.ws.onopen = () => {
					console.log("WebSocket is open now");
					const eventData = JSON.stringify({ type: 'ready' });
					this.ws.send(eventData); // 웹소켓으로 준비완료 정보 전송
					this.key.initWs(this.ws);
					this.start();
				};
			}
		}
		// 다음 프레임에 renderStart를 다시 호출
		this.animationFrameId = requestAnimationFrame(this.renderStart);
	}

	renderGameOver = (winner) => {
		timer++;
		this.ui.drawGameOverScreen(this.info.type, timer % 360, winner);
		this.info.gameover = false;
		if (this.key.HPressed) {
			if (this.info.type == 1) {
				this.home();
			} else if (this.info.type == 2) {
				if (this.tourRound <= 2) {
					this.init();
				} else if (this.tourRound == 3) {
					this.init();
				} else {
					this.home();
				}
			}
		}
	}

	// ### control ###
	init = () => {
		// setInterval 대신 requestAnimationFrame 사용
		cancelAnimationFrame(this.animationFrameId);
		this.renderStart();
	}

	start = () => {
		if (this.animationFrameId) {
			cancelAnimationFrame(this.animationFrameId);
		}
		this.renderGame();
	}

	end = (winner) => {
		if (this.animationFrameId) {
			cancelAnimationFrame(this.animationFrameId);
		}
		this.renderGameOver(winner.nickname);
	}

	home = () => {
		if (this.animationFrameId) {
			cancelAnimationFrame(this.animationFrameId);
		}
		window.location.href = `index.html`;
	}
}
export {Game};