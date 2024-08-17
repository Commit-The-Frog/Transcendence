import { useEffect, useState } from "../core/myreact/myreact.js";

export default function UserHistory ({btnnum}) {
    const [history, setHistory] = useState([], 'history');
    const [user, setUser] = useState('' , 'historyuser');

    useEffect(()=>{
        setHistory([
            {
                opponent : 'wonyeong',
                didwin : false
            }, {
               opponent : 'gaeul',
               didwin : true, 
            }, {
                opponent : 'eseo',
                didwin : true,
            }, {
                opponent : 'yujin',
                didwin : true,
            }, {
                opponent : 'liz',
                didwin : false,
            }, {
                opponent : 'ray',
                didwin : false,
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
                   </div>`
                }).join('')
            }
        </div>
    </div>
    `
}