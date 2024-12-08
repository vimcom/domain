// 获取当前日期的函数
function getCurrentDate() {
    const currentDate = new Date();
    return currentDate;
}

// 处理中文日期格式并将其转换为可解析的日期格式
function parseChineseDate(dateStr) {
    const regex = /(\d{4})\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})\s*日/;
    const match = dateStr.match(regex);
    if (match) {
        const year = match[1];
        const month = match[2].padStart(2, '0'); 
        const day = match[3].padStart(2, '0'); 
        return `${year}-${month}-${day}`; 
    }
    return dateStr; 
}

// 格式化日期为中文格式 "YYYY 年 M 月 D 日"
function formatDateToChinese(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year} 年 ${month} 月 ${day} 日`;
}

// 获取注册商链接
function getRegistrarLink(registrar) {
    const links = {
        "nic.ua": "https://nic.ua/",
        "nic.us.kg": "https://nic.us.kg/",
        "spaceship": "https://www.spaceship.com/",
        "GoDaddy": "https://www.godaddy.com",
        "Namecheap": "https://www.namecheap.com",
    };

    return links[registrar] || "#"; // 默认返回 "#" 如果没有匹配
}

// 获取当前日期并更新页面
document.addEventListener('DOMContentLoaded', function () {
    const currentDate = getCurrentDate();
    const year = currentDate.getFullYear();
    const formattedDate = `${year}`;
    document.getElementById('date').textContent = formattedDate;
});

// 模拟从 /data/domains.json 获取数据
fetch('/domains.json')
    .then(response => response.json())
    .then(domains => {
        const tableBody = document.querySelector("table tbody");

        // 清空表格内容
        tableBody.innerHTML = "";

        domains.forEach(domainData => {
            const currentDate = getCurrentDate();
            const expiryDateStr = parseChineseDate(domainData.expiryDate);
            const expiryDate = new Date(expiryDateStr); 
            const daysLeft = Math.floor((expiryDate - currentDate) / (1000 * 60 * 60 * 24));

            // 创建表格行
            const row = document.createElement("tr");

            // 定义域名的类
            let domainClass = '';
            if (daysLeft <= 0) {
                domainClass = 'expired'; 
            } else if (daysLeft <= 90) {
                domainClass = 'soon-to-expire'; 
            } else {
                domainClass = 'normal'; 
            }

            // 创建域名链接
            const domainLink = document.createElement("a");
            domainLink.href = `http://${domainData.domain}`;
            domainLink.classList.add('domain', domainClass);
            domainLink.target = "_blank";
            domainLink.textContent = domainData.domain;

            // 创建表格单元格
            const domainCell = createTableCell(domainLink); 
            const expiryCell = createTableCell(formatDateToChinese(expiryDate)); 
            const registrarCell = createRegistrarCell(domainData.registrar);
            const feeCell = createTableCell(domainData.renewalFee);
            const remarksCell = createTableCell(domainData.remarks);
            
            //const saleCell = document.createElement("td");
            //saleCell.textContent = domainData.isForSale ? "是" : "否";  根据isForSale属性显示

            // 将各个单元格添加到表格行
            row.appendChild(domainCell);
            row.appendChild(expiryCell);
            row.appendChild(registrarCell);
            row.appendChild(feeCell);
            row.appendChild(remarksCell);
            // row.appendChild(saleCell);  将是否交易单元格添加到行

            // 将行添加到表格中
            tableBody.appendChild(row);
        });
    })
    .catch(error => {
        console.error("加载域名数据失败", error);
        alert("加载域名数据失败，请稍后再试！");
    });

// 创建表格单元格的函数
function createTableCell(content) {
    const cell = document.createElement("td");
    if (content instanceof Node) {
        cell.appendChild(content); 
    } else {
        cell.textContent = content; 
    }
    return cell;
}

// 创建注册商单元格并添加链接的函数
function createRegistrarCell(registrar) {
    const cell = document.createElement("td");
    cell.classList.add('registrar');
    const registrarLink = document.createElement("a");
    registrarLink.href = getRegistrarLink(registrar);
    registrarLink.target = "_blank";
    registrarLink.textContent = registrar;
    cell.appendChild(registrarLink);
    return cell;
}
