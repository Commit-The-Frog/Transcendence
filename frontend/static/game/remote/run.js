import { Game } from "./game.js";

const path = window.location.pathname; // "/game/match/12345"
const segments = path.split('/'); // ["", "game", "match", "12345"]
const uuid = segments[3]; // "12345"

(function run() {
	console.log(`let's roll!`);
	const game = new Game(uuid);

	game.init();
}());