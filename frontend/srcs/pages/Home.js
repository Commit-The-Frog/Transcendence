import { useEffect } from "../core/myreact/myreact.js";
import { bindEventHandler } from "../utils/bindEventHandler.js";
import { changeUrl } from "../utils/changeUrl.js"

export function Home() {
    useEffect(()=>{
        //login 되어있으면 그냥 changeUrl("/userinfo/1") 때려버림.
    },[])
    const loginHandler = function() {
        // login handler
        changeUrl("/userinfo/1");
    }
    bindEventHandler('click', "homeLoginBtn", loginHandler);
    return `
    <div class="home">
        <div class="loginWrapper">
            <img class="homeLogoImg" src="../logo.png"/>
            <button class="homeLoginBtn"> login </button>
        </div>
    </div>
    `
}