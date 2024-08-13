import { Obj } from './object.js'

class Ball extends Obj {
	constructor(x, y, radius, speed = 3, speedMax) {
		super(x, y);
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.speed = speed;
		this.speedMax = speedMax;
		this.dx = -speed;
		this.dy = 0;
	}
	get dx() { return this._dx; }
	get dy() { return this._dy; }
	set dx(dx) { this._dx = dx; }
	set dy(dy) { this._dy = dy; }

	draw = (ctx) => {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		ctx.fillStyle = "black";
		ctx.fill();
		ctx.closePath();
	}
	move = (height, paddleL, paddleR) => {
		this.x += this.dx;
		this.y += this.dy;
		// 위아래 벽 튕기기
		if (this.y + this.dy < this.radius || this.y + this.dy > height - this.radius)
			this.dy *= -1;
		// 좌우 패들 튕기기
		paddleL.checkCollision(this, 'L');
		paddleR.checkCollision(this, 'R');
	}
	handleCollision = (dir, em, cof, paddleDy) => {
		if (dir != 'L' && dir != 'R')
			return ;
		let newDy = cof * paddleDy + this.dy;
		if (dir === 'L')
			this.dx = Math.min(Math.abs(this.dx) + Math.abs(this.dx) * em, this.speedMax);
		else
			this.dx = -1 * Math.min(Math.abs(this.dx) + Math.abs(this.dx) * em, this.speedMax);
		this.dy = newDy >= 0 ? Math.min(newDy, this.speedMax) : Math.max(newDy, -this.speedMax);
	}
	reset = (x, y, dir) => {
		this.x = x;
		this.y = y;
		if (dir === 'L')
			this.dx = -this.speed;
		else if (dir === 'R')
			this.dx = this.speed;
		this.dy = 0;
	}
}

export { Ball };