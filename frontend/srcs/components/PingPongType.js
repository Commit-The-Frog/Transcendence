import { useState } from "../core/myreact/myreact.js"
import { bindEventHandler } from "../utils/bindEventHandler.js";
import { changeUrl } from "../utils/changeUrl.js";
import updateQueryParam from "../utils/updateQueryParams.js";
import translations from "../translations.js";
import { getRecoilValue } from "../core/myrecoil/myrecoil.js";
import { languageState } from "../recoil/languageState.js";
import { notvalidNickMsg, shake, isValidNick } from "../utils/notvalidNick.js";

const PingpongType = () => {
    const [mode, setMode] = useState(1, 'pingpongmode');
    const [itemmode, setItemmode] = useState(false, 'pinpongitemmode');

    updateQueryParam('type', mode);
    updateQueryParam('item_mode', itemmode);
    const handleModeChange = (newMode) => {
        setMode(newMode);
        updateQueryParam('type', newMode);
    };
    const itemmodeHandler = () => {
        setItemmode((prev) => {
            let newMode = !prev;
            updateQueryParam('item_mode',newMode);
            return newMode;
        });
    };

    const startBtnHandler = (event) =>{
        const player1 = document.getElementById("pingpong-player1");
        const player2 = document.getElementById("pingpong-player2");
        const player3 = document.getElementById("pingpong-player3");
        const player4 = document.getElementById("pingpong-player4");
        const url = new URL(window.location);

        if (!isValidNick(player1?.value)) {
            shake(player1);
            return ;
        }
        if (!isValidNick(player2?.value)) {
            shake(player2);
            return ;
        }
        url.pathname += '/start';
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
            url.searchParams.set('player3', player3?.value);
            url.searchParams.set('player4', player4?.value);
        }
        changeUrl(url);
    };

    const pingpongPlayerHandler = (event) => {
        const inputElement = event.target;
        const {value} = event.target;
        const playerIndex = inputElement.id.split('-').pop();
        notvalidNickMsg(".pingpongMsg" + playerIndex , value);
    }
    bindEventHandler('click', "itemmodeHandler", itemmodeHandler);
    bindEventHandler('click', "twoPlayerBtnHandler",() => handleModeChange(1));
    bindEventHandler('click', "tournamentBtnHandler", () => handleModeChange(2));
    bindEventHandler('click', "startBtnHandler", startBtnHandler);
    bindEventHandler('input', "pingpongPlayerHandler", pingpongPlayerHandler);

    return `
        <div class="pingpongtype">
            <div class="pingpongtypeWrapper">
            <div class="itemBtnWrapper">
                <div>
                    <button class="itemBtn itemmodeHandler ${itemmode? 'selected' :''}">
                        ${itemmode ? '✔' : ''}
                    </button>
                </div>
                    <p>${translations[getRecoilValue(languageState)]?.itemmode}</p>
                </div>
                <div class="typeBtnWrapper">
                    <div class="typeBtnWrapper2">
                        <button class="twoplayerModeBtn twoPlayerBtnHandler ${mode === 1 ? 'selected' : ''} "> ${translations[getRecoilValue(languageState)]?.vs}</button>
                        <button class="tournamentBtn tournamentBtnHandler ${mode === 2 ? 'selected' : ''} "> ${translations[getRecoilValue(languageState)]?.tournament}</button>
                    </div>
                </div>
            </div>
            <div class="pingponginputWrapper">
                <form>
                    <input type="text" class="pinpongPlayerInput1 pingpongPlayerHandler" id="pingpong-player1" autocomplete="off" name="pingpong-player1" placeholder="player1">
                    <p class="pingpongMsgplayer1 pingpongPlayerMsg">&nbsp;</p>
                    <input type="text" class="pinpongPlayerInput2 pingpongPlayerHandler" id="pingpong-player2" autocomplete="off" name="pingpong-player2" placeholder="player2">
                    <p class="pingpongPlayerMsg pingpongMsgplayer2">&nbsp;</p>
                    ${mode === 2 ? `<input type="text" class="pinpongPlayerInput3 pingpongPlayerHandler" autocomplete="off" id="pingpong-player3" name="pingpong-player3" placeholder="player3">
                    <p class="pingpongPlayerMsg pingpongMsgplayer3">&nbsp;</p>` : ''}
                    ${mode === 2 ? `<input type="text" class="pinpongPlayerInput4 pingpongPlayerHandler" autocomplete="off" id="pingpong-player4" name="pingpong-player4" placeholder="player4">
                    <p class="pingpongPlayerMsg pingpongMsgplayer4">&nbsp;</p>` : ''}
                </form>
            </div>
            <div class="startBtnWrapper">
                <button class="pingpongStart startBtnHandler"> ${translations[getRecoilValue(languageState)]?.start}</button>
            </div>
        </div>
    `
}

export default PingpongType;