import { getRecoilValue } from "../core/myrecoil/myrecoil.js"
import { languageState } from "../recoil/languageState.js"
import translations from "../translations.js"

export default function UserProfile ( {
    data
}){
    return `
    <div class="userProfile">
        <div class="userProfileImgNameWrapper">
        <div class="userProfileImgNameWrapper2">
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
                        <span> ${translations[getRecoilValue(languageState)]?.win} </span>
                        <span>${data?.score?.lose ? data?.score?.lose : '0'} </span>
                        <span> ${translations[getRecoilValue(languageState)]?.lose} </span>
                    </div>
                </div>
            </div>
            </div>
            <button class="userInfoEdit"> ${translations[getRecoilValue(languageState)]?.edit} </button>
        </div>
    </div>
    `
}