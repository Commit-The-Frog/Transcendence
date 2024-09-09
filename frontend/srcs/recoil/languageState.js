import {atom} from "../core/myrecoil/myrecoil.js"

function getLanguage() {
    return localStorage.getItem('lang') || 'en';
}

export const languageState = atom({
    key : 'languageState',
    default : getLanguage(),
})