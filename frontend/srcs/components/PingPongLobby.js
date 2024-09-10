import { useEffect } from "../core/myreact/myreact.js";

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


export default PingPongLobby;