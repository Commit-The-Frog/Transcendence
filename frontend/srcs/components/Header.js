import { bindEventHandler } from "../utils/bindEventHandler.js"
import { changeUrl } from "../utils/changeUrl.js";

export function Header () {
    const clickHeaderMyPageHandler = function() {
        changeUrl("/userinfo/1213");
    }
    const clickHeaderPingPongHandler = function() {
        changeUrl("/userinfo/1213");
    }
    bindEventHandler('click' , "clickHeaderMyPageHandler", clickHeaderMyPageHandler);
    bindEventHandler('click' , "clickHeaderPingPongHandler", clickHeaderPingPongHandler);
    return `
    <div class="header">
        <button class="clickHeaderMyPageHandler"> mypage </button>
        <button class="clickHeaderPingPongHandler"> pingpong </button>
    </div>
    `
}