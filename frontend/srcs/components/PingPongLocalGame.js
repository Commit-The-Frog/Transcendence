import { useEffect } from "../core/myreact/myreact.js"
import { run } from "../game/local/run.js"

const PingPongLocalGame = () => {
    useEffect(()=>{
        run();
        //setTimeout(run,100); // useEffect고칠 수 있는지 확인
        // 왜 렌더링이 두번되는지..? 두번되어도 돼야하는거아닌가...
    },[],'localgamerun');
    return `
        <div class="pingponglocalgame">
            <canvas id="ping pong" width="800" height="600"></canvas>
        </div>
    `
}

export default PingPongLocalGame;