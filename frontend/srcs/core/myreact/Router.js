import { Home } from "../../pages/Home.js";
import { User } from "../../pages/User.js";
import { parseUrl } from "../../utils/parseUrl.js";
import Pingpong from "../../pages/Pingpong.js";
import Twofa from "../../pages/Twofa.js";
import Pixel from "../../pages/Pixel.js";
import useSocket from "../../utils/useSocket.js";
import NotFound from "../../pages/NotFound.js";
import { connectAccessSocket, getSocket } from "../../utils/accessSocket.js";
import { changeUrl } from "../../utils/changeUrl.js";
import myAxios from "../myaxios/myAxios.js";
import { useEffect, useState } from "./myreact.js";

export function Router() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [validTwofa, setValidTowfa] = useState(false);

const routes = {
    "/" : Home,
    "/user/:id" : User,
    "/user" : User,
    "/pingpong" : Pingpong,
    "/pingpong/remote" : Pingpong,
    "/pingpong/remote/start" : Pingpong,
    "/pingpong/local" : Pingpong,
    "/pingpong/local/start" : Pingpong,
    "/pixel" : Pixel,
    "/pixel/start" : Pixel,
    "/twofa" : Twofa
}

const path = window.location.pathname;
const parsed = parseUrl(path, routes);

const refresh = async () => {
    const url = `https://${window.env.SERVER_IP}/login/refresh`;
    return myAxios.get(url)
    .then(()=>{
        return true;
    })
    .catch((err)=>{
        if (err.status === 401) {
            return false;
        }
        return true;
    })
}

const islogin = async (route) => {
    const url = `https://${window.env.SERVER_IP}/login/islogin`;
    try {
        await myAxios.get(url);
        setIsLoggedIn(true);
        if (route === "/") {
            changeUrl("/user");
        }
    } catch (err) {
        console.log(err);
        if (err.status === 401 && route !== "/") {
            const refreshed = await refresh();
            if (refreshed) {
                setIsLoggedIn(true);
                // if (route === "/") {
                //     changeUrl("/user");
                // }
            } else {
                setIsLoggedIn(false);
                // if (route !== "/") {
                    changeUrl("/");
                // }
            }
        }
        // setIsLoggedIn(false);
        // changeUrl("/");
    }
}


const beforeRoutingDisconnectGmaeSocket = () => {
        useSocket().disconnectSocket();
}
const connectStatusSocket = () => {
        if (getSocket() === null) {
            const url = `wss://${window.location.host}/ws/user/status`
            connectAccessSocket(url);
        }
}

const checkValidTwofa = async () => {
    const url = `https://${window.env.SERVER_IP}/login/check2fa`; // 추후 변경
    try {
        await myAxios.get(url);
        setValidTowfa(true);
    } catch (err) {
        console.log(err);
        if (err.status === 401) {
            setValidTowfa(false);
            changeUrl("/");
        }
        // setIsLoggedIn(false);
        // changeUrl("/");
    }
}

    useEffect(()=>{
        if (parsed) {
            const {route} = parsed;
            if (route != "/pingpong/remote/start") {
                beforeRoutingDisconnectGmaeSocket();
            }
            if (route != "/twofa" && route != "/") {
                islogin();
                connectStatusSocket();
            }
            if (route === "/") {
                islogin(route);
            }
            // if (route == "/twofa") {
            //     checkValidTwofa();
            // }
        }

    },undefined,'rotuerbefore');
    if (parsed) {
        const {route , params} = parsed;
        if (routes[route] && (isLoggedIn ||route === "/" || (route === "/twofa" /*&& validTwofa*/))) {
            return routes[route]({params : params});
        }
        // else if (route === "/twofa" && !validTwofa) {
        //     return `<div>유효사항 체크중...</div>`
        // }
         else if (routes[route] && !isLoggedIn) {
            return `<div>로그인중..</div>`
        }
    }
    return `${NotFound()}`
}