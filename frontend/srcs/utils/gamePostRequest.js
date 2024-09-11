import {myAxios} from "../core/myaxios/myAxios.js"

const gamePostRequest = (istournament, game, round, leftPlayer, rightPlayer, winplayer) => {
    const leftPlayerWin = winplayer === 'left' ? true : false;
    const rightPlayerWin = winplayer === 'right' ? true : false;
    const data = {
        istournament,
        game,
        round,
        playerL : {
            nickname : leftPlayer,
            win : leftPlayerWin
        },
        playerR : {
            nickname : rightPlayer,
            win : rightPlayerWin
        }
    }
    const url = `https://${window.env.SERVER_IP}/match`
    myAxios.post(url,data)
    .then((res)=>{
        console.log(res);
    })
    .catch((e)=>{
        console.log(e);
    })
}