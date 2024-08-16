import { Header } from "../components/Header.js";
import UserProfile from "../components/UserProfile.js";
import { useEffect, useState } from "../core/myreact/myreact.js";
export function UserInfo() {
    const [data, setData] = useState({});

    return `
    <div class="userInfo">
        ${Header()}
        <h1> this is userinfo </h1>
        ${UserProfile({data : data})}
    </div>
    `
}