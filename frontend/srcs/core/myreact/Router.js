import { Home } from "../../pages/Home.js";
import { UserInfo } from "../../pages/UserInfo.js";
import { parseUrl } from "../../utils/parseUrl.js";

export function Router() {

const routes = {
    "/" : Home,
    "/userinfo/:id" : UserInfo,
}

const path = window.location.pathname;
const parsed = parseUrl(path, routes);
if (parsed) {
    const {route , params} = parsed;
    if (routes[route])
        return routes[route]();
    else
        return `<div> 404 not fond </div>`
    }else {
        return `<div> 404 not fond </div>`
    }
}