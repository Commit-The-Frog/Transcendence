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
    const [isLoggedIn, setIsLoggedIn] = useState(false);  // 로그인 상태
    const [loading, setLoading] = useState(true);         // 로딩 상태

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

const islogin = async () => {
    const url = `https://${window.env.SERVER_IP}/login/islogin`;
    try {
        await myAxios.get(url);
        setIsLoggedIn(true);
        //return true;
    } catch (err) {
        if (err.status === 401) {
            const refreshed = await refresh();
            if (refreshed) {
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
                changeUrl("/");
            }
            //return refreshed;
        }
        console.log('혹시..?');
        // setIsLoggedIn(false);
        // changeUrl("/");
        //return false;
    }
}


const beforeRoutingDisconnectGmaeSocket = (route) => {
   //if (route != "/pingpong/remote/start") {
        useSocket().disconnectSocket();
    //}
}
const connectStatusSocket = (route) => {
    //if (route != "/twofa" && route != "/") {
        // (async () => {
        //     const isLoggedIn = await islogin();
        //     if (!isLoggedIn) {
        //         changeUrl("/");
        //         return ;
        //     } 
        // })();
        if (getSocket() === null) {
            const url = `wss://${window.location.host}/ws/user/status`
            connectAccessSocket(url);
        }
    //}
}

    useEffect(()=>{
        console.log(parsed);
        if (parsed) {
            const {route , params} = parsed;
            if (route != "/pingpong/remote/start") {
                beforeRoutingDisconnectGmaeSocket();
            }
            if (route != "/twofa" && route != "/") {
                islogin();
                connectStatusSocket();
            }
        }

    },undefined,'rotuerbefore');
    if (parsed) {
        const {route , params} = parsed;
        if (routes[route] && (isLoggedIn ||route === "/" || route === "/twofa")) {
            // beforeRoutingDisconnectGmaeSocket(route);
            // connectStatusSocket(route);
            return routes[route]({params : params});
        } else if (routes[route] && !isLoggedIn) {
            return `<div>로그인중..</div>`
        }
    }
    return `${NotFound()}`
}