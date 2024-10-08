
import LanguageBtn from "../components/LanguageBtn.js";
import { getRecoilValue, } from "../core/myrecoil/myrecoil.js";
import { languageState } from "../recoil/languageState.js";
import translations from "../translations.js";
import { bindEventHandler } from "../utils/bindEventHandler.js";
import { showToastHandler } from "../utils/showToast.js";
import { changeUrl } from "../utils/changeUrl.js";
import myAxios from "../core/myaxios/myAxios.js";

const Twofa = () => {
    const lagnguage = getRecoilValue(languageState);
    const submit2faEventHandler = (event) => {
        event.preventDefault();
        const value = document.querySelector('.twofaInput').value;
        const url = `https://${window.env.SERVER_IP}/login/2fa?code=${value}`;
        myAxios.get(url,{
            credentials : 'include'
        })
        .then((data)=>{
            changeUrl(`/user`);
        })
        .catch((error)=>{
            if (error.status === 401) {
                showToastHandler(translations[getRecoilValue(languageState)].retrytwofa);
            }
            console.log(error);
        })
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
                            <input type="text" id="twofaInput" class="twofaInput" autocomplete="off">
                            <button type="submit" class="submit2faEventHandler submitbtn btn btn-secondary">${translations[lagnguage].submit}</button>
                        </form>
                    </div>
                </div>
                <div class="hyeinWrapper">
                    <img src="/img/Hyein1.png"/>
                </div>
            </div>
        </div>
    `
}

export default Twofa;