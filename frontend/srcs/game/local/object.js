let Obj = class {
	constructor(x, y, img = null) {
		this.x = x;
		this.y = y;
		this.img = img;
	}
	draw(ctx) {
		ctx.beginPath();
		ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
		ctx.fill();
		ctx.closePath();
	}
}

export { Obj }; 