// 测试矩阵乘法功能
const { MatrixOperations } = require('./lib/matrix-operations');

// 创建MatrixOperations实例
const matrixOps = new MatrixOperations();

// 设置输出格式
matrixOps.setFormatType('rational');

// 测试用例1：2x2矩阵乘法
const matrixA1 = [[1, 2], [3, 4]];
const matrixB1 = [[5, 6], [7, 8]];
console.log('=== 测试用例1：2x2矩阵乘法 ===');
console.log('矩阵A:', JSON.stringify(matrixA1));
console.log('矩阵B:', JSON.stringify(matrixB1));

try {
    const result1 = matrixOps.multiplyMatrices(matrixA1, matrixB1);
    console.log('乘法结果:', JSON.stringify(result1.result, null, 2));
    console.log('返回值结构包含result属性:', 'result' in result1);
    console.log('返回值结构包含steps属性:', 'steps' in result1);
} catch (error) {
    console.error('计算失败:', error.message);
}

// 测试用例2：3x3矩阵乘法
const matrixA2 = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
const matrixB2 = [[9, 8, 7], [6, 5, 4], [3, 2, 1]];
console.log('\n=== 测试用例2：3x3矩阵乘法 ===');
console.log('矩阵A:', JSON.stringify(matrixA2));
console.log('矩阵B:', JSON.stringify(matrixB2));

try {
    const result2 = matrixOps.multiplyMatrices(matrixA2, matrixB2);
    console.log('乘法结果:', JSON.stringify(result2.result, null, 2));
    console.log('返回值结构包含result属性:', 'result' in result2);
    console.log('返回值结构包含steps属性:', 'steps' in result2);
} catch (error) {
    console.error('计算失败:', error.message);
}

console.log('\n=== 测试完成 ===');