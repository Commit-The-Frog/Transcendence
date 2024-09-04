import { Canvas } from './canvas.js';
import { UserInterface } from './userInterface.js';
import { Key } from './key.js';

let timer = 0;

let Game = class {
	constructor(matchName, nickname, type, itemMode) {
		this.canvas = new Canvas("ping pong");
		this.ui = new UserInterface(this.canvas);
		this.key = new Key();
		this.type = type;
		this.typestr = type == '1' ? '1vs1' : 'tournament';
		this.nickname = nickname;
		this.tourStatus = null;
		this.wsUrl = `ws://${window.env.SERVER_IP}:${window.env.SERVER_PORT}/ws/game/${this.typestr}?match_name=${matchName}&id=${nickname}`;
		this.info = null;
		this.animationFrameId = null;
		this.itemMode = itemMode;
		this.status = null;
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
	renderSchedule = (players) => {
		if (players.length == 0) {
			this.canvas.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.ui.drawScheduleScreen(['', '', '', ''], 'Waiting for players...');
		}
		else if (players.length <= 3) {
			this.canvas.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.ui.drawScheduleScreen(players, 'Waiting for players...');
		} else {
			let count = 6;
			const countDown = setInterval(()=> {
				this.canvas.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
				count--;
				this.ui.drawScheduleScreen(players, `Game start in ${count}`);
				if (count == 0)
					clearInterval(countDown);
			}, 1000);
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
		this.controlTournament();
	}
	controlTournament = () => {
		console.log(`웹소켓 연결 시도 : ${this.wsUrl}`);
		this.ws = new WebSocket(this.wsUrl);
		this.key.initWs(this.ws);
		this.ws.onopen = () => {
			console.log(`토너먼트 웹소켓 연결 성공`);
		};
		this.ws.onerror = (error) => {
			console.log(`토너먼트 웹소켓 에러 발생`);
			console.log(error);
		};
		this.ws.onclose = () =>{
			console.log(`토너먼트 웹소켓 종료`);
		};
		this.onmessage = (event) => {
			const data = JSON.parse(event.data);
			if (data.type) {	// 토너먼트 컨트롤
				if (data.type === 'tour_waiting') {
					this.status = data.type;
					this.renderSchedule(data.players);
				}
				else if (data.type === 'game1' || data.type === 'game2') {
					this.status = data.type;
					console.log(data.type);
				}
			}
			else if (this.status) {
				if (this.status === 'game1' || this.status === 'game2') {
					
				} else if (this.status === 'final') {
					
				}
			}
		};
	}
}
export {Game};