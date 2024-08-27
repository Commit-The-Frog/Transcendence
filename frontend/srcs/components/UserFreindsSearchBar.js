import { useEffect, useRef, useState } from "../core/myreact/myreact.js";
import { bindEventHandler } from "../utils/bindEventHandler.js";
import { changeUrl } from "../utils/changeUrl.js";

const UserFriendsSearchModal = ({onClose}) => {
    const timeoutRef = useRef(null);

    useEffect(()=>{
        const input = document.querySelector(".userfriendsSerachInput");
        input.focus();
    },[],"usersearchmodal");

    const userFriendSearchHandler = (event) => {
        event.preventDefault();
        const value = event.target.value;
        const searchFriendsResult = document.querySelector(".searchFriendsResult");
        const searchFriends = [];

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        if (value === "") {
            searchFriendsResult.innerHTML = `누구 찾아 👀`;
            currentFocus = -1;
        } else {
            fetch(`http://localhost:3000/user/search?nick=${value}`)
            .then((res)=>res.json())
            .then((data)=>{
                searchFriends.length = 0;
                searchFriends.push(...data);
                searchFriendsResult.innerHTML = `
                ${searchFriends.map((el)=>{
                  return `
                     <div class="userfriendEl userFriendHndler" data-id="${el.id}">
                         ${el.nick}
                     </div> `
                }).join('')}
                `
                currentFocus = 0;
                const items = searchFriendsResult.querySelectorAll(".userfriendEl");
                addActive(items);
            })
            .catch(()=>{
                searchFriendsResult.innerHTML = `그런이름 없어요 🙏`;
                currentFocus = -1;
            });
    }
    }

    let currentFocus = 0;
    const handleKeyboardNaviagtion = (event) => {
        const searchFriendsResult = document.querySelector(".searchFriendsResult");
        const items = searchFriendsResult.querySelectorAll(".userfriendEl");

        if (items.length > 0) {
            if (event.key === "ArrowDown") {
                currentFocus++;
                if (currentFocus >= items.length) currentFocus = 0;
                addActive(items);
            } else if (event.key === "ArrowUp") {
                currentFocus--;
                if (currentFocus < 0) currentFocus = items.length - 1;
                addActive(items);
            } else if (event.key === "Enter") {
                event.preventDefault();
                if (currentFocus > -1)
                    items[currentFocus].click();
            }
        }
    }

    const userFriendHndler = (event) =>{
        const friendId = event.target.getAttribute('data-id');
        changeUrl(`/userinfo/${friendId}`);
        onClose();
    }

    const addActive = (items) => {
        removeActive(items);
        if (currentFocus >= 0 && currentFocus < items.length ){
            items[currentFocus].classList.add("active");
        }
    }

    const removeActive = (items) => {
        items.forEach((item)=>{
            item.classList.remove("active");
        })
    }
    bindEventHandler('click', "userFriendHndler",userFriendHndler);
    bindEventHandler('input', "userFriendSearchHandler",userFriendSearchHandler);
    bindEventHandler('keydown', "handleKeyboardNaviagtion", handleKeyboardNaviagtion);
    return `
    <div class="userFriendsSearchModal">
        <input class="userfriendsSerachInput userFriendSearchHandler handleKeyboardNaviagtion" name="userfriendsSerachInput"  type="text" placeholder="🔍 " autocomplete="off">
        <div class="searchFriendsResult">
        </div>
    </div>
    `
}

export default UserFriendsSearchModal;