const UserHistoryElPvp = ({el}) => {
    return `
    <div class="userFriend userHistory ${el?.game}El ">
        <div class="matchday">
            ${el?.date}
        </div>
        <div class="matchHistory">
             <div>
                 ${el?.playerL?.win ? '🥇' : '&nbsp&nbsp&nbsp&nbsp'}
             </div>
             <div class="historyplayer historyplayerself ${el?.playerL?.win ? `winner` : `loser`}">
                 <p>${el?.playerL?.nickname}</p>
             </div>
             <div class="historyplayer historyplayeropponent ${el?.playerR?.win ? `winner` : `loser`}">
                 <p>${el?.playerR?.nickname}</p>
             </div>
             <div>
                 ${el?.playerR?.nickname ? '&nbsp&nbsp&nbsp&nbsp' : '🥇'}
             </div>
         </div>
         <div class="matchgame">
            ${el?.game}
         </div>
    </div>
    `
}

export default UserHistoryElPvp;