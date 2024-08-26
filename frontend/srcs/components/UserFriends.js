import { useEffect, useState } from "../core/myreact/myreact.js"
import { changeUrl } from "../utils/changeUrl.js";
import UserFreindsSearch from "./UserFreindsSearch.js"

export default function UserFriends ({btnnum, userId}) {
    const [friends, setFriends] = useState([], 'friends');
    useEffect(()=>{
        fetch(`http://localhost:3000/user/friend?id=${userId}`)
        .then((res)=>{
            return res.json();
        })
        .then((data)=>{
            setFriends(data);
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
                        <p>${el?.nick}</p>
                   </div>`
                }).join('')
            }
        </div>
    </div>`
}