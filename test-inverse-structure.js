// 测试矩阵求逆功能的返回值结构
const { MatrixOperations } = require('./lib/matrix-operations');

// 创建MatrixOperations实例
const matrixOps = new MatrixOperations();

// 设置输出格式
matrixOps.setFormatType('rational');

// 测试用例：2x2矩阵
const testMatrix2x2 = [[1, 2], [3, 4]];

// 测试用例：3x3矩阵（与用户提供的测试用例相同）
const testMatrix3x3 = [
    [-1, 1, 0],
    [1, 0, 1],
    [1, -1, 1]
];

console.log('=== 测试矩阵求逆功能 ===');

try {
    console.log('\n1. 测试2x2矩阵求逆：');
    console.log('输入矩阵:', JSON.stringify(testMatrix2x2));
    const result2x2 = matrixOps.calculateInverse(testMatrix2x2);
    console.log('返回值结构:', JSON.stringify(result2x2, null, 2));
    console.log('isInvertible属性存在:', 'isInvertible' in result2x2);
    console.log('inverse属性存在:', 'inverse' in result2x2);
    console.log('steps属性存在:', 'steps' in result2x2);
    console.log('求逆结果:', JSON.stringify(result2x2.inverse, null, 2));
} catch (error) {
    console.error('2x2矩阵求逆失败:', error.message);
}

try {
    console.log('\n2. 测试3x3矩阵求逆：');
    console.log('输入矩阵:', JSON.stringify(testMatrix3x3));
    const result3x3 = matrixOps.calculateInverse(testMatrix3x3);
    console.log('返回值结构:', JSON.stringify(result3x3, null, 2));
    console.log('isInvertible属性存在:', 'isInvertible' in result3x3);
    console.log('inverse属性存在:', 'inverse' in result3x3);
    console.log('steps属性存在:', 'steps' in result3x3);
    console.log('求逆结果:', JSON.stringify(result3x3.inverse, null, 2));
} catch (error) {
    console.error('3x3矩阵求逆失败:', error.message);
}

console.log('\n=== 测试完成 ===');