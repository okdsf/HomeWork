-- -- -- -- farm 作业初始化

CREATE DATABASE IF NOT EXISTS farm_store_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 使用该数据库
USE farm_store_db;

-- --- 表 1: Products (产品表) ---
DROP TABLE IF EXISTS Sale_Items;
DROP TABLE IF EXISTS Sales;
DROP TABLE IF EXISTS Products;
DROP TABLE IF EXISTS Customers;

CREATE TABLE Products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    unit_price_ht DECIMAL(10, 2) NOT NULL COMMENT '不含税单价',
    vat_rate DECIMAL(4, 3) NOT NULL DEFAULT 0.055 COMMENT '增值税率',
    stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0)
) ENGINE=InnoDB;

-- --- 表 2: Customers (忠实客户表) ---
CREATE TABLE Customers (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    gender ENUM('Male', 'Female') NOT NULL
) ENGINE=InnoDB;

-- --- 表 3: Sales (销售主表) ---
CREATE TABLE Sales (
    sale_id INT PRIMARY KEY AUTO_INCREMENT,
    sale_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    customer_id INT NULL COMMENT '外键, 可为空, 对应散客',
    -- 定义外键约束
    FOREIGN KEY (customer_id)
        REFERENCES Customers(customer_id)
        ON DELETE SET NULL -- 如果客户被删除, 历史订单保留但客户信息变为空
) ENGINE=InnoDB;

-- --- 表 4: Sale_Items (销售详情表) ---
CREATE TABLE Sale_Items (
    sale_item_id INT PRIMARY KEY AUTO_INCREMENT,
    sale_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity_sold INT NOT NULL CHECK (quantity_sold > 0),
    price_at_sale DECIMAL(10, 2) NOT NULL COMMENT '销售发生时的历史单价',
    vat_at_sale DECIMAL(4, 3) NOT NULL COMMENT '销售发生时的历史税率',
    -- 定义外键约束
    FOREIGN KEY (sale_id)
        REFERENCES Sales(sale_id)
        ON DELETE CASCADE, -- 如果一笔销售被删除, 其所有详情也应被删除
    FOREIGN KEY (product_id)
        REFERENCES Products(product_id)
        ON DELETE RESTRICT -- 如果一个产品在销售记录中存在, 则禁止删除该产品
) ENGINE=InnoDB;

-- --- 填充 Products 表 ---
-- 必须包含作业中提到的产品
INSERT INTO Products (name, unit_price_ht, stock_quantity) VALUES
('Comté', 25.50, 50),
('Reblochon', 12.00, 30),
('Raclette', 18.75, 40),
('Tomme de Savoie', 15.20, 35),
('Lait Frais (1L)', 1.50, 100),
('Yaourt Nature (x4)', 2.80, 80),
('Fromage Blanc (500g)', 3.50, 60),
('Saucisson Sec', 9.90, 70),
('Confiture de Fraises', 4.50, 90);

-- --- 填充 Customers 表 ---
INSERT INTO Customers (first_name, last_name, gender) VALUES
('Jean', 'Dupont', 'Male'),
('Marie', 'Curie', 'Female'),
('Pierre', 'Martin', 'Male');



INSERT INTO Sales (customer_id, sale_date) VALUES (1, '2025-12-26 10:30:00');
SET @last_sale_id = LAST_INSERT_ID(); 

INSERT INTO Sale_Items (sale_id, product_id, quantity_sold, price_at_sale, vat_at_sale) VALUES
(@last_sale_id, 1, 1, 25.50, 0.055), -- Comté
(@last_sale_id, 5, 2, 1.50, 0.055);  -- Lait Frais

INSERT INTO Sales (customer_id, sale_date) VALUES (NULL, '2025-12-26 11:15:00');
SET @last_sale_id = LAST_INSERT_ID();

INSERT INTO Sale_Items (sale_id, product_id, quantity_sold, price_at_sale, vat_at_sale) VALUES
(@last_sale_id, 2, 1, 12.00, 0.055), -- Reblochon
(@last_sale_id, 9, 1, 4.50, 0.055);  -- Confiture de Fraises


INSERT INTO Sales (customer_id, sale_date) VALUES (2, '2025-12-27 15:00:00');
SET @last_sale_id = LAST_INSERT_ID();

INSERT INTO Sale_Items (sale_id, product_id, quantity_sold, price_at_sale, vat_at_sale) VALUES
(@last_sale_id, 3, 2, 18.75, 0.055), -- Raclette
(@last_sale_id, 6, 3, 2.80, 0.055),  -- Yaourt Nature
(@last_sale_id, 7, 1, 3.50, 0.055);  -- Fromage Blanc