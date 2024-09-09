import { useEffect } from "../core/myreact/myreact.js";
import { run } from "../game/remote/run.js";

const PingPongRemoteGame = () => {
    useEffect(()=>{
        const canvas = document.getElementById("remotePingpong");
        if (canvas) {
            run();
        }
    },undefined,'remotegamerun');
    return `
        <div class="pingpongremotegame">
            <canvas id="remotePingpong" width="800" height="600"></canvas>
        </div>
    `
}

export default PingPongRemoteGame;