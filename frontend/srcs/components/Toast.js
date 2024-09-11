import { render, useEffect, useState } from "../core/myreact/myreact.js";
import { getRecoilValue } from "../core/myrecoil/myrecoil.js";
import { toastState } from "../recoil/toastState.js";
import { _render } from "../core/myreact/myreact.js";

const Toast = () => {
    return `
        <div class="mytoast">
            <div class="toastbox ${getRecoilValue(toastState)?.show ? 'show' : ''}">
                <p class="toastboxmsg"> ${getRecoilValue(toastState)?.msg} </p>
            </div>
        </div>
    `
}

export default Toast;