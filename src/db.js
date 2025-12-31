// 引入 dotenv 来加载 .env 文件中的环境变量
require('dotenv').config();

// 引入 mysql2 库
const mysql = require('mysql2/promise');

// 创建数据库连接池
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'farm_store_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// 测试连接
pool.getConnection()
    .then(connection => {
        console.log('🎉 Successfully connected to the MySQL database!');
        connection.release(); // 释放连接
    })
    .catch(err => {
        console.error('❌ Error connecting to the database:', err.stack);
    });

// 导出连接池，以便在其他文件中使用
module.exports = pool;