import { Header } from "../components/Header.js";
import UserHub from "../components/UserHub.js";
import UserProfile from "../components/UserProfile.js";
import myAxios from "../core/myaxios/myAxios.js";
import { _render, render, useEffect, useState } from "../core/myreact/myreact.js";
import { changeUrl } from "../utils/changeUrl.js";
import { getLastUrlSegment } from "../utils/getLastUrlSegment.js";

export const userinfoGetter = ( setData) => {
    const lastSegment = getLastUrlSegment();
    const url =  lastSegment !== 'user' ? `https://${window.env.SERVER_IP}/user?id=${lastSegment}` : `https://${window.env.SERVER_IP}/user`;
    myAxios.get(url,{
        credentials : 'include'
    })
    .then((res)=>{
        const data = res.data;
        setData({
            nick : data.nickname,
            status : data.status,
            img : data.profile_image,
            id : data.user_id,
            host : data.host,
            friend : data.friend,
            use_2fa : data.use_2fa
            ,...data,
        });
    })
    .catch((e)=>{
        if (e.status === 404) {
            changeUrl(`/not-found`);
        }
        console.log(e);
    })
}

export function User({params}) {
    const [data, setData] = useState({});
    const segments = window.location.pathname.split('/');
    const lastSegment = segments.pop() || segments.pop();
    useEffect(()=>{
        userinfoGetter(setData);
    },[window.location.pathname],'userinfofetch');
    return `
    <div class="userInfo">
        ${Header()}
        <div class="userInfoWrapper1">
            <div class="HaerinWrapper">
                <img src="/img/Haerin1.png" />
            </div>
            <div class="userInfoWrapper">
                ${UserProfile({data : data, setData : setData})}
                <div class="userHubWrapper">
                    ${UserHub({userId : lastSegment, data})}
                </div>
            </div>
            <div class="danielleWrapper">
                <img src="/img/Danielle1.png"/>
            </div>
        </div>
    </div>
    `
}