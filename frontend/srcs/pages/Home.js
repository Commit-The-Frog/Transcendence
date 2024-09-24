import { useEffect } from "../core/myreact/myreact.js";
import { getRecoilValue } from "../core/myrecoil/myrecoil.js";
import { useridState } from "../recoil/useridState.js";
import { bindEventHandler } from "../utils/bindEventHandler.js";
import { changeUrl } from "../utils/changeUrl.js"


export function Home() {
    const loginHandler = function() {
        window.location.href = `https://${window.env.SERVER_IP}/login`;
    }
    bindEventHandler('click', "homeLoginBtn", loginHandler);
    return `
    <div class="home">
        <div class="loginWrapper">
            <img class="homeLogoImg" src="/img/logo.png"/>
            <button class="homeLoginBtn"> login </button>
        </div>
    </div>
    `
}