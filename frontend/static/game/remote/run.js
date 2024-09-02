import { Game } from "./game.js";

// remote.html?location=remote&type=2&item_mode=false&player1=asdf&match_name=uuid
const params = new URLSearchParams(window.location.search);
const type = params.get('type');
const itemMode = params.get('item_mode');
const matchName = params.get('match_name');
const nickname = params.get('player1');

(function run() {
	console.log(`let's roll! type:${type} itemMode=${itemMode} matchName=${matchName} nickname=${nickname}`);
	const game = new Game(matchName, nickname, type, itemMode);

	game.init();
}());