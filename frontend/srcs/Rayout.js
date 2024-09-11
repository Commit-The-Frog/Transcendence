import { Router } from "./core/myreact/Router.js";
import Toast from "./components/Toast.js";
import { getRecoilValue } from "./core/myrecoil/myrecoil.js";
import { toastState } from "./recoil/toastState.js";

export function Rayout () {
    return `
    <div class=rayout">
        ${getRecoilValue(toastState)?.show ? Toast() : ''}
        ${Router()}
    </div>
    `
}