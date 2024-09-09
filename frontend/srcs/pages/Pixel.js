import { Header } from "../components/Header.js";
import PixelGame from "../components/PixelGame.js";
import PixelSelect from "../components/PixelSelect.js";
import { changeUrl } from "../utils/changeUrl.js";

const pixelParamRoute = () => {
    const params = window.location.pathname.split('/');
    const params2 = params[2];
    if (params2 === "start") {
        return PixelGame;
        // game
    } else if (params2) {
        changeUrl("/not-found");
    } else {
        return PixelSelect;
    }
}


const Pixel = () => {
    const innerComponent = pixelParamRoute();

    return `
    <div class="pixel">
        <div>
        ${Header()}
        </div>
        <div class="pixelContentbox">
            ${innerComponent? innerComponent() : ''}
        </div>
        <div class="pixelHanniWrapper">
            <img src="/img/Hanni1.png"/>
        </div>
        <div class="pixelDanielleWrapper">
            <img src="/img/Danielle2.png" />
        </div>
    </div>
    `
}

export default Pixel;