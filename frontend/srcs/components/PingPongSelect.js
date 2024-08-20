import { bindEventHandler } from "../utils/bindEventHandler.js";
import { changeUrl } from "../utils/changeUrl.js";

const PingPongSelect = () => {

    const params = window.location.pathname.split('/');

    const pingpongLocalBtnHandler = () => {
        changeUrl('/pingpong/local');
    }

    const pingpongRemotBtnHandler = () => {
        changeUrl('/pingpong/remote');
    }

    bindEventHandler('click',"pingpongLocalBtnHandler",pingpongLocalBtnHandler);
    bindEventHandler('click',"pingpongRemotBtnHandler",pingpongRemotBtnHandler);
    return `
    <div class="pingpongselect">
        <div class="pingpongselectWrapper">
            <button class="pingpongLocalBtnHandler ${params[2] === "local" ? "selected" : "" }">local</button>
            <button class="pingpongRemotBtnHandler ${params[2] === "remote" ? "selected" : "" }">remote</button>
        </div>
    </div>
    `
}

export default PingPongSelect;