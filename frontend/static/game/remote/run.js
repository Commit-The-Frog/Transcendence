import { Game } from "./game.js";

const path = window.location.pathname; // "/game/match/12345"
const segments = path.split('/'); // ["", "game", "match", "12345"]
const uuid = segments[3]; // "12345"
const params = new URLSearchParams(window.location.search);
const nickname = params.get('nickname');

(function run() {
	console.log(`let's roll!`);
	const game = new Game(uuid, nickname);

	game.init();
}());