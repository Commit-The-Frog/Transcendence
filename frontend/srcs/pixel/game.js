import { Player } from "./player.js";

class Game {
    constructor(canvasId, leftPlayerName, rightPlayerName) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.backgroundImage = new Image();
        this.backgroundImage.src = '/pixel/pixel_background.jpg';

        this.leftPlayer = new Player(50, this.canvas.height - 150, 100, 100, '/pixel/pixel_daniel.png', this.ctx, this.canvas.width, this.canvas.height , true);
        this.rightPlayer = new Player(this.canvas.width - 150, this.canvas.height - 150, 100, 100, '/pixel/pixel_hanni.png', this.ctx,this.canvas.width , this.canvas.height , false);

        this.isRunning = false;
        this.keys = {};
        this.setupKeyboardListeners();
        this.gameOver = false;
        this.winner = "";
        this.winPlayer = "";
        this.leftPlayerName = leftPlayerName;  // 왼쪽 플레이어 이름
        this.rightPlayerName = rightPlayerName; 
        this.onGameOverCallback = null;
        this.countdown = 3;  // 3초 카운트다운
        this.countdownInterval = null;  // 카운트다운 타이머
        this.startButton = document.getElementById("startButton"); // startButton을 게임 객체에서 관리
        this.showInitialBackground();
        this.setupStartButton(); // 버튼 설정
    }

    showInitialBackground() {
        this.backgroundImage.onload = () => {
            this.clearCanvas(); // 기존 캔버스를 지우고
            this.ctx.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height); // 배경을 그림
            this.showPlayerNames(); // 플레이어 이름도 초기 화면에 표시
        };
    }

    setupStartButton() {
        this.startButton.style.display = "block";  // 버튼 표시
        this.startButton.onclick = () => {
            this.startButton.style.display = "none";  // 버튼 숨김
            this.start();  // 게임 시작
        };
    }

    showPlayerNames() {
        this.ctx.font = "40px Arial";
        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "center";
        this.ctx.fillText(this.leftPlayerName, this.canvas.width / 4, this.canvas.height / 2);
        this.ctx.fillText(this.rightPlayerName, (3 * this.canvas.width) / 4, this.canvas.height / 2);
    }


    showCountdownAndNames() {
        this.clearCanvas();  // 기존 캔버스를 지우기
        this.ctx.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);

        // 플레이어 이름 표시
        this.ctx.font = "40px Arial";
        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "center";
        this.ctx.fillText(this.leftPlayerName, this.canvas.width / 4, this.canvas.height / 2);  // 왼쪽 플레이어 이름
        this.ctx.fillText(this.rightPlayerName, (3 * this.canvas.width) / 4, this.canvas.height / 2);  // 오른쪽 플레이어 이름

        // 카운트다운 표시
        this.ctx.font = "50px Arial";
        this.ctx.fillStyle = "white";
        this.ctx.fillText(this.countdown, this.canvas.width / 2, this.canvas.height / 3);  // 카운트다운 표시
    }

    start() {
        this.preGame = true;

        this.showCountdownAndNames();
        this.countdownInterval = setInterval(() => {
            this.countdown -= 1;
            this.showCountdownAndNames();
            if (this.countdown === 0) {
                clearInterval(this.countdownInterval);
                this.preGame = false;
                this.isRunning = true;
                this.run();
            }
        }, 1000);
    }

    run() {
        if (this.isRunning && !this.gameOver) {
            const currentTime = Date.now();
            this.update(currentTime);
            this.render();
            requestAnimationFrame(() => this.run());
        }
    }
    stop() {
        this.isRunning = false;  // 게임 중단
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);  // 애니메이션 중단
        }
        this.clearCanvas();  // 캔버스 지우기
        this.removeKeyboardListeners();  // 이벤트 리스너 제거
    }
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);  // 캔버스 지우기
    }

    checkGameOver() {
        if (this.leftPlayer.lives === 0 || this.rightPlayer.lives === 0) {
            this.isRunning = false;
            this.gameOver = true;

            if (this.leftPlayer.lives === 0) {
                this.winner = this.rightPlayerName;
                this.winPlayer = "right";
            } else {
                this.winner = this.leftPlayerName;
                this.winPlayer = "left";
            }
            if (this.gameOver) {
                this.endGame();
            }
        }
    }

    update() {
        this.handleKeyInput();
        this.leftPlayer.updateBullets(this.canvas.width);
        this.rightPlayer.updateBullets(this.canvas.width);

        this.checkCollisions();
        this.checkGameOver();
    }

    handleKeyInput() {
        if (this.keys['a'] || this.keys['A'] || this.keys['ㅁ']) this.leftPlayer.moveWithFixedDirection('left', false);
        if (this.keys['d'] || this.keys['D'] || this.keys['ㅇ']) this.leftPlayer.moveWithFixedDirection('right', true);
        if (this.keys['w'] || this.keys['W'] || this.keys['ㅈ']) this.leftPlayer.move('up');
        if (this.keys['s'] || this.keys['S'] || this.keys['ㄴ']) this.leftPlayer.move('down');

        if (this.keys['ArrowLeft']) this.rightPlayer.moveWithFixedDirection('left', false);
        if (this.keys['ArrowRight']) this.rightPlayer.moveWithFixedDirection('right', true);
        if (this.keys['ArrowUp']) this.rightPlayer.move('up');
        if (this.keys['ArrowDown']) this.rightPlayer.move('down');


        if (this.keys['q'] || this.keys['Q'] || this.keys['ㅂ']) this.leftPlayer.shoot();

        if (this.keys['l'] || this.keys['L'] || this.keys['ㅣ']) this.rightPlayer.shoot();

    }

    endGame() {
        this.isRunning = false;
        this.render();
        setTimeout(()=>{
            this.displayWinner();
            if (this.onGameOverCallback) {
                this.onGameOverCallback(this.winner);
            }
        }, 3000);
    }

    onGameOverCallback(callback) {
        this.onGameOverCallback = callback;
    }

    onGameOver(callback) {
        this.onGameOverCallback = callback;
    }

    checkCollisions() {
        this.leftPlayer.bullets.forEach(bullet => {
            if (bullet.checkCollision(this.rightPlayer)) {
                this.rightPlayer.loseLife();
                bullet.x = -100;
            }
        });

        this.rightPlayer.bullets.forEach(bullet => {
            if (bullet.checkCollision(this.leftPlayer)) {
                this.leftPlayer.loseLife();
                bullet.x = -100;
            }
        });
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
        this.leftPlayer.draw();
        this.rightPlayer.draw();

        this.leftPlayer.drawLives(10,10);
        this.rightPlayer.drawLives(this.canvas.width - 100, 10);

        this.leftPlayer.drawBullets();
        this.rightPlayer.drawBullets();

        if (!this.gameOver) {
            this.leftPlayer.draw();
            this.rightPlayer.draw();

            this.leftPlayer.drawLives(10, 10);
            this.rightPlayer.drawLives(this.canvas.width - 100, 10);

            this.leftPlayer.drawBullets();
            this.rightPlayer.drawBullets();
        } else {
            this.displayWinner();
        }
    }

    displayWinner() {
        this.ctx.font = "50px Arial";
        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "center";
        this.ctx.fillText(`${this.winner} win! `, this.canvas.width / 2, this.canvas.height / 2);
    }
    setupKeyboardListeners() {
        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keyup', this.handleKeyUp);
    }

    removeKeyboardListeners() {
        document.removeEventListener('keydown', this.handleKeyDown);  // 리스너 제거
        document.removeEventListener('keyup', this.handleKeyUp);  // 리스너 제거
    }

    handleKeyDown = (event) => {
        this.keys[event.key] = true;
    }

    handleKeyUp = (event) => {
        this.keys[event.key] = false;
    }

}

export {Game}