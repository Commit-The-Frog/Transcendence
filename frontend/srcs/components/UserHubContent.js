import UserFriends from "./UserFriends.js"
import UserHistory from "./UserHistory.js"

export default function UserHubContent({btnnum, userId, data}) {
    return `
    ${btnnum === 0 ? UserFriends({btnnum, userId, data}) : UserHistory({btnnum, userId})}
    `
}