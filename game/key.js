let Key = class {
	constructor() {
		this.WPressed = false;
		this.SPressed = false;
		this.upPressed = false;
		this.downPressed = false;
		this.setKeyEventHandler();
	}

	get WPressed ()	{ return this._WPressed; }
	get SPressed () { return this._SPressed; }
	get upPressed () { return this._upPressed; }
	get downPressed () { return this._downPressed; }

	set WPressed(status) { this._WPressed = status; }
	set SPressed(status) { this._SPressed = status; }
	set upPressed(status) { this._upPressed = status; }
	set downPressed(status) { this._downPressed = status; }

	keyDownHandler = (e) => {
		console.log(e.key);
		if (e.key === "Right" || e.key === "ArrowUp")
			this.upPressed = true;
		else if (e.key === "Left" || e.key === "ArrowDown")
			this.downPressed = true;
		else if (e.key === "w")
			this.WPressed = true;
		else if (e.key === "s")
			this.SPressed = true;
	}
	keyUpHandler = (e) => {
		if (e.key === "Up" || e.key === "ArrowUp")
			this.upPressed = false;
		else if (e.key === "Down" || e.key === "ArrowDown")
			this.downPressed = false;
		else if (e.key === "w")
			this.WPressed = false;
		else if (e.key === "s")
			this.SPressed = false;
	}
	setKeyEventHandler() {
		document.addEventListener("keydown", this.keyDownHandler, false);
		document.addEventListener("keyup", this.keyUpHandler, false);
	}
}



export { Key };