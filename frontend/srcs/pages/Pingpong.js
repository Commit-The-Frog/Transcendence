import { Header } from "../components/Header.js";
import { bindEventHandler } from "../utils/bindEventHandler.js";
import { changeUrl } from "../utils/changeUrl.js";

const Pingpong = () => {
    const pingpongLocalHandler = () => {
        changeUrl('/pingpong/local');
    }
    const pingpongRemoteHandler = () => {
        changeUrl('/pingpong/remote');
    }
    bindEventHandler('click', "pingpongLocalHandler", pingpongLocalHandler);
    bindEventHandler('click', "pingpongRemoteHandler",pingpongRemoteHandler);
    return `
    <div class="pingpong">
        ${Header()}
        <div class="pingpongPg">
            <button class="pingpongLocalHandler">Local</button>
            <button class="pingpongRemoteHandler">Remote</button>
        </div>
    </div>
    `
}

export default Pingpong;