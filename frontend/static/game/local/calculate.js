
const calculate = (info, key) => {
	// L패들 가속처리
	if (key.WPressed && info.paddleL.y > 10)
		info.paddleL.dy = Math.min(-info.paddleL.accelInit, info.paddleL.dy - info.paddleL.accel)
	else if (key.SPressed && info.paddleL.y + info.paddleL.height < info.canvasHeight - 10)
		info.paddleL.dy = Math.max(info.paddleL.accelInit, info.paddleL.dy + info.paddleL.accel)
	else
		info.paddleL.dy = 0;
	// 패들 이동
	info.paddleL.move(info.canvasHeight);
	// R패들 가속처리
	if (key.upPressed && info.paddleR.y > 10)
		info.paddleR.dy = Math.min(-info.paddleR.accelInit, info.paddleR.dy - info.paddleR.accel)
	else if (key.downPressed && info.paddleR.y + info.paddleR.height < info.canvasHeight - 10)
		info.paddleR.dy = Math.max(info.paddleR.accelInit, info.paddleR.dy + info.paddleR.accel)
	else
		info.paddleR.dy = 0;
	// R패들 이동
	info.paddleR.move(info.canvasHeight);

	// 공 이동
	info.ball.move(info.canvasHeight, info.paddleL, info.paddleR);

	// 라운드 승패 판정 및 라운드 정보 초기화
	let loser = checkBallOut(info);
	if (loser === 1) {
		++info.playerL.score;
		info.resetRound('R');
	} else if (loser === 2) {
		++info.playerR.score;
		info.resetRound('L');
	}

	// 게임 종료 판정(5점 득점시)
	if (info.playerL.score === info.maxScore) {
		info.gameover = true;
		info.winner = info.playerL;
	}
	else if (info.playerR.score === info.maxScore) {
		info.gameover = true;
		info.winner = info.playerR;
	}
}

const checkBallOut = (info) => {
	if (info.ball.x < -50)
		return 1;
	if (info.ball.x > info.canvasWidth + 50)
		return 2;
	return 0;
}

export { calculate };