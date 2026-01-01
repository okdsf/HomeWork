// ================================================================
// 全局变量和配置
// ================================================================

// 全局配置
const API_BASE_URL = 'http://localhost:3000/api';

// 购物车状态
let cart = [];

// 全局数据缓存
let productsData = [];
let customersData = [];

// 当前语言状态
let currentLang = 'en';

// Flatpickr 实例
let startDatePicker = null;
let endDatePicker = null;

// ================================================================
// 国际化字典
// ================================================================

const translations = {
    en: {
        // Header
        "header.title": "Farm Store Dashboard",
        
        // Product Management
        "product_management.title": "🗂️ Products & Stock Management",
        "product_table.headers.name": "Product Name",
        "product_table.headers.price": "Price (HT)",
        "product_table.headers.stock": "Stock",
        "product_table.headers.actions": "Actions",
        "product_management.add_section.summary": "► Click to add a new product",
        "product_management.form.name_placeholder": "Product Name",
        "product_management.form.price_placeholder": "Price (HT)",
        "product_management.form.stock_placeholder": "Initial Stock",
        "product_management.form.submit_button": "Confirm Add",
        
        // Customer Management
        "customer_management.title": "👥 Loyal Customer Management",
        "customer_management.edit_title": "Edit Customer",
        "customer_management.form.firstname_placeholder": "First Name",
        "customer_management.form.lastname_placeholder": "Last Name",
        "customer_management.gender.male": "Male",
        "customer_management.gender.female": "Female",
        "customer_management.form.submit_button": "Add Customer",
        "customer_management.form.save_button": "Save Changes",
        "tooltip.edit_customer": "Edit",
        "alert.customer_update_success": "Customer updated successfully!",
        "alert.customer_update_fail": "Failed to update customer: ",
        
        // Sales Entry
        "sales_entry.title": "🛒 Record a Sale",
        "sales_entry.form.product_label": "Product:",
        "sales_entry.form.quantity_label": "Quantity:",
        "sales_entry.form.add_to_cart_button": "Add to List",
        "sales_entry.cart_title": "Current Sale List",
        "sales_entry.form.customer_label": "Customer (Optional):",
        "sales_entry.form.walk_in_customer": "— Walk-in Customer —",
        "sales_entry.total_price": "Total: €0.00",
        "sales_entry.form.confirm_sale_button": "✓ Confirm Sale",
        
        // Sales Report
        "sales_report.title": "📊 Sales Snapshot",
        "sales_report.form.start_date_label": "Start Date:",
        "sales_report.form.end_date_label": "End Date:",
        "sales_report.form.generate_button": "Query",
        
        // Alerts and Messages
        "alert.product_load_fail": "Could not load product data. Please check if the backend is running.",
        "alert.product_add_success": "Product added successfully!",
        "alert.product_add_fail": "Failed to add product: ",
        "alert.stock_update_fail": "Failed to update stock: ",
        "alert.customer_load_fail": "Could not load customer data.",
        "alert.customer_add_success": "Customer added successfully!",
        "alert.customer_add_fail": "Failed to add customer: ",
        "alert.invalid_quantity": "Please select a product and enter a valid quantity.",
        "alert.cart_empty": "Sale list cannot be empty!",
        "alert.sale_success": "Sale recorded successfully!",
        "alert.sale_fail": "Failed to record sale: ",
        "alert.select_dates": "Please select a start and end date.",
        "alert.report_fail": "Failed to generate report.",
        "alert.no_products": "No products available for sale.",
        "alert.server_error": "Server error. Please try again.",
        
        // Empty States
        "empty.product_table": "No products available",
        "empty.customer_list": "No customers found",
        "empty.cart": "Cart is empty",
        
        // Tooltips
        "tooltip.increase_stock": "Increase stock",
        "tooltip.decrease_stock": "Decrease stock",
        "tooltip.remove_item": "Remove",
        
        // Report
        "report.period": "From {start} to {end}",
        "report.total_revenue": "Total Revenue: €{amount}",
        "report.sale_item": "{date} - {product} x {quantity} (Sold to: {customer})",
        "report.no_sales": "No sales records for this period.",

        // Sales History
        "sales_history.title": "📜 Recent Sales History",
        "sales_history.empty": "No sales records yet.",
        "sales_history.item": "{date} | {product} x {quantity} | €{price} | {customer}"
    },
    zh: {
        // Header
        "header.title": "农场商店管理系统",
        
        // Product Management
        "product_management.title": "🗂️ 产品与库存管理",
        "product_table.headers.name": "产品名称",
        "product_table.headers.price": "单价 (HT)",
        "product_table.headers.stock": "库存",
        "product_table.headers.actions": "操作",
        "product_management.add_section.summary": "► 点击添加新产品",
        "product_management.form.name_placeholder": "产品名称",
        "product_management.form.price_placeholder": "单价(HT)",
        "product_management.form.stock_placeholder": "初始库存",
        "product_management.form.submit_button": "确认添加",
        
        // Customer Management
        "customer_management.title": "👥 忠实客户管理",
        "customer_management.edit_title": "编辑客户",
        "customer_management.form.firstname_placeholder": "名",
        "customer_management.form.lastname_placeholder": "姓",
        "customer_management.gender.male": "男",
        "customer_management.gender.female": "女",
        "customer_management.form.submit_button": "添加客户",
        "customer_management.form.save_button": "保存修改",
        "tooltip.edit_customer": "编辑",
        "alert.customer_update_success": "客户信息更新成功!",
        "alert.customer_update_fail": "更新客户失败: ",
        
        // Sales Entry
        "sales_entry.title": "🛒 销售录入",
        "sales_entry.form.product_label": "产品:",
        "sales_entry.form.quantity_label": "数量:",
        "sales_entry.form.add_to_cart_button": "添加到清单",
        "sales_entry.cart_title": "本次销售清单",
        "sales_entry.form.customer_label": "客户 (可选):",
        "sales_entry.form.walk_in_customer": "— 散客 —",
        "sales_entry.total_price": "总计: €0.00",
        "sales_entry.form.confirm_sale_button": "✓ 确认销售",
        
        // Sales Report
        "sales_report.title": "📊 销售业绩速览",
        "sales_report.form.start_date_label": "开始日期:",
        "sales_report.form.end_date_label": "结束日期:",
        "sales_report.form.generate_button": "查询",
        
        // Alerts and Messages
        "alert.product_load_fail": "无法加载产品数据，请检查后端服务是否运行。",
        "alert.product_add_success": "产品添加成功!",
        "alert.product_add_fail": "添加产品失败: ",
        "alert.stock_update_fail": "库存更新失败: ",
        "alert.customer_load_fail": "无法加载客户数据。",
        "alert.customer_add_success": "客户添加成功!",
        "alert.customer_add_fail": "添加客户失败: ",
        "alert.invalid_quantity": "请选择一个产品并输入有效的数量。",
        "alert.cart_empty": "销售清单不能为空!",
        "alert.sale_success": "销售成功记录!",
        "alert.sale_fail": "销售失败: ",
        "alert.select_dates": "请选择开始和结束日期。",
        "alert.report_fail": "生成报告失败。",
        "alert.no_products": "没有可销售的产品。",
        "alert.server_error": "服务器错误，请重试。",
        
        // Empty States
        "empty.product_table": "暂无产品数据",
        "empty.customer_list": "暂无客户数据",
        "empty.cart": "清单为空",
        
        // Tooltips
        "tooltip.increase_stock": "增加库存",
        "tooltip.decrease_stock": "减少库存",
        "tooltip.remove_item": "移除",
        
        // Report
        "report.period": "从 {start} 到 {end}",
        "report.total_revenue": "总销售额: €{amount}",
        "report.sale_item": "{date} - {product} x {quantity} (售给: {customer})",
        "report.no_sales": "该时间段内无销售记录。",

        // Sales History
        "sales_history.title": "📜 最近销售记录",
        "sales_history.empty": "暂无销售记录。",
        "sales_history.item": "{date} | {product} x {quantity} | €{price} | {customer}"
    }
};

// ================================================================
// 国际化功能
// ================================================================

/**
 * 设置界面语言
 * @param {string} lang - 语言代码 (如 'en', 'zh')
 */
function setLanguage(lang) {
    const langDict = translations[lang];
    if (!langDict) {
        console.error(`Language '${lang}' not found.`);
        return;
    }

    currentLang = lang;
    
    // 更新语言按钮状态
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`lang-${lang}`).classList.add('active');
    
    // 更新html lang属性
    document.documentElement.lang = lang;
    
    // 更新所有带有data-i18n-key属性的元素
    document.querySelectorAll('[data-i18n-key]').forEach(element => {
        const key = element.getAttribute('data-i18n-key');
        if (langDict[key]) {
            element.textContent = langDict[key];
        }
    });
    
    // 更新所有带有data-i18n-placeholder属性的元素
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        if (langDict[key]) {
            element.placeholder = langDict[key];
        }
    });
    
    // 特殊处理：更新总计显示
    updateTotalPrice();

    // 更新散客选项
    updateWalkInCustomerOption();

    // 更新动态内容
    updateDynamicContent();

    // 更新日期选择器语言
    updateDatePickersLocale();
}

/**
 * 显示本地化的提示消息
 * @param {string} key - 翻译键
 * @param {string} additionalInfo - 附加信息
 */
function showLocalizedAlert(key, additionalInfo = '') {
    const message = translations[currentLang][key] || key;
    alert(message + (additionalInfo ? additionalInfo : ''));
}

/**
 * 获取本地化文本
 * @param {string} key - 翻译键
 * @param {Object} params - 参数对象
 * @returns {string} 本地化文本
 */
function getLocalizedText(key, params = {}) {
    let text = translations[currentLang][key] || key;
    
    // 替换参数
    Object.keys(params).forEach(param => {
        text = text.replace(new RegExp(`{${param}}`, 'g'), params[param]);
    });
    
    return text;
}

/**
 * 初始化 Flatpickr 日期选择器
 */
function initializeDatePickers() {
    const locale = currentLang === 'zh' ? 'zh' : 'default';

    const config = {
        locale: locale,
        dateFormat: 'Y-m-d',
        allowInput: true
    };

    // 初始化开始日期选择器
    if (startDatePicker) {
        startDatePicker.destroy();
    }
    startDatePicker = flatpickr('#start-date', config);

    // 初始化结束日期选择器
    if (endDatePicker) {
        endDatePicker.destroy();
    }
    endDatePicker = flatpickr('#end-date', config);
}

/**
 * 更新 Flatpickr 日期选择器的语言
 */
function updateDatePickersLocale() {
    const locale = currentLang === 'zh' ? 'zh' : 'default';

    if (startDatePicker) {
        startDatePicker.destroy();
        startDatePicker = flatpickr('#start-date', {
            locale: locale,
            dateFormat: 'Y-m-d',
            allowInput: true
        });
    }

    if (endDatePicker) {
        endDatePicker.destroy();
        endDatePicker = flatpickr('#end-date', {
            locale: locale,
            dateFormat: 'Y-m-d',
            allowInput: true
        });
    }
}

/**
 * 更新散客选项
 */
function updateWalkInCustomerOption() {
    const walkInOption = document.querySelector('#sale-customer option[value=""]');
    if (walkInOption) {
        walkInOption.textContent = getLocalizedText('sales_entry.form.walk_in_customer');
    }
}

/**
 * 更新动态内容
 */
function updateDynamicContent() {
    // 如果已有数据，重新渲染相关组件
    if (productsData.length > 0) {
        renderProductTable(productsData);
        populateProductDropdown(productsData);
    } else {
        // 显示空状态
        const tableBody = document.getElementById('product-table-body');
        if (tableBody.children.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="4" class="empty-state">
                        ${getLocalizedText('empty.product_table')}
                    </td>
                </tr>
            `;
        }
    }
    
    if (customersData.length > 0) {
        renderCustomerList(customersData);
        populateCustomerDropdown(customersData);
    }
    
    // 更新购物车
    renderCart();
}

// ================================================================
// 应用初始化
// ================================================================

// 当整个页面加载完成后执行的函数
document.addEventListener('DOMContentLoaded', () => {
    // 初始化语言切换按钮事件
    document.getElementById('lang-en').addEventListener('click', () => setLanguage('en'));
    document.getElementById('lang-zh').addEventListener('click', () => setLanguage('zh'));
    
    // 初始化应用
    initializeApp();
});

/**
 * 初始化应用
 */
function initializeApp() {
    // 初始化日期选择器
    initializeDatePickers();

    // 设置语言（默认英语）
    setLanguage('en');

    // 获取所有必要的数据
    fetchProducts();
    fetchCustomers();
    fetchSalesHistory();

    // 设置表单提交的事件监听器
    setupEventListeners();
}

/**
 * 设置所有事件监听器
 */
function setupEventListeners() {
    // 添加产品表单
    const addProductForm = document.getElementById('add-product-form');
    if (addProductForm) {
        addProductForm.addEventListener('submit', handleAddProduct);
    }

    // 添加客户表单
    const addCustomerForm = document.getElementById('add-customer-form');
    if (addCustomerForm) {
        addCustomerForm.addEventListener('submit', handleAddCustomer);
    }

    // 编辑客户表单
    const editCustomerForm = document.getElementById('edit-customer-form');
    if (editCustomerForm) {
        editCustomerForm.addEventListener('submit', handleEditCustomer);
    }

    // 关闭编辑客户模态框
    const closeEditModal = document.getElementById('close-edit-modal');
    if (closeEditModal) {
        closeEditModal.addEventListener('click', closeEditCustomerModal);
    }

    // 点击模态框外部关闭
    const editModal = document.getElementById('edit-customer-modal');
    if (editModal) {
        editModal.addEventListener('click', (e) => {
            if (e.target === editModal) {
                closeEditCustomerModal();
            }
        });
    }

    // 添加到购物车按钮
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', handleAddToCart);
    }

    // 提交销售表单
    const recordSaleForm = document.getElementById('record-sale-form');
    if (recordSaleForm) {
        recordSaleForm.addEventListener('submit', handleRecordSale);
    }

    // 生成报告按钮
    const generateReportBtn = document.getElementById('generate-report-btn');
    if (generateReportBtn) {
        generateReportBtn.addEventListener('click', handleGenerateReport);
    }
}

// ================================================================
// 产品相关功能
// ================================================================

/**
 * 从API获取产品列表并渲染到表格
 */
async function fetchProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/products`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const products = await response.json();
        
        productsData = products;
        renderProductTable(products);
        populateProductDropdown(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        showLocalizedAlert('alert.product_load_fail');
    }
}

/**
 * 将产品数据渲染到HTML表格中
 * @param {Array} products - 产品对象数组
 */
function renderProductTable(products) {
    const tableBody = document.getElementById('product-table-body');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';

    if (products.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="4" class="empty-state">
                    ${getLocalizedText('empty.product_table')}
                </td>
            </tr>
        `;
        return;
    }

    products.forEach(product => {
        const row = document.createElement('tr');
        if (product.stock_quantity < 10) {
            row.classList.add('low-stock');
        }

        row.innerHTML = `
            <td>${product.name}</td>
            <td>€${parseFloat(product.unit_price_ht).toFixed(2)}</td>
            <td>${product.stock_quantity}</td>
            <td>
                <span class="stock-btn plus" 
                      data-id="${product.product_id}" 
                      data-change="1"
                      title="${getLocalizedText('tooltip.increase_stock')}">+</span>
                <span class="stock-btn minus" 
                      data-id="${product.product_id}" 
                      data-change="-1"
                      title="${getLocalizedText('tooltip.decrease_stock')}">-</span>
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
    event.preventDefault();
    
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
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(newProductData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to add product');
        }

        // 成功后，重置表单并重新加载产品列表
        document.getElementById('add-product-form').reset();
        fetchProducts();
        showLocalizedAlert('alert.product_add_success');

    } catch (error) {
        console.error('Error adding product:', error);
        showLocalizedAlert('alert.product_add_fail', error.message);
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
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
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
        showLocalizedAlert('alert.stock_update_fail', error.message);
    }
}

/**
 * 填充销售区的产品下拉菜单
 * @param {Array} products 
 */
function populateProductDropdown(products) {
    const select = document.getElementById('sale-product');
    if (!select) return;
    
    select.innerHTML = '';
    
    const filteredProducts = products.filter(p => p.stock_quantity > 0);
    
    if (filteredProducts.length === 0) {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = getLocalizedText('alert.no_products');
        select.appendChild(option);
        select.disabled = true;
        return;
    }
    
    select.disabled = false;
    filteredProducts.forEach(product => {
        const option = document.createElement('option');
        option.value = product.product_id;
        const stockText = currentLang === 'zh' ? '库存' : 'Stock';
        option.textContent = `${product.name} (${stockText}: ${product.stock_quantity})`;
        option.dataset.price = product.unit_price_ht;
        option.dataset.vat = product.vat_rate || 0.2; // 默认20%的增值税
        select.appendChild(option);
    });
}

// ================================================================
// 客户相关功能
// ================================================================

/**
 * 获取客户列表并渲染
 */
async function fetchCustomers() {
    try {
        const response = await fetch(`${API_BASE_URL}/customers`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const customers = await response.json();
        
        customersData = customers;
        renderCustomerList(customers);
        populateCustomerDropdown(customers);
    } catch (error) {
        console.error('Error fetching customers:', error);
        showLocalizedAlert('alert.customer_load_fail');
    }
}

/**
 * 渲染客户列表
 * @param {Array} customers 
 */
function renderCustomerList(customers) {
    const list = document.getElementById('customer-list');
    if (!list) return;

    list.innerHTML = '';

    if (customers.length === 0) {
        list.innerHTML = `
            <li class="empty-state">
                ${getLocalizedText('empty.customer_list')}
            </li>
        `;
        return;
    }

    customers.forEach(customer => {
        const listItem = document.createElement('li');
        let genderDisplay = '';

        if (currentLang === 'zh') {
            genderDisplay = customer.gender === 'Male' ? '男' : '女';
        } else {
            genderDisplay = customer.gender;
        }

        // 创建客户信息文本
        const customerInfo = document.createElement('span');
        customerInfo.textContent = `${customer.last_name} ${customer.first_name} (${genderDisplay})`;
        listItem.appendChild(customerInfo);

        // 创建编辑按钮
        const editBtn = document.createElement('button');
        editBtn.className = 'edit-customer-btn';
        editBtn.textContent = getLocalizedText('tooltip.edit_customer');
        editBtn.dataset.customerId = customer.customer_id;
        editBtn.dataset.firstName = customer.first_name;
        editBtn.dataset.lastName = customer.last_name;
        editBtn.dataset.gender = customer.gender;
        editBtn.addEventListener('click', openEditCustomerModal);
        listItem.appendChild(editBtn);

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

    const customerData = {
        first_name: firstName,
        last_name: lastName,
        gender: gender
    };

    try {
        const response = await fetch(`${API_BASE_URL}/customers`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(customerData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to add customer');
        }

        document.getElementById('add-customer-form').reset();
        fetchCustomers();
        showLocalizedAlert('alert.customer_add_success');
    } catch (error) {
        console.error('Error adding customer:', error);
        showLocalizedAlert('alert.customer_add_fail', error.message);
    }
}

/**
 * 打开编辑客户的模态框
 * @param {Event} event - 点击事件
 */
function openEditCustomerModal(event) {
    const btn = event.target;
    const modal = document.getElementById('edit-customer-modal');

    // 填充表单数据
    document.getElementById('edit-customer-id').value = btn.dataset.customerId;
    document.getElementById('edit-customer-firstname').value = btn.dataset.firstName;
    document.getElementById('edit-customer-lastname').value = btn.dataset.lastName;
    document.getElementById('edit-customer-gender').value = btn.dataset.gender;

    // 显示模态框
    modal.classList.add('show');
}

/**
 * 关闭编辑客户的模态框
 */
function closeEditCustomerModal() {
    const modal = document.getElementById('edit-customer-modal');
    modal.classList.remove('show');
    document.getElementById('edit-customer-form').reset();
}

/**
 * 处理编辑客户的表单提交
 * @param {Event} event - 表单提交事件
 */
async function handleEditCustomer(event) {
    event.preventDefault();

    const customerId = document.getElementById('edit-customer-id').value;
    const firstName = document.getElementById('edit-customer-firstname').value;
    const lastName = document.getElementById('edit-customer-lastname').value;
    const gender = document.getElementById('edit-customer-gender').value;

    const customerData = {
        first_name: firstName,
        last_name: lastName,
        gender: gender
    };

    try {
        const response = await fetch(`${API_BASE_URL}/customers/${customerId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(customerData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update customer');
        }

        closeEditCustomerModal();
        fetchCustomers();
        showLocalizedAlert('alert.customer_update_success');
    } catch (error) {
        console.error('Error updating customer:', error);
        showLocalizedAlert('alert.customer_update_fail', error.message);
    }
}

/**
 * 填充销售区的客户下拉菜单
 * @param {Array} customers 
 */
function populateCustomerDropdown(customers) {
    const select = document.getElementById('sale-customer');
    if (!select) return;
    
    select.innerHTML = '';
    
    // 添加散客选项
    const walkInOption = document.createElement('option');
    walkInOption.value = '';
    walkInOption.textContent = getLocalizedText('sales_entry.form.walk_in_customer');
    select.appendChild(walkInOption);
    
    // 添加客户选项
    customers.forEach(customer => {
        const option = document.createElement('option');
        option.value = customer.customer_id;
        option.textContent = `${customer.last_name} ${customer.first_name}`;
        select.appendChild(option);
    });
}

// ================================================================
// 销售相关功能
// ================================================================

/**
 * 处理"添加到清单"按钮点击
 */
function handleAddToCart() {
    const productSelect = document.getElementById('sale-product');
    const quantityInput = document.getElementById('sale-quantity');

    const productId = parseInt(productSelect.value);
    const quantity = parseInt(quantityInput.value);
    
    if (!productId || quantity <= 0 || productSelect.disabled) {
        showLocalizedAlert('alert.invalid_quantity');
        return;
    }

    const selectedOption = productSelect.options[productSelect.selectedIndex];
    const productName = selectedOption.textContent.split(' (')[0];
    const price = parseFloat(selectedOption.dataset.price);
    const vat = parseFloat(selectedOption.dataset.vat);

    // 检查购物车中是否已有该商品
    const existingItem = cart.find(item => item.product_id === productId);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ 
            product_id: productId, 
            name: productName, 
            quantity, 
            price, 
            vat 
        });
    }
    
    renderCart();
    updateTotalPrice();
}

/**
 * 渲染购物车列表
 */
function renderCart() {
    const cartList = document.getElementById('sale-cart');
    if (!cartList) return;
    
    cartList.innerHTML = '';
    
    if (cart.length === 0) {
        const emptyItem = document.createElement('li');
        emptyItem.textContent = getLocalizedText('empty.cart');
        emptyItem.classList.add('empty-state');
        cartList.appendChild(emptyItem);
        return;
    }
    
    cart.forEach((item, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.name} x ${item.quantity}`;
        const removeBtn = document.createElement('span');
        removeBtn.textContent = ' ❌';
        removeBtn.className = 'remove-item';
        removeBtn.title = getLocalizedText('tooltip.remove_item');
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
    const totalElement = document.getElementById('total-price');
    if (!totalElement) return;
    
    const total = cart.reduce((sum, item) => {
        const itemTotal = item.price * (1 + item.vat) * item.quantity;
        return sum + itemTotal;
    }, 0);
    
    const totalText = getLocalizedText('sales_entry.total_price');
    totalElement.textContent = totalText.replace('€0.00', `€${total.toFixed(2)}`);
}

/**
 * 处理确认销售
 * @param {Event} event 
 */
async function handleRecordSale(event) {
    event.preventDefault();

    if (cart.length === 0) {
        showLocalizedAlert('alert.cart_empty');
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
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(saleData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to record sale');
        }

        showLocalizedAlert('alert.sale_success');

        // 重置销售区域
        cart = [];
        renderCart();
        updateTotalPrice();
        document.getElementById('record-sale-form').reset();

        // 刷新产品列表以更新库存
        fetchProducts();
        fetchCustomers();
        fetchSalesHistory(); // 刷新销售历史

    } catch (error) {
        console.error('Error recording sale:', error);
        showLocalizedAlert('alert.sale_fail', error.message);
    }
}

// ================================================================
// 报告相关功能
// ================================================================

/**
 * 处理生成报告
 */
async function handleGenerateReport() {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;

    if (!startDate || !endDate) {
        showLocalizedAlert('alert.select_dates');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/reports/sales?start=${startDate}&end=${endDate}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        displayReportResult(result, startDate, endDate);

    } catch (error) {
        console.error('Error generating report:', error);
        showLocalizedAlert('alert.report_fail');
    }
}

/**
 * 显示报告结果
 * @param {Object} result - 报告数据
 * @param {string} startDate - 开始日期
 * @param {string} endDate - 结束日期
 */
function displayReportResult(result, startDate, endDate) {
    const resultDiv = document.getElementById('report-result');
    if (!resultDiv) return;
    
    let reportHTML = '';
    
    if (result.reportData && result.reportData.length > 0) {
        // 格式化日期
        const formattedStartDate = new Date(startDate).toLocaleDateString();
        const formattedEndDate = new Date(endDate).toLocaleDateString();
        
        // 报告标题和摘要
        reportHTML += `
            <h4>${getLocalizedText('report.period', { 
                start: formattedStartDate, 
                end: formattedEndDate 
            })}</h4>
            <p><strong>${getLocalizedText('report.total_revenue', { 
                amount: result.summary?.totalRevenue || '0.00' 
            })}</strong></p>
        `;
        
        // 销售详情列表
        reportHTML += '<ul>';
        result.reportData.forEach(item => {
            const date = new Date(item.sale_date).toLocaleDateString();
            const customer = item.customer_name || getLocalizedText('sales_entry.form.walk_in_customer');
            
            reportHTML += `
                <li>${getLocalizedText('report.sale_item', {
                    date: date,
                    product: item.product_name,
                    quantity: item.quantity_sold,
                    customer: customer
                })}</li>
            `;
        });
        reportHTML += '</ul>';
    } else {
        reportHTML = `<p>${getLocalizedText('report.no_sales')}</p>`;
    }
    
    resultDiv.innerHTML = reportHTML;
}

// ================================================================
// 销售历史功能
// ================================================================

/**
 * 从API获取销售历史
 */
async function fetchSalesHistory() {
    try {
        const response = await fetch(`${API_BASE_URL}/sales/history?limit=15`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const historyData = await response.json();
        renderSalesHistory(historyData);
    } catch (error) {
        console.error('Error fetching sales history:', error);
        // 静默失败，不显示警告
    }
}

/**
 * 渲染销售历史列表
 * @param {Array} historyData - 销售历史数据
 */
function renderSalesHistory(historyData) {
    const listDiv = document.getElementById('sales-history-list');
    if (!listDiv) return;

    if (!historyData || historyData.length === 0) {
        listDiv.innerHTML = `<p class="empty-state">${getLocalizedText('sales_history.empty')}</p>`;
        return;
    }

    let html = '<ul class="sales-history-ul">';
    historyData.forEach(item => {
        const date = new Date(item.sale_date).toLocaleDateString();
        const customer = item.customer_name || getLocalizedText('sales_entry.form.walk_in_customer');
        const price = parseFloat(item.total_price_ttc).toFixed(2);

        html += `
            <li>
                <span class="history-date">${date}</span>
                <span class="history-product">${item.product_name} x ${item.quantity_sold}</span>
                <span class="history-price">€${price}</span>
                <span class="history-customer">${customer}</span>
            </li>
        `;
    });
    html += '</ul>';

    listDiv.innerHTML = html;
}

// ================================================================
// 实用函数
// ================================================================

/**
 * 格式化货币
 * @param {number} amount - 金额
 * @param {string} currency - 货币代码
 * @returns {string} 格式化后的货币字符串
 */
function formatCurrency(amount, currency = 'EUR') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).format(amount);
}

/**
 * 格式化日期
 * @param {string} dateString - 日期字符串
 * @returns {string} 格式化后的日期
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

/**
 * 处理API错误
 * @param {Error} error - 错误对象
 * @returns {string} 用户友好的错误信息
 */
function handleApiError(error) {
    if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
        return getLocalizedText('alert.server_error');
    }
    return error.message;
}