import { Home } from "../../pages/Home.js";
import { UserInfo } from "../../pages/UserInfo.js";
import { parseUrl } from "../../utils/parseUrl.js";
import Pingpong from "../../pages/Pingpong.js";
import Twofa from "../../pages/Twofa.js";

export function Router() {

const routes = {
    "/" : Home,
    "/userinfo/:id" : UserInfo,
    "/pingpong" : Pingpong,
    "/pingpong/:option" : Pingpong,
    "/pingpong/:option/start" : Pingpong,
    "/twofa" : Twofa
}

const path = window.location.pathname;
const parsed = parseUrl(path, routes);
if (parsed) {
    const {route , params} = parsed;
    if (routes[route])
        return routes[route]({params : params});
    else
        return `<div> 404 not fond </div>`
    } else {
        return `<div> 404 not fond </div>`
    }
}