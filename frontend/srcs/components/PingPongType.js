import { useState } from "../core/myreact/myreact.js"
import { bindEventHandler } from "../utils/bindEventHandler.js";
import { changeUrl } from "../utils/changeUrl.js";
import PingPongItemBtn from "./PingPongItemBtn.js";

const PingpongType = () => {
    const [mode, setMode] = useState(1, 'pingpongmode');
    const [itemmode, setItemmode] = useState(false, 'pinpongitemmode');

    const twoPlyaerBtnHandler = () => {
        setMode(1);
    };
    const tournamentBtnHandler = () => {
        setMode(2);
    };
    const itemmodeHandler = () => {
        setItemmode((prev)=>!(prev));
    };

    const makeurl = () => {
        const player1 = document.getElementById("pingpong-player1")?.value;
        const player2 = document.getElementById("pingpong-player2")?.value;
        const player3 = document.getElementById("pingpong-player3")?.value;
        const player4 = document.getElementById("pingpong-player4")?.value;
        let query = '?';
        query += 'type' + mode;
        query += '&item_mode' + itemmode;
        query += '&player1=' + player1;
        query += '&player2=' + player2;
        if (mode === 2) {
            query += '&player3=' + player3;
            query += '&player4=' + player4;
        }
        return query;
    }

    const startBtnHandler = () =>{
        const params = window.location.pathname;
        const url = params + '/start' + makeurl();
        changeUrl(url);
    }

    bindEventHandler('click', "itemmodeHandler", itemmodeHandler);
    bindEventHandler('click', "twoPlyaerBtnHandler",twoPlyaerBtnHandler );
    bindEventHandler('click', "tournamentBtnHandler", tournamentBtnHandler);
    bindEventHandler('click', "startBtnHandler", startBtnHandler);

    return `
        <div class="pingpongtype">
            <div class="pingpongtypeWrapper">
            <div class="itemBtnWrapper">
                <div>
                    <button class="itemBtn itemmodeHandler ${itemmode? 'selected' :''}">
                        ${itemmode ? '✔' : ''}
                    </button>
                </div>
                    <p>turn item mode</p>
                </div>
                <div class="typeBtnWrapper">
                    <div class="typeBtnWrapper2">
                        <button class="twoplayerModeBtn twoPlyaerBtnHandler ${mode === 1 ? 'selected' : ''} "> 1 &nbsp vs &nbsp 1</button>
                        <button class="tournamentBtn tournamentBtnHandler ${mode === 2 ? 'selected' : ''} "> tournament </button>
                    </div>
                </div>
            </div>
            <div class="pingponginputWrapper">
                <input type="text" class="pinpongPlyaerInput1" id="pingpong-player1" name="query" placeholder="player1"></input>
                <input type="text" class="pinpongPlyaerInput2" id="pingpong-player2" name="query" placeholder="player2"></input>
                ${mode === 2 ? '<input type="text" class="pinpongPlyaerInput3" id="pingpong-player3" name="query" placeholder="player3"></input>' : ''}
                ${mode === 2 ? '<input type="text" class="pinpongPlyaerInput4" id="pingpong-player4" name="query" placeholder="player4"></input>' : ''}
            </div>
            <div class="startBtnWrapper">
                <button class="pingpongStart startBtnHandler"> Start </button>
            </div>
        </div>
    `
}

export default PingpongType;