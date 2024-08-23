import { useEffect, useState } from "../core/myreact/myreact.js"
import { bindEventHandler } from "../utils/bindEventHandler.js";
import { changeUrl } from "../utils/changeUrl.js";
import updateQueryParam from "../utils/updateQueryParams.js";
import translations from "../translations.js";
import { getRecoilValue, useRecoilValue } from "../core/myrecoil/myrecoil.js";
import { languageState } from "../recoil/languageState.js";

const PingpongType = () => {
    const [mode, setMode] = useState(1, 'pingpongmode');
    const [itemmode, setItemmode] = useState(false, 'pinpongitemmode');
    const language = useRecoilValue(languageState);

    const [players, setPlayers] = useState({
        'pingpong-player1' : '',
        'pingpong-player2' : '',
        'pingpong-player3' : '',
        'pingpong-player4' : '',
    }, 'pingpongPlayer');

    const [msg, setMsg] = useState({
        'pingpong-player1' : '&nbsp;',
        'pingpong-player2' : '&nbsp;',
        'pingpong-player3' : '&nbsp;',
        'pingpong-player4' : '&nbsp;',
    }, 'pingpongMsg');

    const [msgKey, setMsgKey] = useState({
        'pingpong-player1' : 'space',
        'pingpong-player2' : 'space',
        'pingpong-player3' : 'space',
        'pingpong-player4' : 'space',
    }, 'pingpongMsgKey');

    useEffect(() => {
        setMsg({
            'pingpong-player1': translations[language]?.[msgKey['pingpong-player1']],
            'pingpong-player2': translations[language]?.[msgKey['pingpong-player2']],
            'pingpong-player3': translations[language]?.[msgKey['pingpong-player3']],
            'pingpong-player4': translations[language]?.[msgKey['pingpong-player4']],
        });
        console.log(msg);
    }, [language], 'setMsgEffect');
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
        
        const isValid = (player) => player?.length > 0 && player?.length <= 10;

        const shake = (player) => {
            player.classList.add('shake'); // shake 클래스 추가
            player.focus();

            player.addEventListener('animationend', function() {
                player.classList.remove('shake');
            }, { once: true });
        }

        if (!isValid(player1?.value)) {
            shake(player1);
            return ;
        }
        if (!isValid(player2?.value)) {
            shake(player2);
            return ;
        }
        url.pathname += '/start';
        url.searchParams.set('player1', player1?.value);
        url.searchParams.set('player2', player2?.value);
        if (url.searchParams.get('type') === "2") {
            if (!isValid(player3?.value)) {
                shake(player3);
                return ;
            }
            if (!isValid(player4?.value)) {
                shake(player4);
                return ;
            }
            url.searchParams.set('player3', player3?.value);
            url.searchParams.set('player4', player4?.value);
        }
        changeUrl(url);
    };

    const pingpongPlayerHandler = (event) => {
        const {name, value} = event.target;
        setPlayers(prev=>({
            ...prev,
            [name] : value,
        }))
        if (value.length > 10) {
            setMsg(prev=>({
                ...prev,
                [name] : translations[getRecoilValue(languageState)]?.exceeds10characters,
            }))
            setMsgKey(prev=>({
                ...prev,
                [name] : 'exceeds10characters',
            }))
        }
        else if (value == '' || value.length > 0 && value.length <= 10) {
            setMsg(prev=>({
                ...prev,
                [name] : '&nbsp;',
            }))
            setMsgKey(prev=>({
                ...prev,
                [name] : 'space',
            }))
        }
    }
    bindEventHandler('click', "itemmodeHandler", itemmodeHandler);
    bindEventHandler('click', "twoPlyaerBtnHandler",() => handleModeChange(1));
    bindEventHandler('click', "tournamentBtnHandler", () => handleModeChange(2));
    bindEventHandler('click', "startBtnHandler", startBtnHandler);
    bindEventHandler('change', "pingpongPlayerHandler", pingpongPlayerHandler);

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
                        <button class="twoplayerModeBtn twoPlyaerBtnHandler ${mode === 1 ? 'selected' : ''} "> ${translations[getRecoilValue(languageState)]?.vs}</button>
                        <button class="tournamentBtn tournamentBtnHandler ${mode === 2 ? 'selected' : ''} "> ${translations[getRecoilValue(languageState)]?.tournament}</button>
                    </div>
                </div>
            </div>
            <div class="pingponginputWrapper">
                <form>
                    <input type="text" class="pinpongPlyaerInput1 pingpongPlayerHandler" id="pingpong-player1" autocomplete="off" name="pingpong-player1" placeholder="player1" value="${players['pingpong-player1']}">
                    <p class="pingpongPlayerMsg">${msg['pingpong-player1']? msg['pingpong-player1']: '&nbsp;' }</p>
                    <input type="text" class="pinpongPlyaerInput2 pingpongPlayerHandler" id="pingpong-player2" autocomplete="off" name="pingpong-player2" placeholder="player2" value="${players['pingpong-player2']}">
                    <p class="pingpongPlayerMsg">${msg['pingpong-player2'] ? msg['pingpong-player2']: '&nbsp;' }</p>
                    ${mode === 2 ? `<input type="text" class="pinpongPlyaerInput3 pingpongPlayerHandler" autocomplete="off" id="pingpong-player3" name="pingpong-player3" placeholder="player3" value="${players['pingpong-player3']}">
                    <p class="pingpongPlayerMsg">${msg['pingpong-player3'] ? msg['pingpong-player3']: '&nbsp;' }</p>` : ''}
                    ${mode === 2 ? `<input type="text" class="pinpongPlyaerInput4 pingpongPlayerHandler" autocomplete="off" id="pingpong-player4" name="pingpong-player4" placeholder="player4" value="${players['pingpong-player4']}">
                    <p class="pingpongPlayerMsg">${msg['pingpong-player4'] ? msg['pingpong-player4']: '&nbsp;' }</p>` : ''}
                </form>
            </div>
            <div class="startBtnWrapper">
                <button class="pingpongStart startBtnHandler"> ${translations[getRecoilValue(languageState)]?.start}</button>
            </div>
        </div>
    `
}

export default PingpongType;