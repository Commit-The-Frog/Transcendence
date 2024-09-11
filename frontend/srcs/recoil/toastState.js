import { atom } from "../core/myrecoil/myrecoil.js";

export const toastState = atom({
    key : 'toastState',
    default : {
        show : false,
        msg : ''
    }
})