import { getRecoilValue, useRecoilState } from "../core/myrecoil/myrecoil.js";
import { languageState } from "../recoil/languageState.js";
import translations from "../translations.js";
import { bindEventHandler } from "../utils/bindEventHandler.js"
import { changeUrl } from "../utils/changeUrl.js";
import LanguageBtn from "./LanguageBtn.js";

export function Header () {
    const params = window.location.pathname.split("/");
    const clickHeaderMyPageHandler = () => {
        const id =  localStorage.getItem('user_id');
        if (!id) {
            changeUrl(`/user`);
        }else
            changeUrl(`/user/${id}`);
    }
    const clickHeaderPingPongHandler = () => {
        changeUrl("/pingpong/local");
    }
    const clickHeaderPixelHandler = () => {
        changeUrl("/pixel");
    }
    bindEventHandler('click' , "clickHeaderMyPageHandler", clickHeaderMyPageHandler);
    bindEventHandler('click' , "clickHeaderPingPongHandler", clickHeaderPingPongHandler);
    bindEventHandler('click' , "clickHeaderPixelHandler", clickHeaderPixelHandler);
    return `
    <div class="header">
        <div class="routingBtnWrapper">
            <button class="clickHeaderMyPageHandler">${translations[getRecoilValue(languageState)]?.mypage} </button>
            <button class="clickHeaderPingPongHandler"> ${translations[getRecoilValue(languageState)]?.pingpong} </button>
            <button class="clickHeaderPixelHandler"> ${translations[getRecoilValue(languageState)]?.pixel} </button>
        </div>
        ${
            params[1] === "user" ?
            `
            <div class="languageBtnWrapper1">
                ${LanguageBtn()}
            </div>
            ` : ``
        }
    </div>
    `
}