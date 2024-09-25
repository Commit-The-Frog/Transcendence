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

const islogin = async (route) => {
    const url = `https://${window.env.SERVER_IP}/login/islogin`;
    myAxios.get(url)
        .then((res)=>{
            setIsLoggedIn(true);
            if (route === "/") {
                changeUrl("/user");
            }
        })
        .catch((err)=>{
            setIsLoggedIn(false);
            if (route !== "/") {
                changeUrl("/");
            }
        })
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
    myAxios.get(url)
    .then(()=>{
        setValidTowfa(true);
    })
    .catch((err)=>{
        if (err.status === 401) {
            setValidTowfa(false);
        }
    })
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
            else if (route === "/") {
                islogin(route);
            }
            else if (route == "/twofa") {
                checkValidTwofa();
            }
        }

    },undefined,'rotuerbefore');
    if (parsed) {
        const {route , params} = parsed;
        if (routes[route] && (isLoggedIn ||route === "/" || (route === "/twofa" && validTwofa))) {
            return routes[route]({params : params});
        }
        else if (route === "/twofa" && !validTwofa) {
            return `${NotFound()}`
        }
         else if (routes[route] && !isLoggedIn) {
            return `<div></div>`
        }
    }
    return `${NotFound()}`
}