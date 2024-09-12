import { useEffect, useState } from "../core/myreact/myreact.js";
import UserHistoryElPvp from "./UserHistoryElPvp.js";
import UserHistoryElTournament from "./UserHistoryElTournament.js";

export default function UserHistory ({btnnum, userId}) {
    const [history, setHistory] = useState([], 'history');
    // const [user, setUser] = useState('' , 'historyuser');

    useEffect(()=>{
        // setHistory([
        //     {
        //       "date": "2024-09-08",
        //       "istournament": false,
        //       "game": "pingpong",
        //       "playerL": {
        //         "nickname": "PlayerOne",
        //         "user_id": 101,
        //         "score": 5,
        //         "win": true
        //       },
        //       "playerR": {
        //         "nickname": "PlayerTwo",
        //         "user_id": 102,
        //         "score": 3,
        //         "win": false
        //       }
        //     },
        //     {
        //       "date": "2024-09-08",
        //       "istournament": true,
        //       "game": "pixel",
        //       "round1": {
        //         "playerL": {
        //           "nickname": "PixelWarrior",
        //           "user_id": 201,
        //           "score": 10,
        //           "win": true
        //         },
        //         "playerR": {
        //           "nickname": "PixelKing",
        //           "user_id": 202,
        //           "score": 8,
        //           "win": false
        //         }
        //       },
        //       "round2": {
        //         "playerL": {
        //           "nickname": "PixelMaster",
        //           "user_id": 203,
        //           "score": 12,
        //           "win": true
        //         },
        //         "playerR": {
        //           "nickname": "PixelSlayer",
        //           "user_id": 204,
        //           "score": 9,
        //           "win": false
        //         }
        //       },
        //       "round3": {
        //         "playerL": {
        //           "nickname": "PixelWarrior",
        //           "user_id": 201,
        //           "score": 15,
        //           "win": true
        //         },
        //         "playerR": {
        //           "nickname": "PixelMaster",
        //           "user_id": 203,
        //           "score": 13,
        //           "win": false
        //         }
        //       }
        //     }
        //   ])
        fetch(`https://${window.env.SERVER_IP}/match?id=${userId}`)
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