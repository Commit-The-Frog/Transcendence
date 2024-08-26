import LanguageBtn from "../components/LanguageBtn.js";
import { getRecoilValue, useRecoilValue } from "../core/myrecoil/myrecoil.js";
import { languageState } from "../recoil/languageState.js";
import translations from "../translations.js";
import { bindEventHandler } from "../utils/bindEventHandler.js";


const Twofa = () => {

    const lagnguage = getRecoilValue(languageState);
    const submit2faEventHandler = (event) => {
        event.preventDefault();
        const value = document.querySelector('.twofaInput').value;
        //서버로 요청보내고 틀리면 흔들거나 하는 로직 추가
    }

    bindEventHandler('click', "submit2faEventHandler", submit2faEventHandler);

    return `
        <div class="twofa">
        <div class="twofaHeader">
            <div class="twofaHeaderSub">
                ${LanguageBtn()}
            </div>
        </div>
            <div class="twofaWrapper">
                <div class="twofaInputWrapper">
                    <div>
                        <h1>${translations[lagnguage].twofainfo}</h1>
                    </div>
                    <div class="inputBtnWrapper">
                        <form id="towfaform">
                            <input type="text" id="twofaInput" class="twofaInput">
                            <button type="submit" class="submit2faEventHandler submitbtn btn btn-secondary">${translations[lagnguage].submit}</button>
                        </form>
                    </div>
                </div>
                <div class="hyeinWrapper">
                    <img src="../Hyein1.png"/>
                </div>
            </div>
        </div>
    `
}

export default Twofa;