// 测试Fraction类的方法
const { Fraction } = require('./lib/matrix-operations.js');

console.log('测试Fraction类的方法...');

// 测试构造函数
const f1 = new Fraction(2, 4);
console.log('构造函数测试1: 2/4 =', f1.numerator, '/', f1.denominator); // 应该是1/2

const f2 = new Fraction('3/6');
console.log('构造函数测试2: 3/6 =', f2.numerator, '/', f2.denominator); // 应该是1/2

const f3 = new Fraction(5);
console.log('构造函数测试3: 5 =', f3.numerator, '/', f3.denominator); // 应该是5/1

// 测试加法
const f4 = new Fraction(1, 2);
const f5 = new Fraction(1, 3);
const f6 = f4.add(f5);
console.log('加法测试: 1/2 + 1/3 =', f6.numerator, '/', f6.denominator); // 应该是5/6

// 测试减法
const f7 = f4.subtract(f5);
console.log('减法测试: 1/2 - 1/3 =', f7.numerator, '/', f7.denominator); // 应该是1/6

// 测试乘法
const f8 = f4.multiply(f5);
console.log('乘法测试: 1/2 * 1/3 =', f8.numerator, '/', f8.denominator); // 应该是1/6

// 测试除法
const f9 = f4.divide(f5);
console.log('除法测试: 1/2 / 1/3 =', f9.numerator, '/', f9.denominator); // 应该是3/2

// 测试toFloat方法
console.log('toFloat测试: 3/2 =', f9.toFloat()); // 应该是1.5

console.log('所有Fraction类测试结束。');