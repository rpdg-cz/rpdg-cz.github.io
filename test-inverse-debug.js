// 调试脚本：详细测试矩阵求逆方法
const { MatrixOperations, Fraction } = require('./lib/matrix-operations.js');

// 创建MatrixOperations实例
const matrixOps = new MatrixOperations();

console.log('测试矩阵求逆（调试模式）：');
const matrix = [[1, 2], [3, 4]];

console.log('输入矩阵:', JSON.stringify(matrix));
console.log('初始化MatrixOperations实例，useFractions:', matrixOps.useFractions);

// 手动执行矩阵求逆的步骤，添加详细日志
function debugInverse(matrix) {
    console.log('\n=== 开始矩阵求逆调试 ===');
    
    // 输入验证
    if (!matrix || !Array.isArray(matrix) || matrix.length === 0) {
        throw new Error('矩阵不能为空');
    }
    if (!Array.isArray(matrix[0]) || matrix[0].length === 0) {
        throw new Error('矩阵不是有效的二维数组');
    }

    const n = matrix.length;
    if (n !== matrix[0].length) {
        throw new Error('只能计算方阵的逆矩阵');
    }

    console.log('矩阵大小:', n, 'x', n);

    const steps = [];
    const augMatrix = [];

    // 将输入矩阵转换为适当的类型并构造增广矩阵 [A|I]
    console.log('\n构造增广矩阵 [A|I]:');
    for (let i = 0; i < n; i++) {
        const row = matrix[i].map(value => {
            const converted = matrixOps.convertToAppropriateType(value);
            console.log('转换值', value, '为', converted);
            return converted;
        });
        const identityRow = new Array(n).fill(0).map((_, idx) => idx === i ? 1 : 0);
        const fullRow = [...row, ...identityRow];
        augMatrix.push(fullRow);
        console.log('增广矩阵行', i+1, ':', fullRow);
    }

    console.log('初始增广矩阵:', JSON.stringify(augMatrix));

    // 高斯-约旦消元
    console.log('\n=== 开始高斯-约旦消元 ===');
    for (let i = 0; i < n; i++) {
        console.log('\n处理第', i+1, '列');
        
        // 寻找主元
        console.log('寻找主元...');
        let pivotRow = i;
        for (let j = i; j < n; j++) {
            const currentValue = augMatrix[j][i];
            const pivotValue = augMatrix[pivotRow][i];
            const currentAbs = currentValue instanceof Fraction ? Math.abs(currentValue.toFloat()) : Math.abs(currentValue);
            const pivotAbs = pivotValue instanceof Fraction ? Math.abs(pivotValue.toFloat()) : Math.abs(pivotValue);
            
            console.log('行', j+1, '列', i+1, '值:', currentValue, '绝对值:', currentAbs);
            console.log('当前主元行', pivotRow+1, '值:', pivotValue, '绝对值:', pivotAbs);
            
            if (currentAbs > pivotAbs) {
                console.log('更新主元行为', j+1);
                pivotRow = j;
            }
        }
        console.log('找到主元行:', pivotRow+1);

        // 交换行
        if (pivotRow !== i) {
            console.log('交换行', i+1, '和行', pivotRow+1);
            [augMatrix[i], augMatrix[pivotRow]] = [augMatrix[pivotRow], augMatrix[i]];
            console.log('交换后增广矩阵:', JSON.stringify(augMatrix));
        }

        // 归一化主元行
        console.log('归一化主元行...');
        const pivot = augMatrix[i][i];
        console.log('主元值:', pivot);
        
        if (matrixOps.isZero(pivot)) {
            throw new Error('矩阵不可逆（行列式为0）');
        }

        console.log('归一化第', i+1, '行，主元为', pivot);
        for (let j = 0; j < 2 * n; j++) {
            const oldValue = augMatrix[i][j];
            let newValue;
            if (oldValue instanceof Fraction && pivot instanceof Fraction) {
                newValue = oldValue.divide(pivot);
            } else {
                newValue = oldValue / pivot;
                if (matrixOps.useFractions) {
                    newValue = matrixOps.toFraction(newValue);
                }
            }
            augMatrix[i][j] = newValue;
            console.log('列', j+1, ':', oldValue, '→', newValue);
        }
        console.log('归一化后主元行:', augMatrix[i]);

        // 消去其他行的当前列
        console.log('消去其他行的当前列...');
        for (let j = 0; j < n; j++) {
            if (j !== i) {
                const factor = augMatrix[j][i];
                console.log('消去行', j+1, '，因子为', factor);
                
                for (let k = 0; k < 2 * n; k++) {
                    const oldValue = augMatrix[j][k];
                    const pivotRowValue = augMatrix[i][k];
                    let product;
                    
                    if (factor instanceof Fraction && pivotRowValue instanceof Fraction) {
                        product = factor.multiply(pivotRowValue);
                    } else {
                        product = factor * pivotRowValue;
                        if (matrixOps.useFractions) {
                            product = matrixOps.toFraction(product);
                        }
                    }
                    
                    let newValue;
                    if (oldValue instanceof Fraction && product instanceof Fraction) {
                        newValue = oldValue.subtract(product);
                    } else {
                        newValue = oldValue - product;
                    }
                    
                    augMatrix[j][k] = newValue;
                    console.log('行', j+1, '列', k+1, ':', oldValue, '-', product, '→', newValue);
                }
                
                console.log('消去后行', j+1, ':', augMatrix[j]);
            }
        }
    }

    // 提取逆矩阵部分
    console.log('\n=== 提取逆矩阵部分 ===');
    const inverseMatrix = [];
    for (let i = 0; i < n; i++) {
        const row = augMatrix[i].slice(n);
        inverseMatrix.push(row);
        console.log('行', i+1, '逆矩阵部分:', row);
    }

    // 格式化结果矩阵用于输出
    console.log('\n=== 格式化结果 ===');
    const formatMatrixForDisplay = (mat) => {
        const currentFormat = matrixOps.getFormatType();
        return mat.map(row => 
            row.map(value => {
                const formatted = matrixOps.formatNumber(value, currentFormat);
                console.log('格式化值', value, '为', formatted);
                return formatted;
            })
        );
    };

    const result = formatMatrixForDisplay(inverseMatrix);
    console.log('最终逆矩阵结果:', JSON.stringify(result));
    
    return result;
}

try {
    const result = debugInverse(matrix);
    console.log('\n矩阵求逆测试成功！');
} catch (error) {
    console.error('\n矩阵求逆测试失败:', error.message);
    console.error('错误堆栈:', error.stack);
}

console.log('\n所有测试结束。');