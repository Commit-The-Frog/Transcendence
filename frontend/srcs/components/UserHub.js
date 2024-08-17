import { useEffect, useState } from "../core/myreact/myreact.js"
import { bindEventHandler } from "../utils/bindEventHandler.js";
import UserFriends from "./UserFriends.js";
import UserHistory from "./UserHistory.js";
import UserHubContent from "./UserHubContent.js";

export default function UserHub () {

    const [btnUserHubNumber, setBtnUserHubNumber] = useState(0);

    const onClickFriendsHandler = () => {
        setBtnUserHubNumber(0);
    }

    const onClickMatchHistoryHandler = () => {
        setBtnUserHubNumber(1);
    }

    bindEventHandler('click',"onClickFriendsHandler",onClickFriendsHandler);
    bindEventHandler('click',"onClickMatchHistoryHandler",onClickMatchHistoryHandler);
    return `
    <div class="userHub">
        <div class="userHubTabs">
            <button class=" onClickFriendsHandler ${btnUserHubNumber === 0 ? 'selected' : ''}">friends</button>
            <button class=" onClickMatchHistoryHandler ${btnUserHubNumber === 1 ? 'selected' : ''}">history</button>
        </div>
        <div class="userHubWrapper">
            ${UserHubContent({btnnum : btnUserHubNumber})}
        </div>
    </div>
    `
}