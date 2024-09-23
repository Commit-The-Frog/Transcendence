
let UserInterface = class {
	constructor(canvas) {
		this.canvas = canvas;
		this.ctx = this.canvas.ctx;
		this.width = this.canvas.width;
		this.height = this.canvas.height;
	}
	drawScheduleScreen = (nicknames, status) => {
		console.log(`status: ${status}`);
		this.ctx.fillStyle = 'black';
		this.ctx.beginPath();
		// 가운데 가로선
		this.ctx.moveTo(this.width/2, this.height/2);
		this.ctx.lineTo(this.width/2-50, this.height/2);
		this.ctx.lineTo(this.width/2+50, this.height/2);
		// 좌측 세로선
		this.ctx.moveTo(this.width/2-50, this.height/2-150);
		this.ctx.lineTo(this.width/2-50, this.height/2+150);
		// 좌측 상단 가로선
		this.ctx.moveTo(this.width/2-150, this.height/2-150);
		this.ctx.lineTo(this.width/2-50, this.height/2-150);
		// 좌측 하단 가로선
		this.ctx.moveTo(this.width/2-150, this.height/2+150);
		this.ctx.lineTo(this.width/2-50, this.height/2+150);
		// 우측 세로선
		this.ctx.moveTo(this.width/2+50, this.height/2-150);
		this.ctx.lineTo(this.width/2+50, this.height/2+150);
		// 우측 상단 가로선
		this.ctx.moveTo(this.width/2+150, this.height/2-150);
		this.ctx.lineTo(this.width/2+50, this.height/2-150);
		// 우측 하단 가로선
		this.ctx.moveTo(this.width/2+150, this.height/2+150);
		this.ctx.lineTo(this.width/2+50, this.height/2+150);
		this.ctx.stroke();
		// vs 텍스트
		this.ctx.font = `42px Matemasie`;
		this.ctx.textAlign = 'center';
		this.ctx.fillText('VS', this.width/2, this.height/2+15);
		// 상단 상태정보
		this.ctx.fillText(status, this.width/2, 50, 500);
		// 1번 플레이어
		this.ctx.font = `25px Matemasie`;
		if (nicknames[0])
			this.ctx.fillText(nicknames[0], this.width/2-250, this.height/2-150, 100);
		// 2번 플레이어
		if (nicknames[1])
			this.ctx.fillText(nicknames[1], this.width/2-250, this.height/2+150, 100);
		// 3번 플레이어
		if (nicknames[2])
			this.ctx.fillText(nicknames[2], this.width/2+250, this.height/2-150, 100);
		// 4번 플레이어
		if (nicknames[3])
			this.ctx.fillText(nicknames[3], this.width/2+250, this.height/2+150, 100);
	}
	drawGameStartScreen = (myTurn, players) => {
		this.ctx.fillStyle = 'black';
		this.ctx.fillRect(0, 0, this.width, this.height);

		this.ctx.font = `40px Matemasie`;
		this.ctx.fillStyle = 'white';
		this.ctx.textAlign = 'center';
		// vs 텍스트
		this.ctx.font = `42px Matemasie`;
		this.ctx.textAlign = 'center';
		this.ctx.fillText('VS', this.width/2, this.height/2);
		// 1번 플레이어
		if (players[0]) {
			if (players[0].nickname)
				this.ctx.fillText(players[0].nickname, this.width/2-250, this.height/2, 100);
			if (players[0].is_ready)
				this.ctx.fillText('ready', this.width/2-250, this.height/2+100, 100);
			else
				this.ctx.fillText('waiting', this.width/2-250, this.height/2+100, 100);
		}
		// 2번 플레이어
		if (players[1]) {
			if (players[1].nickname)
				this.ctx.fillText(players[1].nickname, this.width/2+250, this.height/2, 100);
			if (players[1].is_ready)
				this.ctx.fillText('ready', this.width/2+250, this.height/2+100, 100);
			else
				this.ctx.fillText('waiting', this.width/2+250, this.height/2+100, 100);
		}
		this.ctx.font = `30px Matemasie`;
		if (myTurn)
			this.ctx.fillText('PRESS SPACE BTN', this.width / 2, this.height * 4 / 5, 1000);
	}
	drawGameOverScreen = (type, opacity, winner, disc_user, error) => {
		opacity /= 100;
		this.ctx.fillStyle = 'black';
		this.ctx.fillRect(0, 0, this.width, this.height);

		this.ctx.font = '50px Matemasie';
		this.ctx.fillStyle = 'white';
		this.ctx.textAlign = 'center';
		this.ctx.fillText('GAME OVER', this.width / 2, this.height / 3, 1000);
		this.ctx.font = '30px Matemasie';
		this.ctx.fillText(`player ${winner} win!`, this.width / 2, this.height * 3/ 5, 1000);
		this.ctx.fillStyle = `rgba(255, 255, 255, ${Math.sin(opacity)})`;
		if (!error) {
			if (type == 1)
				this.ctx.fillText(`PRESS 'SPACE' TO GO BACK HOME`, this.width / 2, this.height * 4 / 5, 1000);
			else if (type == 2)
				this.ctx.fillText(`PRESS 'SPACE' TO NEXT GAME`, this.width / 2, this.height * 4 / 5, 1000);
		} else {
			this.ctx.fillStyle = 'red';
			this.ctx.fillText(`${disc_user} has disconnected`, this.width / 2, this.height * 4 / 5, 1000);
		}
	}
	drawHalfLine = () => {
		this.ctx.beginPath();
		this.ctx.moveTo(this.width / 2, 10);
		this.ctx.lineTo(this.width / 2, this.height);
		this.ctx.setLineDash([20]);
		this.ctx.stroke();
	}
	drawScoreAndNickname = (playerL, playerR) => {
		this.ctx.font = `30px Matemasie`;
		this.ctx.fillText(playerL.nickname, this.width / 4 + 20, 100, 1000);
		this.ctx.fillText(playerR.nickname, this.width * 3 / 4 - 48, 100, 1000);
		this.ctx.font = `48px Matemasie`;
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