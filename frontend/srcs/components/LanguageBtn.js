import { _render } from "../core/myreact/myreact.js";
import { useRecoilState, getRecoilValue } from "../core/myrecoil/myrecoil.js";
import { languageState } from "../recoil/languageState.js";
import { bindEventHandler } from "../utils/bindEventHandler.js";


const LanguageBtn = () =>{
    const [, setCurrentLanguage] = useRecoilState(languageState , 'langaueState');

    function setLanguage(language) {
        localStorage.setItem('lang', language);
    }

    const enBtnHandler = () => {
        setCurrentLanguage('en');
        setLanguage('en');
    };
    const koBtnHandler = () => {
        setCurrentLanguage('ko');
        setLanguage('ko');
    };
    const frBtnHandler = () => {
        setCurrentLanguage('fr');
        setLanguage('fr');
    };
    bindEventHandler('click', 'enBtnHandler', enBtnHandler);
    bindEventHandler('click', 'koBtnHandler', koBtnHandler);
    bindEventHandler('click', 'frBtnHandler', frBtnHandler);
    return`
        <div class="languageBtnWrapper">
            <button class="enBtn enBtnHandler ${getRecoilValue(languageState) === `en` ? `selected` : `` }">en</button>
            <button class="koBtn koBtnHandler ${getRecoilValue(languageState) === `ko` ? `selected` : `` }">ko</button>
            <button class="frBtn frBtnHandler ${getRecoilValue(languageState) === `fr` ? `selected` : `` }">fr</button>
        </div>
    `
}

export default LanguageBtn;