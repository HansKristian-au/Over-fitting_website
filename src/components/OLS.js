import multiplyMatrices from './multiplyMatrices'
import transposeMatrix from './tranposeMatrix'
import inverseMatrix from './inverseMatrix'



export default function OLS(X, y) {
    let transpose = transposeMatrix(X);
    let firstMult = multiplyMatrices(transpose, X);
    let inverse = inverseMatrix(firstMult);
    let secondMult = multiplyMatrices(inverse, transpose);
    let betasRows = multiplyMatrices(secondMult, y);
    return betasRows.map(b => [b]);
  }


