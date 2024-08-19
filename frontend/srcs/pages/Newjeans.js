import { Header } from "../components/Header.js"
import NewjeansGame from "../components/NewjeansGame.js";

const Newjeans = () => {
    return `
    <div class="newjeans">
        ${Header()}
        ${NewjeansGame()}
    </div>
    `
}

export default Newjeans;