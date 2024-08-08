
let UserInterface = class {
	constructor(ctx, width, height) {
		this.ctx = ctx;
		this.width = width;
		this.height = height;
		this.scoreFontSize = 48;
	}
	drawHalfLine = () => {
		this.ctx.beginPath();
		this.ctx.moveTo(this.width / 2, 10);
		this.ctx.lineTo(this.width / 2, this.height);
		this.ctx.setLineDash([20]);
		this.ctx.stroke();
	}
	drawScore = (scoreL, scoreR) => {
		this.ctx.font = `${this.scoreFontSize}px sans-serif`;
		this.ctx.fillText(scoreL, this.width / 4 + 20, 100, 100);
		this.ctx.fillText(scoreR, this.width * 3 / 4 - this.scoreFontSize, 100, 100);
		
	}
}

export { UserInterface };