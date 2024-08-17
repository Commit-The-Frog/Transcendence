import { useEffect, useState } from "../core/myreact/myreact.js";

export default function UserHistory ({btnnum}) {
    const [history, setHistory] = useState([], 'history');
    const [user, setUser] = useState('' , 'historyuser');

    useEffect(()=>{
        setHistory([
            {
                opponent : 'wonyeong',
                didwin : false,
                day : '2024. 7. 21'
            }, {
               opponent : 'gaeul',
               didwin : true, 
                day : '2023. 12. 21'
            }, {
                opponent : 'eseo',
                didwin : true,
                day : '2023. 10. 21'
            }, {
                opponent : 'yujin',
                didwin : true,
                day : '2023. 8. 12'
            }, {
                opponent : 'liz',
                didwin : false,
                day : '2022. 2. 1'
            }, {
                opponent : 'ray',
                didwin : false,
                day : '2021. 2. 6'
            }
        ]);
        setUser('haerin');
    },[btnnum]);

    return `
    <div class="userFriends">
        <div class="userFriendSearchNone">&nbsp</div>
        <div class="userFriendsList">
            ${
                history.map((el)=>{
                   return `<div class="userFriend userHistory">
                        <div class="matchday">
                            ${el?.day}
                        </div>
                        <div class="matchHistory">
                             <div>
                                 ${el?.didwin ? '🥇' : '&nbsp&nbsp&nbsp&nbsp'}
                             </div>
                             <div class="historyplayer historyplayerself ${el?.didwin ? `winner` : `loser`}">
                                 <p>${user}</p>
                             </div>
                             <div class="historyplayer historyplayeropponent ${el?.didwin ? `loser` : `winner`}">
                                 <p>${el?.opponent}</p>
                             </div>
                             <div>
                                 ${el?.didwin ? '&nbsp&nbsp&nbsp&nbsp' : '🥇'}
                             </div>
                         </div>
                   </div>`
                }).join('')
            }
        </div>
    </div>
    `
}