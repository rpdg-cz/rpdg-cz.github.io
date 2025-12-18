const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const BASE_DIR = __dirname;

// 创建HTTP服务器
const server = http.createServer((req, res) => {
    // 确定请求的文件路径
    let filePath = path.join(BASE_DIR, req.url === '/' ? 'test-solve-equations.html' : req.url);
    
    // 确定文件类型
    const extname = path.extname(filePath);
    let contentType = 'text/html';
    
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
    }
    
    // 读取并返回文件
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                // 文件不存在
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1>', 'utf-8');
            } else {
                // 服务器错误
                res.writeHead(500);
                res.end('Server Error: ' + error.code);
            }
        } else {
            // 文件存在，返回文件内容
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

// 启动服务器
server.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}/`);
    console.log('测试页面: http://localhost:8080/test-solve-equations.html');
    console.log('方程页面: http://localhost:8080/equation.html');
});