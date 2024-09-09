import { Header } from "../components/Header.js";
import { bindEventHandler } from "../utils/bindEventHandler.js";
import { changeUrl } from "../utils/changeUrl.js";
import PingPongLocalGame from "../components/PingPongLocalGame.js"
import PingPongSelectBox from "../components/PingPongSelectBox.js";
import PingPongRemoteGame from "../components/PingPongRemoteGame.js";

const pingpongParamRoute = () => {
    const params = window.location.pathname.split('/');
    const params2 = params[2];
    const params3 = params[3];
    if (!params2) {
        changeUrl('/pingpong/local');
        return ;
    } else if ((params2 === 'local' || params2 === 'remote') && !params3){
        return PingPongSelectBox;
    } else if (params2 === 'local' && params3 === "start") {
        return PingPongLocalGame;
    } else if (params2 === 'remote' && params3 === "start") {
        return PingPongRemoteGame;   
    }
    else {
        changeUrl('/not-found');
    }
}


const Pingpong = () => {
    const pingpongLocalHandler = () => {
        changeUrl('/pingpong/local');
    }
    const pingpongRemoteHandler = () => {
        changeUrl('/pingpong/remote');
    }
    bindEventHandler('click', "pingpongLocalHandler", pingpongLocalHandler);
    bindEventHandler('click', "pingpongRemoteHandler",pingpongRemoteHandler);

    //params파싱해와야함...
    const innerComponent = pingpongParamRoute();
    return `
    <div class="pingpong">
        ${Header()}
        <div class="pingpongWrapper">
            <div class="hanniWrapper">
                <img src="/img/Hanni2.png"/>
            </div>
                <div class="pingpongselectbox">
                    ${innerComponent ? innerComponent() : ''}
                </div>
            <div class="minjiWrapper">
                <img src="/img/Minji1_flipped.png"/>
            </div>
        </div>
    </div>
    `
}

export default Pingpong;