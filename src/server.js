const express = require('express');
const cors = require('cors');
const db = require('./db'); // 引入我们的数据库连接池

const app = express();
const PORT = process.env.PORT || 3000;

// --- 中间件 (Middleware) ---
app.use(cors()); // 允许跨域请求
app.use(express.json()); // 解析请求体中的 JSON 数据
app.use(express.static('public')); // 托管前端静态文件

// --- API 路由 (API Routes) ---

// 【测试路由】: 检查服务器是否正在运行
app.get('/', (req, res) => {
    res.send('<h1>Farm Store Backend is Running!</h1>');
});

// 【第一个真实API】: 获取所有产品列表
app.get('/api/products', async (req, res) => {
    try {
        const [products] = await db.query('SELECT * FROM Products ORDER BY name');
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Failed to retrieve products from database.' });
    }
});


// ... 其他 API 路由将在这里添加 ...


// --- 启动服务器 ---
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});