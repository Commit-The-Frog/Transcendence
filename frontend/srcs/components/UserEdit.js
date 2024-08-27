import { getRecoilValue } from "../core/myrecoil/myrecoil.js";
import { languageState } from "../recoil/languageState.js";
import translations from "../translations.js";
import { bindEventHandler } from "../utils/bindEventHandler.js";
import { isValidNick, notvalidNickMsg, shake } from "../utils/notvalidNick.js";

const UserEdit = ({onClose}) => {
    const profileImgInputHandler = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imagePreview = document.getElementById("imagePreview");
                imagePreview.src = e.target.result;
            }
            reader.readAsDataURL(file);
        } else {
        }
    }
    const userEditSubmitHandler = (event) => {
        const nick = document.getElementById('username-input');
        if (!isValidNick(nick?.value)) {
            shake(nick);
            return ;
        }

        onClose();
    }

    const userNameInputHandler = (event) => {
        const {value} = event.target;
        
        notvalidNickMsg(".userinputMsg", value);
    }
    bindEventHandler('change', "profileImgInputHandler", profileImgInputHandler);
    bindEventHandler('click', "userEditSubmitHandler", userEditSubmitHandler);
    bindEventHandler('input', "userNameInputHandler", userNameInputHandler);
    return `
    <div class="useredit">
        <div class="usereditInputWrapper">
            <div class="profileimgInputWrapper">
                <div class="profilePreviewContainer">
                    <img class="prfilePreviewImg" id="imagePreview" src="/default.png" alt="Image Preview"  />
                </div>
                <label for="profileimg-input" class="profileimgInputLabel"> ${translations[getRecoilValue(languageState)]?.file}</label>
                <input type="file" id="profileimg-input" accept=".jpg, .jpeg, .png" class="profileimgInput profileImgInputHandler"/>
            </div>
            <div class="usernameInputWrapper">
                <label for="username-input" class="usernameInputLabel">${translations[getRecoilValue(languageState)]?.name}</label>
                <input type="text" id="username-input" class="profileusername userNameInputHandler" />
                <p class="userinputMsg pingpongPlayerMsg">&nbsp;</p>
            </div>
        </div>
        <div class="usereditSubmitWrapper">
            <button class="usereditSubmit userEditSubmitHandler">${translations[getRecoilValue(languageState)]?.submit}</button>
        </div>
    </div>
    `
};

export default UserEdit;