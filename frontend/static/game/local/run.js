import { Game } from "./game.js";

/*
	item
	1) 상대의 패들 길이를 20으로 줄이는 아이템
	2) 상대 패들을 앞으로 100 당기는 아이템
	3) 상대 패들 마찰제거: 미끄러워짐
	4) 상대 패들 투명화: rgba(0,0,0,0.01)
*/

const params = new URLSearchParams(window.location.search);
const type = params.get('type');
const mode = params.get('item_mode');

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
	let itemList = [1, 2, 3, 4];
	shuffleArray(itemList);
	if (type == 2) shuffleArray(nicknameList);
	if (mode === "false")itemList = [0, 0, 0, 0];
	let game = new Game(type, nicknameList, itemList);

	game.init();
}());
