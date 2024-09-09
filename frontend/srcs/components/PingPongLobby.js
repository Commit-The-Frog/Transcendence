import { useEffect } from "../core/myreact/myreact.js";
import { changeUrl } from "../utils/changeUrl.js";
import { connectSocket } from "../utils/useSocket.js";

const PingPongLobby = () => {
    useEffect(()=>{
        pingpnogWsHandler();
    }, undefined, 'pingponglobby');
    return `
    <div class="pingpongLobby">
        <div> 좀 기다려 🖐🏻</div>
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
        console.log(`서버로부터 매치 UUID 수신 : ${matchName}`);

        if (event.data) {
            const url = `/pingpong/remote/start?type=${type}&match_name=${matchName}`;
            changeUrl(url);
        }
    }

    ws.onclose = (event) => {
        console.log(event);
        console.log('close');
    }
	ws.onerror = (error) => {
        console.log(error);
        console.log('err');
        // 에러 났을때 
	};

    connectSocket(wsUrl, ws);
}

export default PingPongLobby;