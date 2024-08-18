import { getRecoilValue } from "../core/myrecoil/myrecoil.js"
import { languageState } from "../recoil/languageState.js"
import translations from "../translations.js"

export default function UserFriendsSearch () {
    
    return `
    <div class="userFriendsSearch displaynone">
        🔍 &nbsp ${translations[getRecoilValue(languageState)]?.friendsSearch}
    </div>
    `
}