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
    return dateStr; // 如果不是中文日期，直接返回原字符串
}

// 格式化日期为中文格式 "YYYY 年 M 月 D 日"
function formatDateToChinese(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year} 年 ${month} 月 ${day} 日`;
}

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
function createRegistrarCell(registrar, registrarLinks) {
    const cell = document.createElement("td");

    // 获取对应的注册商链接，如果没有匹配的则返回 "#"
    const registrarLink = registrarLinks[registrar] || "#";

    const linkElement = document.createElement("a");
    linkElement.href = registrarLink; // 设置链接地址
    linkElement.target = "_blank";     // 在新窗口中打开链接
    linkElement.textContent = registrar; // 设置链接文本为注册商名称

    // 将链接添加到单元格中
    cell.appendChild(linkElement);

    // 为 <td> 元素添加 'registrar' 类名，以便在 CSS 中应用相应的样式
    cell.classList.add('registrar');
    return cell;
}

// 获取当前日期并更新页面
document.addEventListener('DOMContentLoaded', function () {
    const currentDate = getCurrentDate();
    const year = currentDate.getFullYear();
    const formattedDate = `${year}`;
    document.getElementById('date').textContent = formattedDate;
});

// 从 JSON 获取数据并渲染表格
fetch('/domains.json')
    .then(response => response.json())
    .then(data => {
        const registrarLinks = data.registrarLinks;  // 获取注册商链接
        const domains = data.domains;  // 获取域名数据

        const tableBody = document.querySelector("table tbody");
        
        // 清空表格内容
        tableBody.innerHTML = "";

        domains.forEach(domainData => {
            const currentDate = getCurrentDate();
            
            // 判断日期格式并解析
            let expiryDateStr = domainData.expiryDate;
            if (expiryDateStr.includes("年")) {
                expiryDateStr = parseChineseDate(expiryDateStr);  // 如果是中文日期，解析
            }
            const expiryDate = new Date(expiryDateStr);  // 转换为Date对象
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
            const registrarCell = createRegistrarCell(domainData.registrar, registrarLinks);
            const feeCell = createTableCell(domainData.renewalFee);
            const salePriceCell = createTableCell(domainData.salePrice || "null"); // 添加 "未出售"
            const remarksCell = createTableCell(domainData.remarks);

            // 将各个单元格添加到表格行
            row.appendChild(domainCell);
            row.appendChild(expiryCell);
            row.appendChild(registrarCell);
            row.appendChild(feeCell);
            row.appendChild(salePriceCell);
            row.appendChild(remarksCell);

            // 将行添加到表格中
            tableBody.appendChild(row);
        });
    })
    .catch(error => {
        console.error("加载域名数据失败", error);
        alert("加载域名数据失败，请稍后再试！");
    });
