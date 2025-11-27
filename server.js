// server.js (無資料庫版)
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- 這裡就是我們的「暫時資料庫」 ---
let strokes = [];  // 用一個陣列來存所有畫筆
let currentId = 0; // 模擬 ID 自動遞增
let canvasVersion = 0; // 新增：畫布版本號

// API: 接收畫筆線段
app.post('/api/draw', (req, res) => {
    // 取得前端傳來的資料
    const { user_id, x0, y0, x1, y1, color, size, type } = req.body;
    
    // 手動產生 ID
    currentId++;

    // 建立新資料物件
    const newStroke = {
        id: currentId,
        room_id: 1,
        user_id, x0, y0, x1, y1, color, size, type: type || 'pen'
    };

    // 存入記憶體陣列
    strokes.push(newStroke);

    res.json({ status: 'success', id: currentId });
});

// API: 獲取新線段
app.get('/api/fetch_strokes', (req, res) => {
    const last_id = parseInt(req.query.last_id) || 0;

    // 從陣列中過濾出 ID 比 last_id 大的資料
    const newStrokes = strokes.filter(s => s.id > last_id);

    res.json({ 
        strokes: newStrokes, 
        version: canvasVersion 
    });
});

// API: 清空畫布
app.post('/api/clear', (req, res) => {
    strokes = [];    // 清空陣列
    currentId = 0;   // 重置 ID
    canvasVersion++; // 修改：每次清空，版本號 +1
    res.json({ status: 'cleared' });
});

// 啟動伺服器
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 伺服器已啟動!`);
    console.log(`👉 本機測試: http://localhost:${PORT}`);
});