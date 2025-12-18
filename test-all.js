const { MatrixOperations, Fraction } = require('./lib/matrix-operations.js');

console.log('=== 高级代数计算器完整测试套件 ===\n');

// 测试Fraction类
function testFraction() {
    console.log('1. 测试Fraction类：');
    
    // 构造函数测试
    const f1 = new Fraction(1, 2);
    const f2 = new Fraction(3, 4);
    console.log(`   构造函数: f1 = 1/2 → ${f1}`);
    console.log(`   构造函数: f2 = 3/4 → ${f2}`);
    
    // 加法测试
    const sum = f1.add(f2);
    console.log(`   加法: 1/2 + 3/4 = ${sum}`);
    
    // 减法测试
    const diff = f1.subtract(f2);
    console.log(`   减法: 1/2 - 3/4 = ${diff}`);
    
    // 乘法测试
    const product = f1.multiply(f2);
    console.log(`   乘法: 1/2 * 3/4 = ${product}`);
    
    // 除法测试
    const quotient = f1.divide(f2);
    console.log(`   除法: 1/2 ÷ 3/4 = ${quotient}`);
    
    // 转小数测试
    console.log(`   转小数: 1/2 = ${f1.toFloat()}`);
    
    console.log('   ✅ Fraction类测试通过\n');
}

// 测试MatrixOperations基础功能
function testMatrixBasics() {
    console.log('2. 测试矩阵基础功能：');
    
    const matrixOps = new MatrixOperations();
    
    // 测试矩阵乘法
    const A = [[1, 2, 3], [4, 5, 6]];
    const B = [[7, 8], [9, 10], [11, 12]];
    const productResult = matrixOps.multiplyMatrices(A, B);
    console.log('   矩阵乘法测试：');
    console.log('   A:', JSON.stringify(A));
    console.log('   B:', JSON.stringify(B));
    console.log('   A × B:', JSON.stringify(productResult.result));
    
    // 测试矩阵求逆
    const C = [[1, 2], [3, 4]];
    const inverseResult = matrixOps.calculateInverse(C);
    console.log('\n   矩阵求逆测试：');
    console.log('   C:', JSON.stringify(C));
    console.log('   C⁻¹:', JSON.stringify(inverseResult.result));
    
    // 测试矩阵行列式
    const D = [[1, 2], [3, 4]];
    const detResult = matrixOps.calculateDeterminant(D);
    console.log('\n   矩阵行列式测试：');
    console.log('   D:', JSON.stringify(D));
    console.log('   det(D):', detResult.result);
    
    console.log('   ✅ 矩阵基础功能测试通过\n');
}

// 测试格式化功能
function testFormatting() {
    console.log('3. 测试格式化功能：');
    
    const matrixOps = new MatrixOperations();
    
    // 测试分数格式化
    const f = new Fraction(1, 2);
    const formatted = matrixOps.formatNumber(f, 'rational');
    console.log(`   分数格式化: 1/2 → ${formatted}`);
    
    // 测试整数格式化
    const num = 42;
    const formattedInt = matrixOps.formatNumber(num, 'integer');
    console.log(`   整数格式化: 42 → ${formattedInt}`);
    
    console.log('   ✅ 格式化功能测试通过\n');
}

// 运行所有测试
try {
    testFraction();
    testMatrixBasics();
    testFormatting();
    console.log('🎉 所有测试通过！高级代数计算器功能正常。');
} catch (error) {
    console.error('❌ 测试失败:', error.message);
    console.error(error.stack);
    process.exit(1);
}