// 全局配置，定义后端API的基地址
const API_BASE_URL = 'http://localhost:3000/api';

// 当整个页面加载完成后执行的函数
document.addEventListener('DOMContentLoaded', () => {
    // 初始化函数，用于获取初始数据并设置事件监听器
    initializeApp();
});

/**
 * 初始化应用
 */
function initializeApp() {
    // 获取所有必要的数据
    fetchProducts();
    fetchCustomers();
    
    // 设置表单提交的事件监听器
    setupEventListeners();
}

/**
 * 设置所有事件监听器
 */
function setupEventListeners() {
    // 添加产品表单
    document.getElementById('add-product-form').addEventListener('submit', handleAddProduct);
    
    // 添加客户表单
    document.getElementById('add-customer-form').addEventListener('submit', handleAddCustomer);
    
    // 添加到购物车按钮
    document.getElementById('add-to-cart-btn').addEventListener('click', handleAddToCart);

    // 提交销售表单
    document.getElementById('record-sale-form').addEventListener('submit', handleRecordSale);

    // 生成报告按钮
    document.getElementById('generate-report-btn').addEventListener('click', handleGenerateReport);
}


// =================================================================
// 1. 产品相关功能 (Fetch, Render, Add, Update Stock)
// =================================================================

/**
 * 从API获取产品列表并渲染到表格
 */
async function fetchProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/products`);
        if (!response.ok) throw new Error('Network response was not ok');
        const products = await response.json();
        
        renderProductTable(products);
        populateProductDropdown(products); // 更新销售区的下拉菜单
    } catch (error) {
        console.error('Error fetching products:', error);
        alert('无法加载产品数据，请检查后端服务是否运行。');
    }
}

/**
 * 将产品数据渲染到HTML表格中
 * @param {Array} products - 产品对象数组
 */
function renderProductTable(products) {
    const tableBody = document.getElementById('product-table-body');
    tableBody.innerHTML = ''; // 清空现有内容

    products.forEach(product => {
        const row = document.createElement('tr');
        // 如果库存低于10，添加一个'low-stock'类
        if (product.stock_quantity < 10) {
            row.classList.add('low-stock');
        }

        row.innerHTML = `
            <td>${product.name}</td>
            <td>€${parseFloat(product.unit_price_ht).toFixed(2)}</td>
            <td>${product.stock_quantity}</td>
            <td>
                <span class="stock-btn plus" data-id="${product.product_id}" data-change="1">+</span>
                <span class="stock-btn minus" data-id="${product.product_id}" data-change="-1">-</span>
            </td>
        `;
        tableBody.appendChild(row);
    });

    // 为新生成的库存按钮添加事件监听器
    document.querySelectorAll('.stock-btn').forEach(btn => {
        btn.addEventListener('click', handleUpdateStock);
    });
}

/**
 * 处理添加新产品的表单提交
 * @param {Event} event - 表单提交事件
 */
async function handleAddProduct(event) {
    event.preventDefault(); // 阻止表单默认的刷新页面行为
    
    const name = document.getElementById('new-product-name').value;
    const price = document.getElementById('new-product-price').value;
    const stock = document.getElementById('new-product-stock').value;

    const newProductData = {
        name: name,
        unit_price_ht: parseFloat(price),
        stock_quantity: parseInt(stock)
    };

    try {
        const response = await fetch(`${API_BASE_URL}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProductData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to add product');
        }

        // 成功后，重置表单并重新加载产品列表
        document.getElementById('add-product-form').reset();
        fetchProducts(); // 重新获取数据以更新UI
        alert('产品添加成功!');

    } catch (error) {
        console.error('Error adding product:', error);
        alert(`添加产品失败: ${error.message}`);
    }
}

/**
 * 处理库存更新按钮的点击
 * @param {Event} event - 点击事件
 */
async function handleUpdateStock(event) {
    const productId = event.target.dataset.id;
    let change = parseInt(event.target.dataset.change);

    // 按住Shift键可以快速调整10个
    if (event.shiftKey) {
        change *= 10;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/products/${productId}/stock`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ change })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update stock');
        }

        // 成功后，直接更新UI或重新获取列表
        fetchProducts(); 

    } catch (error) {
        console.error('Error updating stock:', error);
        alert(`库存更新失败: ${error.message}`);
    }
}

// =================================================================
// 2. 客户相关功能
// =================================================================

/**
 * 获取客户列表并渲染
 */
async function fetchCustomers() {
    try {
        const response = await fetch(`${API_BASE_URL}/customers`);
        if (!response.ok) throw new Error('Network response was not ok');
        const customers = await response.json();
        
        renderCustomerList(customers);
        populateCustomerDropdown(customers); // 更新销售区的客户下拉菜单
    } catch (error) {
        console.error('Error fetching customers:', error);
    }
}

/**
 * 渲染客户列表
 * @param {Array} customers 
 */
function renderCustomerList(customers) {
    const list = document.getElementById('customer-list');
    list.innerHTML = '';
    customers.forEach(customer => {
        const listItem = document.createElement('li');
        listItem.textContent = `${customer.last_name} ${customer.first_name} (${customer.gender})`;
        list.appendChild(listItem);
    });
}

/**
 * 处理添加新客户的表单
 * @param {Event} event 
 */
async function handleAddCustomer(event) {
    event.preventDefault();
    const firstName = document.getElementById('new-customer-firstname').value;
    const lastName = document.getElementById('new-customer-lastname').value;
    const gender = document.getElementById('new-customer-gender').value;

    try {
        const response = await fetch(`${API_BASE_URL}/customers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ first_name: firstName, last_name: lastName, gender: gender })
        });

        if (!response.ok) throw new Error('Failed to add customer');

        document.getElementById('add-customer-form').reset();
        fetchCustomers(); // 刷新客户列表和下拉菜单
        alert('客户添加成功!');
    } catch (error) {
        console.error('Error adding customer:', error);
        alert('添加客户失败。');
    }
}


// =================================================================
// 3. 销售相关功能
// =================================================================

// 购物车状态 (在内存中维护)
let cart = [];

/**
 * 填充销售区的产品下拉菜单
 * @param {Array} products 
 */
function populateProductDropdown(products) {
    const select = document.getElementById('sale-product');
    select.innerHTML = '';
    products
        .filter(p => p.stock_quantity > 0) // 只显示有库存的商品
        .forEach(product => {
            const option = document.createElement('option');
            option.value = product.product_id;
            option.textContent = `${product.name} (库存: ${product.stock_quantity})`;
            option.dataset.price = product.unit_price_ht;
            option.dataset.vat = product.vat_rate;
            select.appendChild(option);
        });
}

/**
 * 填充销售区的客户下拉菜单
 * @param {Array} customers 
 */
function populateCustomerDropdown(customers) {
    const select = document.getElementById('sale-customer');
    // 保留第一个“散客”选项
    select.innerHTML = '<option value="">— 散客 —</option>';
    customers.forEach(customer => {
        const option = document.createElement('option');
        option.value = customer.customer_id;
        option.textContent = `${customer.last_name} ${customer.first_name}`;
        select.appendChild(option);
    });
}

/**
 * 处理“添加到清单”按钮点击
 */
function handleAddToCart() {
    const productSelect = document.getElementById('sale-product');
    const quantityInput = document.getElementById('sale-quantity');

    const productId = parseInt(productSelect.value);
    const quantity = parseInt(quantityInput.value);
    const selectedOption = productSelect.options[productSelect.selectedIndex];
    const productName = selectedOption.textContent.split(' (')[0];
    const price = parseFloat(selectedOption.dataset.price);
    const vat = parseFloat(selectedOption.dataset.vat);

    if (!productId || quantity <= 0) {
        alert('请选择一个产品并输入有效的数量。');
        return;
    }

    // 检查购物车中是否已有该商品
    const existingItem = cart.find(item => item.product_id === productId);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ product_id: productId, name: productName, quantity, price, vat });
    }
    
    renderCart();
    updateTotalPrice();
}

/**
 * 渲染购物车列表
 */
function renderCart() {
    const cartList = document.getElementById('sale-cart');
    cartList.innerHTML = '';
    cart.forEach((item, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.name} x ${item.quantity}`;
        const removeBtn = document.createElement('span');
        removeBtn.textContent = ' ❌';
        removeBtn.className = 'remove-item';
        removeBtn.onclick = () => removeFromCart(index);
        listItem.appendChild(removeBtn);
        cartList.appendChild(listItem);
    });
}

/**
 * 从购物车中移除一项
 * @param {number} index 
 */
function removeFromCart(index) {
    cart.splice(index, 1);
    renderCart();
    updateTotalPrice();
}

/**
 * 更新显示的总价
 */
function updateTotalPrice() {
    const total = cart.reduce((sum, item) => {
        const itemTotal = item.price * (1 + item.vat) * item.quantity;
        return sum + itemTotal;
    }, 0);
    document.getElementById('total-price').textContent = `总计: €${total.toFixed(2)}`;
}

/**
 * 处理确认销售
 * @param {Event} event 
 */
async function handleRecordSale(event) {
    event.preventDefault();

    if (cart.length === 0) {
        alert('销售清单不能为空！');
        return;
    }

    const customerId = document.getElementById('sale-customer').value;

    const saleData = {
        customer_id: customerId ? parseInt(customerId) : null,
        items: cart.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity
        }))
    };

    try {
        const response = await fetch(`${API_BASE_URL}/sales`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(saleData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to record sale');
        }

        alert('销售成功记录！');
        // 重置销售区域
        cart = [];
        renderCart();
        updateTotalPrice();
        document.getElementById('record-sale-form').reset();
        
        // 刷新产品列表以更新库存
        fetchProducts();

    } catch (error) {
        console.error('Error recording sale:', error);
        alert(`销售失败: ${error.message}`);
    }
}


// =================================================================
// 4. 报告相关功能 (加分项)
// =================================================================

async function handleGenerateReport() {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;

    if (!startDate || !endDate) {
        alert('请选择开始和结束日期。');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/reports/sales?start=${startDate}&end=${endDate}`);
        if (!response.ok) throw new Error('Failed to fetch report');
        
        const result = await response.json();
        
        const resultDiv = document.getElementById('report-result');
        let reportHTML = `<h4>从 ${result.summary.startDate} 到 ${result.summary.endDate}</h4>`;
        reportHTML += `<p><strong>总销售额: €${result.summary.totalRevenue}</strong></p>`;
        
        if (result.reportData.length > 0) {
            reportHTML += '<ul>';
            result.reportData.forEach(item => {
                reportHTML += `<li>${item.sale_date.substring(0, 10)} - ${item.product_name} x ${item.quantity_sold} (售给: ${item.customer_name || '散客'})</li>`;
            });
            reportHTML += '</ul>';
        } else {
            reportHTML += '<p>该时间段内无销售记录。</p>';
        }
        
        resultDiv.innerHTML = reportHTML;

    } catch (error) {
        console.error('Error generating report:', error);
        alert('生成报告失败。');
    }
}