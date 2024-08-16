import { _render } from "../core/myreact/myreact.js";

export function changeUrl (url) {
    history.pushState(null, null, url);
    _render();
}