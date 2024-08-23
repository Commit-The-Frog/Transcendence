import { useEffect, useRef, useState } from "../core/myreact/myreact.js";
import { bindEventHandler } from "../utils/bindEventHandler.js";
import { changeUrl } from "../utils/changeUrl.js";

const UserFriendsSearchModal = ({onClose}) => {
    const [searchFriends, setSearchFriends] = useState([]);
    const [input, setInput] = useState('','friendsSearchInput');
    const timeoutRef = useRef(null);
    const userFriendSearchHandler = (event) => {
        event.preventDefault();
        const value = event.target.value;
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setInput(value);
        if (value === "") {
            setSearchFriends([]);
        } else {
            fetch(`http://localhost:3000/user/search?nick=${value}`)
            .then((res)=>res.json())
            .then((data)=>{
                if (data)
                    setSearchFriends([...data]);
            })
            .catch(()=>{
                setSearchFriends([]);
            });
    }
    }
    const userFriendHndler = (event) =>{
        const friendId = event.target.getAttribute('data-id');
        changeUrl(`/userinfo/${friendId}`);
        onClose();
    }
    bindEventHandler('click', "userFriendHndler",userFriendHndler);
    bindEventHandler('change', "userFriendSearchHandler",userFriendSearchHandler);
    return `
    <div class="userFriendsSearchModal">
        <input class="userfriendsSerachInput userFriendSearchHandler" name="userfriendsSerachInput"  type="text" value="${input}" placeholder="🔍 friends search..." autocomplete="off">
        <div class="searchFriendsResult">
            ${searchFriends.map((el)=>{
                return `
                <div class="userfriendEl userFriendHndler" data-id="${el.id}">
                    ${el.nick}
                </div>
                `
            }).join('')}
        </div>
    </div>
    `
}


export default UserFriendsSearchModal;