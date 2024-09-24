import { useEffect, useRef, useState } from "../core/myreact/myreact.js"
import { bindEventHandler } from "../utils/bindEventHandler.js";
import { changeUrl } from "../utils/changeUrl.js";
import translations from "../translations.js";
import { getRecoilValue } from "../core/myrecoil/myrecoil.js";
import { languageState } from "../recoil/languageState.js";
import { notvalidNickMsg, shake, isValidNick } from "../utils/notvalidNick.js";
import { showToastHandler } from "../utils/showToast.js";

const PingpongType = () => {
    const [mode, setMode] = useState(1, 'pingpongmode');
    const [itemmode, setItemmode] = useState(false, 'pinpongitemmode');
    const typeRef = useRef(mode, 'pingpongtyperef');
    const itemmodeRef = useRef(itemmode, 'pingpongitemmoderef');
    const params = window.location.pathname.split("/");
    const params2 = params[2];

    const handleModeChange = (newMode) => {
        setMode(newMode);
        typeRef.current = newMode;
    };
    const itemmodeHandler = () => {
        setItemmode((prev) => {
            let newMode = !prev;
            itemmodeRef.current = newMode;
            return newMode;
        });
    };

    const localstartBtnHandler = (event) =>{
        playerInputChecker('pingpong', typeRef.current, itemmodeRef.current);
    };

    const remotestartBtnHandler = (event) => {
        playerInputChecker('pingpong', typeRef.current, itemmodeRef.current, true);
    }
    
    bindEventHandler('click', "itemmodeHandler", itemmodeHandler);
    bindEventHandler('click', "twoPlayerBtnHandler",() => handleModeChange(1));
    bindEventHandler('click', "tournamentBtnHandler", () => handleModeChange(2));
    bindEventHandler('click', "localstartBtnHandler", localstartBtnHandler);
    bindEventHandler('click', "remotestartBtnHandler", remotestartBtnHandler);
    bindEventHandler('input', "playerInputHandler", playerInputHandler);

    return `
        <div class="pingpongtype">
            <div class="pingpongtypeWrapper">
            ${params2 === "local" ?
            `<div class="itemBtnWrapper">
                <div>
                    <button class="itemBtn itemmodeHandler ${itemmode? 'selected' :''}">
                        ${itemmode ? '✔' : ''}
                    </button>
                </div>
                    <p>${translations[getRecoilValue(languageState)]?.itemmode}</p>
                </div>`
                : "" }
                <div class="typeBtnWrapper">
                    <div class="typeBtnWrapper2">
                        <button class="twoplayerModeBtn twoPlayerBtnHandler ${mode === 1 ? 'selected' : ''} "> ${translations[getRecoilValue(languageState)]?.vs}</button>
                        <button class="tournamentBtn tournamentBtnHandler ${mode === 2 ? 'selected' : ''} "> ${translations[getRecoilValue(languageState)]?.tournament}</button>
                    </div>
                </div>
            </div>
            ${params2 === "local" ? `
            <div class="pingponginputWrapper">
            <form>
                <input type="text" class="pinpongPlayerInput1 playerInputHandler" id="pingpong-player1" autocomplete="off" name="pingpong-player1" placeholder="player1">
                <p class="pingpongPlayerMsg msgplayer1 ">&nbsp;</p>
                <input type="text" class="pinpongPlayerInput2 playerInputHandler" id="pingpong-player2" autocomplete="off" name="pingpong-player2" placeholder="player2">
                <p class="pingpongPlayerMsg msgplayer2">&nbsp;</p>
                ${mode === 2 ? `<input type="text" class="pinpongPlayerInput3 playerInputHandler" autocomplete="off" id="pingpong-player3" name="pingpong-player3" placeholder="player3">
                <p class="pingpongPlayerMsg msgplayer3">&nbsp;</p>` : ''}
                ${mode === 2 ? `<input type="text" class="pinpongPlayerInput4 playerInputHandler" autocomplete="off" id="pingpong-player4" name="pingpong-player4" placeholder="player4">
                <p class="pingpongPlayerMsg msgplayer4">&nbsp;</p>` : ''}
            </form>
            </div>
            ` : ""}
            
            <div class="startBtnWrapper">
                <button class="pingpongStart ${params2 === "remote" ? "remotestartBtnHandler" : "localstartBtnHandler"}"> ${translations[getRecoilValue(languageState)]?.start}</button>
            </div>
        </div>
    `
}

export const playerInputChecker = (game, type, item_mode, remote = false) => {
    const player1 = document.getElementById(`${game}-player1`);
    const player2 = document.getElementById(`${game}-player2`);
    const player3 = document.getElementById(`${game}-player3`);
    const player4 = document.getElementById(`${game}-player4`);
    const url = new URL(window.location);
    // const params = window.location.pathname.split("/");
    // const params2 = params[2];

    url.pathname += '/start';
    url.searchParams.set('type', type);
    if (remote) {
        changeUrl(url);
        return ;
    }
    if (!isValidNick(player1?.value)) {
        shake(player1);
        return ;
    }
    if (!isValidNick(player2?.value)) {
        shake(player2);
        return ;
    }
    if (player1?.value === player2?.value) {
        showToastHandler(`${translations[getRecoilValue(languageState)]?.duplicatenick}`);
        return ;
    }
    if (item_mode != undefined) {
        url.searchParams.set('item_mode', item_mode);
    }
    url.searchParams.set('player1', player1?.value);
    url.searchParams.set('player2', player2?.value);
    if (url.searchParams.get('type') === "2") {
        if (!isValidNick(player3?.value)) {
            shake(player3);
            return ;
        }
        if (!isValidNick(player4?.value)) {
            shake(player4);
            return ;
        }

        if (player1?.value === player2?.value || 
            player1?.value === player3?.value ||
            player1?.value === player4?.value ||
            player2?.value === player3?.value ||
            player2?.value === player4?.value ||
            player3?.value === player4?.value ) {
            showToastHandler(`${translations[getRecoilValue(languageState)]?.duplicatenick}`);
            return ;
        }
        url.searchParams.set('player3', player3?.value);
        url.searchParams.set('player4', player4?.value);
    }
    changeUrl(url);
}

export const playerInputHandler = (event) => {
    const inputElement = event.target;
    const {value} = event.target;
    const playerIndex = inputElement.id.split('-').pop();
    notvalidNickMsg(".msg" + playerIndex , value);
}

export default PingpongType;