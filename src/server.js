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

// 测试路由: 检查服务器是否正在运行
app.get('/', (req, res) => {
    res.send('<h1>Farm Store Backend is Running!</h1>');
});

// 获取所有产品列表
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
// 新增产品
app.post('/api/products', async (req, res) => {
    // 从请求体中解构出产品数据
    const { name, unit_price_ht, stock_quantity } = req.body;

    // 简单的后端验证
    if (!name || !unit_price_ht || stock_quantity === undefined) {
        return res.status(400).json({ message: 'Missing required fields: name, unit_price_ht, stock_quantity' });
    }

    try {
        const sql = 'INSERT INTO Products (name, unit_price_ht, stock_quantity) VALUES (?, ?, ?)';
        const [result] = await db.query(sql, [name, unit_price_ht, stock_quantity]);
        
        // 返回新创建的产品信息，包括由数据库生成的 ID
        const newProduct = {
            product_id: result.insertId,
            name,
            unit_price_ht,
            stock_quantity
        };
        res.status(201).json(newProduct);

    } catch (error) {
        // 特别处理唯一键冲突错误 (产品重名)
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: `Product with name "${name}" already exists.` });
        }
        console.error('Error adding new product:', error);
        res.status(500).json({ message: 'Failed to add new product.' });
    }
});

// =================================================================
// 修正后的库存更新路由
// =================================================================
app.patch('/api/products/:id/stock', async (req, res) => {
    const { id } = req.params;
    const { change } = req.body;

    if (change === undefined || typeof change !== 'number') {
        return res.status(400).json({ message: 'Invalid stock change value provided.' });
    }

    // 1. 从连接池获取一个专用的连接
    const connection = await db.getConnection(); 

    try {
        // 2. 在这个专用连接上开始事务
        await connection.beginTransaction();

        // 3. 使用 'connection' 对象执行所有查询
        const [rows] = await connection.query('SELECT stock_quantity FROM Products WHERE product_id = ? FOR UPDATE', [id]);
        
        if (rows.length === 0) {
            await connection.rollback(); // 回滚
            return res.status(404).json({ message: 'Product not found.' });
        }
        
        const currentStock = rows[0].stock_quantity;
        const newStock = currentStock + change;
        
        if (newStock < 0) {
            await connection.rollback(); // 回滚
            return res.status(400).json({ message: 'Stock cannot be negative.' });
        }

        const updateSql = 'UPDATE Products SET stock_quantity = ? WHERE product_id = ?';
        await connection.query(updateSql, [newStock, id]);
        
        // 4. 在这个专用连接上提交事务
        await connection.commit();

        res.status(200).json({ product_id: parseInt(id), new_stock_quantity: newStock });

    } catch (error) {
        // 如果发生任何错误，回滚事务
        await connection.rollback();
        console.error(`Error updating stock for product ${id}:`, error);
        res.status(500).json({ message: 'Failed to update stock.' });
    } finally {
        // 5. 无论成功与否，都必须释放连接回池中
        if (connection) {
            connection.release();
        }
    }
});


// =================================================================
// 客户相关的 API
// =================================================================

// 获取所有忠实客户
app.get('/api/customers', async (req, res) => {
    try {
        const [customers] = await db.query('SELECT * FROM Customers ORDER BY last_name, first_name');
        res.status(200).json(customers);
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({ message: 'Failed to retrieve customers.' });
    }
});

// 新增忠实客户
app.post('/api/customers', async (req, res) => {
    const { first_name, last_name, gender } = req.body;

    if (!first_name || !last_name || !gender) {
        return res.status(400).json({ message: 'Missing required fields: first_name, last_name, gender.' });
    }

    try {
        const sql = 'INSERT INTO Customers (first_name, last_name, gender) VALUES (?, ?, ?)';
        const [result] = await db.query(sql, [first_name, last_name, gender]);

        const newCustomer = {
            customer_id: result.insertId,
            first_name,
            last_name,
            gender
        };
        res.status(201).json(newCustomer);

    } catch (error) {
        console.error('Error adding new customer:', error);
        res.status(500).json({ message: 'Failed to add new customer.' });
    }
});

// 修改忠实客户信息
app.put('/api/customers/:id', async (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, gender } = req.body;

    if (!first_name || !last_name || !gender) {
        return res.status(400).json({ message: 'Missing required fields: first_name, last_name, gender.' });
    }

    try {
        // 首先检查客户是否存在
        const [existing] = await db.query('SELECT * FROM Customers WHERE customer_id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ message: 'Customer not found.' });
        }

        const sql = 'UPDATE Customers SET first_name = ?, last_name = ?, gender = ? WHERE customer_id = ?';
        await db.query(sql, [first_name, last_name, gender, id]);

        const updatedCustomer = {
            customer_id: parseInt(id),
            first_name,
            last_name,
            gender
        };
        res.status(200).json(updatedCustomer);

    } catch (error) {
        console.error('Error updating customer:', error);
        res.status(500).json({ message: 'Failed to update customer.' });
    }
});

// =================================================================
// 销售相关的 API
// =================================================================

// 记录一笔新销售
app.post('/api/sales', async (req, res) => {
    // 请求体结构示例:
    // {
    //   "customer_id": 1, (or null for walk-in customer)
    //   "items": [
    //     { "product_id": 1, "quantity": 2 },
    //     { "product_id": 5, "quantity": 1 }
    //   ]
    // }
    const { customer_id, items } = req.body;

    // 验证输入
    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: 'Sale items are required.' });
    }

    const connection = await db.getConnection(); // 获取一个连接用于事务处理

    try {
        await connection.beginTransaction();

        // --- 第 1 步: 插入到 Sales 表 ---
        const saleSql = 'INSERT INTO Sales (customer_id) VALUES (?)';
        // 如果 customer_id 是 undefined 或 0, 设为 null
        const saleCustomerId = customer_id || null; 
        const [saleResult] = await connection.query(saleSql, [saleCustomerId]);
        const newSaleId = saleResult.insertId;

        // --- 第 2 和 3 步: 循环处理购物篮中的每件商品 ---
        for (const item of items) {
            const { product_id, quantity } = item;

            // 2a. 获取当前产品信息 (价格、税率、库存) 并锁定该行以防并发问题
            const [productRows] = await connection.query('SELECT unit_price_ht, vat_rate, stock_quantity FROM Products WHERE product_id = ? FOR UPDATE', [product_id]);
            
            if (productRows.length === 0) {
                // 如果找不到产品, 回滚事务
                throw new Error(`Product with ID ${product_id} not found.`);
            }

            const product = productRows[0];

            // 2b. 检查库存是否充足
            if (product.stock_quantity < quantity) {
                throw new Error(`Insufficient stock for product ID ${product_id}. Available: ${product.stock_quantity}, Required: ${quantity}`);
            }

            // 2c. 插入到 Sale_Items 表 (记录历史价格)
            const saleItemSql = 'INSERT INTO Sale_Items (sale_id, product_id, quantity_sold, price_at_sale, vat_at_sale) VALUES (?, ?, ?, ?, ?)';
            await connection.query(saleItemSql, [newSaleId, product_id, quantity, product.unit_price_ht, product.vat_rate]);

            // 3. 更新 Products 表的库存
            const newStock = product.stock_quantity - quantity;
            const updateStockSql = 'UPDATE Products SET stock_quantity = ? WHERE product_id = ?';
            await connection.query(updateStockSql, [newStock, product_id]);
        }

        // --- 如果所有操作都成功, 提交事务 ---
        await connection.commit();
        
        res.status(201).json({ 
            message: 'Sale recorded successfully!', 
            sale_id: newSaleId 
        });

    } catch (error) {
        // --- 如果任何一步出错, 回滚所有更改 ---
        await connection.rollback();
        console.error('Error recording sale:', error);
        // 根据错误类型返回不同的状态码
        if (error.message.includes('Insufficient stock') || error.message.includes('not found')) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Failed to record sale.' });
        }
    } finally {
        // --- 无论成功还是失败, 最后都要释放连接 ---
        connection.release();
    }
});

// =================================================================
// 销售历史 API
// =================================================================

// 获取最近的销售历史记录
app.get('/api/sales/history', async (req, res) => {
    const limit = parseInt(req.query.limit) || 20; // 默认返回最近20条

    try {
        const sql = `
            SELECT
                s.sale_id,
                s.sale_date,
                p.name AS product_name,
                si.quantity_sold,
                si.price_at_sale,
                si.vat_at_sale,
                (si.price_at_sale * (1 + si.vat_at_sale) * si.quantity_sold) AS total_price_ttc,
                CONCAT(c.first_name, ' ', c.last_name) AS customer_name
            FROM Sales s
            JOIN Sale_Items si ON s.sale_id = si.sale_id
            JOIN Products p ON si.product_id = p.product_id
            LEFT JOIN Customers c ON s.customer_id = c.customer_id
            ORDER BY s.sale_date DESC, s.sale_id DESC
            LIMIT ?;
        `;

        const [historyData] = await db.query(sql, [limit]);
        res.status(200).json(historyData);

    } catch (error) {
        console.error('Error fetching sales history:', error);
        res.status(500).json({ message: 'Failed to fetch sales history.' });
    }
});

// =================================================================
// 报告相关的 API (加分项)
// =================================================================

app.get('/api/reports/sales', async (req, res) => {
    // 从查询参数获取日期范围, e.g., /api/reports/sales?start=2023-10-01&end=2023-10-31
    const { start, end } = req.query;

    if (!start || !end) {
        return res.status(400).json({ message: 'Please provide both start and end date query parameters.' });
    }

    try {
        const sql = `
            SELECT 
                s.sale_id,
                s.sale_date,
                p.name AS product_name,
                si.quantity_sold,
                si.price_at_sale,
                si.vat_at_sale,
                -- 计算单项含税总价
                (si.price_at_sale * (1 + si.vat_at_sale) * si.quantity_sold) AS total_price_ttc,
                CONCAT(c.first_name, ' ', c.last_name) AS customer_name
            FROM Sales s
            JOIN Sale_Items si ON s.sale_id = si.sale_id
            JOIN Products p ON si.product_id = p.product_id
            LEFT JOIN Customers c ON s.customer_id = c.customer_id
            WHERE DATE(s.sale_date) BETWEEN ? AND ?
            ORDER BY s.sale_date, s.sale_id;
        `;
        
        const [reportData] = await db.query(sql, [start, end]);
        
        // 计算总销售额
        const totalRevenue = reportData.reduce((sum, item) => sum + parseFloat(item.total_price_ttc), 0);

        res.status(200).json({
            reportData,
            summary: {
                startDate: start,
                endDate: end,
                totalRevenue: totalRevenue.toFixed(2)
            }
        });

    } catch (error) {
        console.error('Error generating sales report:', error);
        res.status(500).json({ message: 'Failed to generate sales report.' });
    }
});

// --- 启动服务器 ---
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});