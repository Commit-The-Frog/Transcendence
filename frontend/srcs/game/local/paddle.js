import { Obj } from './object.js';

class Paddle extends Obj {
	constructor(x, y, width, height, accel, accelInit, em = 0.01, cof = 0.1, itemNum, dir) {
		if (itemNum == 2 && dir === 'L')		super(x + 100, y);
		else if (itemNum == 2 && dir === 'R')	super(x - 100, y);
		else									super(x, y);
		this.itemNum = itemNum;
		this.width = width;
		this.height = height;
		if (itemNum == 1)
			this.height = 60;
		this.accel = accel;
		this.accelInit = accelInit;
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
		ctx.fillStyle = `rgba(0,0,0,1)`;
		if (this.itemNum == 4)
			ctx.fillStyle = `rgba(0,0,0,0.01)`;
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

		// 좌측 패들 우측면 충돌판정
		if (dir == 'L' && ballL < padR && ballL > padL) {
			// 우측면 충돌
			if (ball.dx <= 0) {
				// 우상단->좌하단 접근시
				if (ball.dy <= 0 && ballB >= padT && ballB < this.y + this.height / 2)
					ball.handleCollision('L', this.em, this.cof, this.dy);
				// 우하단->좌상단 접근시
				else if (ball.dy >= 0 && ballT <= padB && ballT > this.y + this.height / 2)
					ball.handleCollision('L', this.em, this.cof, this.dy);
				else if (ballB >= padT && ballT <= padB)
					ball.handleCollision('L', this.em, this.cof, this.dy);
			}
		}
		// 우측 패들 좌측면 충돌판정
		else if (dir == 'R' && ballR > padL && ballR < padR) {
			// 좌측면 충돌
			if (ball.dx >= 0) {
				// 좌상단->우하단 접근시
				if (ball.dy <= 0 && ballB >= padT && ballB < this.y + this.height / 2)
					ball.handleCollision('R', this.em, this.cof, this.dy);
				// 좌하단->우상단 접근시
				else if (ball.dy >= 0 && ballT <= padB && ballT > this.y + this.height / 2)
					ball.handleCollision('R', this.em, this.cof, this.dy);
				else if (ballB >= padT && ballT <= padB)
					ball.handleCollision('R', this.em, this.cof, this.dy);
			}
		}
	}
}

export { Paddle };