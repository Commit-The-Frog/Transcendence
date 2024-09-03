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
		this.typestr = type == '1' ? '1vs1' : 'tournament';
		this.itemMode = itemMode;
		this.nickname = nickname;
		this.tourStatus = null;
		this.wsUrl = `ws://${window.env.SERVER_IP}:${window.env.SERVER_PORT}/ws/game/${this.typestr}?match_name=${matchName}&id=${nickname}`;
		this.count = 0;
	}

	// ### rendering ###
	renderGame = (isMe) => {
		if (isMe)	this.key.isme = true;
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
				this.key.isme = false;
				this.gameOver();
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
		console.log(`웹소켓 연결 시도 : ${this.wsUrl}`);
		this.ws = new WebSocket(this.wsUrl);
		this.key.initWs(this.ws);
		this.ws.onopen = () => {
			console.log(`토너먼트 웹소켓 오픈 : ${this.wsUrl}`);
		};
		this.ws.onmessage = (event) => {
			const recv_data = JSON.parse(event.data);
			this.tourStatus = recv_data.type;
			if (this.tourStatus == 'tour_waiting') {
				const players = recv_data.players;
				console.log(`서버로부터 참가자 데이터 수신 : ${players} -> 대진표 렌더링...`);
				if (players.length == 4) {
					let count = 6;
					const countDown = setInterval(()=> {
						this.canvas.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
						count--;
						this.ui.drawScheduleScreen(players, `Game start in ${count}`);
						if (count == 0)
							clearInterval(countDown);
					}, 1000);
				} else {
					this.canvas.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
					this.ui.drawScheduleScreen(players, 'Waiting for players...');
				}
			}
		}
	}
	/* 
		Game 시작 화면 렌더링
	*/
	renderStart = () => {
		console.log('renderStart')
		let recv_data;
		let isMe = false;
		this.ui.drawGameStartScreen(false, ['', '']);
		this.ws.onmessage = (event) => {
			recv_data = JSON.parse(event.data);
			if (recv_data.status == 'waiting') {
				console.log('waiting...');
				if (recv_data.playerL.nickname === this.nickname || recv_data.playerR.nickname === this.nickname)
					isMe = true;
				this.canvas.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
				this.ui.drawGameStartScreen(isMe, [recv_data.playerL.nickname, recv_data.playerR.nickname]);
			} else if (recv_data.status == 'in progress') {
				console.log('in progress');
				this.gameStart(isMe);
			}
		}
		const keyReact = setInterval(() => {
			console.log(this.key.spacePressed);
			if (isMe && this.key.spacePressed) {
				const ready = {type: 'ready'};
				let readyData = JSON.stringify(ready);
				this.ws.send(readyData);
				clearInterval(keyReact);
			}
		}, 2);
	}
	/*
		game 종료 화면 렌더링
	*/
	renderGameOver = () => {
		console.log('game 종료');
		timer++;
		this.ui.drawGameOverScreen(1, (timer * 2) % 360, this.info.winner);
		this.animationFrameId = requestAnimationFrame(this.renderGameOver);
	}

	// ### control ###
	init = () => {
		if (this.type == 2)	this.initTournament();
		else	this.initGame();
	}
	// 토너먼트 시작 명령
	initTournament = () => {
		this.renderSchedule();
		if (this.tourStatus === 'game1')
			this.initGame();
		else if (this.tourStatus === 'game2')
			this.initGame();
		else if (this.tourStatus === '')
	}
	// 게임 시작 명령
	initGame = () => {
		this.renderStart();
	}
	// 게임 시작
	gameStart = (isMe) => {
		this.renderGame(isMe);
	}
	// 게임 종료
	gameOver = () => {
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