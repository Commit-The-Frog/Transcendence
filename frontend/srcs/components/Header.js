import { getRecoilValue } from "../core/myrecoil/myrecoil.js";
import { languageState } from "../recoil/languageState.js";
import translations from "../translations.js";
import { bindEventHandler } from "../utils/bindEventHandler.js"
import { changeUrl } from "../utils/changeUrl.js";
import LanguageBtn from "./LanguageBtn.js";

export function Header () {
    const clickHeaderMyPageHandler = () => {
        changeUrl("/userinfo/15880");
    }
    const clickHeaderPingPongHandler = () => {
        changeUrl("/pingpong");
    }
    const clickHeaderNewjeansHandler = () => {
        changeUrl("/newjeans");
    }
    bindEventHandler('click' , "clickHeaderMyPageHandler", clickHeaderMyPageHandler);
    bindEventHandler('click' , "clickHeaderPingPongHandler", clickHeaderPingPongHandler);
    bindEventHandler('click' , "clickHeaderNewjeansHandler", clickHeaderNewjeansHandler);
    return `
    <div class="header">
        <div class="routingBtnWrapper">
            <button class="clickHeaderMyPageHandler">${translations[getRecoilValue(languageState)]?.mypage} </button>
            <button class="clickHeaderPingPongHandler"> ${translations[getRecoilValue(languageState)]?.pingpong} </button>
        </div>
        <div class="languageBtnWrapper1">
            ${LanguageBtn()}
        </div>
    </div>
    `
}