import myAxios from "../core/myaxios/myAxios.js";
import { useEffect, useState } from "../core/myreact/myreact.js"
import { changeUrl } from "../utils/changeUrl.js";
import UserFreindsSearch from "./UserFreindsSearch.js"

export default function UserFriends ({ userId}) {
    const [friends, setFriends] = useState([], 'friends');
    const url = userId !== 'user' ? `https://${window.env.SERVER_IP}/user/friend?id=${userId}` : `https://${window.env.SERVER_IP}/user/friend`
    useEffect(()=>{
        myAxios.get(url)
        .then((res)=>{
            setFriends(res.data);
        })
        .catch((e)=>{
            console.log(e);
        })
    }, [userId],'userHFreindsFetch')

    return `
    <div class="userFriends">
        ${UserFreindsSearch()}
        <div class="userFriendsList">
            ${
                friends?.map((el)=>{
                   return `<div class="userFriend">
                         <div class="isonline ${el?.status ? "online" : 'offline'}"></div>
                        <p>${el?.nickname}</p>
                   </div>`
                }).join('')
            }
        </div>
    </div>`
}