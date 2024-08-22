import { useEffect } from "../core/myreact/myreact.js"
import { run } from "../game/local/run.js"

const PingPongLocalGame = () => {
    useEffect(()=>{
        run();
    },undefined,'localgamerun');
    return `
        <div class="pingponglocalgame">
            <canvas id="ping pong" width="800" height="600"></canvas>
        </div>
    `
}

export default PingPongLocalGame;