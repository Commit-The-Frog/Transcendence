
let Canvas = class {
	constructor(elemId) {
		this.elem = document.getElementById(elemId);
		this.ctx = this.elem.getContext("2d");
		this.width = this.elem.width;
		this.height = this.elem.height;
	}
}

export {Canvas};