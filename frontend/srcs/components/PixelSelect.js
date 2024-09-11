
import updateQueryParam from "../utils/updateQueryParams.js";
import translations from "../translations.js";
import { useEffect, useRef, useState } from "../core/myreact/myreact.js";
import { getRecoilValue } from "../core/myrecoil/myrecoil.js";
import { languageState } from "../recoil/languageState.js";
import { bindEventHandler } from "../utils/bindEventHandler.js";
import { playerInputChecker, playerInputHandler } from "./PingPongType.js";

const PixelSelect = () => {
    const [type, setType] = useState(1, 'pixelmode');
    const typeRef = useRef(type, 'pixeltyperef');
    useEffect(() => {
        typeRef.current = type;
    }, [type], 'typeeffect');
    const handleModeChange = (newType) => {
        setType(newType);
    }
    const startPixelBtnHandler = (event) => {
        playerInputChecker("pixel", typeRef.current);
    }
    bindEventHandler('click', "twoPlayerPixelBtnHandler",() => handleModeChange(1));
    bindEventHandler('click', "tournamentPixelBtnHandler", () => handleModeChange(2));
    bindEventHandler('input', "playerInputHandler", playerInputHandler);
    bindEventHandler('click', "startPixelBtnHandler", startPixelBtnHandler);

    return `
    <div class="pixelSelect">
    <div class="pixelSelectContainer">
        <div class="pixelSelectbox">
            <div class="typeBtnWrapper">
                <div class="pixeltypeBtnWrapper2">
                    <button class="twoplayerModeBtn twoPlayerPixelBtnHandler ${type === 1 ? 'selected' : ''} "> ${translations[getRecoilValue(languageState)]?.vs}</button>
                    <button class="tournamentBtn tournamentPixelBtnHandler ${type === 2 ? 'selected' : ''} "> ${translations[getRecoilValue(languageState)]?.tournament}</button>
                </div>
            </div>
        </div>
        <div class="pixelginputWrapper">
            <form>
                <input type="text" class="pixelPlayerInput1 playerInputHandler" id="pixel-player1" autocomplete="off" name="pixelg-player1" placeholder="player1">
                <p class="pixelgPlayerMsg msgplayer1 ">&nbsp;</p>
                <input type="text" class="pixelPlayerInput2 playerInputHandler" id="pixel-player2" autocomplete="off" name="pixelg-player2" placeholder="player2">
                <p class="pixelgPlayerMsg msgplayer2">&nbsp;</p>
                ${type === 2 ? `<input type="text" class="pixelPlayerInput3 playerInputHandler" autocomplete="off" id="pixel-player3" name="pixelg-player3" placeholder="player3">
                <p class="pixelgPlayerMsg msgplayer3">&nbsp;</p>` : ''}
                ${type === 2 ? `<input type="text" class="pixelPlayerInput4 playerInputHandler" autocomplete="off" id="pixel-player4" name="pixelg-player4" placeholder="player4">
                <p class="pixelgPlayerMsg msgplayer4">&nbsp;</p>` : ''}
            </form>
        </div>
        <div class="startBtnWrapper">
            <button class="pixelgStart startPixelBtnHandler"> ${translations[getRecoilValue(languageState)]?.start}</button>
        </div>
    </div>
        <div class="newjeansimgWrapper">
            <img src="/pixel/pixel_newjeans.png"/>
        </div>
    </div>
    `
}


export default PixelSelect;