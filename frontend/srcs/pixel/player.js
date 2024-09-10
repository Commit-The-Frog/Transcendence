import { Bullet } from "./bullet.js";

class Player {
    constructor(x, y, width, height, imgSrc, ctx,canvasWidth, canvasHeight , defaultFacingRight = true) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = new Image();
        this.image.src = imgSrc;
        this.speed = 5;
        this.ctx = ctx;
        this.facingRight = defaultFacingRight;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.lives = 90;
        this.lifeImageSrc = '/pixel/pixel_heart.png';
        this.lifeImages = [];
        this.maxBullets = 30;
        this.win = false;

        for (let i = 0; i < this.lives; i++) {
            const lifeImage = new Image();
            lifeImage.src = this.lifeImageSrc;
            this.lifeImages.push(lifeImage);
        }
        this.bullets = [];
        this.bulletImageSrc = '/pixel/pixel_bullet.png'; 
    }
    draw() {
        this.ctx.save();
        if (!this.facingRight) {
            this.ctx.scale(-1,1);
            this.ctx.drawImage(this.image, -this.x - this.width, this.y, this.width, this.height)
        } else {
        this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
        this.ctx.restore();
    }
    drawLives(positionX, positionY) {
        for (let i = 0; i < Math.ceil(this.lives / 30); i++) {
            this.ctx.drawImage(this.lifeImages[i], positionX + i * 30, positionY, 20, 25); // 목숨 이미지를 일정 간격으로 그리기
        }
    }
    loseLife() {
        if (this.lives > 0) {
            this.lives -= 1;
        }
    }

    shoot() {
        if (this.bullets.length < this.maxBullets) {
        const bulletX = this.facingRight ? this.x + this.width : this.x - 10;
        const bulletY = this.y + this.height / 2;
        const direction = this.facingRight ? 1 : -1;
        const bullet = new Bullet(bulletX, bulletY, 7, direction, this.bulletImageSrc, this.ctx);
        this.bullets.push(bullet);
    }
    }

    // 총알을 그리기
    drawBullets() {
        this.bullets.forEach(bullet => bullet.draw());
    }

    // 총알 이동
    updateBullets(canvasWidth) {
        this.bullets = this.bullets.filter(bullet => !bullet.isOffScreen(canvasWidth));
        this.bullets.forEach(bullet => bullet.move());
    }

    move(direction) {
        if (direction === 'left' && this.x - this.speed >= 0) {
            this.x -= this.speed;
        };
        if (direction === 'right' && this.x + this.width + this.speed <= this.canvasWidth) {
            this.x += this.speed;
        };
        if (direction === 'up' && this.y - this.speed >= 0) this.y -= this.speed;
        if (direction === 'down' && this.y + this.height + this.speed <= this.canvasHeight){
             this.y += this.speed;
        }
    }

    moveWithFixedDirection(direction, fixedDirection) {
        this.move(direction);
        this.facingRight = fixedDirection;
    }
    setWin(win) {
        this.win = true;
    }
    getWin() {
        return this.win;
    }
}

export {Player}