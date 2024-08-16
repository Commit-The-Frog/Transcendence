export default function UserProfile ( {
    data
}){
    return `
    <div class="userProfile">
        <div class="userProfileImgNameWrapper">
            <div class="userProfileImgWrapper">
                <img class="userProfileImg" src="${data?.img}"/>
            </div>
            <div class="userInfoWrapper1">
                <div class="userInfoWrapper2">
                    <div>
                    <p class="username">${data?.username ? data.username : ''}</p>
                    </div>
                    <div class="userScoreWrapper">
                        <span>${data?.score?.win ? data?.score?.win : ''} </span>
                        <span> 승 </span>
                        <span>${data?.score?.lose ? data?.score?.lose : '0'} </span>
                        <span> 패 </span>
                    </div>
                </div>
            </div>
            <button class="userInfoEdit"> Edit </button>
        </div>
    </div>
    `
}