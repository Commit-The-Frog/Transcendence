import { useEffect, useState } from "../core/myreact/myreact.js";
import UserHistoryElPvp from "./UserHistoryElPvp.js";
import UserHistoryElTournament from "./UserHistoryElTournament.js";

export default function UserHistory ({btnnum, userId}) {
    const [history, setHistory] = useState([], 'history');
    const url = userId != 'user' ? `https://${window.env.SERVER_IP}/match?id=${userId}` : `https://${window.env.SERVER_IP}/match`

    useEffect(()=>{
        fetch(url)
        .then((res)=>{
            if (!res.ok) {
                throw new Error('HTTP error ' + res.status);
            }
            return res.json();
        })
        .then((data)=>{
            setHistory(data);
        }).catch((e)=>{
            console.log(e);
        })
       
    },[btnnum, userId], 'fetchHistoryE');

    return `
    <div class="userFriends">
        <div class="userFriendSearchNone">&nbsp</div>
        <div class="userFriendsList">
            ${
                history.map((el)=>{
                   if (el?.istournament) {
                    return UserHistoryElTournament({el});
                   } else {
                    return UserHistoryElPvp({el});
                   }
                }).join('')
            }
        </div>
    </div>
    `
}