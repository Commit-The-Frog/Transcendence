const UserHistoryElTournament = ({el}) => {
    return `
    <div class="userFriend userHistory userTournament ${el?.game}El">
        <div class="matchday matchdayTournament">
            ${el?.date}
        </div>
        <div class="matchHistoryTournament">
             <div class="matchHistoryRound1">
                <div class="historyplayer historyplayerself ${el?.round1?.playerL?.win  ? `winner` : `loser`}">
                    <p>${el?.round1?.playerL?.nickname}</p>
                </div>
                <div class="historyplayer historyplayeropponent ${el?.round1?.playerR?.win  ? `winner` : `loser`}">
                    <p>${el?.round1?.playerR?.nickname}</p>
                </div>
             </div>
             <div class="tournamentLeftLine">
             </div>
             <div class="tournamentLeftoneLine">
             </div>
             <div class="matchHistoryRound3">
             <div class="tournamentRightLine">
             </div>
             <div class="tournamentRightoneLine">
             </div>
             <div>
                 ${el?.round3?.playerL?.win ? '🥇' : '&nbsp&nbsp&nbsp&nbsp'}
             </div>
                <div class="historyplayer historyplayerself ${el?.round3?.playerL?.win  ? `winner` : `loser`}">
                       <p>${el?.round3.playerL?.nickname}</p>
                   </div>
                   <div class="historyplayer historyplayeropponent ${el?.round3?.playerR?.win  ? `winner` : `loser`}">
                       <p>${el?.round3?.playerR?.nickname}</p>
                   </div>
                   <div>
                 ${el?.round3?.playerR?.win ? '🥇' : '&nbsp&nbsp&nbsp&nbsp'}
                </div>
                </div>
                
             <div class="matchHistoryRound2">
                <div class="historyplayer historyplayerself ${el?.round2?.playerL?.win ? `winner` : `loser`}">
                    <p>${el?.round2?.playerL?.nickname}</p>
                </div>
                <div class="historyplayer historyplayeropponent ${el?.round2?.playerR?.win  ? `winner` : `loser`}">
                    <p>${el?.round2?.playerR?.nickname}</p>
                </div>
            </div>
         </div>
         <div class="matchgame">
            ${el?.game}
         </div>
    </div>
    `
}

export default UserHistoryElTournament;