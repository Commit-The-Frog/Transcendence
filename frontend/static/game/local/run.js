import { Game } from "./game.js";

/*
	1. 타입에 따라서 1대1이나 토너먼트를 한다.
	2. 타입에 따라서 다른 개수의 닉네임을 받는다.(2, 4개)
	3. 1대1인 경우, 그냥 게임을 한다.(run)
	4. 토너먼트인 경우, 대진표를 짜서 해당하는 플레이어들의 게임을 진행시킨다.(run)
*/

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
