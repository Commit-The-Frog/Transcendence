import { useEffect } from "../core/myreact/myreact.js";
import { getRecoilValue } from "../core/myrecoil/myrecoil.js";
import { run } from "../game/remote/run.js";
import { languageState } from "../recoil/languageState.js";
import translations from "../translations.js";
import useSocket from "../utils/useSocket.js";

const PingPongRemoteGame = () => {
    useEffect(()=>{
        const canvas = document.getElementById("remotePingpong");
        if (canvas) {
            pingpnogWsHandler();
        }
    },undefined,'remotegamerun');
    return `
        <div class="pingpongremotegame">
            <div id="pingpongwaitmodal"> ${translations[getRecoilValue(languageState)]?.wait}</div>
            <canvas id="remotePingpong" width="800" height="600"></canvas>
        </div>
    `
}

const pingpnogWsHandler = () => {
    const params = new URLSearchParams(window.location.search);
    const type = params.get('type');
    let typeForBe;

    if (type == 1)	typeForBe = '1vs1';
    else if (type == 2)	typeForBe = 'tournament';

    const wsUrl = `wss://${window.location.host}/ws/game/lobby?type=${typeForBe}`;
    // const ws = new WebSocket(wsUrl);
    const ws = {};

    ws.onopen = (event) => {
        console.log("GameQueue WebSocket 오픈");
    }

    ws.onmessage = (event) => {
        const matchName = event.data;
        const modal = document.getElementById("pingpongwaitmodal");
        console.log(`서버로부터 매치 UUID 수신 : ${matchName}`);

        if (event.data) {
            modal.style.display = "none";
            run (matchName);
            //const url = `/pingpong/remote/start?type=${type}&match_name=${matchName}`;
            //changeUrl(url);
        }
    }

    ws.onclose = (event) => {
        console.log('close');
    }
	ws.onerror = (error) => {
        console.log(error);
        console.log('err');
        // 에러 났을때 
	};

    useSocket().connectSocket(wsUrl, ws);
}

export default PingPongRemoteGame;