import myAxios from "../core/myaxios/myAxios.js";
import { _render, useEffect } from "../core/myreact/myreact.js";
import { getRecoilValue } from "../core/myrecoil/myrecoil.js";
import { userinfoGetter } from "../pages/User.js";
import { languageState } from "../recoil/languageState.js";
import translations from "../translations.js";
import { bindEventHandler } from "../utils/bindEventHandler.js";
import { isValidNick, notvalidNickMsg, shake } from "../utils/notvalidNick.js";
import { showToastHandler } from "../utils/showToast.js";

const UserEdit = ({onClose, data, setData}) => {

    const profileImgInputHandler = (event) => {
        const file = event.target.files[0];
        if (file && file.size > 1024 * 1024) {
            showToastHandler(translations[getRecoilValue(languageState)]?.imagelimit);
            return ;
        }
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
        const imageInput = document.getElementById('profileimg-input');
        const toggle = document.getElementById("toggleSwitch");
        const image = imageInput?.files[0];
        const formData = new FormData();
        // const url = `https://${window.env.SERVER_IP}/user`;
        const url = `https://${window.env.SERVER_IP}/user`;
        if (image) {
            formData.append('profile_image', image);
        }
        formData.append('nickname',nick?.value);
        formData.append('use_2fa', !(toggle.checked));
        myAxios.post(url, formData)
        .then((res)=>{
            onClose();
            userinfoGetter(setData);
        })
        .catch((err)=>{
            if (err.status === 406) {
                showToastHandler(err.data.error);
                return ;
            }
        })
    }

    const userNameInputHandler = (event) => {
        const {value} = event.target;
        
        notvalidNickMsg(".userinputMsg", value);
    }

    useEffect(()=>{
        const profileinput =  document.getElementById("username-input");
        const toggle = document.getElementById("toggleSwitch");
        if (profileinput)
            profileinput.value = data?.nick ? data?.nick : '';
        if (toggle)
            toggle.checked = data?.use_2fa !== undefined ? !(data?.use_2fa) : false;
    },undefined,'userEditData');

    bindEventHandler('change', "profileImgInputHandler", profileImgInputHandler);
    bindEventHandler('click', "userEditSubmitHandler", userEditSubmitHandler);
    bindEventHandler('input', "userNameInputHandler", userNameInputHandler);
    return `
    <div class="useredit">
        <div class="usereditInputWrapper">
            <div class="profileimgInputWrapper">
                <div class="profilePreviewContainer">
                    <img class="prfilePreviewImg" id="imagePreview" src="${data.img ? `https://${window.env.SERVER_IP_NOAPI}/profile_images/${data.img}` : '/img/default.png'}" alt="Image Preview"  />
                </div>
                <label for="profileimg-input" class="profileimgInputLabel"> ${translations[getRecoilValue(languageState)]?.file}</label>
                <input type="file" id="profileimg-input" accept=".jpg, .jpeg, .png" class="profileimgInput profileImgInputHandler"/>
            </div>
            <div class="usernameInputWrapper">
            <form class="twofaSelect">
            <p>2FA</p>
            <label class="switch">
                <input type="checkbox" id="toggleSwitch" class="2fatoggle">
                <span class="slider"></span>
            </label>
        </form>
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