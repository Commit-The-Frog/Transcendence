import  Modal  from "./Modal.js"
import { useState } from "../core/myreact/myreact.js"
import { getRecoilValue } from "../core/myrecoil/myrecoil.js"
import { languageState } from "../recoil/languageState.js"
import translations from "../translations.js"
import {bindEventHandler} from "../utils/bindEventHandler.js"
import UserFriendsSearchModal from "./UserFreindsSearchBar.js"

export default function UserFriendsSearch () {
    const [modal, setModal] = useState(false, 'searchmodal');

    const friendsSearchHandler = () => {
        setModal(true);
    }
    const closeHandler = () => {
        setModal(false);
    }
    bindEventHandler('click', "friendsSearchHandler", friendsSearchHandler);
    return `
    <div class="userFriendsSearch displaynone friendsSearchHandler">
        🔍 &nbsp ${translations[getRecoilValue(languageState)]?.friendsSearch}
    </div>
    ${modal === true ? Modal({modal, closeHandler, className : 'userSearchModal' , children : UserFriendsSearchModal}) : ''}
    `
}