import { useState } from "../core/myreact/myreact.js"
import { getRecoilValue } from "../core/myrecoil/myrecoil.js"
import { languageState } from "../recoil/languageState.js"
import translations from "../translations.js"
import UserEdit from "./UserEdit.js";
import { bindEventHandler } from "../utils/bindEventHandler.js";
import Modal from "./Modal.js";
export default function UserProfile ( {
    data
}){
    const [editOpen, setEditOpen] = useState(false, 'editopen');
    const userEditOpenHandler = () => {
        setEditOpen(true);
    }

    const closeHandler = () => {
        setEditOpen(false);
    }
    bindEventHandler('click', "userEditOpenHandler", userEditOpenHandler);
    return `
    <div class="userProfile">
        <div class="userProfileImgNameWrapper">
        <div class="userProfileImgNameWrapper2">
            <div class="userProfileImgWrapper">
                <img class="userProfileImg" src="${data?.img}"/>
            </div>
            <div class="userInfoWrapper1">
                <div class="userInfoWrapper2">
                    <div>
                    <p class="username">${data?.nick ? data.nick : ''}</p>
                    </div>
                </div>
            </div>
            </div>
            <button class="userInfoEdit userEditOpenHandler"> ${translations[getRecoilValue(languageState)]?.edit} </button>
        </div>
    </div>
    ${editOpen === true ? Modal({modal : editOpen, closeHandler, onclose : () => setEditOpen(false), children : UserEdit, childrenName : "userEdit"}) : ''}
    `
}