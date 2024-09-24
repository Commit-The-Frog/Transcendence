import { Canvas } from './canvas.js';
import { UserInterface } from './userInterface.js';
import { Key } from './key.js';
// import { connectSocket, getcurrentSocket } from '../../utils/useSocket.js';
import  useSocket  from '../../utils/useSocket.js';
import { showToastHandler } from '../../utils/showToast.js';
import { changeUrl } from '../../utils/changeUrl.js';

let timer = 0;

let Game = class {
	constructor(matchName, nickname, type, itemMode) {
		this.canvas = new Canvas("remotePingpong");
		this.ui = new UserInterface(this.canvas);
		this.key = new Key();
		this.type = type;
		this.typestr = type == '1' ? '1vs1' : 'tournament';
		this.nickname = nickname;
		this.wsUrl = `wss://${window.location.host}/ws/game/${this.typestr}?match_name=${matchName}&id=${nickname}`;
		this.itemMode = itemMode;
		this.tourStatus = null;
		this.gameStatus = null;
		this.myTurn = false;
		this.count = 0;
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
			this.count = 6;
			const countDown = setInterval(()=> {
				this.canvas.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
				this.count--;
				this.ui.drawScheduleScreen(players, `Game start in ${this.count}`);
				if (this.count == 1 && (this.tourStatus == 'game1' || this.tourStatus == 'game2' || this.tourStatus == 'final'))
					clearInterval(countDown);
			}, 1000);
		}
	}
	/* 
		game 시작 화면 렌더링
	*/
	renderStart = (gameData) => {
		this.canvas.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.ui.drawGameStartScreen(this.myTurn, [gameData.playerL, gameData.playerR]);
		//console.log(this.myTurn)
	}
	/*
		game 진행 렌더링
	*/
	renderGame = (gameData) => {
		this.canvas.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.ui.drawHalfLine();
		this.ui.drawInfo(gameData);
		this.ui.drawScoreAndNickname(gameData.playerL, gameData.playerR);
	}
	/*
		game 종료 화면 렌더링
	*/
	renderGameOver = (gameData, error) => {
		console.log('game 종료');
		this.myTurn = false;
		this.key.myTurn = false;
		timer++;
		if (!error)
			this.ui.drawGameOverScreen(1, (timer * 2) % 360, gameData.winner, null, false);
		else
			this.ui.drawGameOverScreen(1, (timer * 2) % 360, gameData.winner, gameData.disconnected_player, true);
	}


	// ### control ###
	init = () => {
		if (this.type == 1)
			this.init1vs1();
		else
			this.initTournament();
	}
	init1vs1 = () => {
		console.log(`1vs1 웹소켓 연결 시도 : ${this.wsUrl}`);
		const ws_ = {};
		// this.ws = new WebSocket(this.wsUrl);
		// this.key.initWs(this.ws);
		ws_.onopen = () => {
			console.log(`토너먼트 웹소켓 연결 성공`);
		};
		ws_.onerror = (error) => {
			console.log(`토너먼트 웹소켓 에러 발생`);
			console.log(error);
		};
		ws_.onclose = () =>{
			console.log(`토너먼트 웹소켓 종료`);
		};
		ws_.onmessage = (event) => {
			const data = JSON.parse(event.data);
			//console.log(data);
			if (data.type === 'refresh') {
				changeUrl("/pingpong/remote");
			}
			else if (data.status) {
				this.myTurn = true;
				this.key.myTurn = true;
				if (data.status == 'waiting') {
					this.renderStart(data);
					if (this.myTurn) this.key.sendSpaceKeyEventToWsOnce();
				} else if (data.status == 'in progress') {
					this.renderGame(data);
				} else if (data.status == 'game over') {
					this.renderGameOver(data, false);
				} else if (data.status == 'error')
					this.renderGameOver(data, true);
			}
		}
		useSocket().connectSocket(this.wsUrl, ws_);
		this.ws = useSocket().getcurrentSocket();
		this.key.initWs(useSocket().getcurrentSocket());

	}
	initTournament = () => {
		console.log(`토너먼트 웹소켓 연결 시도 : ${this.wsUrl}`);
		const ws_ = {};
		// this.ws = new WebSocket(this.wsUrl);
		// this.key.initWs(this.ws);
		ws_.onopen = () => {
			console.log(`토너먼트 웹소켓 연결 성공`);
		};
		ws_.onerror = (error) => {
			console.log(`토너먼트 웹소켓 에러 발생`);
			console.log(error);
			changeUrl("/pingpong/remote");
			// showToastHandler('에러났어 ㅡㅡ');
		};
		ws_.onclose = () =>{
			console.log(`토너먼트 웹소켓 종료`);
		};
		ws_.onmessage = (event) => {
			// console.log(event);
			const data = JSON.parse(event.data);
			if (data.type === 'refresh') {
				changeUrl("/pingpong/remote");
				// showToastHandler('에러났어 ㅡㅡ');
			}
			else if (data.type) {	// 토너먼트 컨트롤
				this.tourStatus = data.type;
				if (data.type == 'tour_waiting') {
					this.renderSchedule(data.players);
				} else if (data.type == 'game1' || data.type == 'game2' || data.type == 'final') {
					// console.log(data);
					console.log(data.playerL + ' ' + this.nickname);
					if (data.playerL === this.nickname || data.playerR === this.nickname) {
						this.myTurn = true;
						this.key.myTurn = true;
					}
				}
			} else if (this.count == 1 && data.status) {
				//console.log(data.status)
				this.gameStatus = data.status;
				if (data.status == 'waiting') {
					this.renderStart(data);
					//if (this.myTurn) this.key.sendSpaceKeyEventToWsOnce();
					this.key.sendSpaceKeyEventToWsOnce();
				} else if (data.status == 'in progress') {
					this.renderGame(data);
				} else if (data.status == 'game over') {
					this.renderGameOver(data, false);
				} else if (data.status == 'error') {
					this.renderGameOver(data, true);
				}
			}
		};
		useSocket().connectSocket(this.wsUrl, ws_);
		this.ws = useSocket().getcurrentSocket();
		this.key.initWs(useSocket().getcurrentSocket());
	}
}
export {Game};