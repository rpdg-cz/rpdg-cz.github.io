// 读取并执行matrix-operations.js文件
import * as fs from 'fs';
import * as path from 'path';

// 读取matrix-operations.js文件
const matrixOperationsPath = path.join(import.meta.dirname, 'lib', 'matrix-operations.js');
const matrixOperationsContent = fs.readFileSync(matrixOperationsPath, 'utf8');

// 测试matrix-operations.js的内容
console.log('matrix-operations.js 文件内容长度:', matrixOperationsContent.length);
console.log('文件开头:', matrixOperationsContent.substring(0, 100));
console.log('文件结尾:', matrixOperationsContent.substring(matrixOperationsContent.length - 100));

// 使用动态导入来加载CommonJS模块
import('./lib/matrix-operations.js')
    .then(module => {
        console.log('\n=== 模块导入结果 ===');
        console.log('模块导出内容:', Object.keys(module));
        
        // 获取MatrixOperations和Fraction
        const { MatrixOperations, Fraction } = module;
        
        // 测试矩阵乘法
        console.log('\n=== 测试矩阵乘法 ===');
        try {
            const matrixOps = new MatrixOperations();
            matrixOps.setFormatType('decimal');
            
            const matrix1 = [[1, 2, 3], [4, 5, 6]];
            const matrix2 = [[7, 8], [9, 10], [11, 12]];
            
            const result = matrixOps.multiplyMatrices(matrix1, matrix2);
            console.log('矩阵乘法结果:', result.result);
            console.log('矩阵乘法步骤数量:', result.steps.length);
            console.log('矩阵乘法测试: 成功');
        } catch (error) {
            console.error('矩阵乘法测试失败:', error.message);
            console.error('错误堆栈:', error.stack);
        }
        
        // 测试矩阵求逆
        console.log('\n=== 测试矩阵求逆 ===');
        try {
            const matrixOps = new MatrixOperations();
            matrixOps.setFormatType('decimal');
            
            const matrix = [[1, 2], [3, 4]];
            
            const result = matrixOps.calculateInverse(matrix);
            console.log('矩阵求逆结果:', result.result);
            console.log('矩阵求逆步骤数量:', result.steps.length);
            console.log('矩阵求逆测试: 成功');
        } catch (error) {
            console.error('矩阵求逆测试失败:', error.message);
            console.error('错误堆栈:', error.stack);
        }
    })
    .catch(error => {
        console.error('导入matrix-operations.js失败:', error.message);
        console.error('错误堆栈:', error.stack);
    });