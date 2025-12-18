const fs = require('fs');
const path = require('path');

// 读取并执行matrix-operations.js文件
const matrixOpsPath = path.join(__dirname, 'lib', 'matrix-operations.js');
const matrixOpsCode = fs.readFileSync(matrixOpsPath, 'utf8');

// 创建一个虚拟的浏览器环境
global.window = {};
global.document = {};

try {
    // 执行matrix-operations.js
    eval(matrixOpsCode);
    
    // 创建MatrixOperations实例
    const MatrixOperations = window.MatrixOperations;
    const matrixOps = new MatrixOperations();
    matrixOps.setFormatType('rational');
    
    // 测试 1: 唯一解
    const matrix1 = [[1, 2], [3, 4]];
    const constants1 = [5, 11];
    
    // 测试 2: 无解
    const matrix2 = [[1, 2], [2, 4]];
    const constants2 = [5, 11];
    
    // 测试 3: 无穷解
    const matrix3 = [[1, 2], [2, 4]];
    const constants3 = [5, 10];
    
    console.log('测试 1: 唯一解');
    console.log('矩阵:', matrix1);
    console.log('常数向量:', constants1);
    let res1 = matrixOps.solveEquations(matrix1, constants1);
    console.log('结果:', JSON.stringify(res1, null, 2));
    console.log('-------------------------');
    
    console.log('测试 2: 无解');
    console.log('矩阵:', matrix2);
    console.log('常数向量:', constants2);
    let res2 = matrixOps.solveEquations(matrix2, constants2);
    console.log('结果:', JSON.stringify(res2, null, 2));
    console.log('-------------------------');
    
    console.log('测试 3: 无穷解');
    console.log('矩阵:', matrix3);
    console.log('常数向量:', constants3);
    let res3 = matrixOps.solveEquations(matrix3, constants3);
    console.log('结果:', JSON.stringify(res3, null, 2));
    console.log('-------------------------');
    
} catch (e) {
    console.error('错误:', e);
}