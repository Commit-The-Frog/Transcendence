
let UserInterface = class {
	constructor(canvas) {
		this.canvas = canvas;
		this.ctx = this.canvas.ctx;
		this.width = this.canvas.width;
		this.height = this.canvas.height;
	}
	drawGameStartScreen = () => {
		this.ctx.fillStyle = 'black';
		this.ctx.fillRect(0, 0, this.width, this.height);

		this.ctx.font = `40px sans-serif`;
		this.ctx.fillStyle = 'white';
		this.ctx.textAlign = 'center';
		this.ctx.fillText('PING PONG', this.width / 2, this.height / 5, 1000);
		this.ctx.font = `30px sans-serif`;
		this.ctx.fillText('PRESS ANY BUTTON', this.width / 2, this.height * 4 / 5, 1000);
	}
	drawGameOverScreen = (type, opacity, winner) => {
		opacity /= 100;
		this.ctx.fillStyle = 'black';
		this.ctx.fillRect(0, 0, this.width, this.height);

		this.ctx.font = '50px sans-serif';
		this.ctx.fillStyle = 'white';
		this.ctx.textAlign = 'center';
		this.ctx.fillText('GAME OVER', this.width / 2, this.height / 3, 1000);
		this.ctx.font = '30px sans-serif';
		this.ctx.fillText(`player ${winner} win!`, this.width / 2, this.height * 3/ 5, 1000);
		this.ctx.fillStyle = `rgba(255, 255, 255, ${Math.sin(opacity)})`;
		if (type == 1)
			this.ctx.fillText(`PRESS 'H' TO GO BACK HOME`, this.width / 2, this.height * 4 / 5, 1000);
		else if (type == 2)
			this.ctx.fillText(`PRESS 'H' TO NEXT GAME`, this.width / 2, this.height * 4 / 5, 1000);
	}
	drawHalfLine = () => {
		this.ctx.beginPath();
		this.ctx.moveTo(this.width / 2, 10);
		this.ctx.lineTo(this.width / 2, this.height);
		this.ctx.setLineDash([20]);
		this.ctx.stroke();
	}
	drawScoreAndNickname = (playerL, playerR) => {
		this.ctx.font = `30px sans-serif`;
		this.ctx.fillText(playerL.nickname, this.width / 4 + 20, 100, 1000);
		this.ctx.fillText(playerR.nickname, this.width * 3 / 4 - 48, 100, 1000);
		this.ctx.font = `48px sans-serif`;
		this.ctx.fillText(playerL.score, this.width / 4 + 20, 160, 100);
		this.ctx.fillText(playerR.score, this.width * 3 / 4 - 48, 160, 100);
	}
	drawPaddle = (x, y, width, height) => {
		this.ctx.beginPath();
		this.ctx.rect(x, y, width, height);
		this.ctx.fillStyle = `rgba(0,0,0,1)`;
		this.ctx.fill();
	}
	drawBall = (x, y, radius) => {
		this.ctx.beginPath();
		this.ctx.arc(x, y, radius, 0, Math.PI * 2, false);
		this.ctx.fillStyle = "black";
		this.ctx.fill();
		this.ctx.closePath();
	}
	drawInfo = (info) => {
		this.drawPaddle(info.paddleL.x, info.paddleL.y, info.paddleL.width, info.paddleL.height);
		this.drawPaddle(info.paddleR.x, info.paddleR.y, info.paddleR.width, info.paddleR.height);
		this.drawBall(info.ball.x, info.ball.y, info.ball.radius);
	}
}

export { UserInterface };