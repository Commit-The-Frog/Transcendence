
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
	info.ball.move(info.canvasHeight, info.paddleL, info.paddleR)
}

export { calculate };