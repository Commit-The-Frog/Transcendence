import { Game } from "./game.js";

/*
	1. 타입에 따라서 1대1이나 토너먼트를 한다.
	2. 타입에 따라서 다른 개수의 닉네임을 받는다.(2, 4개)
	3. 1대1인 경우, 그냥 게임을 한다.(run)
	4. 토너먼트인 경우, 대진표를 짜서 해당하는 플레이어들의 게임을 진행시킨다.(run)
*/

const params = new URLSearchParams(window.location.search);
const type = params.get('type');

// Fisher-Yates Shuffle
const shuffleArray = (array) => {
	for (let i = array.length - 1; i >= 0; i--) {
		// 0부터 i까지의 임의의 정수 j를 선택
		const j = Math.floor(Math.random() * (i + 1));

		// array[i]와 array[j]의 값을 교환
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}

// url 파라미터에서 닉네임 가져오기
const getNicknameList = () => {
	let nicknameList = [];

	for (let i=0; i<=type*2-1; i++)
		nicknameList[i] = params.get(`player${i+1}`);
	return nicknameList;
}

// 메인
(function run() {
	const nicknameList = getNicknameList();
	if (type == 2) shuffleArray(nicknameList);
	let game = new Game(type, nicknameList);

	game.init();
}());
