import { Game } from "./game.js";

const getNickname = () => {
	// 현재 URL에서 쿼리 파라미터를 가져오기
	const params = new URLSearchParams(window.location.search);

	// 각 파라미터 값 가져오기
	const player1 = params.get('player1');
	const player2 = params.get('player2');

	return [player1, player2];
}

(function run() {
	const nickname = getNickname();
	let game = new Game(nickname);

	game.init();
}());
