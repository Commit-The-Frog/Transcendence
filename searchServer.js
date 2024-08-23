const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000;

app.use(cors()); // CORS 허용

// 예제 데이터
const users = [
    { nick: 'haerin', id: 15880 },
    { nick: 'minji', id: 15881 },
    { nick: 'hanni', id: 15882 },
    { nick: 'danielle', id: 15883 },
    { nick: 'hyein', id: 15884 },
    { nick: 'jiwoo', id: 15885 },
    { nick: 'jisu', id: 15886 },
    { nick: 'soyeon', id: 15887 },
    { nick: 'miyeon', id: 15888 },
    { nick: 'shuhua', id: 15889 },
    { nick: 'yuqi', id: 15890 },
    { nick: 'minnie', id: 15891 },
    { nick: 'soojin', id: 15892 },
    { nick: 'sana', id: 15893 },
    { nick: 'momo', id: 15894 },
    { nick: 'nayeon', id: 15895 },
    { nick: 'jeongyeon', id: 15896 },
    { nick: 'jihyo', id: 15897 },
    { nick: 'mina', id: 15898 },
    { nick: 'dahyun', id: 15899 },
    { nick: 'chaeyoung', id: 15900 },
    { nick: 'tzuyu', id: 15901 },
    { nick: 'yeji', id: 15902 },
    { nick: 'lia', id: 15903 },
    { nick: 'ryujin', id: 15904 },
    { nick: 'chaeryeong', id: 15905 },
    { nick: 'yuna', id: 15906 },
    { nick: 'irene', id: 15907 },
    { nick: 'seulgi', id: 15908 },
    { nick: 'wendy', id: 15909 },
    { nick: 'joy', id: 15910 },
    { nick: 'yeri', id: 15911 },
    { nick: 'taeyeon', id: 15912 },
    { nick: 'sunny', id: 15913 },
    { nick: 'tiffany', id: 15914 },
    { nick: 'hyoyeon', id: 15915 },
    { nick: 'yuri', id: 15916 },
    { nick: 'sooyoung', id: 15917 },
    { nick: 'yoona', id: 15918 },
    { nick: 'seohyun', id: 15919 },
    { nick: 'jisoo', id: 15920 },
    { nick: 'jennie', id: 15921 },
    { nick: 'rosé', id: 15922 },
    { nick: 'lisa', id: 15923 },
    { nick: 'karina', id: 15924 },
    { nick: 'giselle', id: 15925 },
    { nick: 'winter', id: 15926 },
    { nick: 'ningning', id: 15927 }
];

const users2 = [
    { nick: 'haerin', id: 15880, status: true, host: false },
    { nick: 'minji', id: 15881, status: false, host: false },
    { nick: 'hanni', id: 15882, status: true, host: false },
    { nick: 'danielle', id: 15883, status: false, host: false },
    { nick: 'hyein', id: 15884, status: true, host: false },
    { nick: 'jiwoo', id: 15885, status: false, host: false },
    { nick: 'jisu', id: 15886, status: true, host: false },
    { nick: 'soyeon', id: 15887, status: false, host: false },
    { nick: 'miyeon', id: 15888, status: true, host: false },
    { nick: 'shuhua', id: 15889, status: false, host: false },
    { nick: 'yuqi', id: 15890, status: true, host: false },
    { nick: 'minnie', id: 15891, status: false, host: false },
    { nick: 'soojin', id: 15892, status: true, host: false },
    { nick: 'sana', id: 15893, status: false, host: false },
    { nick: 'momo', id: 15894, status: true, host: false },
    { nick: 'nayeon', id: 15895, status: false, host: false },
    { nick: 'jeongyeon', id: 15896, status: true, host: false },
    { nick: 'jihyo', id: 15897, status: false, host: false },
    { nick: 'mina', id: 15898, status: true, host: false },
    { nick: 'dahyun', id: 15899, status: false, host: false },
    { nick: 'chaeyoung', id: 15900, status: true, host: false },
    { nick: 'tzuyu', id: 15901, status: false, host: false },
    { nick: 'yeji', id: 15902, status: true, host: false },
    { nick: 'lia', id: 15903, status: false, host: false },
    { nick: 'ryujin', id: 15904, status: true, host: false },
    { nick: 'chaeryeong', id: 15905, status: false, host: false },
    { nick: 'yuna', id: 15906, status: true, host: false },
    { nick: 'irene', id: 15907, status: false, host: false },
    { nick: 'seulgi', id: 15908, status: true, host: false },
    { nick: 'wendy', id: 15909, status: false, host: false },
    { nick: 'joy', id: 15910, status: true, host: false },
    { nick: 'yeri', id: 15911, status: false, host: false },
    { nick: 'taeyeon', id: 15912, status: true, host: false },
    { nick: 'sunny', id: 15913, status: false, host: false },
    { nick: 'tiffany', id: 15914, status: true, host: false },
    { nick: 'hyoyeon', id: 15915, status: false, host: false },
    { nick: 'yuri', id: 15916, status: true, host: false },
    { nick: 'sooyoung', id: 15917, status: false, host: false },
    { nick: 'yoona', id: 15918, status: true, host: false },
    { nick: 'seohyun', id: 15919, status: false, host: false },
    { nick: 'jisoo', id: 15920, status: true, host: false },
    { nick: 'jennie', id: 15921, status: false, host: false },
    { nick: 'rosé', id: 15922, status: true, host: false },
    { nick: 'lisa', id: 15923, status: false, host: false },
    { nick: 'karina', id: 15924, status: true, host: false },
    { nick: 'giselle', id: 15925, status: false, host: false },
    { nick: 'winter', id: 15926, status: true, host: false },
    { nick: 'ningning', id: 15927, status: false, host: false }
];
const matches = [
    {
        date: '2024.8.22',
        playerL: { nick: 'hyein', id: 15884, win: true },
        playerR: { nick: 'haerin', id: 15880, win: false },
    },
    {
        date: '2024.8.21',
        playerL: { nick: 'haerin', id: 15880, win: true },
        playerR: { nick: 'hyein', id: 15884, win: false },
    },
    {
        date: '2024.8.20',
        playerL: { nick: 'hyein', id: 15884, win: true },
        playerR: { nick: 'otherPlayer', id: 15882, win: false },
    },
    {
        date: '2024.8.19',
        playerL: { nick: 'minji', id: 15881, win: true },
        playerR: { nick: 'hanni', id: 15882, win: false },
    },
    {
        date: '2024.8.18',
        playerL: { nick: 'danielle', id: 15883, win: true },
        playerR: { nick: 'miyeon', id: 15888, win: false },
    },
    {
        date: '2024.8.17',
        playerL: { nick: 'yuqi', id: 15890, win: false },
        playerR: { nick: 'soyeon', id: 15887, win: true },
    },
    {
        date: '2024.8.16',
        playerL: { nick: 'miyeon', id: 15888, win: true },
        playerR: { nick: 'shuhua', id: 15889, win: false },
    },
    {
        date: '2024.8.15',
        playerL: { nick: 'sana', id: 15893, win: true },
        playerR: { nick: 'momo', id: 15894, win: false },
    },
    {
        date: '2024.8.14',
        playerL: { nick: 'jeongyeon', id: 15896, win: true },
        playerR: { nick: 'nayeon', id: 15895, win: false },
    },
    {
        date: '2024.8.13',
        playerL: { nick: 'jihyo', id: 15897, win: false },
        playerR: { nick: 'mina', id: 15898, win: true },
    },
    {
        date: '2024.8.12',
        playerL: { nick: 'dahyun', id: 15899, win: true },
        playerR: { nick: 'chaeyoung', id: 15900, win: false },
    },
    {
        date: '2024.8.11',
        playerL: { nick: 'tzuyu', id: 15901, win: false },
        playerR: { nick: 'yeji', id: 15902, win: true },
    },
    {
        date: '2024.8.10',
        playerL: { nick: 'lia', id: 15903, win: true },
        playerR: { nick: 'ryujin', id: 15904, win: false },
    },
    {
        date: '2024.8.09',
        playerL: { nick: 'chaeryeong', id: 15905, win: false },
        playerR: { nick: 'yuna', id: 15906, win: true },
    },
    {
        date: '2024.8.08',
        playerL: { nick: 'irene', id: 15907, win: true },
        playerR: { nick: 'seulgi', id: 15908, win: false },
    },
    {
        date: '2024.8.07',
        playerL: { nick: 'wendy', id: 15909, win: true },
        playerR: { nick: 'joy', id: 15910, win: false },
    },
    {
        date: '2024.8.06',
        playerL: { nick: 'yeri', id: 15911, win: false },
        playerR: { nick: 'taeyeon', id: 15912, win: true },
    },
    {
        date: '2024.8.05',
        playerL: { nick: 'sunny', id: 15913, win: false },
        playerR: { nick: 'tiffany', id: 15914, win: true },
    },
    {
        date: '2024.8.04',
        playerL: { nick: 'hyoyeon', id: 15915, win: true },
        playerR: { nick: 'yuri', id: 15916, win: false },
    },
    {
        date: '2024.8.03',
        playerL: { nick: 'sooyoung', id: 15917, win: true },
        playerR: { nick: 'yoona', id: 15918, win: false },
    },
    {
        date: '2024.8.02',
        playerL: { nick: 'seohyun', id: 15919, win: false },
        playerR: { nick: 'jisoo', id: 15920, win: true },
    },
    {
        date: '2024.8.01',
        playerL: { nick: 'jennie', id: 15921, win: true },
        playerR: { nick: 'rosé', id: 15922, win: false },
    },
    {
        date: '2024.7.31',
        playerL: { nick: 'lisa', id: 15923, win: true },
        playerR: { nick: 'karina', id: 15924, win: false },
    },
    {
        date: '2024.7.30',
        playerL: { nick: 'giselle', id: 15925, win: false },
        playerR: { nick: 'winter', id: 15926, win: true },
    },
    {
        date: '2024.7.29',
        playerL: { nick: 'ningning', id: 15927, win: true },
        playerR: { nick: 'hyein', id: 15884, win: false },
    },
    {
        date: '2024.7.28',
        playerL: { nick: 'haerin', id: 15880, win: false },
        playerR: { nick: 'minji', id: 15881, win: true },
    },
    {
        date: '2024.7.27',
        playerL: { nick: 'hanni', id: 15882, win: true },
        playerR: { nick: 'danielle', id: 15883, win: false },
    },
];


app.get('/user', (req, res) => {
    const id = parseInt(req.query.id);
    const user = users2.find(u => u.id === id);

    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

const friendsData = {
    15880: [15881, 15882, 15883, 15884],        // haerin의 친구 목록
    15881: [15880, 15884, 15885],               // minji의 친구 목록
    15882: [15880, 15885, 15886],               // hanni의 친구 목록
    15883: [15880, 15882, 15887],               // danielle의 친구 목록
    15884: [15881, 15882, 15888],               // hyein의 친구 목록
    15885: [15882, 15886, 15889],               // jiwoo의 친구 목록
    15886: [15883, 15885, 15890],               // jisu의 친구 목록
    15887: [15880, 15884, 15891],               // soyeon의 친구 목록
    15888: [15881, 15889, 15892],               // miyeon의 친구 목록
    15889: [15882, 15890, 15893],               // shuhua의 친구 목록
    15890: [15885, 15891, 15894],               // yuqi의 친구 목록
    15891: [15886, 15892, 15895],               // minnie의 친구 목록
    15892: [15887, 15893, 15896],               // soojin의 친구 목록
    15893: [15888, 15894, 15897],               // sana의 친구 목록
    15894: [15889, 15895, 15898],               // momo의 친구 목록
    15895: [15890, 15896, 15899],               // nayeon의 친구 목록
    15896: [15891, 15897, 15900],               // jeongyeon의 친구 목록
    15897: [15892, 15898, 15901],               // jihyo의 친구 목록
    15898: [15893, 15899, 15902],               // mina의 친구 목록
    15899: [15894, 15900, 15903],               // dahyun의 친구 목록
    15900: [15895, 15901, 15904],               // chaeyoung의 친구 목록
    15901: [15896, 15902, 15905],               // tzuyu의 친구 목록
    15902: [15897, 15903, 15906],               // yeji의 친구 목록
    15903: [15898, 15904, 15907],               // lia의 친구 목록
    15904: [15899, 15905, 15908],               // ryujin의 친구 목록
    15905: [15900, 15906, 15909],               // chaeryeong의 친구 목록
    15906: [15901, 15907, 15910],               // yuna의 친구 목록
    15907: [15902, 15908, 15911],               // irene의 친구 목록
    15908: [15903, 15909, 15912],               // seulgi의 친구 목록
    15909: [15904, 15910, 15913],               // wendy의 친구 목록
    15910: [15905, 15911, 15914],               // joy의 친구 목록
    15911: [15906, 15912, 15915],               // yeri의 친구 목록
    15912: [15907, 15913, 15916],               // taeyeon의 친구 목록
    15913: [15908, 15914, 15917],               // sunny의 친구 목록
    15914: [15909, 15915, 15918],               // tiffany의 친구 목록
    15915: [15910, 15916, 15919],               // hyoyeon의 친구 목록
    15916: [15911, 15917, 15920],               // yuri의 친구 목록
    15917: [15912, 15918, 15921],               // sooyoung의 친구 목록
    15918: [15913, 15919, 15922],               // yoona의 친구 목록
    15919: [15914, 15920, 15923],               // seohyun의 친구 목록
    15920: [15915, 15921, 15924],               // jisoo의 친구 목록
    15921: [15916, 15922, 15925],               // jennie의 친구 목록
    15922: [15917, 15923, 15926],               // rosé의 친구 목록
    15923: [15918, 15924, 15927],               // lisa의 친구 목록
    15924: [15919, 15925, 15920],               // karina의 친구 목록
    15925: [15920, 15926, 15921],               // giselle의 친구 목록
    15926: [15921, 15927, 15922],               // winter의 친구 목록
    15927: [15922, 15923, 15924],               // ningning의 친구 목록
};


// /user/search 엔드포인트
app.get('/user/search', (req, res) => {
    const userNick = req.query.nick;
    
    if (!userNick) {
        console.log("Missing nick parameter");
        return res.status(400).json({ error: 'Missing nick parameter' });
    }

    // userNick이 부분적으로 일치하는 모든 사용자 찾기
    const matchingUsers = users.filter(u => u.nick.toLowerCase().includes(userNick.toLowerCase()));

    if (matchingUsers.length > 0) {
        console.log(matchingUsers);
        res.json(matchingUsers);
    } else {
        console.log(`No users found matching: ${userNick}`);
        res.status(404).json({ error: 'No users found' });
    }
});

app.get('/user/friend', (req, res) => {
    const id = parseInt(req.query.id);

    if (!id || !users.find(u => u.id === id)) {
        return res.status(400).json({ error: 'Invalid or missing id parameter' });
    }

    const friendIds = friendsData[id] || [];

    // 친구의 정보를 반환 (ID, 닉네임, 상태)
    const friends = friendIds.map(friendId => {
        const friend = users2.find(u => u.id === friendId);
        return friend ? { id: friend.id, nick: friend.nick, status: friend.status } : null;
    }).filter(friend => friend !== null);

    res.json(friends);
});

app.get('/match', (req, res) => {
    const id = parseInt(req.query.id);

    if (!id || !users.find(u => u.id === id)) {
        return res.status(400).json({ error: 'Invalid or missing id parameter' });
    }

    // 해당 사용자가 참여한 모든 매치를 필터링
    const userMatches = matches.filter(match => 
        match.playerL.id === id || match.playerR.id === id
    );

    if (userMatches.length > 0) {
        res.json(userMatches);
    } else {
        res.status(404).json({ error: 'No matches found for this user' });
    }
});



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});