import { Game } from "./game.js";

class Tournament {
    constructor(canvasId, playerNames) {
        this.canvasId = canvasId;
        this.players = playerNames;
        this.startButton = document.getElementById("startButton");
        this.roundWinners = [];
        this.currentRound = 0;
        this.currentGame = null; 
        this.timeoutId = null;
    }

    startRound(roundNumber, playerA, playerB) {
        console.log(`Round ${roundNumber}: ${playerA} vs ${playerB}`);

        if (this.currentGame) {
            this.currentGame.stop();
        }
        this.currentGame = new Game(this.canvasId, playerA, playerB);

        this.currentGame.onGameOver((winner) => {
            console.log(`Round ${roundNumber} winner: ${winner}`);
            this.roundWinners.push(winner);
            if (roundNumber === 1) {
                this.startSecondRound();
            }
            if (this.roundWinners.length === 2) {
                this.startFinalRound();
            }
        });
    }

    startTournament() {
        this.startFirstRound();
    }
    startFirstRound() {
        this.startRound(1, this.players[0], this.players[1]);
    }
    startSecondRound() {
        this.startRound(2, this.players[2], this.players[3]);
    }
    startFinalRound() {
        const winner1 = this.roundWinners[0];
        const winner2 = this.roundWinners[1];
        console.log(`Final Round: ${winner1} vs ${winner2}`);
        this.startRound(3, winner1, winner2);
    }

    stopTournament() {
        if (this.currentGame) {
            this.currentGame.stop();
            this.currentGame = null;
        }
        this.players = [];
        this.roundWinners = [];
        this.currentRound = 0;
        console.log("토너먼트가 중단되고 초기화되었습니다.");
    }
}

export {Tournament};