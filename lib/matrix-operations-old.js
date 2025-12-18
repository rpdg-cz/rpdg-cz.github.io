/**
 * 分数类 - 用于表示和处理有理数
 */
class Fraction {
    /**
     * 构造函数
     * @param {number|string} numerator - 分子或分数字符串(如 "1/2", "3")
     * @param {number} [denominator=1] - 分母
     */
    constructor(numerator, denominator = 1) {
        // 如果传入的是分数字符串
        if (typeof numerator === 'string') {
            const parts = numerator.split('/');
            if (parts.length === 2) {
                numerator = parseInt(parts[0], 10);
                denominator = parseInt(parts[1], 10);
            } else {
                numerator = parseInt(numerator, 10);
                denominator = 1;
            }
        }
        
        // 确保类型正确
        this.numerator = parseInt(numerator, 10) || 0;
        this.denominator = parseInt(denominator, 10) || 1;
        
        // 确保分母为正
        if (this.denominator < 0) {
            this.numerator = -this.numerator;
            this.denominator = -this.denominator;
        }
        
        // 简化分数
        this.reduce();
    }
    
    /**
     * 计算最大公约数
     * @param {number} a - 第一个数
     * @param {number} b - 第二个数
     * @returns {number} 最大公约数
     */
    static gcd(a, b) {
        a = Math.abs(a);
        b = Math.abs(b);
        while (b !== 0) {
            const temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }
    
    /**
     * 简化分数
     */
    reduce() {
        const commonDivisor = Fraction.gcd(this.numerator, this.denominator);
        this.numerator = Math.floor(this.numerator / commonDivisor);
        this.denominator = Math.floor(this.denominator / commonDivisor);
    }
    
    /**
     * 将分数转换为浮点数
     * @returns {number} 浮点数值
     */
    toFloat() {
        return this.numerator / this.denominator;
    }
    
    /**
     * 将浮点数转换为分数
     * @param {number} value - 浮点数
     * @param {number} [precision=10] - 精度
     * @returns {Fraction} 分数对象
     */
    static fromFloat(value, precision = 10) {
        // 处理整数
        if (Number.isInteger(value)) {
            return new Fraction(value, 1);
        }
        
        // 处理近似浮点数（由于精度问题）
        // 使用连分数算法寻找更简洁的分数近似
        let numerator = 1;
        let denominator = 0;
        let tempNumerator = 0;
        let tempDenominator = 1;
        let floor = Math.floor(value);
        let remainder = value - floor;
        
        const maxIterations = 20;
        let iteration = 0;
        
        while (remainder > Math.pow(10, -precision) && iteration < maxIterations) {
            const reciprocal = 1 / remainder;
            floor = Math.floor(reciprocal);
            
            const newNumerator = floor * numerator + tempNumerator;
            const newDenominator = floor * denominator + tempDenominator;
            
            // 更新临时变量
            tempNumerator = numerator;
            tempDenominator = denominator;
            
            // 更新主要变量
            numerator = newNumerator;
            denominator = newDenominator;
            
            // 计算新的余数
            remainder = reciprocal - floor;
            
            iteration++;
        }
        
        // 处理负数
        if (value < 0) {
            numerator = -numerator;
        }
        
        return new Fraction(numerator, denominator);
    }
    
    /**
     * 加法运算
     * @param {Fraction|number|string} other - 另一个分数或数字
     * @returns {Fraction} 结果分数
     */
    add(other) {
        other = this._normalizeOperand(other);
        const numerator = this.numerator * other.denominator + other.numerator * this.denominator;
        const denominator = this.denominator * other.denominator;
        return new Fraction(numerator, denominator);
    }
    
    /**
     * 减法运算
     * @param {Fraction|number|string} other - 另一个分数或数字
     * @returns {Fraction} 结果分数
     */
    subtract(other) {
        other = this._normalizeOperand(other);
        const numerator = this.numerator * other.denominator - other.numerator * this.denominator;
        const denominator = this.denominator * other.denominator;
        return new Fraction(numerator, denominator);
    }
    
    /**
     * 乘法运算
     * @param {Fraction|number|string} other - 另一个分数或数字
     * @returns {Fraction} 结果分数
     */
    multiply(other) {
        other = this._normalizeOperand(other);
        const numerator = this.numerator * other.numerator;
        const denominator = this.denominator * other.denominator;
        return new Fraction(numerator, denominator);
    }
    
    /**
     * 除法运算
     * @param {Fraction|number|string} other - 另一个分数或数字
     * @returns {Fraction} 结果分数
     */
    divide(other) {
        other = this._normalizeOperand(other);
        if (other.numerator === 0) {
            throw new Error('除数不能为零');
        }
        const numerator = this.numerator * other.denominator;
        const denominator = this.denominator * other.numerator;
        return new Fraction(numerator, denominator);
    }
    
    /**
     * 归一化操作数
     * @param {Fraction|number|string} operand - 操作数
     * @returns {Fraction} 分数对象
     * @private
     */
    _normalizeOperand(operand) {
        if (operand instanceof Fraction) {
            return operand;
        }
        return new Fraction(operand);
    }
    
    /**
     * 将分数转换为字符串
     * @param {boolean} [forceFraction=false] - 是否强制显示为分数形式
     * @returns {string} 格式化后的字符串
     */
    toString(forceFraction = false) {
        // 如果分母为1，直接返回分子
        if (!forceFraction && this.denominator === 1) {
            return this.numerator.toString();
        }
        
        // 处理负数
        if (this.numerator < 0) {
            return `-${Math.abs(this.numerator)}/${this.denominator}`;
        }
        
        return `${this.numerator}/${this.denominator}`;
    }
    
    /**
     * 格式化显示分数
     * @param {Object} [options={}] - 格式化选项
     * @param {boolean} [options.useMixedNumbers=false] - 是否使用带分数形式
     * @param {boolean} [options.forceFraction=false] - 是否强制显示为分数
     * @returns {string} 格式化后的字符串
     */
    format(options = {}) {
        const { useMixedNumbers = false, forceFraction = false } = options;
        
        // 如果不需要带分数且分母为1，直接返回分子
        if (!useMixedNumbers && !forceFraction && this.denominator === 1) {
            return this.numerator.toString();
        }
        
        // 处理带分数形式
        if (useMixedNumbers && Math.abs(this.numerator) > this.denominator) {
            const integerPart = Math.floor(Math.abs(this.numerator) / this.denominator);
            const fractionalPart = Math.abs(this.numerator) % this.denominator;
            
            if (fractionalPart === 0) {
                return (this.numerator < 0 ? '-' : '') + integerPart.toString();
            }
            
            return (this.numerator < 0 ? '-' : '') + 
                   `${integerPart} ${fractionalPart}/${this.denominator}`;
        }
        
        // 默认格式
        return this.toString();
    }

}

class MatrixOperations {
    constructor() {
        this.precision = 10; // 浮点数精度
        this.useFractions = true; // 默认使用分数输出
        this.formatType = 'rational'; // 默认输出格式：rational（有理数）或integer（整数）
    }
    
    /**
     * 设置输出格式类型
     * @param {string} formatType - 输出格式：'integer'（整数）或'rational'（有理数）或'decimal'（小数）或'fraction'（分数）
     */
    setFormatType(formatType) {
        // 映射页面使用的格式类型到内部格式类型
        if (formatType === 'integer') {
            this.formatType = 'integer';
        } else if (formatType === 'decimal') {
            this.formatType = 'rational'; // 使用有理数格式显示小数
            this.useFractions = false; // 不使用分数输出
        } else if (formatType === 'fraction') {
            this.formatType = 'rational'; // 使用有理数格式显示分数
            this.useFractions = true; // 使用分数输出
        } else {
            this.formatType = 'rational';
            this.useFractions = true;
        }
    }
    
    /**
     * 获取当前输出格式类型
     * @returns {string} 当前输出格式
     */
    getFormatType() {
        return this.formatType;
    }
    
    /**
     * 将浮点数转换为分数对象
     * @param {number} value - 浮点数
     * @returns {Fraction} 分数对象
     */
    toFraction(value) {
        return Fraction.fromFloat(value, this.precision);
    }
    
    /**
     * 将分数对象格式化为字符串
     * @param {Fraction} fraction - 分数对象
     * @returns {string} 格式化的分数字符串
     */
    formatFraction(fraction) {
        return fraction.toString();
    }
    
    /**
     * 将数字格式化为适当的形式（整数或分数）
     * @param {number|Fraction|string} value - 要格式化的数字、分数或字符串
     * @param {string} formatType - 输出格式类型：'integer'（整数）或'rational'（有理数）
     * @returns {string} 格式化后的字符串
     */
    formatNumber(value, formatType = 'rational') {
        try {
            // 处理字符串输入
            if (typeof value === 'string') {
                // 检查是否已经是分数格式
                if (value.includes('/')) {
                    if (formatType === 'integer') {
                        // 如果需要整数格式，尝试转换为小数后取整
                        const parts = value.split('/');
                        if (parts.length === 2) {
                            const numerator = parseInt(parts[0], 10);
                            const denominator = parseInt(parts[1], 10);
                            if (!isNaN(numerator) && !isNaN(denominator) && denominator !== 0) {
                                return Math.round(numerator / denominator).toString();
                            }
                        }
                    }
                    return value;
                }
                // 尝试转换为数字
                const numValue = parseFloat(value);
                if (!isNaN(numValue)) {
                    value = numValue;
                } else {
                    return value; // 返回原始字符串
                }
            }
            
            if (formatType === 'integer') {
                // 整数输出格式
                if (value instanceof Fraction) {
                    // 使用整型模拟：分子除以分母后四舍五入取整
                    return Math.round(value.numerator / value.denominator).toString();
                }
                // 对普通数字四舍五入取整
                return Math.round(value).toString();
            } else {
                // 有理数输出格式
                if (value instanceof Fraction) {
                    // 如果分数的分子或分母太大（超过1000000），自动转换为小数
                    if (Math.abs(value.numerator) > 1000000 || Math.abs(value.denominator) > 1000000) {
                        return value.toFloat().toString();
                    }
                    // 否则显示为分数
                    return value.toString(false);
                } else {
                    // 对于普通数字，转换为分数显示
                    const fraction = this.toFraction(value);
                    // 如果分数的分子或分母太大（超过1000000），自动转换为小数
                    if (Math.abs(fraction.numerator) > 1000000 || Math.abs(fraction.denominator) > 1000000) {
                        return fraction.toFloat().toString();
                    }
                    return fraction.toString(false);
                }
            }
        } catch (e) {
            console.error('格式化数字时出错:', e);
            return '0';
        }
    }

    /**
     * 数字四舍五入
     * @param {number|Fraction} num - 要处理的数字或分数
     * @returns {number|Fraction} 处理后的数字或分数
     */
    round(num) {
        if (num instanceof Fraction) {
            return num; // 分数不需要四舍五入，保持精确值
        }
        return Math.round(num * Math.pow(10, this.precision)) / Math.pow(10, this.precision);
    }
    
    /**
     * 将输入值转换为适当的类型（数字或分数）
     * @param {number|string|Fraction} value - 输入值
     * @param {boolean} [useFraction=true] - 是否转换为分数
     * @returns {number|Fraction} 转换后的值
     */
    convertToAppropriateType(value, useFraction = true) {
        if (value instanceof Fraction) {
            return value;
        }
        
        // 如果是字符串形式的分数
        if (typeof value === 'string' && value.includes('/')) {
            return new Fraction(value);
        }
        
        const numValue = parseFloat(value);
        if (useFraction && this.useFractions) {
            return this.toFraction(numValue);
        }
        return numValue;
    }

    /**
     * 深拷贝矩阵
     * @param {Array<Array<number>>} matrix - 要拷贝的矩阵
     * @returns {Array<Array<number>>} 拷贝后的矩阵
     */
    copyMatrix(matrix) {
        // 输入验证
        if (!matrix || !Array.isArray(matrix) || matrix.length === 0) {
            throw new Error('矩阵不能为空');
        }
        if (!Array.isArray(matrix[0]) || matrix[0].length === 0) {
            throw new Error('矩阵不是有效的二维数组');
        }
        
        return matrix.map(row => [...row]);
    }

    /**
     * 创建单位矩阵
     * @param {number} size - 矩阵大小
     * @returns {Array<Array<number>>} 单位矩阵
     */
    createIdentityMatrix(size) {
        const identity = [];
        for (let i = 0; i < size; i++) {
            const row = [];
            for (let j = 0; j < size; j++) {
                row.push(i === j ? 1 : 0);
            }
            identity.push(row);
        }
        return identity;
    }

    /**
     * 计算矩阵的特征多项式（增加 LaTeX 输出）
     * @param {Array<Array<number|string>>} matrix - 方阵
     * @returns {Object} 包含特征多项式和步骤的对象（包含 polynomialLatex 字段）
     */
    calculateCharacteristicPolynomial(matrix) {
        // 输入验证
        if (!matrix || !Array.isArray(matrix) || matrix.length === 0) {
            throw new Error('矩阵不能为空');
        }
        const n = matrix.length;
        if (matrix[0].length !== n) {
            throw new Error('只能计算方阵的特征多项式');
        }

        const steps = [];

        // 将输入矩阵转换为分数/数值形式以保证计算一致性
        const inputMatrix = matrix.map(row =>
            row.map(value => this.convertToAppropriateType(value))
        );

        // 格式化矩阵用于显示（纯文本）
        const formatMatrixForDisplay = (mat) => {
            const currentFormat = this.getFormatType();
            return mat.map(row =>
                row.map(value => this.formatNumber(value, currentFormat))
            );
        };

        // 初始矩阵显示
        steps.push({
            matrix: formatMatrixForDisplay(inputMatrix),
            description: `初始矩阵 A，阶数为 ${n}`
        });

        steps.push({
            matrix: null,
            description: `构造矩阵 A - xI（I 为单位矩阵），求 det(A - xI)`
        });

        // 处理 2x2 的快捷情况
        if (n === 2) {
            const a = inputMatrix[0][0];
            const b = inputMatrix[0][1];
            const c = inputMatrix[1][0];
            const d = inputMatrix[1][1];

            const trace = (a instanceof Fraction) ? a.add(d) : (a + d);
            const det = (a instanceof Fraction) ? a.multiply(d).subtract(b.multiply(c)) : (a * d) - (b * c);

            steps.push({
                matrix: null,
                description: `对于 2×2 矩阵，特征多项式为：x^2 - tr(A)·x + det(A)`
            });

            steps.push({
                matrix: null,
                description: `tr(A) = ${this.formatNumber(trace)}, det(A) = ${this.formatNumber(det)}`
            });

            const plainPolynomial = `x^2 - ${this.formatNumber(trace)} x + ${this.formatNumber(det)}`;

            const traceLatex = this.numberToLatex(trace);
            const detLatex = this.numberToLatex(det);
            const latexPolynomial = `$$x^{2} - ${traceLatex}\\,x + ${detLatex}$$`;

            steps.push({
                matrix: null,
                description: `特征多项式（LaTeX）： ${latexPolynomial}`
            });

            return {
                result: plainPolynomial,
                polynomial: plainPolynomial,
                polynomialLatex: latexPolynomial,
                coefficients: [1, (trace instanceof Fraction ? trace.multiply(new Fraction(-1)) : -trace), det],
                steps
            };
        }

        // 一般阶数：主子式法计算系数
        steps.push({
            matrix: null,
            description: `对于 ${n}×${n} 矩阵，使用主子式法计算特征多项式系数`
        });

        const coefficients = [1]; // 最高次项系数为 1

        for (let r = 1; r <= n; r++) {
            const minorsSum = this.calculatePrincipalMinorsSum(inputMatrix, r);
            let coeff;
            if (minorsSum instanceof Fraction) {
                coeff = (r % 2 === 0) ? minorsSum : (new Fraction(-1).multiply(minorsSum));
            } else {
                coeff = minorsSum * ((-1) ** r);
            }
            coefficients.push(coeff);

            steps.push({
                matrix: null,
                description: `计算 (-1)^${r} × (所有 ${r} 阶主子式之和) = ${this.formatNumber(coeff)}`
            });
        }

        // 构建纯文本与 LaTeX 多项式
        const textTerms = [];
        const latexTerms = [];

        for (let i = 0; i < coefficients.length; i++) {
            const coeff = coefficients[i];
            const power = n - i;
            const isZero = coeff instanceof Fraction ? coeff.numerator === 0 : (typeof coeff === 'number' && Math.abs(coeff) < 1e-12);
            if (isZero && power !== 0) continue;

            // 计算符号与绝对值
            const negative = coeff instanceof Fraction ? coeff.numerator < 0 : (typeof coeff === 'number' && coeff < 0);
            const absCoeff = (coeff instanceof Fraction) ? new Fraction(Math.abs(coeff.numerator), coeff.denominator) : Math.abs(coeff);

            const absCoeffText = this.formatNumber(absCoeff);
            const absCoeffLatex = this.numberToLatex(absCoeff);

            // 文本项构建
            let textCore = '';
            if (power === 0) {
                textCore = this.formatNumber(coeff);
            } else {
                // 当系数绝对值为1且不是常数项时省略显示系数
                const showCoeffText = !(absCoeffText === '1');
                if (showCoeffText) textCore = `${absCoeffText} `;
                textCore += `x${power > 1 ? '^' + power : ''}`;
            }
            const textSign = (textTerms.length === 0) ? (negative ? '-' : '') : (negative ? ' - ' : ' + ');
            textTerms.push(textSign + textCore);

            // LaTeX 项构建
            let latexCore = '';
            if (power === 0) {
                latexCore = this.numberToLatex(coeff); // numberToLatex 会处理负号
                // numberToLatex 返回不带 $ 的片段，处理符号统一由下面处理
                // 如果 numberToLatex produced "-\frac{a}{b}", preserve sign by checking negative
                if (latexCore.startsWith('-')) {
                    latexCore = latexCore.slice(1); // remove leading '-' to let sign be handled uniformly
                }
            } else {
                const showCoeffLatex = !(absCoeffText === '1');
                if (showCoeffLatex) latexCore = `${absCoeffLatex}\\,`;
                latexCore += `x${power > 1 ? `^{${power}}` : ''}`;
            }
            latexTerms.push({ core: latexCore || '1', negative });
        }

        const plainPolynomial = textTerms.length ? textTerms.join('') : '0';

        // 组装 LaTeX 字符串
        let latexParts = [];
        for (let idx = 0; idx < latexTerms.length; idx++) {
            const t = latexTerms[idx];
            const sign = (idx === 0) ? (t.negative ? '-' : '') : (t.negative ? ' - ' : ' + ');
            latexParts.push(sign + t.core);
        }
        const latexPolynomial = `$$${latexParts.join('')}$$`;

        steps.push({
            matrix: null,
            description: `特征多项式为： ${plainPolynomial}`
        });
        steps.push({
            matrix: null,
            description: `特征多项式（LaTeX）： ${latexPolynomial}`
        });

        return {
            result: plainPolynomial,
            polynomial: plainPolynomial,
            polynomialLatex: latexPolynomial,
            coefficients,
            steps
        };
    }

    /**
     * 生成所有大小为r的组合
     * @param {Array} arr - 原始数组
     * @param {number} r - 组合大小
     * @returns {Array} 所有组合
     * @private
     */
    generateCombinations(arr, r) {
        if (r === 0) return [[]];
        if (arr.length < r) return [];
        
        const result = [];
        const first = arr[0];
        const rest = arr.slice(1);
        
        // 包含first的组合
        for (const combo of this.generateCombinations(rest, r - 1)) {
            result.push([first, ...combo]);
        }
        
        // 不包含first的组合
        for (const combo of this.generateCombinations(rest, r)) {
            result.push(combo);
        }
        
        return result;
    }
    
    /**
     * 提取矩阵的主子式
     * @param {Array} matrix - 原矩阵
     * @param {Array} indices - 行/列索引
     * @returns {Array} 主子式
     * @private
     */
    extractPrincipalMinor(matrix, indices) {
        const minor = [];
        for (const i of indices) {
            const row = [];
            for (const j of indices) {
                // 复制元素值，避免引用原始数据
                const value = matrix[i][j];
                row.push(value instanceof Fraction ? new Fraction(value) : value);
            }
            minor.push(row);
        }
        return minor;
    }
    
    /**
     * 计算所有r阶主子式之和
     * @param {Array} matrix - 原矩阵
     * @param {number} r - 主子式阶数
     * @returns {number|Fraction} 所有r阶主子式之和
     * @private
     */
    calculatePrincipalMinorsSum(matrix, r) {
        if (r === 0) return 1;
        
        const n = matrix.length;
        const indices = Array.from({length: n}, (_, i) => i);
        const combinations = this.generateCombinations(indices, r);
        
        // 确保使用适当的类型转换
        const processedMatrix = matrix.map(row => 
            row.map(value => this.convertToAppropriateType(value))
        );
        
        // 初始化和为0
        let sum = this.useFractions ? new Fraction(0) : 0;
        
        for (const combo of combinations) {
            const minor = this.extractPrincipalMinor(processedMatrix, combo);
            const detResult = this.calculateDeterminant(minor);
            const det = detResult.result;
            
            // 累加行列式值
            if (this.useFractions) {
                sum = sum.add(det);
            } else {
                sum += det;
            }
        }
        
        return sum;
    }
    
    /**
     * 将值转换为适当的类型（数字或分数）
     * @param {number|string} value - 要转换的值
     * @returns {number|Fraction} 转换后的值
     * @private
     */
    convertToAppropriateType(value) {
        if (value instanceof Fraction) {
            return value;
        }
        
        if (typeof value === 'string') {
            if (value.includes('/')) {
                return new Fraction(value);
            }
            value = parseFloat(value);
        }
        
        if (typeof value === 'number') {
            if (this.useFractions) {
                return this.toFraction(value);
            }
            return value;
        }
        
        throw new Error('无法转换的值类型');
    }

    /**
     * 计算行列式值（带步骤）
     * @param {Array<Array<number|string>>} matrix - 方阵
     * @returns {Object} 包含结果和步骤的对象
     */
    calculateDeterminant(matrix) {
        // 输入验证
        if (!matrix || !Array.isArray(matrix) || matrix.length === 0) {
            throw new Error('矩阵不能为空');
        }
        if (!Array.isArray(matrix[0]) || matrix[0].length === 0) {
            throw new Error('矩阵不是有效的二维数组');
        }
        
        const steps = [];
        const n = matrix.length;
        let swapCount = 0;
        
        // 检查矩阵是否为方阵
        if (matrix[0].length !== n) {
            throw new Error('只能计算方阵的行列式');
        }
        
        // 检查矩阵的所有行是否长度一致
        for (let i = 0; i < n; i++) {
            if (!Array.isArray(matrix[i]) || matrix[i].length !== n) {
                throw new Error('矩阵不是有效的二维数组：所有行必须具有相同的长度');
            }
        }
        
        // 处理1x1矩阵的特殊情况
        if (n === 1) {
            const value = this.convertToAppropriateType(matrix[0][0]);
            steps.push({
                matrix: [[this.formatNumber(value)]],
                description: `1x1矩阵的行列式就是其唯一元素：${this.formatNumber(value)}`
            });
            return { result: value, steps };
        }
        
        // 将输入矩阵转换为分数形式
        let detMatrix = matrix.map(row => 
            row.map(value => this.convertToAppropriateType(value))
        );
        
        // 格式化矩阵用于显示
        const formatMatrixForDisplay = (mat) => {
            const currentFormat = this.getFormatType();
            return mat.map(row => 
                row.map(value => this.formatNumber(value, currentFormat))
            );
        };

        // 初始矩阵
        steps.push({
            matrix: formatMatrixForDisplay(detMatrix),
            description: `初始矩阵，阶数为 ${n}`
        });

        for (let i = 0; i < n; i++) {
            // 寻找主元
            let pivotRow = i;
            for (let j = i; j < n; j++) {
                const currentAbs = detMatrix[j][i] instanceof Fraction ? 
                    Math.abs(detMatrix[j][i].toFloat()) : Math.abs(detMatrix[j][i]);
                const pivotAbs = detMatrix[pivotRow][i] instanceof Fraction ? 
                    Math.abs(detMatrix[pivotRow][i].toFloat()) : Math.abs(detMatrix[pivotRow][i]);
                
                if (currentAbs > pivotAbs) {
                    pivotRow = j;
                }
            }

            // 交换行
            if (pivotRow !== i) {
                [detMatrix[i], detMatrix[pivotRow]] = [detMatrix[pivotRow], detMatrix[i]];
                swapCount++;
                steps.push({
                    matrix: formatMatrixForDisplay(detMatrix),
                    description: `交换第 ${i+1} 行和第 ${pivotRow+1} 行`
                });
            }

            // 如果主元为0，行列式为0
            const pivotValue = detMatrix[i][i];
            const isZero = pivotValue instanceof Fraction ? 
                pivotValue.numerator === 0 : Math.abs(pivotValue) < 1e-10;
                
            if (isZero) {
                steps.push({
                    matrix: formatMatrixForDisplay(detMatrix),
                    description: `主元位置（第${i+1}行第${i+1}列）为0，行列式值为0`
                });
                return { result: new Fraction(0), steps };
            }

            // 计算上三角矩阵
            for (let j = i + 1; j < n; j++) {
                let factor;
                if (detMatrix[j][i] instanceof Fraction && detMatrix[i][i] instanceof Fraction) {
                    // 分数除法
                    factor = detMatrix[j][i].divide(detMatrix[i][i]);
                } else {
                    // 数值除法
                    factor = detMatrix[j][i] / detMatrix[i][i];
                    if (this.useFractions) {
                        factor = this.toFraction(factor);
                    }
                }
                
                for (let k = i; k < n; k++) {
                    let product;
                    if (factor instanceof Fraction && detMatrix[i][k] instanceof Fraction) {
                        // 分数乘法
                        product = factor.multiply(detMatrix[i][k]);
                    } else {
                        // 数值乘法
                        product = factor * detMatrix[i][k];
                        if (this.useFractions && !(factor instanceof Fraction) && !(detMatrix[i][k] instanceof Fraction)) {
                            product = this.toFraction(product);
                        }
                    }
                    
                    if (detMatrix[j][k] instanceof Fraction && product instanceof Fraction) {
                        // 分数减法
                        detMatrix[j][k] = detMatrix[j][k].subtract(product);
                    } else {
                        // 数值减法
                        detMatrix[j][k] = detMatrix[j][k] - product;
                        if (this.useFractions && !(detMatrix[j][k] instanceof Fraction)) {
                            detMatrix[j][k] = this.toFraction(detMatrix[j][k]);
                        }
                    }
                }
                
                steps.push({
                    matrix: formatMatrixForDisplay(detMatrix),
                    description: `第 ${j+1} 行减去第 ${i+1} 行的 ${this.formatNumber(factor)} 倍`
                });
            }
        }

        // 计算对角线元素乘积
        let result = new Fraction(1);
        for (let i = 0; i < n; i++) {
            if (detMatrix[i][i] instanceof Fraction) {
                result = result.multiply(detMatrix[i][i]);
            } else {
                result = result.multiply(new Fraction(detMatrix[i][i]));
            }
        }

        // 考虑交换次数的符号
        if (swapCount % 2 !== 0) {
            result = result.multiply(new Fraction(-1));
        }
        
        steps.push({
            matrix: null,
            description: `行列式值为对角线元素乘积乘以(-1)^${swapCount}，结果为 ${this.formatNumber(result)}`
        });

        return { result, steps };
    }

    /**
     * 分析向量线性相关性
     * @param {Array<Array<number>>} vectors - 向量数组
     * @returns {Object} 分析结果
     */
    analyzeVectors(vectors) {
        // 输入验证
        if (!vectors || !Array.isArray(vectors) || vectors.length === 0) {
            throw new Error('向量集合不能为空');
        }
        if (!Array.isArray(vectors[0]) || vectors[0].length === 0) {
            throw new Error('向量不是有效的数组');
        }
        
        const steps = [];
        const m = vectors.length; // 向量的数量
        const n = vectors[0].length; // 每个向量的维度
        
        // 检查所有向量是否具有相同的维度
        for (let i = 0; i < m; i++) {
            if (!Array.isArray(vectors[i]) || vectors[i].length !== n) {
                throw new Error('所有向量必须具有相同的维度');
            }
        }
        
        // 将向量作为矩阵的列（使用列变换的标准做法）
        let matrix = [];
        for (let i = 0; i < n; i++) {
            matrix[i] = [];
            for (let j = 0; j < m; j++) {
                matrix[i][j] = this.convertToAppropriateType(vectors[j][i]);
            }
        }

        steps.push({
            matrix: this.copyMatrix(matrix),
            description: "将向量作为矩阵的列"
        });

        // 进行列变换求秩（列主元分析）
        let rank = 0;
        let pivotColumns = [];
        let columnIndices = Array.from({length: m}, (_, i) => i); // 记录原始列索引
        
        for (let i = 0, j = 0; i < n && j < m; i++) {
            // 寻找列主元
            let pivotCol = j;
            for (let k = j; k < m; k++) {
                const currentAbs = matrix[i][k] instanceof Fraction ? 
                    Math.abs(matrix[i][k].toFloat()) : Math.abs(matrix[i][k]);
                const pivotAbs = matrix[i][pivotCol] instanceof Fraction ? 
                    Math.abs(matrix[i][pivotCol].toFloat()) : Math.abs(matrix[i][pivotCol]);
                
                if (currentAbs > pivotAbs) {
                    pivotCol = k;
                }
            }

            // 如果当前行没有主元，继续下一行
            const pivotValue = matrix[i][pivotCol];
            const isZero = pivotValue instanceof Fraction ? 
                pivotValue.numerator === 0 : Math.abs(pivotValue) < 1e-10;
            
            if (isZero) {
                continue;
            }

            // 交换列
            if (pivotCol !== j) {
                // 交换矩阵中的列
                for (let k = 0; k < n; k++) {
                    [matrix[k][j], matrix[k][pivotCol]] = [matrix[k][pivotCol], matrix[k][j]];
                }
                // 更新列索引映射
                [columnIndices[j], columnIndices[pivotCol]] = [columnIndices[pivotCol], columnIndices[j]];
                steps.push({
                    matrix: this.copyMatrix(matrix),
                    description: `交换第 ${j+1} 列和第 ${pivotCol+1} 列`
                });
            }

            // 归一化主元列
            const pivot = matrix[i][j];
            for (let k = i; k < n; k++) {
                if (matrix[k][j] instanceof Fraction && pivot instanceof Fraction) {
                    matrix[k][j] = matrix[k][j].divide(pivot);
                } else {
                    matrix[k][j] = this.round(matrix[k][j] / pivot);
                    if (this.useFractions && !(matrix[k][j] instanceof Fraction)) {
                        matrix[k][j] = this.toFraction(matrix[k][j]);
                    }
                }
            }
            steps.push({
                matrix: this.copyMatrix(matrix),
                description: `第 ${j+1} 列除以主元 ${this.formatNumber(pivot)} 进行归一化`
            });

            // 消去其他列的当前行
            for (let k = 0; k < m; k++) {
                if (k !== j) {
                    const currentValue = matrix[i][k];
                    const isNonZero = currentValue instanceof Fraction ? 
                        currentValue.numerator !== 0 : Math.abs(currentValue) > 1e-10;
                    
                    if (isNonZero) {
                        let factor;
                        if (matrix[i][k] instanceof Fraction && matrix[i][j] instanceof Fraction) {
                            factor = matrix[i][k].divide(matrix[i][j]);
                        } else {
                            factor = matrix[i][k] / matrix[i][j];
                            if (this.useFractions) {
                                factor = this.toFraction(factor);
                            }
                        }
                        
                        for (let l = i; l < n; l++) {
                            let product;
                            if (factor instanceof Fraction && matrix[l][j] instanceof Fraction) {
                                product = factor.multiply(matrix[l][j]);
                            } else {
                                product = factor * matrix[l][j];
                                if (this.useFractions && !(factor instanceof Fraction) && !(matrix[l][j] instanceof Fraction)) {
                                    product = this.toFraction(product);
                                }
                            }
                            
                            if (matrix[l][k] instanceof Fraction && product instanceof Fraction) {
                                matrix[l][k] = matrix[l][k].subtract(product);
                            } else {
                                matrix[l][k] = this.round(matrix[l][k] - product);
                                if (this.useFractions && !(matrix[l][k] instanceof Fraction)) {
                                    matrix[l][k] = this.toFraction(matrix[l][k]);
                                }
                            }
                        }
                        
                        steps.push({
                            matrix: this.copyMatrix(matrix),
                            description: `第 ${k+1} 列减去第 ${j+1} 列的 ${this.formatNumber(factor)} 倍`
                        });
                    }
                }
            }

            pivotColumns.push(j);
            rank++;
            j++;
        }

        // 确定极大线性无关组（根据主元列的原始索引）
        const maxIndependentSet = pivotColumns.map(colIndex => {
            const originalVectorIndex = columnIndices[colIndex];
            return vectors[originalVectorIndex];
        }).filter((vec, index, self) => 
            // 去重
            self.findIndex(v => JSON.stringify(v) === JSON.stringify(vec)) === index
        );

        const isLinearlyIndependent = rank === m;

        return {
            isLinearlyIndependent,
            rank,
            maxIndependentSet,
            pivotColumns: pivotColumns.map(col => col + 1), // 转换为1-based索引
            steps
        };
    }

    /**
     * 计算两个向量的点积
     * @param {Array<number|Fraction>} vector1 - 第一个向量
     * @param {Array<number|Fraction>} vector2 - 第二个向量
     * @returns {number|Fraction} 点积结果
     */
    dotProduct(vector1, vector2) {
        if (!Array.isArray(vector1) || !Array.isArray(vector2) || vector1.length !== vector2.length) {
            throw new Error('向量必须是相同长度的数组');
        }

        let result = 0;
        if (this.useFractions) {
            result = new Fraction(0);
        }

        for (let i = 0; i < vector1.length; i++) {
            const v1 = this.convertToAppropriateType(vector1[i]);
            const v2 = this.convertToAppropriateType(vector2[i]);
            let product;

            if (v1 instanceof Fraction && v2 instanceof Fraction) {
                product = v1.multiply(v2);
            } else if (v1 instanceof Fraction) {
                product = v1.multiply(v2);
            } else if (v2 instanceof Fraction) {
                product = v2.multiply(v1);
            } else {
                product = v1 * v2;
                if (this.useFractions) {
                    product = this.toFraction(product);
                }
            }

            if (result instanceof Fraction && product instanceof Fraction) {
                result = result.add(product);
            } else if (result instanceof Fraction) {
                result = result.add(product);
            } else {
                result += product;
            }
        }

        return result;
    }

    /**
     * 向量数乘
     * @param {Array<number|Fraction>} vector - 向量
     * @param {number|Fraction} scalar - 标量
     * @returns {Array<number|Fraction>} 结果向量
     */
    scalarMultiply(vector, scalar) {
        if (!Array.isArray(vector)) {
            throw new Error('参数必须是向量数组');
        }

        const scalarType = this.convertToAppropriateType(scalar);
        const result = [];

        for (let i = 0; i < vector.length; i++) {
            const v = this.convertToAppropriateType(vector[i]);
            let product;

            if (v instanceof Fraction && scalarType instanceof Fraction) {
                product = v.multiply(scalarType);
            } else if (v instanceof Fraction) {
                product = v.multiply(scalarType);
            } else if (scalarType instanceof Fraction) {
                product = scalarType.multiply(v);
            } else {
                product = v * scalarType;
                if (this.useFractions) {
                    product = this.toFraction(product);
                }
            }

            result.push(product);
        }

        return result;
    }

    /**
     * 向量加法
     * @param {Array<number|Fraction>} vector1 - 第一个向量
     * @param {Array<number|Fraction>} vector2 - 第二个向量
     * @returns {Array<number|Fraction>} 结果向量
     */
    addVectors(vector1, vector2) {
        if (!Array.isArray(vector1) || !Array.isArray(vector2) || vector1.length !== vector2.length) {
            throw new Error('向量必须是相同长度的数组');
        }

        const result = [];

        for (let i = 0; i < vector1.length; i++) {
            const v1 = this.convertToAppropriateType(vector1[i]);
            const v2 = this.convertToAppropriateType(vector2[i]);
            let sum;

            if (v1 instanceof Fraction && v2 instanceof Fraction) {
                sum = v1.add(v2);
            } else if (v1 instanceof Fraction) {
                sum = v1.add(v2);
            } else if (v2 instanceof Fraction) {
                sum = v2.add(v1);
            } else {
                sum = v1 + v2;
                if (this.useFractions) {
                    sum = this.toFraction(sum);
                }
            }

            result.push(sum);
        }

        return result;
    }

    /**
     * 向量减法
     * @param {Array<number|Fraction>} vector1 - 被减向量
     * @param {Array<number|Fraction>} vector2 - 减向量
     * @returns {Array<number|Fraction>} 结果向量
     */
    subtractVectors(vector1, vector2) {
        if (!Array.isArray(vector1) || !Array.isArray(vector2) || vector1.length !== vector2.length) {
            throw new Error('向量必须是相同长度的数组');
        }

        const result = [];

        for (let i = 0; i < vector1.length; i++) {
            const v1 = this.convertToAppropriateType(vector1[i]);
            const v2 = this.convertToAppropriateType(vector2[i]);
            let difference;

            if (v1 instanceof Fraction && v2 instanceof Fraction) {
                difference = v1.subtract(v2);
            } else if (v1 instanceof Fraction) {
                difference = v1.subtract(v2);
            } else if (v2 instanceof Fraction) {
                difference = new Fraction(v1).subtract(v2);
            } else {
                difference = v1 - v2;
                if (this.useFractions) {
                    difference = this.toFraction(difference);
                }
            }

            result.push(difference);
        }

        return result;
    }

    /**
     * 计算向量的模长
     * @param {Array<number|Fraction>} vector - 向量
     * @returns {number} 模长
     */
    vectorNorm(vector) {
        if (!Array.isArray(vector)) {
            throw new Error('参数必须是向量数组');
        }

        // 检查向量是否全部是浮点数
        const allFloats = vector.every(element => typeof element === 'number');
        
        // 如果全部是浮点数，直接使用浮点数计算，避免精度损失
        if (allFloats) {
            let sumOfSquares = 0;
            for (let i = 0; i < vector.length; i++) {
                sumOfSquares += vector[i] * vector[i];
            }
            return Math.sqrt(sumOfSquares);
        }

        // 否则使用常规计算方式（可能包含Fraction）
        let sumOfSquares = 0;
        if (this.useFractions) {
            sumOfSquares = new Fraction(0);
        }

        for (let i = 0; i < vector.length; i++) {
            const v = this.convertToAppropriateType(vector[i]);
            let square;

            if (v instanceof Fraction) {
                square = v.multiply(v);
            } else {
                square = v * v;
                if (this.useFractions) {
                    square = this.toFraction(square);
                }
            }

            if (sumOfSquares instanceof Fraction && square instanceof Fraction) {
                sumOfSquares = sumOfSquares.add(square);
            } else if (sumOfSquares instanceof Fraction) {
                sumOfSquares = sumOfSquares.add(square);
            } else {
                sumOfSquares += square;
            }
        }

        // 计算并返回真正的模长（平方和的平方根）
        if (sumOfSquares instanceof Fraction) {
            return Math.sqrt(sumOfSquares.toFloat());
        } else {
            return Math.sqrt(sumOfSquares);
        }
    }

    /**
     * 向量单位化
     * @param {Array<number|Fraction>} vector - 向量
     * @returns {Array<number|Fraction>} 单位化后的向量（根据useFractions决定类型）
     */
    normalizeVector(vector) {
        if (!Array.isArray(vector)) {
            throw new Error('参数必须是向量数组');
        }

        // 计算向量的模长
        const norm = this.vectorNorm(vector);
        
        // 如果模长接近零，说明是零向量
        if (typeof norm === 'number' && Math.abs(norm) < 1e-10) {
            throw new Error('零向量无法单位化');
        }

        // 计算模长的倒数作为标量
        const scalar = 1 / norm;

        // 对于单位化操作，返回浮点数数组更合适
        // 因为单位化涉及平方根，通常是无理数，无法用精确分数表示
        return vector.map(element => {
            if (element instanceof Fraction) {
                return element.toFloat() * scalar;
            } else {
                return element * scalar;
            }
        });
    }

    /**
     * 施密尔特正交化
     * @param {Array<Array<number|string>>} vectors - 向量数组
     * @returns {Object} 正交化结果
     */
    schmidtOrthonormalization(vectors) {
        // 输入验证
        if (!vectors || !Array.isArray(vectors) || vectors.length === 0) {
            throw new Error('向量集合不能为空');
        }
        if (!Array.isArray(vectors[0]) || vectors[0].length === 0) {
            throw new Error('向量不是有效的数组');
        }

        const steps = [];
        const m = vectors.length; // 向量的数量
        const n = vectors[0].length; // 每个向量的维度

        // 检查所有向量是否具有相同的维度
        for (let i = 0; i < m; i++) {
            if (!Array.isArray(vectors[i]) || vectors[i].length !== n) {
                throw new Error('所有向量必须具有相同的维度');
            }
        }

        // 首先判断向量组是否线性无关
        const linearityResult = this.analyzeVectors(vectors);
        if (!linearityResult.isLinearlyIndependent) {
            return {
                isLinearlyIndependent: false,
                rank: linearityResult.rank,
                orthogonalVectors: [],
                orthonormalVectors: [],
                steps: [...linearityResult.steps, {
                    matrix: null,
                    description: '向量组线性相关，无法进行施密尔特正交化'
                }]
            };
        }

        // 将输入向量转换为适当的类型（保持原始数据的独立拷贝）
        const processedVectors = vectors.map(vector => 
            vector.map(value => this.convertToAppropriateType(value))
        );

        const orthogonalVectors = []; // 保存正交向量（元素可能为 Fraction 或 number）
        const orthonormalVectors = []; // 保存单位化向量（返回 float 数组）

        // 帮助函数：安全除法，尽量保留 Fraction 类型
        const safeDivide = (a, b) => {
            if (b === 0 || (b instanceof Fraction && b.numerator === 0)) {
                throw new Error('用于投影的除数为0');
            }
            if (a instanceof Fraction && b instanceof Fraction) {
                return a.divide(b);
            } else if (a instanceof Fraction) {
                return a.divide(b);
            } else if (b instanceof Fraction) {
                return new Fraction(a).divide(b);
            } else {
                const num = a / b;
                return this.useFractions ? this.toFraction(num) : num;
            }
        };

        // 开始施密尔特正交化过程
        for (let i = 0; i < m; i++) {
            // 深拷贝当前向量，避免后续修改影响原向量
            let u = processedVectors[i].map(el => el instanceof Fraction ? new Fraction(el.numerator, el.denominator) : el);
            let description = `u_${i+1} = v_${i+1}`;

            // 减去前面所有正交向量的投影
            for (let j = 0; j < i; j++) {
                const vOrth = orthogonalVectors[j];

                const dotUOrth = this.dotProduct(u, vOrth);
                const dotOrthOrth = this.dotProduct(vOrth, vOrth);

                // 如果分母为零，跳过该投影（通常不会发生，因为已经检测线性无关）
                const isZeroDen = dotOrthOrth instanceof Fraction ? dotOrthOrth.numerator === 0 : Math.abs(dotOrthOrth) < 1e-12;
                if (isZeroDen) continue;

                let projectionCoeff = safeDivide(dotUOrth, dotOrthOrth);

                // 计算投影并从 u 中减去
                const projection = this.scalarMultiply(vOrth, projectionCoeff);
                u = this.subtractVectors(u, projection);

                // 更新描述
                description += ` - ${this.formatNumber(projectionCoeff)}*u_${j+1}`;

                // 记录一步细节（展示当前投影系数与中间向量）
                steps.push({
                    matrix: [ this.formatNumberVector(projection) ],
                    description: `将 ${this.formatNumber(projectionCoeff)} * u_${j+1} 从 v_${i+1} 中减去（投影）`
                });

                steps.push({
                    matrix: [ this.formatNumberVector(u) ],
                    description: `减去投影后，得到中间正交向量 u_${i+1}`
                });
            }

            // 将 u 深拷贝保存为正交向量（保持 Fraction 精度时用 Fraction）
            const uCopy = u.map(el => el instanceof Fraction ? new Fraction(el.numerator, el.denominator) : el);
            orthogonalVectors.push(uCopy);

            // 计算并保存单位向量（返回浮点数组）
            const e = this.normalizeVector(u);
            orthonormalVectors.push(e);

            // 添加步骤（显示最终的 u 和对应单位向量 e）
            steps.push({
                matrix: [ this.formatNumberVector(uCopy) ],
                description: `${description} = ${this.formatNumberVector(uCopy)}`
            });

            steps.push({
                matrix: [ this.formatNumberVector(e) ],
                description: `单位化 u_${i+1} 得到 e_${i+1} = u_${i+1}/||u_${i+1}|| = ${this.formatNumberVector(e)}`
            });
        }

        return {
            isLinearlyIndependent: true,
            rank: m,
            orthogonalVectors,
            orthonormalVectors,
            steps: [...linearityResult.steps, ...steps]
        };
    }

    /**
     * 格式化向量用于显示
     * @param {Array<number|Fraction>} vector - 向量
     * @returns {Array<string>} 格式化后的向量
     */
    formatNumberVector(vector) {
        return vector.map(value => this.formatNumber(value));
    }

    /**
     * --- LaTeX 支持辅助方法 ---
     * 以下方法用于将数字/分数/向量/矩阵格式化为 LaTeX 表示，供页面渲染步骤时调用。
     */

    /**
     * 检查文本中是否已经包含 LaTeX 标记
     * @param {string} text
     * @returns {boolean}
     */
    containsLatexMarkers(text) {
        if (text === null || text === undefined) return false;
        return /\$|\\\(|\\\[|\\begin\{/.test(String(text));
    }

    /**
     * 将格式化的数字/分数字符串转换为 LaTeX 表示
     * 支持 "a/b"、"-a/b"、带分数 "q r/s" 形式
     * @param {string|number} input
     * @returns {string} LaTeX 片段（不含 $$ 包裹）
     */
    formatStringToLatex(input) {
        if (input === null || input === undefined) return '0';
        let str = String(input).trim();

        // 先统一把 lambda 符号/文字转换为 LaTeX 命令 \lambda（避免后续被当普通字符）
        // 处理：Unicode λ、单词 "lambda"、已有 "\lambda" 都能被统一为 \lambda
        str = str.replace(/\\lambda/g, '\\lambda'); // 已有转义保持
        str = str.replace(/λ/g, '\\lambda');
        str = str.replace(/\blambda\b/gi, '\\lambda');

        // 带分数 "int num/den"
        if (/\d+\s+\d+\/\d+/.test(str)) {
            const parts = str.split(/\s+/);
            const intPart = parts[0];
            const fracPart = parts[1];
            const [num, den] = fracPart.split('/');
            return `${intPart} + \\frac{${num}}{${den}}`;
        }

        // 纯分数 a/b
        if (/^-?\d+\/\d+$/.test(str)) {
            const negative = str.startsWith('-');
            if (negative) str = str.slice(1);
            const [num, den] = str.split('/');
            const frac = `\\frac{${num}}{${den}}`;
            return negative ? `-${frac}` : frac;
        }

        // 如果已经包含 LaTeX 标记则直接返回原样（避免二次转义）
        if (this.containsLatexMarkers(str)) return str;

        // 将 x_y 形式转换为 x_{y}（适合行内 LaTeX）
        str = str.replace(/\b([a-zA-Z])_(\d+)\b/g, '$1_{ $2 }');

        return str;
    }

    /**
     * 将单个数字/分数转换为 LaTeX（包装为可直接放入矩阵条目的字符串）
     * @param {number|Fraction|string} value
     * @returns {string}
     */
    numberToLatex(value) {
        try {
            // 先用现有格式器得到显示字符串，再转换为 LaTeX 片段
            const formatted = this.formatNumber(value);
            return this.formatStringToLatex(formatted);
        } catch (e) {
            return this.formatStringToLatex(String(value));
        }
    }

    /**
     * 将向量（数组）转换为 LaTeX 列向量（返回带 $$ 包裹的字符串）
     * @param {Array<number|string>} vector
     * @returns {string} $$\begin{bmatrix} ... \end{bmatrix}$$
     */
    vectorToLatex(vector) {
        if (!Array.isArray(vector)) return '';
        const rows = vector.map(cell => this.numberToLatex(cell)).join(' \\\\ ');
        const latex = `\\begin{bmatrix}${rows}\\end{bmatrix}`;
        return `$$${latex}$$`;
    }

    /**
     * 将矩阵（二维数组）转换为 LaTeX 矩阵（返回带 $$ 包裹的字符串）
     * @param {Array<Array<number|string>>} matrix
     * @returns {string} $$\begin{bmatrix} ... \end{bmatrix}$$
     */
    matrixToLatex(matrix) {
        if (!Array.isArray(matrix) || matrix.length === 0) return '';
        const rows = matrix.map(row => {
            if (!Array.isArray(row)) return this.numberToLatex(row);
            return row.map(cell => this.numberToLatex(cell)).join(' & ');
        }).join(' \\\\ ');
        const latex = `\\begin{bmatrix}${rows}\\end{bmatrix}`;
        return `$$${latex}$$`;
    }

    /**
     * 自动将常见数学片段包装为行内 LaTeX（用于描述文本）
     * - 分数 a/b -> $frac{a}{b}$
     * - 下标 u_1 -> $u_{1}$
     * - 乘法 a * b -> $a cdot b$（在安全条件下），否则回退为中点 "·"
     * - 支持把 'λ' 或 'lambda' 转为行内 LaTeX $lambda$，并支持带指数的形式
     * @param {string} text
     * @returns {string} 处理后的 HTML 字符串（含 $ ... $）
     */
    autoWrapMath(text) {
        if (!text) return '';
        let src = String(text);

        // 暂存 HTML 标签，避免误替换
        const htmlTags = [];
        src = src.replace(/<[^>]+>/g, (m) => {
            htmlTags.push(m);
            return `__HTML_TAG_${htmlTags.length - 1}__`;
        });

        // 先处理 lambda 带指数的形式： λ^2 或 lambda^2 -> $lambda^{2}$
        src = src.replace(/(?:λ|lambda)\s*\^\s*(\d+)/gi, (m, p1) => {
            return `$\\lambda^{${p1}}$`;
        });

        // 再处理孤立的 λ 或 lambda -> $lambda$
        src = src.replace(/(?:λ|lambda)\b/gi, (m) => {
            return `$\\lambda$`;
        });

        // 分数 a/b -> $frac{a}{b}$
        src = src.replace(/-?\d+\/\d+/g, (m) => {
            const negative = m.startsWith('-');
            const core = negative ? m.slice(1) : m;
            const [num, den] = core.split('/');
            const frac = `\\frac{${num}}{${den}}`;
            return (negative ? '-' : '') + `$${frac}$`;
        });

        // 下标 x_1 -> $x_{1}$
        src = src.replace(/\b([a-zA-Z])_(\d+)\b/g, (m, p1, p2) => `$${p1}_{${p2}}$`);

        // 乘法 a * b -> $a cdot b$ 或回退为中点
        src = src.replace(/([^\s<>$]+)\s*\*\s*([^\s<>$]+)/g, (match, left, right) => {
            const leftHasLatex = this.containsLatexMarkers(left);
            const rightHasLatex = this.containsLatexMarkers(right);
            const leftIsHtml = /<[^>]+>/.test(left) || /<[^>]+>/.test(right);

            if (leftHasLatex || rightHasLatex || leftIsHtml) {
                return `${left} · ${right}`;
            }
            return `$${left} \\cdot ${right}$`;
        });

        // 恢复 HTML 标签
        src = src.replace(/__HTML_TAG_(\d+)__/g, (_, idx) => htmlTags[parseInt(idx, 10)] || '');

        return src;
    }


    // 解线性方程组 Ax = b
    solveEquations(matrix, constants) {
        // 输入验证
        if (!Array.isArray(matrix) || !Array.isArray(constants)) {
            throw new Error('输入矩阵和常数项必须为数组');
        }

        if (matrix.length !== constants.length) {
            throw new Error('矩阵行数必须与常数项长度相同');
        }

        // 构建增广矩阵
        const augmentedMatrix = [];
        for (let i = 0; i < matrix.length; i++) {
            if (matrix[i].length !== matrix[0].length) {
                throw new Error('矩阵必须为矩形');
            }
            augmentedMatrix.push(matrix[i].concat(constants[i]));
        }

        // 高斯消元到行阶梯形
        const rref = this.reduceToRowEchelon(augmentedMatrix);
        const rankA = this.calculateRank(matrix);
        const rankAugmented = this.calculateRank(rref);

        // 确定解的类型
        if (rankA < rankAugmented) {
            // 无解
            return {
                type: 'no-solution',
                rankA: rankA,
                rankAugmented: rankAugmented
            };
        } else if (rankA === rankAugmented && rankA === matrix[0].length) {
            // 唯一解
            const solution = this.gaussianElimination(rref);
            return {
                type: 'unique-solution',
                solution: solution,
                rankA: rankA,
                rankAugmented: rankAugmented
            };
        } else {
            // 无穷多解
            const { particularSolution, basisSolutions } = this.findParticularSolutionAndBasis(rref);
            return {
                type: 'infinite-solutions',
                particularSolution: particularSolution,
                basisSolutions: basisSolutions,
                rankA: rankA,
                rankAugmented: rankAugmented,
                dimension: matrix[0].length - rankA
            };
        }
    }

    // 高斯消元法（唯一解情况）
    gaussianElimination(augmentedMatrix) {
        const n = augmentedMatrix.length;
        const x = new Array(n).fill(0);

        // 回代求解
        for (let i = n - 1; i >= 0; i--) {
            let sum = 0;
            for (let j = i + 1; j < n; j++) {
                sum += augmentedMatrix[i][j] * x[j];
            }
            x[i] = (augmentedMatrix[i][n] - sum) / augmentedMatrix[i][i];
        }

        return x.map(val => this.round(val, 6));
    }

    // 将矩阵转换为行阶梯形
    reduceToRowEchelon(matrix) {
        const m = matrix.length;
        const n = matrix[0].length;
        const result = matrix.map(row => [...row]);

        let lead = 0;
        for (let r = 0; r < m; r++) {
            if (lead >= n) break;

            // 找到主元行
            let i = r;
            while (this.isZero(result[i][lead])) {
                i++;
                if (i === m) {
                    i = r;
                    lead++;
                    if (lead === n) return result;
                }
            }

            // 交换行
            [result[i], result[r]] = [result[r], result[i]];

            // 归一化主元行
            const lv = result[r][lead];
            if (!this.isZero(lv)) {
                for (let j = lead; j < n; j++) {
                    result[r][j] /= lv;
                }
            }

            // 消去其他行
            for (let i = 0; i < m; i++) {
                if (i !== r && !this.isZero(result[i][lead])) {
                    const lv = result[i][lead];
                    for (let j = lead; j < n; j++) {
                        result[i][j] -= lv * result[r][j];
                    }
                }
            }

            lead++;
        }

        return result;
    }

    // 计算矩阵的秩
    calculateRank(matrix) {
        const rref = this.reduceToRowEchelon(matrix);
        let rank = 0;
        for (const row of rref) {
            if (!row.every(val => this.isZero(val))) {
                rank++;
            }
        }
        return rank;
    }

    // 判断数值是否为零（考虑浮点数误差）
    isZero(value) {
        return Math.abs(value) < 1e-10;
    }

    // 找到特解和基础解系
    findParticularSolutionAndBasis(rref) {
        const m = rref.length;
        const n = rref[0].length - 1; // 减1是因为最后一列是常数项
        const particularSolution = new Array(n).fill(0);
        const basisSolutions = [];
        const pivotColumns = new Set();

        // 找到主元列
        for (let i = 0; i < m; i++) {
            const pivotIndex = rref[i].findIndex(val => !this.isZero(val));
            if (pivotIndex !== -1 && pivotIndex < n) {
                pivotColumns.add(pivotIndex);
            }
        }

        // 自由变量索引
        const freeVariables = [];
        for (let j = 0; j < n; j++) {
            if (!pivotColumns.has(j)) {
                freeVariables.push(j);
            }
        }

        // 构建特解
        for (let i = 0; i < m; i++) {
            const pivotIndex = rref[i].findIndex(val => !this.isZero(val));
            if (pivotIndex !== -1 && pivotIndex < n) {
                particularSolution[pivotIndex] = rref[i][n];
            }
        }

        // 构建基础解系
        for (const freeVar of freeVariables) {
            const basis = new Array(n).fill(0);
            basis[freeVar] = 1;

            for (let i = 0; i < m; i++) {
                const pivotIndex = rref[i].findIndex(val => !this.isZero(val));
                if (pivotIndex !== -1 && pivotIndex < n && pivotIndex !== freeVar) {
                    basis[pivotIndex] = -rref[i][freeVar];
                }
            }

            basisSolutions.push(basis.map(val => this.round(val, 6)));
        }

        return {
            particularSolution: particularSolution.map(val => this.round(val, 6)),
            basisSolutions: basisSolutions
        };
    }}

// 只支持CommonJS和浏览器全局导出
if (typeof module !== 'undefined' && module.exports) {
    // CommonJS 导出
    module.exports = { MatrixOperations, Fraction };
} else if (typeof window !== 'undefined') {
    // 浏览器全局导出
    window.MatrixOperations = MatrixOperations;
    window.Fraction = Fraction;
}













