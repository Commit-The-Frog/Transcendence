import { Obj } from './object.js';

class Paddle extends Obj {
	constructor(x, y, width, height, speed = 5) {
		super(x, y);
		this.width = width;
		this.height = height;
		this.speed = speed;
	}
	draw = (ctx) => {
		ctx.beginPath();
		ctx.rect(this.x, this.y, this.width, this.height);
		ctx.fillStyle = "black";
		ctx.fill();
		ctx.closePath();
	}
	moveUp = () => {
		this.y = Math.max(this.y - this.speed, 0);
	}
	moveDown = (height) => {
		this.y = Math.min(this.y + this.speed, height - this.height);
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
					ball.dx = ball.speed;
				// 우하단->좌상단 접근시
				else if (ball.dy >= 0 && ball.y > this.y + this.height / 2)
					ball.dx = ball.speed;
				ball.dx = ball.speed;
			}
		}
		// 우측 패들 좌측면 충돌판정
		else if (dir == 'R' && ballR > padL && ballR < padR) {
			// 좌측면 충돌
			if (ball.dx >= 0) {
				// 좌상단->우하단 접근시
				if (ball.dy <= 0 && ball.y < this.y + this.height / 2)
					ball.dx = -ball.speed;
				// 좌하단->우상단 접근시
				else if (ball.dy >= 0 && ball.y > this.y + this.height / 2)
					ball.dx = -ball.speed;
				ball.dx = -ball.speed;
			}
		}
	}
}

export { Paddle };