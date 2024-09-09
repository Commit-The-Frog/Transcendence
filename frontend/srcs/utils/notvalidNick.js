import { getRecoilValue } from "../core/myrecoil/myrecoil.js";
import { languageState } from "../recoil/languageState.js";
import translations from "../translations.js";

const notvalidNickMsg = (className, value) => {
    const messageElement = document.querySelector(className);
    if (value.length > 10) {
        if (messageElement) {
            messageElement.innerHTML = translations[getRecoilValue(languageState)]?.exceeds10characters;
        }
    }
    else if (value == '' || value.length > 0 && value.length <= 10) {
        if (messageElement) {
            messageElement.innerHTML = "&nbsp;";
        }
    }
}

const shake = (input) => {
    input.classList.add('shake');
    input.focus();

    input.addEventListener('animationend', function() {
        input.classList.remove('shake');
    }, { once: true });
}

const isValidNick = (nick) => nick?.length > 0 && nick?.length <= 10;

export {notvalidNickMsg, shake, isValidNick};