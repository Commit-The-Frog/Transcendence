let Key = class {
	constructor() {
		this.HPressed = false;
		this.upPressed = false;
		this.downPressed = false;
		this.nowPressed = null;
		this.ws = null;
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
		else if (e.code === "KeyH")
			this.HPressed = true;
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
		else if (e.code === "KeyH")
			this.HPressed = false;
	}
	setKeyEventHandler() {
		document.addEventListener("keydown", this.keyDownHandler, false);
		document.addEventListener("keyup", this.keyUpHandler, false);
	}
	sendKeyEventToWs = () => {
		// 키정보 서버에 전송
		if (this.ws && this.ws.readyState === WebSocket.OPEN) {
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
}



export { Key };