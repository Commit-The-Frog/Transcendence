import { Router } from "./core/myreact/Router.js";
import { Header } from "./components/Header.js";

export function Rayout () {
    return `
    <div class=rayout">
        ${Router()}
    </div>
    `
}