import { Obj } from './object.js';

class Paddle extends Obj {
	constructor(x, y, width, height, accel, em = 0.01, cof = 0.1) {
		super(x, y);
		this.width = width;
		this.height = height;
		this.accel = accel;
		this.em = em;
		this.cof = cof;
		this.dy = 0;
	}
	set x(x) { this._x = x; }
	set y(y) { this._y = y; }
	set dx(dx) { this._dx = dx; }
	set dy(dy) { this._dy = dy; }
	set speed(speed) { this._speed = speed; }

	get x() { return this._x; }
	get y() { return this._y; }
	get dx() { return this._dx; }
	get dy() { return this._dy; }
	get speed() { return this._speed; }

	draw = (ctx) => {
		ctx.beginPath();
		ctx.rect(this.x, this.y, this.width, this.height);
		ctx.fillStyle = "black";
		ctx.fill();
		ctx.closePath();
	}
	move = (height) => {
		if (this.y + this.dy >= 0 && this.y + this.height + this.dy <= height)
			this.y += this.dy;
	}
	checkCollision = (ball, dir) => {
		const ballL = ball.x - ball.radius;
		const ballR = ball.x + ball.radius;
		const ballT = ball.y - ball.radius;
		const ballB = ball.y + ball.radius;
		const padL = this.x;
		const padR = this.x + this.width;
		const padT = this.y;
		const padB = this.y + this.height;

		if (!(ballB >= padT && ballT <= padB))
			return ;

		// 좌측 패들 우측면 충돌판정
		if (dir == 'L' && ballL < padR && ballL > padL) {
			// 우측면 충돌
			if (ball.dx <= 0) {
				// 우상단->좌하단 접근시
				if (ball.dy <= 0 && ball.y < this.y + this.height / 2)
					ball.dx = Math.abs(ball.dx) + Math.abs(ball.dx) * this.em;
				// 우하단->좌상단 접근시
				else if (ball.dy >= 0 && ball.y > this.y + this.height / 2)
					ball.dx = Math.abs(ball.dx) + Math.abs(ball.dx) * this.em;
				else
					ball.dx = Math.abs(ball.dx) + Math.abs(ball.dx) * this.em;
				ball.dy += this.cof * this.dy;
			}
		}
		// 우측 패들 좌측면 충돌판정
		else if (dir == 'R' && ballR > padL && ballR < padR) {
			// 좌측면 충돌
			if (ball.dx >= 0) {
				// 좌상단->우하단 접근시
				if (ball.dy <= 0 && ball.y < this.y + this.height / 2)
					ball.dx = -1 * Math.abs(ball.dx) - Math.abs(ball.dx) * this.em;
				// 좌하단->우상단 접근시
				else if (ball.dy >= 0 && ball.y > this.y + this.height / 2)
					ball.dx = -1 * Math.abs(ball.dx) - Math.abs(ball.dx) * this.em;
				else
					ball.dx = -1 *Math.abs(ball.dx) - Math.abs(ball.dx) * this.em;
					ball.dy += this.cof * this.dy;
			}
		}
	}
}

export { Paddle };