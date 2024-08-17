import UserFriends from "./UserFriends.js"
import UserHistory from "./UserHistory.js"

export default function UserHubContent({btnnum}) {
    return `
    ${btnnum === 0 ? UserFriends({btnnum}) : UserHistory({btnnum})}
    `
}