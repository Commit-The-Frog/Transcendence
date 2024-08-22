import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv'

const app = express();
const PORT = 3000;

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 정적 파일 제공
app.use(express.static(path.join(__dirname, 'static')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'index.html'));
});

app.get('/game/match/:uuid', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'remote.html'));
});

app.get('/config.js', (req, res) => {
    const filePath = path.join(__dirname, 'static', 'config/config.js');
    res.type(mime.getType(filePath));  // MIME 타입을 자동으로 설정
    res.sendFile(filePath);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});