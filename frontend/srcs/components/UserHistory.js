import { useEffect, useState } from "../core/myreact/myreact.js";

export default function UserHistory ({btnnum, userId}) {
    const [history, setHistory] = useState([], 'history');
    const [user, setUser] = useState('' , 'historyuser');

    useEffect(()=>{
        fetch(`http://localhost:3000/match?id=${userId}`)
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
        // setHistory([
        //     {
        //         opponent : 'wonyeong',
        //         didwin : false,
        //         day : '2024. 7. 21'
        //     }, {
        //        opponent : 'gaeul',
        //        didwin : true, 
        //         day : '2023. 12. 21'
        //     }, {
        //         opponent : 'eseo',
        //         didwin : true,
        //         day : '2023. 10. 21'
        //     }, {
        //         opponent : 'yujin',
        //         didwin : true,
        //         day : '2023. 8. 12'
        //     }, {
        //         opponent : 'liz',
        //         didwin : false,
        //         day : '2022. 2. 1'
        //     }, {
        //         opponent : 'ray',
        //         didwin : false,
        //         day : '2021. 2. 6'
        //     }
        // ]);
        // setUser('haerin');
    },[btnnum, userId], 'fetchHistoryE');

    return `
    <div class="userFriends">
        <div class="userFriendSearchNone">&nbsp</div>
        <div class="userFriendsList">
            ${
                history.map((el)=>{
                   return `<div class="userFriend userHistory">
                        <div class="matchday">
                            ${el?.date}
                        </div>
                        <div class="matchHistory">
                             <div>
                                 ${el?.playerL?.win ? '🥇' : '&nbsp&nbsp&nbsp&nbsp'}
                             </div>
                             <div class="historyplayer historyplayerself ${el?.playerL?.win ? `winner` : `loser`}">
                                 <p>${el?.playerL?.nick}</p>
                             </div>
                             <div class="historyplayer historyplayeropponent ${el?.playerR?.win ? `winner` : `loser`}">
                                 <p>${el?.playerR?.nick}</p>
                             </div>
                             <div>
                                 ${el?.playerR?.nick ? '&nbsp&nbsp&nbsp&nbsp' : '🥇'}
                             </div>
                         </div>
                   </div>`
                }).join('')
            }
        </div>
    </div>
    `
}