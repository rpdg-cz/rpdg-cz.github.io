/**
 * 分数类 - 用于表示和处理有理数
 */
class Fraction {
    /**
     * 构造函数
     * @param {number|string} numerator - 分子或分数表达式
     * @param {number} denominator - 分母（可选，如果numerator是字符串则忽略）
     */
    constructor(numerator, denominator) {
        if (typeof numerator === 'string') {
            // 从字符串解析分数
            const match = numerator.match(/^(-?\d+)\/(\d+)$/);
            if (match) {
                numerator = parseInt(match[1]);
                denominator = parseInt(match[2]);
            } else {
                // 整数
                numerator = parseInt(numerator);
                denominator = 1;
            }
        } else if (denominator === undefined) {
            // 单个数字
            denominator = 1;
        }
        
        // 简化分数
        const gcd = Fraction.gcd(Math.abs(numerator), Math.abs(denominator));
        this.numerator = numerator / gcd;
        this.denominator = denominator / gcd;
        
        // 确保分母为正
        if (this.denominator < 0) {
            this.numerator = -this.numerator;
            this.denominator = -this.denominator;
        }
    }
    
    /**
     * 计算最大公约数
     * @param {number} a - 第一个数
     * @param {number} b - 第二个数
     * @returns {number} 最大公约数
     */
    static gcd(a, b) {
        while (b !== 0) {
            const temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }

    /**
     * 转换为浮点数
     * @returns {number} 浮点数表示
     */
    toFloat() {
        return this.numerator / this.denominator;
    }

    /**
     * 加法
     * @param {Fraction|number} other - 另一个分数或数字
     * @returns {Fraction} 结果分数
     */
    add(other) {
        if (!(other instanceof Fraction)) {
            other = new Fraction(other);
        }
        const numerator = this.numerator * other.denominator + other.numerator * this.denominator;
        const denominator = this.denominator * other.denominator;
        return new Fraction(numerator, denominator);
    }

    /**
     * 减法
     * @param {Fraction|number} other - 另一个分数或数字
     * @returns {Fraction} 结果分数
     */
    subtract(other) {
        if (!(other instanceof Fraction)) {
            other = new Fraction(other);
        }
        const numerator = this.numerator * other.denominator - other.numerator * this.denominator;
        const denominator = this.denominator * other.denominator;
        return new Fraction(numerator, denominator);
    }

    /**
     * 乘法
     * @param {Fraction|number} other - 另一个分数或数字
     * @returns {Fraction} 结果分数
     */
    multiply(other) {
        if (!(other instanceof Fraction)) {
            other = new Fraction(other);
        }
        const numerator = this.numerator * other.numerator;
        const denominator = this.denominator * other.denominator;
        return new Fraction(numerator, denominator);
    }

    /**
     * 除法
     * @param {Fraction|number} other - 另一个分数或数字
     * @returns {Fraction} 结果分数
     */
    divide(other) {
        if (!(other instanceof Fraction)) {
            other = new Fraction(other);
        }
        const numerator = this.numerator * other.denominator;
        const denominator = this.denominator * other.numerator;
        return new Fraction(numerator, denominator);
    }

    /**
     * 转换为字符串表示
     * @returns {string} 分数的字符串表示
     */
    toString() {
        if (this.denominator === 1) {
            // 整数情况
            return this.numerator.toString();
        } else {
            // 分数情况
            return `${this.numerator}/${this.denominator}`;
        }
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
            this.formatType = formatType; // 默认使用传入的格式类型
        }
    }
    
    /**
     * 获取当前输出格式类型
     * @returns {string} 当前输出格式类型
     */
    getFormatType() {
        return this.formatType;
    }
    
    /**
     * 将数字转换为分数
     * @param {number} num - 输入数字
     * @returns {Fraction} 分数对象
     */
    toFraction(num) {
        if (num instanceof Fraction) {
            return num;
        }
        
        // 将浮点数转换为分数
        if (typeof num === 'number') {
            const decimalPlaces = 10;
            const denominator = Math.pow(10, decimalPlaces);
            const numerator = Math.round(num * denominator);
            return new Fraction(numerator, denominator);
        } else {
            // 字符串或其他类型
            return new Fraction(num);
        }
    }
    
    /**
     * 格式化数字输出
     * @param {number|Fraction} num - 输入数字或分数
     * @param {string} formatType - 输出格式类型
     * @returns {string} 格式化后的字符串
     */
    formatNumber(num, formatType) {
        if (formatType === 'integer') {
            return Math.round(num).toString();
        } else if (formatType === 'rational') {
            if (this.useFractions && !(num instanceof Fraction)) {
                num = this.toFraction(num);
            }
            
            if (num instanceof Fraction) {
                if (num.denominator === 1) {
                    return num.numerator.toString();
                } else {
                    return num.numerator + '/' + num.denominator;
                }
            } else {
                return num.toFixed(this.precision);
            }
        } else {
            // 默认使用浮点数输出
            return num.toString();
        }
    }
    
    /**
     * 四舍五入数字
     * @param {number} num - 输入数字
     * @param {number} precision - 小数位数
     * @returns {number} 四舍五入后的数字
     */
    round(num, precision = this.precision) {
        const factor = Math.pow(10, precision);
        return Math.round(num * factor) / factor;
    }
    
    /**
     * 将值转换为适当的类型（数字或分数）
     * @param {string|number} value - 输入值
     * @returns {number|Fraction} 转换后的值
     */
    convertToAppropriateType(value) {
        if (typeof value === 'string') {
            // 尝试解析为数字
            const num = parseFloat(value);
            if (!isNaN(num)) {
                if (this.useFractions) {
                    return this.toFraction(num);
                } else {
                    return num;
                }
            } else {
                // 尝试解析为分数
                return new Fraction(value);
            }
        } else if (typeof value === 'number') {
            if (this.useFractions) {
                return this.toFraction(value);
            } else {
                return value;
            }
        }
        return value;
    }
    
    /**
     * 复制矩阵
     * @param {Array<Array<number|Fraction>>} matrix - 输入矩阵
     * @returns {Array<Array<number|Fraction>>} 复制后的矩阵
     */
    copyMatrix(matrix) {
        return matrix.map(row => [...row]);
    }
    
    /**
     * 创建单位矩阵
     * @param {number} size - 矩阵大小
     * @returns {Array<Array<number>>} 单位矩阵
     */
    createIdentityMatrix(size) {
        const matrix = [];
        for (let i = 0; i < size; i++) {
            const row = new Array(size).fill(0);
            row[i] = 1;
            matrix.push(row);
        }
        return matrix;
    }
    
    /**
     * 计算特征多项式系数（使用主子式法）
     * @param {Array<Array<number|string>>} matrix - 输入矩阵
     * @returns {Object} 包含特征多项式系数和步骤的对象
     */
    calculateCharacteristicPolynomial(matrix) {
        // 输入验证
        if (!matrix || !Array.isArray(matrix) || matrix.length === 0) {
            throw new Error('矩阵不能为空');
        }
        if (!Array.isArray(matrix[0]) || matrix[0].length === 0) {
            throw new Error('矩阵不是有效的二维数组');
        }
        
        const n = matrix.length;
        if (n !== matrix[0].length) {
            throw new Error('只能计算方阵的特征多项式');
        }
        
        const steps = [];
        const coefficients = [];
        
        // 将输入矩阵转换为适当的类型
        const processedMatrix = matrix.map(row => row.map(value => this.convertToAppropriateType(value)));
        
        steps.push({
            matrix: processedMatrix,
            description: '输入矩阵 A'
        });
        
        // 计算各阶主子式之和
        for (let k = 0; k <= n; k++) {
            const sum = this.calculatePrincipalMinorsSum(processedMatrix, k);
            coefficients.push(sum);
            
            steps.push({
                matrix: null,
                description: `计算第 ${k} 阶主子式之和：S${k} = ${sum}`
            });
        }
        
        // 格式化结果用于显示
        const formatCoefficients = () => {
            const currentFormat = this.getFormatType();
            return coefficients.map(coeff => this.formatNumber(coeff, currentFormat));
        };
        
        return {
            coefficients: formatCoefficients(),
            steps
        };
    }
    
    /**
     * 生成所有组合
     * @param {Array} arr - 输入数组
     * @param {number} k - 组合大小
     * @returns {Array<Array>} 所有组合
     */
    generateCombinations(arr, k) {
        const result = [];
        
        const backtrack = (start, combo) => {
            if (combo.length === k) {
                result.push([...combo]);
                return;
            }
            
            for (let i = start; i < arr.length; i++) {
                combo.push(arr[i]);
                backtrack(i + 1, combo);
                combo.pop();
            }
        };
        
        backtrack(0, []);
        return result;
    }
    
    /**
     * 提取主子式
     * @param {Array<Array<number|Fraction>>} matrix - 输入矩阵
     * @param {Array<number>} indices - 行/列索引
     * @returns {Array<Array<number|Fraction>>} 主子式
     */
    extractPrincipalMinor(matrix, indices) {
        const minor = [];
        for (const i of indices) {
            const row = [];
            for (const j of indices) {
                row.push(matrix[i][j]);
            }
            minor.push(row);
        }
        return minor;
    }
    
    /**
     * 计算主子式之和
     * @param {Array<Array<number|Fraction>>} matrix - 输入矩阵
     * @param {number} k - 主子式阶数
     * @returns {number|Fraction} 主子式之和
     */
    calculatePrincipalMinorsSum(matrix, k) {
        if (k === 0) {
            return 1; // 0阶主子式之和为1
        }
        
        const n = matrix.length;
        if (k > n) {
            return 0; // 阶数超过矩阵大小，和为0
        }
        
        // 生成所有k个行/列的组合
        const indices = Array.from({ length: n }, (_, i) => i);
        const combinations = this.generateCombinations(indices, k);
        
        // 计算每个主子式的行列式并求和
        let sum = 0;
        for (const combo of combinations) {
            const minor = this.extractPrincipalMinor(matrix, combo);
            const det = this.calculateDeterminant(minor);
            sum += det.result;
        }
        
        return sum;
    }
    
    /**
     * 计算行列式（使用高斯消元法）
     * @param {Array<Array<number|string>>} matrix - 输入矩阵
     * @returns {Object} 包含行列式值和步骤的对象
     */
    calculateDeterminant(matrix) {
        // 输入验证
        if (!matrix || !Array.isArray(matrix) || matrix.length === 0) {
            throw new Error('矩阵不能为空');
        }
        if (!Array.isArray(matrix[0]) || matrix[0].length === 0) {
            throw new Error('矩阵不是有效的二维数组');
        }
        
        const n = matrix.length;
        if (n !== matrix[0].length) {
            throw new Error('只能计算方阵的行列式');
        }
        
        const steps = [];
        const det = [];
        
        // 将输入矩阵转换为适当的类型
        const processedMatrix = matrix.map(row => row.map(value => this.convertToAppropriateType(value)));
        
        steps.push({
            matrix: processedMatrix,
            description: '输入矩阵'
        });
        
        // 高斯消元
        for (let i = 0; i < n; i++) {
            // 寻找主元
            let pivotRow = i;
            for (let j = i; j < n; j++) {
                const currentAbs = processedMatrix[j][i] instanceof Fraction ? 
                    Math.abs(processedMatrix[j][i].toFloat()) : Math.abs(processedMatrix[j][i]);
                const pivotAbs = processedMatrix[pivotRow][i] instanceof Fraction ? 
                    Math.abs(processedMatrix[pivotRow][i].toFloat()) : Math.abs(processedMatrix[pivotRow][i]);
                
                if (currentAbs > pivotAbs) {
                    pivotRow = j;
                }
            }
            
            // 交换行
            if (pivotRow !== i) {
                [processedMatrix[i], processedMatrix[pivotRow]] = [processedMatrix[pivotRow], processedMatrix[i]];
                det.push(-1); // 交换行改变行列式符号
                
                steps.push({
                    matrix: this.copyMatrix(processedMatrix),
                    description: `交换第 ${i+1} 行和第 ${pivotRow+1} 行`
                });
            }
            
            // 归一化主元行
            const pivot = processedMatrix[i][i];
            if (this.isZero(pivot)) {
                // 行列式为0
                steps.push({
                    matrix: null,
                    description: '矩阵奇异，行列式为0'
                });
                
                return {
                    result: 0,
                    steps
                };
            }
            
            det.push(pivot); // 记录主元
            
            // 消去下方元素
            for (let j = i + 1; j < n; j++) {
                const factor = processedMatrix[j][i] instanceof Fraction ? 
                    processedMatrix[j][i].divide(pivot) : processedMatrix[j][i] / pivot;
                
                for (let k = i; k < n; k++) {
                    if (processedMatrix[j][k] instanceof Fraction && processedMatrix[i][k] instanceof Fraction && factor instanceof Fraction) {
                        processedMatrix[j][k] = processedMatrix[j][k].subtract(factor.multiply(processedMatrix[i][k]));
                    } else {
                        processedMatrix[j][k] -= factor * processedMatrix[i][k];
                        if (this.useFractions) {
                            processedMatrix[j][k] = this.toFraction(processedMatrix[j][k]);
                        }
                    }
                }
                
                steps.push({
                    matrix: this.copyMatrix(processedMatrix),
                    description: `第 ${j+1} 行减去第 ${i+1} 行的 ${factor} 倍`
                });
            }
        }
        
        // 计算对角线元素的乘积
        let determinant = 1;
        for (const val of det) {
            if (val instanceof Fraction) {
                determinant = determinant instanceof Fraction ? determinant.multiply(val) : new Fraction(determinant).multiply(val);
            } else {
                determinant *= val;
            }
        }
        
        // 格式化结果用于显示
        const formatDeterminant = () => {
            const currentFormat = this.getFormatType();
            return this.formatNumber(determinant, currentFormat);
        };
        
        return {
            result: determinant,
            formattedResult: formatDeterminant(),
            steps
        };
    }
    
    /**
     * 分析向量组线性相关性
     * @param {Array<Array<number|string>>} vectors - 向量组
     * @returns {Object} 包含分析结果和步骤的对象
     */
    analyzeVectors(vectors) {
        // 输入验证
        if (!vectors || !Array.isArray(vectors) || vectors.length === 0) {
            throw new Error('向量组不能为空');
        }
        if (!Array.isArray(vectors[0]) || vectors[0].length === 0) {
            throw new Error('向量不是有效的数组');
        }
        
        const steps = [];
        const n = vectors[0].length; // 向量维数
        
        // 将输入向量转换为适当的类型
        const processedVectors = vectors.map(vector => vector.map(value => this.convertToAppropriateType(value)));
        
        steps.push({
            matrix: processedVectors,
            description: '输入向量组'
        });
        
        // 将向量组转换为矩阵（按列排列）
        const matrix = [];
        for (let i = 0; i < n; i++) {
            matrix[i] = [];
            for (let j = 0; j < processedVectors.length; j++) {
                matrix[i][j] = processedVectors[j][i];
            }
        }
        
        steps.push({
            matrix: matrix,
            description: '将向量组转换为矩阵（按列排列）'
        });
        
        // 高斯消元求秩
        const rref = this.reduceToRowEchelon(matrix);
        const rank = this.calculateRank(rref);
        
        steps.push({
            matrix: rref,
            description: '行阶梯形矩阵'
        });
        
        steps.push({
            matrix: null,
            description: `矩阵的秩为：${rank}`
        });
        
        // 分析线性相关性
        let isLinearlyIndependent = false;
        let basis = [];
        let relation = [];
        
        if (rank === processedVectors.length) {
            isLinearlyIndependent = true;
            basis = processedVectors;
        } else {
            isLinearlyIndependent = false;
            
            // 寻找极大无关组
            const pivotColumns = this.findPivotColumns(rref);
            basis = pivotColumns.map(colIndex => processedVectors[colIndex]);
            
            // 计算线性关系
            relation = this.calculateLinearRelation(processedVectors, pivotColumns);
        }
        
        // 格式化结果用于显示
        const formatVectors = (vecs) => {
            const currentFormat = this.getFormatType();
            return vecs.map(vec => 
                vec.map(value => this.formatNumber(value, currentFormat))
            );
        };
        
        return {
            rank,
            isLinearlyIndependent,
            basis: formatVectors(basis),
            relation: formatVectors(relation),
            steps
        };
    }
    
    /**
     * 计算点积
     * @param {Array<number|Fraction>} vector1 - 第一个向量
     * @param {Array<number|Fraction>} vector2 - 第二个向量
     * @returns {number|Fraction} 点积
     */
    dotProduct(vector1, vector2) {
        if (vector1.length !== vector2.length) {
            throw new Error('向量维数不匹配');
        }
        
        let product = 0;
        for (let i = 0; i < vector1.length; i++) {
            if (vector1[i] instanceof Fraction && vector2[i] instanceof Fraction) {
                const temp = vector1[i].multiply(vector2[i]);
                product = product instanceof Fraction ? product.add(temp) : temp;
            } else {
                product += vector1[i] * vector2[i];
            }
        }
        
        return product;
    }
    
    /**
     * 向量数乘
     * @param {Array<number|Fraction>} vector - 向量
     * @param {number|Fraction} scalar - 标量
     * @returns {Array<number|Fraction>} 结果向量
     */
    scalarMultiply(vector, scalar) {
        return vector.map(component => {
            if (component instanceof Fraction && scalar instanceof Fraction) {
                return component.multiply(scalar);
            } else {
                const result = component * scalar;
                return this.useFractions ? this.toFraction(result) : result;
            }
        });
    }
    
    /**
     * 向量加法
     * @param {Array<number|Fraction>} vector1 - 第一个向量
     * @param {Array<number|Fraction>} vector2 - 第二个向量
     * @returns {Array<number|Fraction>} 结果向量
     */
    addVectors(vector1, vector2) {
        if (vector1.length !== vector2.length) {
            throw new Error('向量维数不匹配');
        }
        
        return vector1.map((component, index) => {
            if (component instanceof Fraction && vector2[index] instanceof Fraction) {
                return component.add(vector2[index]);
            } else {
                const result = component + vector2[index];
                return this.useFractions ? this.toFraction(result) : result;
            }
        });
    }
    
    /**
     * 向量减法
     * @param {Array<number|Fraction>} vector1 - 第一个向量
     * @param {Array<number|Fraction>} vector2 - 第二个向量
     * @returns {Array<number|Fraction>} 结果向量
     */
    subtractVectors(vector1, vector2) {
        if (vector1.length !== vector2.length) {
            throw new Error('向量维数不匹配');
        }
        
        return vector1.map((component, index) => {
            if (component instanceof Fraction && vector2[index] instanceof Fraction) {
                return component.subtract(vector2[index]);
            } else {
                const result = component - vector2[index];
                return this.useFractions ? this.toFraction(result) : result;
            }
        });
    }
    
    /**
     * 向量模长
     * @param {Array<number|Fraction>} vector - 向量
     * @returns {number|Fraction} 模长
     */
    vectorNorm(vector) {
        const dot = this.dotProduct(vector, vector);
        if (dot instanceof Fraction) {
            return Math.sqrt(dot.toFloat());
        } else {
            return Math.sqrt(dot);
        }
    }
    
    /**
     * 向量单位化
     * @param {Array<number|Fraction>} vector - 向量
     * @returns {Array<number|Fraction>} 单位向量
     */
    normalizeVector(vector) {
        const norm = this.vectorNorm(vector);
        return this.scalarMultiply(vector, 1 / norm);
    }
    
    /**
     * 施密特正交化
     * @param {Array<Array<number|string>>} vectors - 向量组
     * @returns {Object} 包含正交向量组和步骤的对象
     */
    schmidtOrthonormalization(vectors) {
        // 输入验证
        if (!vectors || !Array.isArray(vectors) || vectors.length === 0) {
            throw new Error('向量组不能为空');
        }
        if (!Array.isArray(vectors[0]) || vectors[0].length === 0) {
            throw new Error('向量不是有效的数组');
        }
        
        const steps = [];
        const n = vectors.length;
        const dim = vectors[0].length;
        
        // 将输入向量转换为适当的类型
        const processedVectors = vectors.map(vector => vector.map(value => this.convertToAppropriateType(value)));
        
        steps.push({
            matrix: processedVectors,
            description: '输入向量组'
        });
        
        const orthogonal = [];
        const orthonormal = [];
        
        for (let i = 0; i < n; i++) {
            // 计算正交向量
            let u = [...processedVectors[i]];
            
            for (let j = 0; j < i; j++) {
                const dot = this.dotProduct(processedVectors[i], orthogonal[j]);
                const normSq = this.dotProduct(orthogonal[j], orthogonal[j]);
                const proj = this.scalarMultiply(orthogonal[j], dot / normSq);
                u = this.subtractVectors(u, proj);
                
                steps.push({
                    matrix: [proj],
                    description: `计算向量 v${i+1} 在 u${j+1} 上的投影：proj(u${j+1}, v${i+1}) = ${dot}/${normSq} * u${j+1}`
                });
            }
            
            orthogonal.push(u);
            
            steps.push({
                matrix: [u],
                description: `正交向量 u${i+1} = v${i+1} - Σ proj(u_j, v${i+1})`
            });
            
            // 计算单位向量
            const norm = this.vectorNorm(u);
            if (!this.isZero(norm)) {
                const e = this.scalarMultiply(u, 1 / norm);
                orthonormal.push(e);
                
                steps.push({
                    matrix: [e],
                    description: `单位正交向量 e${i+1} = u${i+1} / ||u${i+1}||`
                });
            }
        }
        
        // 格式化结果用于显示
        const formatVectors = (vecs) => {
            const currentFormat = this.getFormatType();
            return vecs.map(vec => 
                vec.map(value => this.formatNumber(value, currentFormat))
            );
        };
        
        return {
            orthogonal: formatVectors(orthogonal),
            orthonormal: formatVectors(orthonormal),
            steps
        };
    }
    
    /**
     * 解线性方程组
     * @param {Array<Array<number|string>>} matrix - 系数矩阵
     * @param {Array<number|string>} vector - 常数项向量
     * @returns {Object} 包含解和步骤的对象
     */
    solveEquations(matrix, vector) {
        // 输入验证
        if (!matrix || !Array.isArray(matrix) || matrix.length === 0) {
            throw new Error('系数矩阵不能为空');
        }
        if (!vector || !Array.isArray(vector) || vector.length === 0) {
            throw new Error('常数项向量不能为空');
        }
        if (!Array.isArray(matrix[0]) || matrix[0].length === 0) {
            throw new Error('系数矩阵不是有效的二维数组');
        }
        
        const m = matrix.length;
        const n = matrix[0].length;
        
        if (m !== vector.length) {
            throw new Error('系数矩阵的行数与常数项向量的长度不匹配');
        }
        
        const steps = [];
        
        // 将输入矩阵和向量转换为适当的类型
        const processedMatrix = matrix.map(row => row.map(value => this.convertToAppropriateType(value)));
        const processedVector = vector.map(value => this.convertToAppropriateType(value));
        
        steps.push({
            matrix: processedMatrix,
            vector: processedVector,
            description: '输入系数矩阵和常数项向量'
        });
        
        // 构造增广矩阵
        const augmentedMatrix = [];
        for (let i = 0; i < m; i++) {
            augmentedMatrix.push([...processedMatrix[i], processedVector[i]]);
        }
        
        steps.push({
            matrix: augmentedMatrix,
            description: '构造增广矩阵 [A|b]'
        });
        
        // 高斯消元
        const gaussMatrix = this.gaussianElimination(augmentedMatrix);
        
        steps.push({
            matrix: gaussMatrix,
            description: '高斯消元后的矩阵'
        });
        
        // 转换为行阶梯形矩阵
        const rref = this.reduceToRowEchelon(gaussMatrix);
        
        steps.push({
            matrix: rref,
            description: '行阶梯形矩阵'
        });
        
        // 计算系数矩阵和增广矩阵的秩
        const rankA = this.calculateRank(rref.map(row => row.slice(0, -1)));
        const rankAugmented = this.calculateRank(rref);
        
        steps.push({
            matrix: null,
            description: `系数矩阵的秩：rank(A) = ${rankA}`
        });
        
        steps.push({
            matrix: null,
            description: `增广矩阵的秩：rank([A|b]) = ${rankAugmented}`
        });
        
        // 判断解的情况
        let type = '';
        let solution = null;
        let particularSolution = null;
        let basis = [];
        
        if (rankA < rankAugmented) {
            // 无解
            type = 'inconsistent';
            steps.push({
                matrix: null,
                description: '方程组无解'
            });
        } else if (rankA === rankAugmented && rankA === n) {
            // 唯一解
            type = 'unique';
            solution = this.extractSolution(rref);
            
            steps.push({
                matrix: null,
                description: '方程组有唯一解'
            });
        } else {
            // 无穷多解
            type = 'infinite';
            const { particularSolution: partSol, basisSolutions } = this.findParticularSolutionAndBasis(rref);
            particularSolution = partSol;
            basis = basisSolutions;
            
            steps.push({
                matrix: null,
                description: '方程组有无穷多解'
            });
        }
        
        // 格式化结果用于显示
        const formatVector = (vec) => {
            if (!vec) return null;
            const currentFormat = this.getFormatType();
            return vec.map(value => this.formatNumber(value, currentFormat));
        };
        
        const formatBasis = () => {
            const currentFormat = this.getFormatType();
            return basis.map(vec => 
                vec.map(value => this.formatNumber(value, currentFormat))
            );
        };
        
        return {
            type,
            rankA,
            rankAugmented,
            solution: formatVector(solution),
            particularSolution: formatVector(particularSolution),
            basis: formatBasis(),
            steps
        };
    }
    
    /**
     * 高斯消元法
     * @param {Array<Array<number|Fraction>>} matrix - 输入矩阵
     * @returns {Array<Array<number|Fraction>>} 消元后的矩阵
     */
    gaussianElimination(matrix) {
        const m = matrix.length;
        const n = matrix[0].length;
        const result = this.copyMatrix(matrix);
        
        for (let i = 0; i < Math.min(m, n); i++) {
            // 寻找主元
            let pivotRow = i;
            for (let j = i; j < m; j++) {
                const currentAbs = result[j][i] instanceof Fraction ? 
                    Math.abs(result[j][i].toFloat()) : Math.abs(result[j][i]);
                const pivotAbs = result[pivotRow][i] instanceof Fraction ? 
                    Math.abs(result[pivotRow][i].toFloat()) : Math.abs(result[pivotRow][i]);
                
                if (currentAbs > pivotAbs) {
                    pivotRow = j;
                }
            }
            
            // 交换行
            if (pivotRow !== i) {
                [result[i], result[pivotRow]] = [result[pivotRow], result[i]];
            }
            
            // 归一化主元行
            const pivot = result[i][i];
            if (this.isZero(pivot)) {
                continue; // 跳过全零行
            }
            
            // 消去下方元素
            for (let j = i + 1; j < m; j++) {
                const factor = result[j][i] instanceof Fraction ? 
                    result[j][i].divide(pivot) : result[j][i] / pivot;
                
                for (let k = i; k < n; k++) {
                    if (result[j][k] instanceof Fraction && result[i][k] instanceof Fraction && factor instanceof Fraction) {
                        result[j][k] = result[j][k].subtract(factor.multiply(result[i][k]));
                    } else {
                        result[j][k] -= factor * result[i][k];
                        if (this.useFractions) {
                            result[j][k] = this.toFraction(result[j][k]);
                        }
                    }
                }
            }
        }
        
        return result;
    }
    
    /**
     * 将矩阵转换为行阶梯形
     * @param {Array<Array<number|Fraction>>} matrix - 输入矩阵
     * @returns {Array<Array<number|Fraction>>} 行阶梯形矩阵
     */
    reduceToRowEchelon(matrix) {
        const m = matrix.length;
        const n = matrix[0].length;
        const result = this.copyMatrix(matrix);
        
        let pivotCol = 0;
        
        for (let i = 0; i < m; i++) {
            if (pivotCol >= n) {
                break;
            }
            
            // 寻找主元
            let pivotRow = i;
            while (pivotRow < m && this.isZero(result[pivotRow][pivotCol])) {
                pivotRow++;
            }
            
            if (pivotRow === m) {
                // 没有主元，移到下一列
                pivotCol++;
                i--;
                continue;
            }
            
            // 交换行
            [result[i], result[pivotRow]] = [result[pivotRow], result[i]];
            
            // 归一化主元行
            const pivot = result[i][pivotCol];
            for (let j = pivotCol; j < n; j++) {
                if (result[i][j] instanceof Fraction && pivot instanceof Fraction) {
                    result[i][j] = result[i][j].divide(pivot);
                } else {
                    result[i][j] /= pivot;
                    if (this.useFractions) {
                        result[i][j] = this.toFraction(result[i][j]);
                    }
                }
            }
            
            // 消去其他行的当前列元素
            for (let j = 0; j < m; j++) {
                if (j !== i && !this.isZero(result[j][pivotCol])) {
                    const factor = result[j][pivotCol];
                    for (let k = pivotCol; k < n; k++) {
                        if (result[j][k] instanceof Fraction && result[i][k] instanceof Fraction && factor instanceof Fraction) {
                            result[j][k] = result[j][k].subtract(factor.multiply(result[i][k]));
                        } else {
                            result[j][k] -= factor * result[i][k];
                            if (this.useFractions) {
                                result[j][k] = this.toFraction(result[j][k]);
                            }
                        }
                    }
                }
            }
            
            pivotCol++;
        }
        
        return result;
    }
    
    /**
     * 计算矩阵的秩
     * @param {Array<Array<number|Fraction>>} matrix - 输入矩阵
     * @returns {number} 矩阵的秩
     */
    calculateRank(matrix) {
        let rank = 0;
        const m = matrix.length;
        const n = matrix[0].length;
        
        for (let i = 0; i < m; i++) {
            let hasNonZero = false;
            for (let j = 0; j < n; j++) {
                if (!this.isZero(matrix[i][j])) {
                    hasNonZero = true;
                    break;
                }
            }
            if (hasNonZero) {
                rank++;
            }
        }
        
        return rank;
    }
    
    /**
     * 判断值是否为零
     * @param {number|Fraction} value - 输入值
     * @returns {boolean} 是否为零
     */
    isZero(value) {
        if (value instanceof Fraction) {
            return value.numerator === 0;
        } else {
            return Math.abs(value) < 1e-10;
        }
    }
    
    /**
     * 提取解
     * @param {Array<Array<number|Fraction>>} rref - 行阶梯形矩阵
     * @returns {Array<number|Fraction>} 解向量
     */
    extractSolution(rref) {
        const n = rref[0].length - 1;
        const solution = new Array(n).fill(0);
        
        for (let i = rref.length - 1; i >= 0; i--) {
            const pivotIndex = rref[i].findIndex(val => !this.isZero(val));
            if (pivotIndex === -1) {
                continue;
            }
            
            let sum = rref[i][n];
            for (let j = pivotIndex + 1; j < n; j++) {
                if (!this.isZero(solution[j])) {
                    if (sum instanceof Fraction && rref[i][j] instanceof Fraction && solution[j] instanceof Fraction) {
                        sum = sum.subtract(rref[i][j].multiply(solution[j]));
                    } else {
                        sum -= rref[i][j] * solution[j];
                        if (this.useFractions) {
                            sum = this.toFraction(sum);
                        }
                    }
                }
            }
            
            solution[pivotIndex] = sum;
        }
        
        return solution;
    }
    
    /**
     * 找到特解和基础解系
     * @param {Array<Array<number|Fraction>>} rref - 行阶梯形矩阵
     * @returns {Object} 特解和基础解系
     */
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
    }
    
    /**
     * 查找主元列
     * @param {Array<Array<number|Fraction>>} rref - 行阶梯形矩阵
     * @returns {Array<number>} 主元列索引
     */
    findPivotColumns(rref) {
        const pivotColumns = [];
        let lastPivotCol = -1;
        
        for (const row of rref) {
            const pivotIndex = row.findIndex(val => !this.isZero(val));
            if (pivotIndex !== -1 && pivotIndex > lastPivotCol) {
                pivotColumns.push(pivotIndex);
                lastPivotCol = pivotIndex;
            }
        }
        
        return pivotColumns;
    }
    
    /**
     * 计算线性关系
     * @param {Array<Array<number|Fraction>>} vectors - 向量组
     * @param {Array<number>} pivotColumns - 主元列索引
     * @returns {Array<Array<number|Fraction>>} 线性关系
     */
    calculateLinearRelation(vectors, pivotColumns) {
        // 实现线性关系的计算
        return [];
    }
    
    /**
     * 向量格式化为LaTeX
     * @param {Array<number|string>} vector - 输入向量
     * @returns {string} LaTeX字符串
     */
    vectorToLatex(vector) {
        const formatType = this.getFormatType();
        const formatted = vector.map(v => this.formatNumber(v, formatType));
        return '\\begin{pmatrix}' + formatted.join('\\\\') + '\\end{pmatrix}';
    }
    
    /**
     * 矩阵格式化为LaTeX
     * @param {Array<Array<number|string>>} matrix - 输入矩阵
     * @returns {string} LaTeX字符串
     */
    matrixToLatex(matrix) {
        const formatType = this.getFormatType();
        const formatted = matrix.map(row => 
            row.map(col => this.formatNumber(col, formatType)).join(' & ')
        );
        return '\\begin{pmatrix}' + formatted.join('\\\\') + '\\end{pmatrix}';
    }
    
    /**
     * 数字格式化为LaTeX
     * @param {number|string} num - 输入数字
     * @returns {string} LaTeX字符串
     */
    numberToLatex(num) {
        const formatType = this.getFormatType();
        const formatted = this.formatNumber(num, formatType);
        return formatted.replace(/\//g, '\\\\frac{');
    }
    
    /**
     * 字符串格式化为LaTeX
     * @param {string} text - 输入文本
     * @returns {string} LaTeX字符串
     */
    formatStringToLatex(text) {
        // 简单的LaTeX转义
        return text
            .replace(/&/g, '\\&')
            .replace(/>/g, '\\gt')
            .replace(/</g, '\\lt')
            .replace(/%/g, '\\%')
            .replace(/\$/g, '\\$')
            .replace(/#/g, '\\#')
            .replace(/\_/g, '\\_')
            .replace(/\^/g, '\\^')
            .replace(/~/g, '\\~');
    }
    
    /**
     * 检查字符串是否包含LaTeX标记
     * @param {string} text - 输入文本
     * @returns {boolean} 是否包含LaTeX标记
     */
    containsLatexMarkers(text) {
        return /\\begin|\\end|\\frac|\\sqrt|\\sum|\\prod|\\int|\\lim|\\log|\\sin|\\cos|\\tan/.test(text);
    }
    
    /**
     * 自动包装数学公式
     * @param {string} text - 输入文本
     * @returns {string} 包装后的文本
     */
    autoWrapMath(text) {
        if (this.containsLatexMarkers(text)) {
            if (!text.startsWith('$') && !text.endsWith('$')) {
                return '$' + text + '$';
            }
        }
        return text;
    }
    
    /**
     * 矩阵乘法
     * @param {Array<Array<number|string>>} matrix1 - 第一个矩阵
     * @param {Array<Array<number|string>>} matrix2 - 第二个矩阵
     * @returns {Object} 包含结果矩阵和步骤的对象
     */
    multiplyMatrices(matrix1, matrix2) {
        // 输入验证
        if (!matrix1 || !Array.isArray(matrix1) || matrix1.length === 0) {
            throw new Error('第一个矩阵不能为空');
        }
        if (!matrix2 || !Array.isArray(matrix2) || matrix2.length === 0) {
            throw new Error('第二个矩阵不能为空');
        }
        if (!Array.isArray(matrix1[0]) || matrix1[0].length === 0) {
            throw new Error('第一个矩阵不是有效的二维数组');
        }
        if (!Array.isArray(matrix2[0]) || matrix2[0].length === 0) {
            throw new Error('第二个矩阵不是有效的二维数组');
        }

        const rows1 = matrix1.length;
        const cols1 = matrix1[0].length;
        const rows2 = matrix2.length;
        const cols2 = matrix2[0].length;

        if (cols1 !== rows2) {
            throw new Error('第一个矩阵的列数必须等于第二个矩阵的行数');
        }

        const steps = [];
        const result = [];

        // 将输入矩阵转换为适当的类型
        const processedMatrix1 = matrix1.map(row => row.map(value => this.convertToAppropriateType(value)));
        const processedMatrix2 = matrix2.map(row => row.map(value => this.convertToAppropriateType(value)));

        steps.push({
            matrix: processedMatrix1,
            description: '第一个矩阵 A'
        });

        steps.push({
            matrix: processedMatrix2,
            description: '第二个矩阵 B'
        });

        // 初始化结果矩阵
        for (let i = 0; i < rows1; i++) {
            result[i] = [];
            for (let j = 0; j < cols2; j++) {
                // 初始化结果元素为适当的类型（0或0的分数形式）
                if (this.useFractions) {
                    result[i][j] = new Fraction(0);
                } else {
                    result[i][j] = 0;
                }
            }
        }

        // 执行矩阵乘法
        for (let i = 0; i < rows1; i++) {
            for (let j = 0; j < cols2; j++) {
                for (let k = 0; k < cols1; k++) {
                    let product;
                    if (processedMatrix1[i][k] instanceof Fraction && processedMatrix2[k][j] instanceof Fraction) {
                        product = processedMatrix1[i][k].multiply(processedMatrix2[k][j]);
                    } else {
                        product = processedMatrix1[i][k] * processedMatrix2[k][j];
                        if (this.useFractions) {
                            product = this.toFraction(product);
                        }
                    }

                    if (result[i][j] instanceof Fraction && product instanceof Fraction) {
                        result[i][j] = result[i][j].add(product);
                    } else {
                        result[i][j] += product;
                    }
                }
            }
        }

        // 格式化结果矩阵用于输出
        const formatMatrixForDisplay = (mat) => {
            const currentFormat = this.getFormatType();
            return mat.map(row => 
                row.map(value => this.formatNumber(value, currentFormat))
            );
        };

        return {
            result: formatMatrixForDisplay(result),
            steps
        };
    }

    /**
     * 矩阵求逆
     * @param {Array<Array<number|string>>} matrix - 输入矩阵
     * @returns {Object} 包含逆矩阵和步骤的对象
     */
    calculateInverse(matrix) {
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

        const steps = [];
        const augMatrix = [];

        // 将输入矩阵转换为适当的类型并构造增广矩阵 [A|I]
        for (let i = 0; i < n; i++) {
            const row = matrix[i].map(value => this.convertToAppropriateType(value));
            const identityRow = new Array(n).fill(0).map((_, idx) => this.convertToAppropriateType(idx === i ? 1 : 0));
            augMatrix.push([...row, ...identityRow]);
        }

        steps.push({
            matrix: this.copyMatrix(augMatrix),
            description: `构造增广矩阵 [A|I]`
        });

        // 高斯-约旦消元
        for (let i = 0; i < n; i++) {
            // 寻找主元
            let pivotRow = i;
            for (let j = i; j < n; j++) {
                const currentAbs = augMatrix[j][i] instanceof Fraction ? 
                    Math.abs(augMatrix[j][i].toFloat()) : Math.abs(augMatrix[j][i]);
                const pivotAbs = augMatrix[pivotRow][i] instanceof Fraction ? 
                    Math.abs(augMatrix[pivotRow][i].toFloat()) : Math.abs(augMatrix[pivotRow][i]);
                
                if (currentAbs > pivotAbs) {
                    pivotRow = j;
                }
            }

            // 交换行
            if (pivotRow !== i) {
                [augMatrix[i], augMatrix[pivotRow]] = [augMatrix[pivotRow], augMatrix[i]];
                steps.push({
                    matrix: this.copyMatrix(augMatrix),
                    description: `交换第 ${i+1} 行和第 ${pivotRow+1} 行`
                });
            }

            // 归一化主元行
            const pivot = augMatrix[i][i];
            if (this.isZero(pivot)) {
                throw new Error('矩阵不可逆（行列式为0）');
            }

            for (let j = 0; j < 2 * n; j++) {
                if (augMatrix[i][j] instanceof Fraction && pivot instanceof Fraction) {
                    augMatrix[i][j] = augMatrix[i][j].divide(pivot);
                } else {
                    augMatrix[i][j] /= pivot;
                    if (this.useFractions) {
                        augMatrix[i][j] = this.toFraction(augMatrix[i][j]);
                    }
                }
            }

            steps.push({
                matrix: this.copyMatrix(augMatrix),
                description: `第 ${i+1} 行除以主元 ${this.formatNumber(pivot)} 进行归一化`
            });

            // 消去其他行的当前列
            for (let j = 0; j < n; j++) {
                if (j !== i) {
                    const factor = augMatrix[j][i];
                    for (let k = 0; k < 2 * n; k++) {
                        let product;
                        if (factor instanceof Fraction && augMatrix[i][k] instanceof Fraction) {
                            product = factor.multiply(augMatrix[i][k]);
                        } else {
                            product = factor * augMatrix[i][k];
                            if (this.useFractions) {
                                product = this.toFraction(product);
                            }
                        }
                        
                        if (augMatrix[j][k] instanceof Fraction && product instanceof Fraction) {
                            augMatrix[j][k] = augMatrix[j][k].subtract(product);
                        } else {
                            augMatrix[j][k] -= product;
                            if (this.useFractions) {
                                augMatrix[j][k] = this.toFraction(augMatrix[j][k]);
                            }
                        }
                    }
                    
                    steps.push({
                        matrix: this.copyMatrix(augMatrix),
                        description: `第 ${j+1} 行减去第 ${i+1} 行的 ${this.formatNumber(factor)} 倍`
                    });
                }
            }
        }

        // 提取逆矩阵部分
        const inverseMatrix = [];
        for (let i = 0; i < n; i++) {
            inverseMatrix.push(augMatrix[i].slice(n));
        }

        // 格式化结果矩阵用于输出
        const formatMatrixForDisplay = (mat) => {
            const currentFormat = this.getFormatType();
            return mat.map(row => 
                row.map(value => this.formatNumber(value, currentFormat))
            );
        };

        return {
            isInvertible: true,
            inverse: formatMatrixForDisplay(inverseMatrix),
            steps
        };
    }
}

// 只支持CommonJS和浏览器全局导出
if (typeof module !== 'undefined' && module.exports) {
    // CommonJS 导出
    module.exports = { MatrixOperations, Fraction };
} else if (typeof window !== 'undefined') {
    // 浏览器全局导出
    window.MatrixOperations = MatrixOperations;
    window.Fraction = Fraction;
}