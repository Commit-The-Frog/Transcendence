import { useEffect, useState } from "../core/myreact/myreact.js"
import UserFreindsSearch from "./UserFreindsSearch.js"

export default function UserFriends ({btnnum}) {
    const [friends, setFriends] = useState([], 'friends');
    const [user, setUser] = useState('', 'user');

    useEffect(()=>{
        setFriends([
            {
                username : 'minji',
                online : false,
            }, {
                username : 'hani',
                online : true,
            }, {
                username : 'hyein',
                online : false,
            }, {
                username : 'daniel',
                online : true,
            }
        ])
    }, [])
    setUser('hi');
    return `
    <div class="userFriends">
        ${UserFreindsSearch()}
        <div class="userFriendsList">
            ${
                friends?.map((el)=>{
                   return `<div class="userFriend">
                         <div class="isonline ${el?.online ? "online" : 'offline'}"></div>
                        <p>${el?.username}</p>
                   </div>`
                }).join('')
            }
        </div>
    </div>`
}