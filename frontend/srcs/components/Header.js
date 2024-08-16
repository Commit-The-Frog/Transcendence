import { bindEventHandler } from "../utils/bindEventHandler.js"
import { changeUrl } from "../utils/changeUrl.js";

export function Header () {
    const clickHeaderMyPageHandler = function() {
        changeUrl("/userinfo/1213");
    }
    bindEventHandler('click' , "clickHeaderMyPageHandler", clickHeaderMyPageHandler);
    return `
    <div class="header">
        <button class="clickHeaderMyPageHandler"> mypage !</button>
    </div>
    `
}