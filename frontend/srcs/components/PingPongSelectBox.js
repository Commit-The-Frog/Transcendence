import PingPongSelect from "./PingPongSelect.js"
import PingpongType from "./PingPongType.js"

const PingPongSelectBox = () => {
    return `
        <div>
            ${PingPongSelect()}
            ${PingpongType()}
        </div>
    `
}

export default PingPongSelectBox;