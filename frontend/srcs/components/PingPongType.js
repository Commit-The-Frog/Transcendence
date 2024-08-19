import { useState } from "../core/myreact/myreact"

const PingpongType = () => {
    const [itemmode, setItemmode] = useState(false);
    const pingpongOneMatchHandler = () => {
        let url = '';
    }
    const pingpongTournamentHandler = () => {

    }
    return `
        <div class="pingpongtype">
            <div class="input-label">
                <input id="mode" type="checkbox">
                <label for="mode">turn item mode</label>
            </div>
            <button class="pingpongOneMatchHandler">1 vs 1</button>
            <button class="pingpongTournamentHandler">TOURNAMENT</button>
        </div>
    `
}