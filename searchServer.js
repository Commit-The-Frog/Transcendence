const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000;

app.use(cors()); // CORS 허용

// 예제 데이터
const users = [
    { name: 'haerin', id: 15880 },
    { name: 'minji', id: 15881 },
    { name: 'hanni', id: 15882 },
    { name: 'danielle', id: 15883 },
    { name: 'hyein', id: 15884 },
    { name: 'jiwoo', id: 15885 },
    { name: 'jisu', id: 15886 },
    { name: 'soyeon', id: 15887 },
    { name: 'miyeon', id: 15888 },
    { name: 'shuhua', id: 15889 },
    { name: 'yuqi', id: 15890 },
    { name: 'minnie', id: 15891 },
    { name: 'soojin', id: 15892 },
    { name: 'sana', id: 15893 },
    { name: 'momo', id: 15894 },
    { name: 'nayeon', id: 15895 },
    { name: 'jeongyeon', id: 15896 },
    { name: 'jihyo', id: 15897 },
    { name: 'mina', id: 15898 },
    { name: 'dahyun', id: 15899 },
    { name: 'chaeyoung', id: 15900 },
    { name: 'tzuyu', id: 15901 }
];

// /user/search 엔드포인트
app.get('/user/search', (req, res) => {
    const userNick = req.query.nick;
    
    if (!userNick) {
        console.log("Missing nick parameter");
        return res.status(400).json({ error: 'Missing nick parameter' });
    }

    // userNick이 부분적으로 일치하는 모든 사용자 찾기
    const matchingUsers = users.filter(u => u.name.toLowerCase().includes(userNick.toLowerCase()));

    if (matchingUsers.length > 0) {
        res.json(matchingUsers);
    } else {
        console.log(`No users found matching: ${userNick}`);
        res.status(404).json({ error: 'No users found' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});