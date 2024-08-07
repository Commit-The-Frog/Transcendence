import { Obj } from './object.js'

class Ball extends Obj {
	constructor(x, y, radius) {
		super(x, y);
		this.x = x;
		this.y = y;
		this.radius = radius;
	}
	draw(ctx) {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		ctx.fillStyle = "black";
		ctx.fill();
		ctx.closePath();
	}
}

export { Ball };