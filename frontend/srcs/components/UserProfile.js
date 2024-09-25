import { _render, useEffect, useState } from "../core/myreact/myreact.js"
import { getRecoilValue } from "../core/myrecoil/myrecoil.js"
import { languageState } from "../recoil/languageState.js"
import translations from "../translations.js"
import UserEdit from "./UserEdit.js";
import { bindEventHandler } from "../utils/bindEventHandler.js";
import Modal from "./Modal.js";
import { getLastUrlSegment } from "../utils/getLastUrlSegment.js";
import myAxios from "../core/myaxios/myAxios.js";
import { userinfoGetter } from "../pages/User.js";
import { changeUrl } from "../utils/changeUrl.js";
export default function UserProfile ( {
    data, setData
}){
    const [editOpen, setEditOpen] = useState(false, 'editopen');
    const userEditOpenHandler = () => {
        setEditOpen(true);
    }

    const closeHandler = () => {
        setEditOpen(false);
    }
    const friendAddHandler = () => {
        const id = getLastUrlSegment();
        const url = `https://${window.env.SERVER_IP}/user/friend`;
        myAxios.post(url,{ user_id : id})
        .then((res) =>{
            userinfoGetter(setData);
        })
        .catch((el)=>{
            console.log(el);
        })
    }
    const logoutHandler = () => {
        const url = `https://${window.env.SERVER_IP}/login/logout`;
        myAxios.get(url)
        .then(()=>{
            changeUrl("/");
        });
    }

    const unfollowHandler = () => {
        const url = `https://${window.env.SERVER_IP}/user/friend`;
        const id = getLastUrlSegment();
        myAxios.delete(url,{ user_id : id})
        .then((res) =>{
            userinfoGetter(setData);
        })
        .catch((el)=>{
            console.log(el);
        })
    }

    useEffect(()=>{
        const winRateBar = document.getElementById("winRateBar");
        winRateBar.style.width = `${data.win_rate}%`;
    },undefined,'userwinrate');

    bindEventHandler('click', "userEditOpenHandler", userEditOpenHandler);
    bindEventHandler('click', "friendAddHandler", friendAddHandler);
    bindEventHandler('click', "logoutHandler", logoutHandler);
    bindEventHandler('click', "unfollowHandler", unfollowHandler);
    return `
    <div class="userProfile">
        ${
            data?.host ?
            `<button class="logoutBtn logoutHandler">${translations[getRecoilValue(languageState)]?.logout} </button>` : ``
        }
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
                    <div>
                    <p class="winRate">
                    ${translations[getRecoilValue(languageState)]?.winrate}
                    </p>
                    <div class="winRateBarWrapper">
                        <p class="winRate winRateReal">
                        ${data?.win_rate !== undefined ? data?.win_rate : '0'} %
                        </p>
                        <div class="winRateBar" id="winRateBar" >
                        </div>
                    </div>
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
               (!data?.host && !data?.friend) ?`<button class="userInfoEdit friendAddHandler">${translations[getRecoilValue(languageState)]?.follow} </button>` :
                ``
            }
            ${
                (!data?.host && data?.friend) ? `<button class="userInfoEdit unfollowHandler">${translations[getRecoilValue(languageState)]?.unfollow} </button>` : ``
            }
        </div>
    </div>
    ${editOpen === true ? Modal({modal : editOpen, closeHandler, onClose : () => setEditOpen(false), children : UserEdit, data ,setData, childrenName : "userEdit"}) : ''}
    `
}