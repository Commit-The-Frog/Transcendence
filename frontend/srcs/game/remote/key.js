let Key = class {
	constructor() {
		this.spacePressed = false;
		this.upPressed = false;
		this.downPressed = false;
		this.nowPressed = null;
		this.ws = null;
		this.myTurn = false;
		this.setKeyEventHandler();
	}
	initWs = (ws) => {
		this.ws = ws;
	}
	keyDownHandler = (e) => {
		if (e) this.nowPressed = e.code;
		if (e.key === "Up" || e.key === "ArrowUp") {
			this.upPressed = true;
			this.sendKeyEventToWs();
		}
		else if (e.key === "Down" || e.key === "ArrowDown") {
			this.downPressed = true;
			this.sendKeyEventToWs();
		}
		else if (e.code === "Space")
			this.spacePressed = true;
	}
	keyUpHandler = (e) => {
		if (e) this.nowPressed = null;
		if (e.key === "Up" || e.key === "ArrowUp") {
			this.upPressed = false;
			this.sendKeyEventToWs();
		}
		else if (e.key === "Down" || e.key === "ArrowDown") {
			this.downPressed = false;
			this.sendKeyEventToWs();
		}
		else if (e.code === "Space")
			this.spacePressed = false;
	}
	setKeyEventHandler() {
		document.addEventListener("keydown", this.keyDownHandler, false);
		document.addEventListener("keyup", this.keyUpHandler, false);
	}
	sendKeyEventToWs = () => {
		// 키정보 서버에 전송
		//if (this.myTurn && this.ws) {
		if (this.ws) {
			const keyInfo = JSON.stringify( {
				type: 'update',
				key: {
					upPressed: this.upPressed,
					downPressed: this.downPressed
				}
			});
			this.ws.send(keyInfo);
		}
	}
	sendSpaceKeyEventToWsOnce = () => {
		
		const keyReact = setInterval(() => {
			if (this.spacePressed) {
				const ready = {type: 'ready'};
				let readyData = JSON.stringify(ready);
				this.ws.send(readyData);
				console.log('서버에 스베이스바 레디버튼 전송');
				clearInterval(keyReact);
			}
		}, 1);
	}
}



export { Key };