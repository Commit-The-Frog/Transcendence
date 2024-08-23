import UserFriends from "./UserFriends.js"
import UserHistory from "./UserHistory.js"

export default function UserHubContent({btnnum, userId}) {
    return `
    ${btnnum === 0 ? UserFriends({btnnum, userId}) : UserHistory({btnnum, userId})}
    `
}