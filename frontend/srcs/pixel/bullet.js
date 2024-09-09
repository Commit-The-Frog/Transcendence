class Bullet {
    constructor(x, y, speed, direction, imgSrc, ctx) {
        this.x = x;
        this.y = y;
        this.speed = speed;  // 총알의 이동 속도
        this.direction = direction;  // 총알이 날아가는 방향 (1: 오른쪽, -1: 왼쪽)
        this.image = new Image();
        this.image.src = imgSrc;
        this.width = 10;
        this.height = 10;
        this.ctx = ctx;
    }

    draw() {
        this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    move() {
        this.x += this.speed * this.direction;
    }

    // 총알이 화면 밖으로 나갔는지 확인
    isOffScreen(canvasWidth) {
        return this.x < 0 || this.x > canvasWidth;
    }

    // 총알이 상대 플레이어와 충돌했는지 확인
    checkCollision(player) {
        return (
            this.x < player.x + player.width &&
            this.x + this.width > player.x &&
            this.y < player.y + player.height &&
            this.y + this.height > player.y
        );
    }
}

export {Bullet};
