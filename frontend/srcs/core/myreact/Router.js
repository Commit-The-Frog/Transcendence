import { Home } from "../../pages/Home.js";
import { User } from "../../pages/User.js";
import { parseUrl } from "../../utils/parseUrl.js";
import Pingpong from "../../pages/Pingpong.js";
import Twofa from "../../pages/Twofa.js";
import Pixel from "../../pages/Pixel.js";
import useSocket from "../../utils/useSocket.js";

export function Router() {

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

const beforeRoutingDisconnectGmaeSocket = (route) => {
    if (route != "/pingpong/remote/start") {
        console.log(route);
        console.log(useSocket().getcurrentSocket());
        useSocket().disconnectSocket();
    }
}


if (parsed) {
    const {route , params} = parsed;
    if (routes[route]) {
        beforeRoutingDisconnectGmaeSocket(route);
        return routes[route]({params : params});
    }
    else
        return `<div> 404 not found </div>`
    } else {
        return `<div> 404 not found </div>`
    }
}