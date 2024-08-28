import { Canvas } from './canvas.js';
import { UserInterface } from './userInterface.js';
import { Key } from './key.js';

let timer = 0;

let Game = class {
	constructor(matchName, nickname, type, itemMode) {
		this.animationFrameId = null;
		this.canvas = new Canvas("ping pong");
		this.ui = new UserInterface(this.canvas);
		this.key = new Key();
		this.info = null;
		this.ws = null;
		this.type = type;
		this.itemMode = itemMode;
		this.wsUrl = `ws://${window.env.SERVER_IP}:${window.env.SERVER_PORT}/ws/game/match?match_name=${matchName}&id=${nickname}`;
		this.count = 0;
	}

	// ### rendering ###
	renderGame = () => {
		// 계산(웹소켓으로 정보 받아옴)
		this.ws.onmessage = (event) => {
			this.count++;
			this.info = JSON.parse(event.data);
			if (this.info && this.info.status === 'in progress') {
				// requestAnimationFrame을 사용하여 렌더링
				this.animationFrameId = requestAnimationFrame(() => {
					this.canvas.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
					// 화면 렌더링
					this.ui.drawHalfLine();
					this.ui.drawInfo(this.info);
					this.ui.drawScoreAndNickname(this.info.playerL, this.info.playerR);
				});
			} else if (this.info && this.info.status === 'game over') {
				this.end()
			}
		};
	}

	/* 
		대진표 화면 렌더링
			- 참가자 배열 전달 후 화면 그리기
			- 웹소켓 연결요청
	*/
	renderSchedule = () => {
		this.ui.drawScheduleScreen(['', '', '', ''], 'Waiting for players...');
		if (this.key.nowPressed) {
			this.ws = new WebSocket(this.wsUrl);
			this.ws.onopen = () => {
				console.log(`토너먼트 웹소켓 오픈 : ${matchName}`);
			};
			this.ws.onmessage = (event) => {
				const players = event.players;
				console.log(`서버로부터 참가자 데이터 수신 : ${players}`);
				if (players.length == 4) {
					let countDown = 5;
					this.ui.drawScheduleScreen(players, `Game start in ${countDown}`);
				} else {
					this.ui.drawScheduleScreen(players, 'Waiting for players...');
				}
			}
		}
	}

	renderStart = () => {
		this.ui.drawGameStartScreen();
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

	renderGameOver = () => {
		timer++;
		this.ui.drawGameOverScreen(1, (timer * 2) % 360, this.info.winner);
		if (this.key.spacePressed) {
			this.home();
		}
		this.animationFrameId = requestAnimationFrame(this.renderGameOver);
	}

	// ### control ###
	init = () => {
		cancelAnimationFrame(this.animationFrameId);
		if (this.type == 2)	this.initTournament();
		else	this.initGame();
	}

	// 토너먼트 시작 명령
	initTournament = () => {
		cancelAnimationFrame(this.animationFrameId);
		
	}

	// 게임 시작 명령
	initGame = () => {

	}

	start = () => {
		cancelAnimationFrame(this.animationFrameId);
		this.renderGame();
	}

	end = () => {
		cancelAnimationFrame(this.animationFrameId);
		this.renderGameOver();
	}

	home = () => {
		if (this.animationFrameId) {
			cancelAnimationFrame(this.animationFrameId);
		}
		window.location.href = `index.html`;
	}
}
export {Game};