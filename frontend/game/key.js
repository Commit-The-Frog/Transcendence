let Key = class {
	constructor(canvas) {
		this.canvas = canvas;
		this.WPressed = false;
		this.SPressed = false;
		this.RPressed = false;
		this.upPressed = false;
		this.downPressed = false;
		this.nowPressed = null;
		this.setKeyEventHandler();
	}

	get WPressed ()	{ return this._WPressed; }
	get SPressed () { return this._SPressed; }
	get upPressed () { return this._upPressed; }
	get downPressed () { return this._downPressed; }
	get RPressed () { return this._RPressed; }

	get isSomethingPressed () {
		if (this.nowPressed)
			return true;
		return false;	
	}

	set WPressed(status) { this._WPressed = status; }
	set SPressed(status) { this._SPressed = status; }
	set upPressed(status) { this._upPressed = status; }
	set downPressed(status) { this._downPressed = status; }
	set RPressed(status) { this._RPressed = status; }

	keyDownHandler = (e) => {
		if (e) this.nowPressed = e.code;
		if (e.key === "Right" || e.key === "ArrowUp")
			this.upPressed = true;
		else if (e.key === "Left" || e.key === "ArrowDown")
			this.downPressed = true;
		else if (e.code === "KeyW")
			this.WPressed = true;
		else if (e.code === "KeyS")
			this.SPressed = true;
		else if (e.code === "KeyR")
			this.RPressed = true;
	}
	keyUpHandler = (e) => {
		if (e) this.nowPressed = null;
		if (e.key === "Up" || e.key === "ArrowUp")
			this.upPressed = false;
		else if (e.key === "Down" || e.key === "ArrowDown")
			this.downPressed = false;
		else if (e.code === "KeyW")
			this.WPressed = false;
		else if (e.code === "KeyS")
			this.SPressed = false;
		else if (e.code === "KeyR")
			this.RPressed = false;
	}
	setKeyEventHandler() {
		document.addEventListener("keydown", this.keyDownHandler, false);
		document.addEventListener("keyup", this.keyUpHandler, false);
	}
}



export { Key };