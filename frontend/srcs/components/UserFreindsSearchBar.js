import { useEffect, useRef, useState } from "../core/myreact/myreact.js";
import { bindEventHandler } from "../utils/bindEventHandler.js";

const UserFriendsSearchModal = () => {
    const [searchFriends, setSearchFriends] = useState([]);
    const [input, setInput] = useState('','friendsSearchInput');
    const timeoutRef = useRef(null);
    const userFriendSearchHandler = (event) => {
        event.preventDefault();
        const value = event.target.value;
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        if (input != value) {
            setInput(value);
        }
        timeoutRef.current = setTimeout(()=>{
            fetch(`http://localhost:3000/user/search?nick=${value}`)
            .then((res)=>res.json())
            .then((data)=>{
                if (data)
                    setSearchFriends([...data]);
            })
            .catch(()=>{});
        },300);
    }
    bindEventHandler('change', "userFriendSearchHandler",userFriendSearchHandler);
    return `
    <div>
        <input class="userfriendsSerachInput userFriendSearchHandler" name="userfriendsSerachInput"  type="text" value="${input}" placeholder="🔍 friends search...">
        ${searchFriends.map((el)=>{
            return `
            <div>
                ${el.name}
            </div>
            `
        }).join('')}
    </div>
    `
}


export default UserFriendsSearchModal;


        // timeout = setTimeout(()=>{
        //     
        // }, 300);