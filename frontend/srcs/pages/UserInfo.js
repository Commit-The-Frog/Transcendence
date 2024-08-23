import { Header } from "../components/Header.js";
import UserHub from "../components/UserHub.js";
import UserProfile from "../components/UserProfile.js";
import { useEffect, useState } from "../core/myreact/myreact.js";
import { changeUrl } from "../utils/changeUrl.js";
export function UserInfo({params}) {
    const [data, setData] = useState({});

    const segments = window.location.pathname.split('/');
    const lastSegment = segments.pop() || segments.pop();
    useEffect(()=>{
        fetch(`http://localhost:3000/user?id=${lastSegment}`)
        .then((res)=>{
            if (!res.ok) {
                // 404 또는 다른 HTTP 오류를 감지하여 처리
                throw new Error('HTTP error ' + res.status);
            }
            return res.json();
        })
        .then((data)=>{
            setData(data);
        }).catch((e)=>{
            // 404로 리다이렉트, 본인페이지로 가는 방법도 있음!
            //changeUrl('/not-fond');
            console.log(e);
        })
    },[lastSegment],'userinfofetch')
    return `
    <div class="userInfo">
        ${Header()}
        <div class="userInfoWrapper1">
            <div class="HaerinWrapper">
                <img src="/Haerin1.png" />
            </div>
            <div class="userInfoWrapper">
                ${UserProfile({data : data})}
                <div class="userHubWrapper">
                    ${UserHub({userId : lastSegment})}
                </div>
            </div>
            <div class="danielleWrapper">
                <img src="/Danielle1.png"/>
            </div>
        </div>
    </div>
    `
}