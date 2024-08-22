import { Header } from "../components/Header.js";
import UserHub from "../components/UserHub.js";
import UserProfile from "../components/UserProfile.js";
import { useEffect, useState } from "../core/myreact/myreact.js";
export function UserInfo() {
    const [data, setData] = useState({});

    useEffect(()=>{
        setData({
            username : 'kitty',
            img : "../haerin.png",
            score : {
                win : 30,
                lose : 0
            }

        })
    },[])
    return `
    <div class="userInfo">
        ${Header()}
        <div class="userInfoWrapper1">
            <div class="danielleWrapper">
                <img src="/Danielle1.png"/>
            </div>
            <div class="userInfoWrapper">
                ${UserProfile({data : data})}
                <div class="userHubWrapper">
                    ${UserHub()}
                </div>
            </div>
        </div>
    </div>
    `
}