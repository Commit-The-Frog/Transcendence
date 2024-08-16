import { Header } from "../components/Header.js";
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
        ${UserProfile({data : data})}
    </div>
    `
}