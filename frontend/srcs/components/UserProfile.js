import { useEffect, useState } from "../core/myreact/myreact.js"
import { getRecoilValue } from "../core/myrecoil/myrecoil.js"
import { languageState } from "../recoil/languageState.js"
import translations from "../translations.js"
import UserEdit from "./UserEdit.js";
import { bindEventHandler } from "../utils/bindEventHandler.js";
import Modal from "./Modal.js";
import { getLastUrlSegment } from "../utils/getLastUrlSegment.js";
import myAxios from "../core/myaxios/myAxios.js";
export default function UserProfile ( {
    data, setData
}){
    const [editOpen, setEditOpen] = useState(false, 'editopen');
    const [host, setHost] = useState(false,'ishost');
    const [friend, setFriend] = useState(false, 'isFriend');
    const userEditOpenHandler = () => {
        setEditOpen(true);
    }

    const closeHandler = () => {
        setEditOpen(false);
    }
    useEffect(()=>{
        // if (data?.host) {
        //     setHost(true);
        // }
        // if (data?.friend) {
        //     setFriend(true);
        // }
    },undefined,'userhost');

    const friendAddHandler = () => {
        const id = getLastUrlSegment();
        const url = `https://${window.env.SERVER_IP}/user/friend`;
        myAxios.post(url,{ user_id : id})
        .then((res) =>{
            setFriend(true);
        })
        .catch((el)=>{
            console.log(el);
        })
    }


    bindEventHandler('click', "userEditOpenHandler", userEditOpenHandler);
    bindEventHandler('click', "friendAddHandler", friendAddHandler);
    return `
    <div class="userProfile">
        <div class="userProfileImgNameWrapper">
        <div class="userProfileImgNameWrapper2">
            <div class="userProfileImgWrapper">
                <img class="userProfileImg" src="${data.img ? `https://${window.env.SERVER_IP_NOAPI}/profile_images/${data.img}` : '/img/default.png'}"/>
            </div>
            <div class="userInfoWrapper1">
                <div class="userInfoWrapper2">
                    <div>
                    <p class="username">${data?.nick ? data.nick : ''}</p>
                    </div>
                </div>
            </div>
            </div>
            ${
                data?.host ?
                `<button class="userInfoEdit userEditOpenHandler"> ${translations[getRecoilValue(languageState)]?.edit} </button>` :
                ``
            }
            ${
               (!data?.host && !data?.friend) ?`<button class="userInfoEdit friendAddHandler">subscribe</button>` :
                ``
            }
        </div>
    </div>
    ${editOpen === true ? Modal({modal : editOpen, closeHandler, onClose : () => setEditOpen(false), children : UserEdit, data ,setData, childrenName : "userEdit"}) : ''}
    `
}