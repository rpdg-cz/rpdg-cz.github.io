const fs = require('fs');

// 读取matrix-operations.js文件
const filePath = 'lib/matrix-operations.js';
const content = fs.readFileSync(filePath, 'utf8');

// 找到MatrixOperations类的结束位置
const endOfClassPattern = /^}$/m;
const match = endOfClassPattern.exec(content);

if (!match) {
    console.error('Could not find the end of MatrixOperations class');
    process.exit(1);
}

const endOfClassIndex = match.index;

// 要添加的代码
const newCode = `
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
    }
`;

// 在类结束前插入新代码
const newContent = content.slice(0, endOfClassIndex) + newCode + content.slice(endOfClassIndex);

// 写回文件
fs.writeFileSync(filePath, newContent, 'utf8');

console.log('成功添加solveEquations方法到MatrixOperations类中');
