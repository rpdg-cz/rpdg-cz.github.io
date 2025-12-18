// 测试脚本：验证multiplyMatrices和calculateInverse方法
const { MatrixOperations } = require('./lib/matrix-operations.js');

// 创建MatrixOperations实例
const matrixOps = new MatrixOperations();

console.log('测试开始...');

// 测试矩阵乘法
console.log('\n1. 测试矩阵乘法：');
const matrix1 = [[1, 2, 3], [4, 5, 6]];
const matrix2 = [[7, 8], [9, 10], [11, 12]];

try {
    const multiplyResult = matrixOps.multiplyMatrices(matrix1, matrix2);
    console.log('输入矩阵 A:', JSON.stringify(matrix1));
    console.log('输入矩阵 B:', JSON.stringify(matrix2));
    console.log('乘法结果:', JSON.stringify(multiplyResult.result));
    console.log('矩阵乘法测试成功！');
} catch (error) {
    console.error('矩阵乘法测试失败:', error.message);
}

// 测试矩阵求逆
console.log('\n2. 测试矩阵求逆：');
const matrix = [[1, 2], [3, 4]];

try {
    const inverseResult = matrixOps.calculateInverse(matrix);
    console.log('输入矩阵:', JSON.stringify(matrix));
    console.log('逆矩阵结果:', JSON.stringify(inverseResult.result));
    console.log('矩阵求逆测试成功！');
} catch (error) {
    console.error('矩阵求逆测试失败:', error.message);
}

console.log('\n所有测试结束。');