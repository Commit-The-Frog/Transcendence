import { Home } from "../../pages/Home.js";
import { User } from "../../pages/User.js";
import { parseUrl } from "../../utils/parseUrl.js";
import Pingpong from "../../pages/Pingpong.js";
import Twofa from "../../pages/Twofa.js";
import Pixel from "../../pages/Pixel.js";
import useSocket from "../../utils/useSocket.js";
import NotFound from "../../pages/NotFound.js";
import { connectAccessSocket, getSocket } from "../../utils/accessSocket.js";

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
        useSocket().disconnectSocket();
    }
    if (route != "/twofa" && route != "/") {
        if (getSocket() === null) {
            // const url = `https://${window.env.SERVER_IP}/ws/access`
            // connectAccessSocket(url);
        }
    }
}


if (parsed) {
    const {route , params} = parsed;
    if (routes[route]) {
        beforeRoutingDisconnectGmaeSocket(route);
        return routes[route]({params : params});
    }
    else
        return `${NotFound()}`
    } else {
        return `${NotFound()}`
    }
}