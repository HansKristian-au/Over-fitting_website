import multiplyMatrices from './multiplyMatrices'
import transposeMatrix from './tranposeMatrix'
import inverseMatrix from './inverseMatrix'


export default function calculateVar(X) {
    let transpose = transposeMatrix(X);
    let firstMult = multiplyMatrices(transpose, X);
    let inverse = inverseMatrix(firstMult);

    const variances = inverse.map((value, i) => value[i])

    return variances
}