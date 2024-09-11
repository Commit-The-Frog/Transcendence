import { useEffect } from "../core/myreact/myreact.js"
import { Game } from "../pixel/game.js";
import { Tournament } from "../pixel/tournament.js";

const PixelGame = () => {
    useEffect(()=>{
        const urlParams = new URLSearchParams(window.location.search);
        const type = urlParams.get('type');
        const player1 = urlParams.get('player1');
        const player2 = urlParams.get('player2');
        const player3 = urlParams.get('player3');
        const player4 = urlParams.get('player4');
        if (type === '2') {
            const playerName = [player1, player2, player3, player4];
            const tournament = new Tournament('pixelgameCanvas', playerName);
            tournament.startTournament();
            return () => {
                tournament.stopTournament();
            }
        } else if (type === '1') {
            const game = new Game('pixelgameCanvas', player1, player2);
            // game.start();
            return () => {
                game.stop();
            }
        }
    },undefined,'pixelgame');

    return `<div class="pixelCanvasBox">
        <canvas id="pixelgameCanvas" width="800" height="600" >
        </canvas>
        <button id="startButton" style="display: none;">Start</button>

    </div>
`
}

export default PixelGame;